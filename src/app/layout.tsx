import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Live Lesson Lab",
  description:
    "A source-grounded, teacher-controlled classroom that adapts to student thinking in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
