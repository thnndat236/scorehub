import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "ScoreHub",
    template: "%s | ScoreHub",
  },
  description:
    "An score analytics platform for high school graduation exam.",
};

const themeScript = `(function(){var dark=false;try{var stored=localStorage.getItem("scorehub-theme");dark=stored==="dark"||(stored!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);}catch(error){try{dark=window.matchMedia("(prefers-color-scheme: dark)").matches;}catch(fallbackError){dark=false;}}var root=document.documentElement;root.classList.toggle("dark",dark);root.style.colorScheme=dark?"dark":"light";})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
