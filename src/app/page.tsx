'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
    name: "Sunset Ceviche",
    description: "Fresh catch of the day marinated in citrus, red onion, cilantro, and tropical fruits",
    price: 18.99,
    category: "appetizers",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
    allergens: ["fish"],
    isvegetarian: false,
    preptime: "15 min",
    popular: true
  },
  {
    id: 2,
    name: "Grilled Mahi-Mahi",
    description: "Fresh mahi-mahi with coconut rice, grilled vegetables, and passion fruit glaze",
    price: 32.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop",
    allergens: [],
    isvegetarian: false,
    preptime: "25 min",
    popular: true
  },
  {
    id: 3,
    name: "Mediterranean Quinoa Bowl",
    description: "Quinoa with roasted vegetables, feta cheese, olives, and tahini dressing",
    price: 24.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
    allergens: ["dairy"],
    isvegetarian: true,
    preptime: "20 min",
    popular: false
  },
  {
    id: 4,
    name: "Tropical Crème Brûlée",
    description: "Classic vanilla crème brûlée infused with coconut and topped with caramelized sugar",
    price: 12.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400&h=200&fit=crop",
    allergens: ["dairy", "eggs"],
    isvegetarian: true,
    preptime: "10 min",
    popular: true
  },
  {
    id: 5,
    name: "Sunset Paradise Cocktail",
    description: "Premium rum, passion fruit, mango, and a splash of champagne",
    price: 15.99,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=200&fit=crop",
    allergens: [],
    isvegetarian: true,
    preptime: "5 min",
    popular: true
  },
  {
    id: 6,
    name: "Chef&apos;s Tasting Menu",
    description: "Seven-course journey through our finest seasonal ingredients",
    price: 95.99,
    category: "specials",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop",
    allergens: ["gluten", "dairy"],
    isvegetarian: false,
    preptime: "90 min",
    popular: true
  }
];

export default function DigitalMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('appetizers');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{name: string, price: number}[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Google Sheets CSV Export URL
  const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1SJ0ooxxlc74FsvBlSoStuDus0nh4MEDeLpvtYQAf6Iw/export?format=csv';

  const categories = [
    { id: 'appetizers', name: '🥗 Appetizers' },
    { id: 'mains', name: '🍽️ Main Courses' },
    { id: 'desserts', name: '🧁 Desserts' },
    { id: 'beverages', name: '🍹 Beverages' },
    { id: 'specials', name: '⭐ Chef&apos;s Specials' }
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

  const addToCart = (itemName: string, price: number) => {
    setCart(prev => [...prev, { name: itemName, price }]);
    setNotification(`${itemName} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const viewCart = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some delicious items!');
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartSummary = `Your Order:\n\n${cart.map(item => `${item.name} - $${item.price.toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nWould you like to proceed to checkout?`;
    
    if (confirm(cartSummary)) {
              alert('Thank you for your order! Our kitchen staff will prepare your meal shortly. 🍽️');
      setCart([]);
    }
  };

  const getBadgeClass = (allergen: string) => {
    const badgeMap: { [key: string]: string } = {
      'gluten': 'badge gluten-free',
      'dairy': 'badge',
      'nuts': 'badge',
      'shellfish': 'badge spicy',
      'fish': 'badge spicy'
    };
    return badgeMap[allergen] || 'badge';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo">🌅 Sunshine Resort</div>
        <div className="tagline">Culinary Excellence by the Sea</div>
      </header>

      <div className="time-indicator">
        ⏰ Kitchen Hours: 6:00 AM - 11:00 PM | Room Service Available 24/7
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search our menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-section">
        <div className="menu-category active">
          <h2 className="section-title">
            {categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredItems.map((item, index) => (
            <div key={item.id} className="menu-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <Image
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop'}
                alt={item.name}
                width={400}
                height={200}
                className="item-image"
              />
              <div className="item-content">
                <div className="item-header">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                </div>
                <div className="item-description">{item.description}</div>
                <div className="item-badges">
                  {item.isvegetarian && <span className="badge vegetarian">Vegetarian</span>}
                  {item.popular && <span className="badge chef-special">Chef's Special</span>}
                  {item.allergens.map(allergen => (
                    <span key={allergen} className={getBadgeClass(allergen)}>
                      {allergen}
                    </span>
                  ))}
                </div>
                <button 
                  className="add-to-cart"
                  onClick={() => addToCart(item.name, item.price)}
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="no-items">
              <div className="no-items-emoji">🔍</div>
              <h3>No dishes found</h3>
              <p>Try adjusting your search or browse other categories</p>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="contact-info">
            📍 123 Paradise Beach Drive, Tropical Island<br />
            📞 +1 (555) SUNSHINE | 🌐 sunshineresort.com
          </div>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
          </div>
        </div>
      </footer>

      <div className="floating-cart" onClick={viewCart}>
        <div className="cart-icon">🛒</div>
        <div className="cart-count">{cart.length}</div>
      </div>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}