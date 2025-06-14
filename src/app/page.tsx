'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Heart, Clock, Leaf, X, Filter, ChevronRight } from 'lucide-react';

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
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Google Sheets CSV Export URL
  const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1SJ0ooxxlc74FsvBlSoStuDus0nh4MEDeLpvtYQAf6Iw/export?format=csv';

  const categories = [
    { id: 'all', name: 'All', emoji: '🍽️' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'mains', name: 'Mains', emoji: '🥘' },
    { id: 'salads', name: 'Salads', emoji: '🥗' },
    { id: 'burgers', name: 'Burgers', emoji: '🍔' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
    { id: 'beverages', name: 'Drinks', emoji: '🥤' }
  ];

  const parseCSVData = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('Invalid CSV format');
      
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      
      const items = lines.slice(1).map((line, index) => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
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
        values.push(current.trim());
        
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

  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu data');
      }
      
      const csvData = await response.text();
      const parsedItems = parseCSVData(csvData);
      
      if (parsedItems.length === 0) {
        throw new Error('No menu items found');
      }
      
      setMenuItems(parsedItems);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setMenuItems(sampleMenuItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-light">Loading Menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Savora</h1>
              <p className="text-gray-400 text-sm">Fine Dining Experience</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-3 rounded-full bg-gray-900/50 hover:bg-gray-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 rounded-full bg-gray-900/50 hover:bg-gray-800 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 rounded-full hover:bg-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
              <input
                type="text"
                placeholder="Search dishes..."
                className="flex-1 bg-transparent border-b border-gray-700 pb-3 text-xl placeholder-gray-500 focus:outline-none focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            {searchTerm && (
              <div className="space-y-4">
                {filteredItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-orange-500 font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Categories</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowFilters(false);
                  }}
                  className={`p-4 rounded-xl text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-black'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.emoji}</div>
                  <div className="font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Category */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {categories.find(c => c.id === selectedCategory)?.emoji}
          </span>
          <div>
            <h2 className="text-xl font-bold">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-400 text-sm">{filteredItems.length} items</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-6 pb-20">
        <div className="space-y-6">
          {filteredItems.map(item => (
            <div key={item.id} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gray-900/30 backdrop-blur-sm">
                <div className="relative h-48">
                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Popular Badge */}
                  {item.popular && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      Popular
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-4 right-4 p-3 rounded-full bg-black/30 backdrop-blur-sm hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                  
                  {/* Price */}
                  <div className="absolute bottom-4 right-4 bg-orange-500 text-black px-4 py-2 rounded-full">
                    <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold leading-tight flex-1">{item.name}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.preptime}</span>
                    </div>
                    
                    {item.isvegetarian && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Leaf className="w-4 h-4" />
                        <span>Vegetarian</span>
                      </div>
                    )}
                  </div>
                  
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-xs text-gray-500 mb-2">Contains:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.allergens.map(allergen => (
                          <span
                            key={allergen}
                            className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">No dishes found</h3>
            <p className="text-gray-400">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}