import { createContext, useContext, useState } from "react"; 
import { AppProvider, Page } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import MissingApiKey from "./components/MissingApiKey";
import AgeRestrictionSettings from "./components/AgeRestrictionSettings";
import { createApp } from "@shopify/app-bridge"; 

// 🔹 Fix: Properly define context
const AppBridgeContext = createContext(null);

const App = () => {
    const [appBridgeConfig] = useState(() => {
        const host = new URLSearchParams(location.search).get("host") || window.__SHOPIFY_HOST;
        window.__SHOPIFY_HOST = host;
        return {
            host,
            apiKey: import.meta.env.VITE_SHOPIFY_API_KEY, 
            forceRedirect: true,
        };
    });

    if (!appBridgeConfig.apiKey) {
        return (
            <AppProvider i18n={enTranslations}>
                <MissingApiKey />
            </AppProvider>
        );
    }

    const appBridge = createApp(appBridgeConfig);

    return (
        <AppProvider i18n={enTranslations}>
            <AppBridgeContext.Provider value={appBridge}>
                <Page>
                    <AgeRestrictionSettings />
                </Page>
            </AppBridgeContext.Provider>
        </AppProvider>
    );
};

export const useAppBridge = () => {
    return useContext(AppBridgeContext);
};

export default App;
