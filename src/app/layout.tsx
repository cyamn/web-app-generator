import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TrpcProvider } from "@/components/providers";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Toaster position="bottom-center" reverseOrder={false} />
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}
