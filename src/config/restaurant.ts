// Restaurant Configuration
// Customers can edit this file to customize their restaurant branding

export const defaultRestaurantConfig = {
  name: "Fast",
  tagline: "Your Restaurant Tagline",
  description: "Your restaurant description for SEO",
  keywords: ["restaurant", "food", "dining", "menu"],
  
  // Contact Information
  address: "Your Restaurant Address",
  phone: "Your Phone Number",
  website: "yourwebsite.com",
  
  // Social Media (leave empty if not used)
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourpage", 
  twitter: "https://twitter.com/yourpage",
  
  // Branding
  primaryColor: "#FF7675",
  
  // Google Sheets Integration - Use your actual working spreadsheet
  googleSheetsUrl: "https://docs.google.com/spreadsheets/d/1SJ0ooxxlc74FsvBlSoStuDus0nh4MEDeLpvtYQAf6Iw/export?format=csv&gid=0"
};

// This file is used as fallback when Google Sheets data is not available
// For production, all data should come from Google Sheets