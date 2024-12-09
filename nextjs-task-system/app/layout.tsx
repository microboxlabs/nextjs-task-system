import { ThemeModeScript } from "flowbite-react";
import { NavbarComponent } from "./components/Navbar";
import { FooterComponet } from "./components/Footer";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeModeScript />
        <NavbarComponent />
        <main>{children}</main>
        <FooterComponet />
      </body>
    </html>
  );
}
