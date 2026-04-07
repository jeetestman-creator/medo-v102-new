import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <AuthProvider>
        <SettingsProvider>
          <App />
          <Analytics />
        </SettingsProvider>
      </AuthProvider>
    </AppWrapper>
  </StrictMode>
);
