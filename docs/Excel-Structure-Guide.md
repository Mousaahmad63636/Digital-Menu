# Excel Spreadsheet Structure Guide

## Required Excel Sheet Structure

Your Google Sheets document must contain **TWO sections**:

### 1. Restaurant Details Section (Rows 1-10)
```
A1: RESTAURANT_DETAILS
A2: name,Sunshine Resort
A3: tagline,Culinary Excellence by the Sea
A4: address,123 Paradise Beach Drive, Tropical Island
A5: phone,+1 (555) SUNSHINE
A6: website,sunshineresort.com
A7: facebook,https://facebook.com/sunshineresort
A8: instagram,https://instagram.com/sunshineresort
A9: twitter,https://twitter.com/sunshineresort
A10: primaryColor,#FF7675
```

### 2. Menu Items Section (Rows 12+)
```
A12: MENU_ITEMS
A13: name,description,price,category,image,allergens,isvegetarian,preptime,popular
A14: Sunset Ceviche,Fresh catch of the day marinated in citrus...,18.99,appetizers,https://...,fish,no,15 min,yes
```

## Google Sheets Setup Instructions

1. Create a new Google Sheets document
2. Add restaurant details in rows 1-10 (format: key,value)
3. Add "MENU_ITEMS" in row 12
4. Add menu headers in row 13
5. Add menu items starting from row 14
6. Make sheet publicly viewable
7. Get the CSV export URL: `/export?format=csv&gid=0`

## Field Descriptions

### Restaurant Details
- **name**: Restaurant name for branding
- **tagline**: Subtitle under restaurant name
- **address**: Full address for footer
- **phone**: Contact phone number
- **website**: Website URL (without https://)
- **facebook/instagram/twitter**: Full social media URLs
- **primaryColor**: Hex color for branding (#FF7675)

### Menu Items
- **allergens**: Semicolon separated (gluten;dairy;nuts)
- **isvegetarian**: yes/no
- **popular**: yes/no for popular badge
- **category**: lowercase (appetizers, mains, desserts, drinks)
