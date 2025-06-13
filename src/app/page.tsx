'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Star, Clock, Leaf, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function DigitalMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

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

  // Sample data for demo/fallback
  const sampleMenuItems = [
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
        const values = [];
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
        
        const item = { id: index + 1 };
        
        headers.forEach((header, i) => {
          const value = (values[i] || '').replace(/"/g, '').trim();
          switch (header) {
            case 'price':
              item[header] = parseFloat(value) || 0;
              break;
            case 'allergens':
              item[header] = value ? value.split(';').map(a => a.trim()).filter(a => a) : [];
              break;
            case 'isvegetarian':
            case 'popular':
              item[header] = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
              break;
            default:
              item[header] = value;
          }
        });
        
        return item;
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
      // Try to fetch from Google Sheets if URL is configured and online
      if (GOOGLE_SHEETS_URL !== 'YOUR_SHEET_CSV_URL_HERE' && isOnline) {
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
        // Use sample data for demo or when offline
        console.log('Using sample data...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setMenuItems(sampleMenuItems);
        setUsingFallback(true);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(err.message || 'Failed to load menu. Please try again.');
      // Fallback to sample data on error
      if (menuItems.length === 0) {
        setMenuItems(sampleMenuItems);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, [GOOGLE_SHEETS_URL, isOnline, menuItems.length]);

  useEffect(() => {
    fetchMenuData();
    // Auto-refresh every 5 minutes if using Google Sheets
    const interval = setInterval(() => {
      if (GOOGLE_SHEETS_URL !== 'YOUR_SHEET_CSV_URL_HERE' && isOnline) {
        fetchMenuData(false); // Silent refresh
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchMenuData, GOOGLE_SHEETS_URL, isOnline]);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const AllergenBadge = ({ allergen }) => (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 mr-1 mb-1">
      <AlertCircle className="w-3 h-3 mr-1" />
      {allergen}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading fresh menu...</p>
        </div>
      </div>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchMenuData()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Restaurant Name</h1>
            <p className="text-gray-600">Fresh • Local • Delicious</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              {usingFallback && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Demo Mode
                </span>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Error Message (non-blocking) */}
          {error && menuItems.length > 0 && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Using cached menu data. {error}
              </p>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-end mt-2">
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

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image 
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'} 
                  alt={item.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                {item.popular && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    favorites.has(item.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-400'
                  } hover:scale-110 transition-transform`}
                >
                  <Star className="w-4 h-4" fill={favorites.has(item.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <div className="text-xl font-bold text-blue-600">${item.price?.toFixed(2)}</div>
                </div>
                
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.preptime || 'Ask server'}
                  </div>
                  {item.isvegetarian && (
                    <div className="flex items-center text-sm text-green-600">
                      <Leaf className="w-4 h-4 mr-1" />
                      Vegetarian
                    </div>
                  )}
                </div>
                
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Contains allergens:</p>
                    <div className="flex flex-wrap">
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
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Your Restaurant Name</h3>
          <p className="text-gray-400 mb-4">123 Main Street • (555) 123-4567</p>
          <p className="text-sm text-gray-500">
            Hours: Mon-Thu 11am-10pm • Fri-Sat 11am-11pm • Sun 12pm-9pm
          </p>
        </div>
      </footer>
    </div>
  );
}