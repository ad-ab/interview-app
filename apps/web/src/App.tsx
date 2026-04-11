import { Outlet } from "@tanstack/react-router";
import { Theme, Content, Layer } from "@carbon/react";
import TopBar from "./components/TopBar";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";

function AppShell() {
  const { carbonTheme } = useTheme();
  return (
    <Theme
      theme={carbonTheme}
      style={{
        minHeight: "100%",
        backgroundColor: "var(--cds-layer-background-02)",
      }}
    >
      <TopBar />
      <div style={{ display: "flex", paddingTop: "48px" }}>
        <Outlet />
      </div>
    </Theme>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppShell />
      </SidebarProvider>
    </ThemeProvider>
  );
}
