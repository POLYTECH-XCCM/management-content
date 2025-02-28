import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "../../styles/editor.css";
import "../../styles/original.css";
import NextAuthProvider from "../Providers";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
//const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Editeur de documents | XCCM",
  description: "XCCM Module de composition de documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <NextAuthProvider>{children}</NextAuthProvider>
          <ToastContainer position="bottom-right" />
        </Theme>
      </body>
    </html>
  );
}
