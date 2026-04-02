import { ModalProvider } from "@/context/ModalContext.tsx";
import { WebSocketProvider } from "@/context/WebSocketProvider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./config/i18n";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "./index.css";
import queryClient from "./query/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WebSocketProvider>
        <ModalProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </ModalProvider>
      </WebSocketProvider>
    </AuthProvider>
    <Toaster />
  </QueryClientProvider>,
);
