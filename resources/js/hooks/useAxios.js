import { createApp } from "@shopify/app-bridge";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSessionToken } from '@shopify/app-bridge/utilities';

const useAxios = () => {
    const [app, setApp] = useState(null);

    useEffect(() => {
        const host = new URLSearchParams(window.location.search).get("host");
        if (!host) {
            console.error("Shopify host is missing.");
            return;
        }

        const appBridge = createApp({
            apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
            host,
        });

        setApp(appBridge);

        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        const interceptor = axios.interceptors.request.use(async (config) => {
            if (!appBridge) {
                console.error("Shopify App Bridge is not initialized.");
                return config;
            }
            try {
                const token = await getSessionToken(appBridge);
                config.headers.Authorization = `Bearer ${token}`;
                config.params = { ...config.params, host };
            } catch (error) {
                console.error("Error getting session token:", error);
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    return { axios };
};

export default useAxios;
