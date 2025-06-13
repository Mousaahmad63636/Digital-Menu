'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Star, Clock, Leaf, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  allergens: string[];
  isvegetarian: boolean;
  preptime: string;
  popular: boolean;
}

// Sample data for demo/fallback
const sampleMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, basil, olive oil",
    price: 18.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
    allergens: ["gluten", "dairy"],
    isvegetarian: true,
    preptime: "15-20 min",
    popular: true
  },
  {
    id: 2,
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon herb butter, served with seasonal vegetables",
    price: 28.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    allergens: ["fish"],
    isvegetarian: false,
    preptime: "20-25 min",
    popular: true
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan cheese, croutons, caesar dressing",
    price: 14.99,
    category: "salads",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    allergens: ["gluten", "dairy", "eggs"],
    isvegetarian: true,
    preptime: "5-10 min",
    popular: false
  },
  {
    id: 4,
    name: "BBQ Burger",
    description: "Beef patty with BBQ sauce, onion rings, lettuce, tomato",
    price: 16.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    allergens: ["gluten", "dairy"],
    isvegetarian: false,
    preptime: "15-18 min",
    popular: true
  },
  {
    id: 5,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with chocolate ganache and fresh berries",
    price: 8.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    allergens: ["gluten", "dairy", "eggs"],
    isvegetarian: true,
    preptime: "5 min",
    popular: true
  },
  {
    id: 6,
    name: "Craft Beer",
    description: "Local IPA with citrus notes and hoppy finish",
    price: 6.99,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    allergens: ["gluten"],
    isvegetarian: true,
    preptime: "2 min",
    popular: false
  }
];

export default function DigitalMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set<number>());
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // 🔧 Your Google Sheets CSV Export URL
  const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1SJ0ooxxlc74FsvBlSoStuDus0nh4MEDeLpvtYQAf6Iw/export?format=csv';

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'mains', name: 'Main Dishes', icon: '🥘' },
    { id: 'salads', name: 'Salads', icon: '🥗' },
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'beverages', name: 'Beverages', icon: '🍺' }
  ];

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const parseCSVData = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('Invalid CSV format');
      
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      
      const items = lines.slice(1).map((line, index) => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        // Handle CSV parsing with proper quote handling
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim()); // Add the last value
        
        const item: Partial<MenuItem> = { id: index + 1 };
        
        headers.forEach((header, i) => {
          const value = (values[i] || '').replace(/"/g, '').trim();
          switch (header) {
            case 'name':
              item.name = value;
              break;
            case 'description':
              item.description = value;
              break;
            case 'price':
              item.price = parseFloat(value) || 0;
              break;
            case 'category':
              item.category = value;
              break;
            case 'image':
              item.image = value;
              break;
            case 'allergens':
              item.allergens = value ? value.split(';').map(a => a.trim()).filter(a => a) : [];
              break;
            case 'isvegetarian':
              item.isvegetarian = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
              break;
            case 'preptime':
              item.preptime = value;
              break;
            case 'popular':
              item.popular = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
              break;
          }
        });
        
        return item as MenuItem;
      }).filter(item => item.name && item.name.length > 0);
      
      return items;
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw new Error('Failed to parse menu data');
    }
  };

  const fetchMenuData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from Google Sheets if online
      if (isOnline) {
        console.log('Fetching from Google Sheets...');
        const response = await fetch(GOOGLE_SHEETS_URL, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch menu data`);
        }
        
        const csvData = await response.text();
        const parsedItems = parseCSVData(csvData);
        
        if (parsedItems.length === 0) {
          throw new Error('No menu items found in spreadsheet');
        }
        
        setMenuItems(parsedItems);
        setUsingFallback(false);
        console.log(`Loaded ${parsedItems.length} items from Google Sheets`);
      } else {
        // Use sample data when offline
        console.log('Using sample data (offline)...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setMenuItems(sampleMenuItems);
        setUsingFallback(true);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to load menu. Please try again.');
      // Fallback to sample data on error
      if (menuItems.length === 0) {
        setMenuItems(sampleMenuItems);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline, menuItems.length]);

  useEffect(() => {
    fetchMenuData();
    // Auto-refresh every 5 minutes if online
    const interval = setInterval(() => {
      if (isOnline) {
        fetchMenuData(false); // Silent refresh
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchMenuData, isOnline]);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (itemId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const AllergenBadge = ({ allergen }: { allergen: string }) => (
    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-red-100 text-red-800 font-medium">
      <AlertCircle className="w-4 h-4 mr-1" />
      {allergen}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Menu</h2>
          <p className="text-gray-600 text-lg">Getting fresh items for you...</p>
        </div>
      </div>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-500 text-8xl mb-6">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Menu Unavailable</h3>
          <p className="text-gray-600 mb-6 text-lg max-w-sm mx-auto leading-relaxed">{error}</p>
          <button 
            onClick={() => fetchMenuData()}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Sticky Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Your Restaurant Name</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className={`p-2 rounded-full transition-colors ${
                searchExpanded ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => fetchMenuData()}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh menu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchExpanded && (
        <div className="bg-white border-b sticky top-16 z-10 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchExpanded(false); // Close search when selecting category
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors min-w-max ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message (compact) */}
      {error && menuItems.length > 0 && (
        <div className="mx-4 mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ⚠️ Using cached menu. {error}
        </div>
      )}

      {/* Mobile Menu Items - Single Column */}
      <div className="px-4 py-4">
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image 
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'} 
                  alt={item.name}
                  width={400}
                  height={240}
                  className="w-full h-60 object-cover"
                />
                {item.popular && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🔥 Popular
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-3 right-3 p-3 rounded-full ${
                    favorites.has(item.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-400'
                  } hover:scale-110 transition-transform shadow-md`}
                >
                  <Star className="w-5 h-5" fill={favorites.has(item.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 ml-3">${item.price?.toFixed(2)}</div>
                </div>
                
                <p className="text-gray-600 mb-4 text-base leading-relaxed">{item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">{item.preptime || 'Ask server'}</span>
                  </div>
                  {item.isvegetarian && (
                    <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <Leaf className="w-4 h-4 mr-1" />
                      <span className="font-medium">Vegetarian</span>
                    </div>
                  )}
                </div>
                
                {item.allergens && item.allergens.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2 font-medium">Contains allergens:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map(allergen => (
                        <AllergenBadge key={allergen} allergen={allergen} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No items found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Mobile Footer with Status Info */}
      <footer className="bg-gray-900 text-white py-6 mt-8">
        <div className="px-4">
          {/* Status Bar */}
          <div className="flex items-center justify-center gap-4 mb-4 text-sm border-b border-gray-700 pb-4">
            <span className="text-gray-300">Fresh • Local • Delicious</span>
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-gray-300">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {usingFallback && (
              <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">Demo Mode</span>
            )}
          </div>

          {/* Menu Stats */}
          <div className="text-center mb-4 text-sm text-gray-300">
            <p>{filteredItems.length} menu items available</p>
            {lastUpdated && (
              <p className="text-gray-400 text-xs mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Your Restaurant Name</h3>
            <p className="text-gray-400 mb-4 text-lg">123 Main Street • (555) 123-4567</p>
            <div className="text-sm text-gray-500 leading-relaxed">
              <p className="mb-1">Mon-Thu: 11am-10pm</p>
              <p className="mb-1">Fri-Sat: 11am-11pm</p>
              <p>Sunday: 12pm-9pm</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}