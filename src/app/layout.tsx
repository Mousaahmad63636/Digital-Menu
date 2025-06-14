import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Savora - Fine Dining Experience",
  description: "Discover our exquisite menu featuring fresh, locally sourced ingredients and culinary artistry",
  keywords: ["restaurant", "fine dining", "menu", "food", "cuisine", "mobile menu"],
  authors: [{ name: "Savora Restaurant" }],
  creator: "Savora Restaurant",
  publisher: "Savora Restaurant",
  
  // Mobile optimization
  themeColor: "#FF6B35",
  colorScheme: "dark",
  
  // Apple Web App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Savora Menu",
    startupImage: "/apple-touch-icon.png",
  },
  
  // Mobile app manifest
  manifest: "/manifest.json",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://savora-restaurant.com",
    siteName: "Savora Restaurant",
    title: "Savora - Fine Dining Experience",
    description: "Discover our exquisite menu featuring fresh, locally sourced ingredients and culinary artistry",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Savora Restaurant Menu",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Savora - Fine Dining Experience",
    description: "Discover our exquisite menu featuring fresh, locally sourced ingredients and culinary artistry",
    images: ["/og-image.jpg"],
  },
  
  // Mobile optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  
  // Format detection
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  
  // Additional mobile meta
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#FF6B35",
    "msapplication-navbutton-color": "#FF6B35",
    "application-name": "Savora Menu",
    "msapplication-tooltip": "Savora Restaurant Menu",
    "msapplication-starturl": "/",
    "msapplication-tap-highlight": "no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Prevent zoom on input focus (iOS Safari) */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* PWA support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Optimize for mobile */}
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        
        {/* Prevent automatic phone number detection */}
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
      </head>
      <body className="font-inter bg-black text-white antialiased overflow-x-hidden">
        {/* Safe area handling for devices with notches */}
        <div className="min-h-screen safe-area-top safe-area-bottom">
          {children}
        </div>
        
        {/* Prevent context menu on long press (mobile) */}
        <style jsx>{`
          * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          input, textarea {
            -webkit-user-select: text;
            -khtml-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
        `}</style>
      </body>
    </html>
  );
}