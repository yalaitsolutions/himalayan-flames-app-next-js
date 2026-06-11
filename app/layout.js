import "@/styles/global.css";
import Providers from "./providers";

export const metadata = {
  title: "Himalayan Flames | Authentic Nepali & Indian Cuisine — Dearborn, MI",
  description:
    "Experience authentic Nepali & Indian cuisine at Himalayan Flames in Dearborn, MI. Halal-certified, family-friendly fine dining with traditional recipes and warm hospitality.",
  keywords:
    "Nepali restaurant, Indian restaurant, Dearborn MI, halal food, biryani, tandoori, momos, curry",
  icons: { icon: "/logo.avif" },
  openGraph: {
    title: "Himalayan Flames | Authentic Nepali & Indian Cuisine",
    description:
      "Experience the flavors of the Himalayas right in Dearborn, MI. 100% Halal.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts + Font Awesome icons (kept on CDN, as in the original app) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
