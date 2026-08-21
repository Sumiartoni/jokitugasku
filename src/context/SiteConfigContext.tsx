import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig, defaultSiteConfig, fetchSiteConfig, getSiteConfig, updateCachedSiteConfig } from '@/config/site';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig());

  useEffect(() => {
    // 1. Initial fetch from Supabase
    fetchSiteConfig().then((c) => {
      updateCachedSiteConfig(c);
      setConfig(c);
    });

    // 2. Realtime listener for live updates from Admin Settings
    if (!isSupabaseConfigured || !supabase) return;

    const client = supabase;
    const channel = client
      .channel('public_settings_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'settings',
          filter: 'key=eq.app_settings'
        },
        (payload: any) => {
          if (payload.new && payload.new.value) {
            const s = payload.new.value;
            const updated: SiteConfig = {
              ...defaultSiteConfig,
              whatsappNumber: s.whatsappNumber || defaultSiteConfig.whatsappNumber,
              whatsappDisplay: s.whatsappDisplay || defaultSiteConfig.whatsappDisplay,
              operatingHours: s.operatingHours || defaultSiteConfig.operatingHours,
              emailPlaceholder: s.contactEmail || defaultSiteConfig.emailPlaceholder,
            };
            updateCachedSiteConfig(updated);
            setConfig(updated);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}
