// app/layout.tsx
import "./globals.css";
import SiteShell from "@/app/components/Layout/SiteShell";

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteShell session={session}>{children}</SiteShell>
      </body>
    </html>
  );
}
