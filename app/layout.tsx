import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ホットスタッフ対象案件抽出ツール",
  description: "求人案件の掲載可否を自動判定し、非掲載案件を抽出するツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
