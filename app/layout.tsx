import { getUserAndProfile } from "@/actions/auth.actions";
import TopBar from "@/components/topbar";
import AuthProvider from "@/providers/auth";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL!;

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BCIC Hub",
  description: "All the BCIC Alumni in one place!",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile, user } = await getUserAndProfile();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <AuthProvider profile={profile} user={user}>
            <TopBar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
