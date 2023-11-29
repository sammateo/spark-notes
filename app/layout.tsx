import { GeistSans } from "geist/font/sans";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Spark Notes",
  description: "Mom!! mrmeme is straying from tutorials again",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <Navbar />
        <main>{children}</main>
        <ToastContainer position="top-center" />
      </body>
    </html>
  );
}
