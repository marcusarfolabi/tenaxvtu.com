"use client";
import { useState, useEffect } from "react";

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing automatically on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the native browser install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  return { installPrompt, handleInstallClick };
}