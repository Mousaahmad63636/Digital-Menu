import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunshine Resort - Digital Menu",
  description: "Culinary Excellence by the Sea - Browse our fresh menu items on your mobile device",
  keywords: ["restaurant", "resort", "menu", "food", "tropical", "mobile menu", "dining"],
  authors: [{ name: "Sunshine Resort" }],
  creator: "Sunshine Resort",
  publisher: "Sunshine Resort",
  
  // Mobile optimization
  themeColor: "#FF7675",
  colorScheme: "light",
  
  // Apple Web App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sunshine Resort Menu",
  },
  
  // Mobile app manifest
  manifest: "/manifest.json",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sunshine-resort.com",
    siteName: "Sunshine Resort",
    title: "Sunshine Resort - Digital Menu",
    description: "Culinary Excellence by the Sea - Browse our fresh menu items",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sunshine Resort Menu",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Sunshine Resort - Digital Menu",
    description: "Culinary Excellence by the Sea - Browse our fresh menu items",
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
    "msapplication-TileColor": "#FF7675",
    "msapplication-navbutton-color": "#FF7675",
    "application-name": "Sunshine Resort Menu",
    "msapplication-tooltip": "Sunshine Resort Digital Menu",
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