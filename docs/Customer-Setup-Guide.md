# Digital Menu Setup Guide for Customers

## Quick Start Checklist

✅ **Step 1**: Set up Google Sheets with your restaurant data  
✅ **Step 2**: Update restaurant configuration  
✅ **Step 3**: Deploy your digital menu  
✅ **Step 4**: Share QR code with customers  

---

## Step 1: Google Sheets Setup

### 1.1 Create Your Menu Spreadsheet

1. **Open Google Sheets** and create a new document
2. **Name your sheet**: "YourRestaurant-Menu"
3. **Copy this exact structure**:

```
Row 1:  RESTAURANT_DETAILS
Row 2:  name,Your Restaurant Name Here
Row 3:  tagline,Your Amazing Tagline Here
Row 4:  address,Your Full Address Here
Row 5:  phone,Your Phone Number
Row 6:  website,yourwebsite.com
Row 7:  facebook,https://facebook.com/yourpage
Row 8:  instagram,https://instagram.com/yourpage
Row 9:  twitter,https://twitter.com/yourpage
Row 10: primaryColor,#FF7675

Row 12: MENU_ITEMS
Row 13: name,description,price,category,image,allergens,isvegetarian,preptime,popular
Row 14: Your First Dish,Description here,12.99,appetizers,https://image-url,gluten;dairy,no,15 min,yes
```

### 1.2 Fill Your Restaurant Details

**Replace these with your information:**

| Field | Example | Your Value |
|-------|---------|------------|
| **name** | "Mario's Italian Kitchen" | |
| **tagline** | "Authentic Italian Since 1985" | |
| **address** | "123 Main St, Downtown, NY 10001" | |
| **phone** | "+1 (555) 123-4567" | |
| **website** | "mariositalian.com" | |
| **facebook** | "https://facebook.com/mariositalian" | |
| **instagram** | "https://instagram.com/mariositalian" | |
| **twitter** | "https://twitter.com/mariositalian" | |
| **primaryColor** | "#FF7675" (or your brand color) | |

### 1.3 Add Your Menu Items

**For each menu item, provide:**

- **name**: Dish name
- **description**: Appetizing description
- **price**: Number only (12.99, not $12.99)
- **category**: appetizers, mains, desserts, drinks
- **image**: Full URL to image (Unsplash recommended)
- **allergens**: Separate with semicolons (gluten;dairy;nuts)
- **isvegetarian**: yes or no
- **preptime**: "15 min" format
- **popular**: yes for popular badge

### 1.4 Make Sheet Public

1. **Click Share** button (top right)
2. **Change access**: "Anyone with the link can view"
3. **Copy the sharing URL**
4. **Convert to CSV export URL**:
   - Replace `/edit#gid=0` with `/export?format=csv&gid=0`
   - Example: `https://docs.google.com/spreadsheets/d/ABC123/export?format=csv&gid=0`

---

## Step 2: Update Configuration

### 2.1 Edit Restaurant Config File

**File**: `src/config/restaurant.ts`

```typescript
export const defaultRestaurantConfig = {
  name: "YOUR RESTAURANT NAME",
  tagline: "YOUR TAGLINE",
  description: "YOUR SEO DESCRIPTION",
  keywords: ["your", "restaurant", "keywords"],
  
  address: "YOUR ADDRESS",
  phone: "YOUR PHONE",
  website: "yourwebsite.com",
  
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourpage", 
  twitter: "https://twitter.com/yourpage",
  
  primaryColor: "#YOUR_COLOR",
  
  googleSheetsUrl: "YOUR_CSV_EXPORT_URL_HERE"
};
```

### 2.2 Color Customization

Popular restaurant colors:
- **Italian**: `#D63031` (Red)
- **Asian**: `#00B894` (Green) 
- **Cafe**: `#A0522D` (Brown)
- **Seafood**: `#0984E3` (Blue)
- **Default**: `#FF7675` (Coral)

---

## Step 3: Deployment Options

### Option A: Vercel (Recommended)

1. **Push code to GitHub**
2. **Connect Vercel to your GitHub**
3. **Deploy automatically**
4. **Custom domain**: yourrestaurant.vercel.app

### Option B: Netlify

1. **Drag and drop build folder**
2. **Connect to GitHub for auto-deploys**
3. **Custom domain available**

### Option C: Self-Hosting

1. **Run**: `npm run build`
2. **Upload** `out` folder to your web host
3. **Point domain** to uploaded files

---

## Step 4: Customer Access

### 4.1 Generate QR Code

1. **Use any QR generator** (qr-code-generator.com)
2. **Input your website URL**
3. **Download high-resolution QR code**
4. **Print for table tents/stands**

### 4.2 QR Code Placement Ideas

- **Table tents** with "Scan for Menu"
- **Wall posters** at entrance
- **Receipt footers**
- **Social media posts**
- **Business cards**

---

## Maintenance & Updates

### Adding New Items
1. **Add row** to Google Sheets
2. **Menu updates automatically** (within 5 minutes)
3. **No code changes needed**

### Updating Prices
1. **Edit price** in Google Sheets
2. **Changes reflect immediately**

### Seasonal Menus
1. **Hide items**: Change category to "hidden"
2. **Or delete rows** for temporary removal

---

## Troubleshooting

### Menu Not Loading
- ✅ Check Google Sheets is public
- ✅ Verify CSV export URL format
- ✅ Ensure MENU_ITEMS section exists

### Images Not Showing
- ✅ Use direct image URLs
- ✅ Try Unsplash or Imgur
- ✅ Check URLs start with https://

### Colors Not Updating
- ✅ Use valid hex colors (#FF7675)
- ✅ Update both config file AND Google Sheets
- ✅ Clear browser cache

---

## Support

**Need help?** 
- 📧 Email: support@digitalmenu.com
- 📱 WhatsApp: +1 (555) MENU-HELP
- 🌐 Documentation: digitalmenu.com/docs

**Business Hours**: Monday-Friday, 9 AM - 6 PM EST