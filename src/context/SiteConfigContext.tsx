import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig, defaultSiteConfig, fetchSiteConfig, getSiteConfig } from '@/config/site';

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());

  useEffect(() => {
    fetchSiteConfig().then((c) => setConfig(c));
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}
