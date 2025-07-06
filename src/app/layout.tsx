import type { Metadata } from "next";
import "./globals.css";
import { defaultRestaurantConfig } from "../config/restaurant";

export const metadata: Metadata = {
  title: `${defaultRestaurantConfig.name} - Digital Menu`,
  description: `${defaultRestaurantConfig.description} - Browse our fresh menu items on your mobile device`,
  keywords: defaultRestaurantConfig.keywords,
  authors: [{ name: defaultRestaurantConfig.name }],
  creator: defaultRestaurantConfig.name,
  publisher: defaultRestaurantConfig.name,
  
  // Mobile optimization
  themeColor: "#FF7675",
  colorScheme: "light",
  
  // Apple Web App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: `${defaultRestaurantConfig.name} Menu`,
  },
  
  // Mobile app manifest
  manifest: "/manifest.json",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${defaultRestaurantConfig.website}`,
    siteName: defaultRestaurantConfig.name,
    title: `${defaultRestaurantConfig.name} - Digital Menu`,
    description: `${defaultRestaurantConfig.description} - Browse our fresh menu items`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${defaultRestaurantConfig.name} Menu`,
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: `${defaultRestaurantConfig.name} - Digital Menu`,
    description: `${defaultRestaurantConfig.description} - Browse our fresh menu items`,
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
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": defaultRestaurantConfig.primaryColor,
    "msapplication-navbutton-color": defaultRestaurantConfig.primaryColor,
    "application-name": `${defaultRestaurantConfig.name} Menu`,
    "msapplication-tooltip": `${defaultRestaurantConfig.name} Digital Menu`,
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}