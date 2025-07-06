# Google Sheets Template

## Copy this structure exactly into your Google Sheets

### Restaurant Details Section (Rows 1-10)
```
A1: RESTAURANT_DETAILS
A2: name,Mario's Italian Kitchen
A3: tagline,Authentic Italian Since 1985
A4: address,123 Main Street, Downtown, New York 10001
A5: phone,+1 (555) 123-4567
A6: website,mariositalian.com
A7: facebook,https://facebook.com/mariositalian
A8: instagram,https://instagram.com/mariositalian
A9: twitter,https://twitter.com/mariositalian
A10: primaryColor,#D63031
```

### Menu Items Section (Rows 12+)
```
A12: MENU_ITEMS
A13: name,description,price,category,image,allergens,isvegetarian,preptime,popular

A14: Bruschetta Classica,Fresh tomatoes and basil on toasted bread,8.99,appetizers,https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400,gluten,yes,10 min,yes

A15: Caesar Salad,Crisp romaine lettuce with house-made Caesar dressing,12.99,appetizers,https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400,dairy;gluten,yes,8 min,no

A16: Margherita Pizza,Fresh mozzarella and basil on thin crust,16.99,mains,https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400,dairy;gluten,yes,15 min,yes

A17: Spaghetti Carbonara,Traditional Roman pasta with eggs and pancetta,18.99,mains,https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400,dairy;gluten,no,12 min,yes

A18: Grilled Salmon,Fresh Atlantic salmon with seasonal vegetables,24.99,mains,https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400,fish,no,18 min,no

A19: Tiramisu,Classic Italian dessert with coffee and mascarpone,7.99,desserts,https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400,dairy;gluten,yes,5 min,yes

A20: Espresso,Authentic Italian espresso,3.99,drinks,https://images.unsplash.com/photo-1510707577011-a1e1454c9465?w=400,,yes,3 min,no

A21: House Wine,Red or white wine by the glass,6.99,drinks,https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400,,no,2 min,no
```

## Instructions

1. **Create new Google Sheets document**
2. **Copy the above structure exactly** (including commas)
3. **Replace sample data** with your restaurant information
4. **Add more menu items** following the same format
5. **Make sheet public** (Anyone with link can view)
6. **Get CSV export URL** (replace `/edit#gid=0` with `/export?format=csv&gid=0`)

## Field Guidelines

### Restaurant Details
- **name**: Your restaurant's full name
- **tagline**: Short memorable phrase (optional)
- **address**: Complete address for footer
- **phone**: Include country code if international
- **website**: Domain only (no https://)
- **social**: Full URLs to your social media pages
- **primaryColor**: Hex color code for branding

### Menu Items
- **name**: Keep under 30 characters
- **description**: Appetizing description (50-100 characters)
- **price**: Numbers only (12.99 not $12.99)
- **category**: lowercase (appetizers, mains, desserts, drinks)
- **image**: Use Unsplash URLs for best results
- **allergens**: Separate with semicolons (gluten;dairy;nuts)
- **isvegetarian**: yes or no
- **preptime**: Include "min" (15 min)
- **popular**: yes for popular badge

## Categories

Use these exact category names:
- **appetizers** - Starters, small plates
- **mains** - Main courses, entrees  
- **desserts** - Sweet treats
- **drinks** - Beverages, cocktails

## Tips

- **Keep descriptions short** but appetizing
- **Use high-quality images** from Unsplash
- **Update prices regularly** 
- **Mark popular items** to drive sales
- **Be accurate with allergens** for customer safety