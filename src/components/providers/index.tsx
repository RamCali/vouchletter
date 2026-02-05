"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "@/lib/auth/client";
import { Toaster } from "sonner";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#7c3aed",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NeonAuthUIProvider authClient={authClient}>
        {children}
        <Toaster richColors position="top-right" />
      </NeonAuthUIProvider>
    </ThemeProvider>
  );
}
