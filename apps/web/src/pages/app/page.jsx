import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import NavbarMain from "../../components/NavbarMain";
import SMIHomeHero from "../../components/SMIHomeHero";
import SMIHomeLibrary from "../../components/SMIHomeLibrary";
import SMIHomeCommunity from "../../components/SMIHomeCommunity";
import SMIHomePricing from "../../components/SMIHomePricing";
import SMIHomeSuccessStories from "../../components/SMIHomeSuccessStories";
import SMIAIAssistant from "../../components/SMIAIAssistant";
import SMIHomeFooter from "../../components/SMIHomeFooter";
import SMILoadingScreen from "../../components/SMILoadingScreen";

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {isLoading && <SMILoadingScreen key="loading" />}
      </AnimatePresence>

      <NavbarMain />
      <main>
        <SMIHomeHero />
        <SMIHomeLibrary />
        <SMIHomeCommunity />
        <SMIHomePricing />
        <SMIHomeSuccessStories />
      </main>
      <SMIHomeFooter />
      <SMIAIAssistant />
    </div>
  );
}
