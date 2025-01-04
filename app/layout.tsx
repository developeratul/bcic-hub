import TopBar from "@/components/topbar";
import AuthProvider from "@/providers/auth";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase.from("profile").select("*").eq("id", user.id).single();

    profile = data;
  }

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider profile={profile} user={user}>
            <TopBar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
