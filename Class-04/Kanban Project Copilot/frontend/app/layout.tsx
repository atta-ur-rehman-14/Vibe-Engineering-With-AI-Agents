import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit | Product launch plan",
  description: "A focused Kanban board for moving product work forward.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
