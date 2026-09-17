"use client";

import * as Ably from "ably";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { REALTIME_CHANNELS } from "@/lib/realtime";

// Refresh server-rendered catalog surfaces when an authorized backend write broadcasts a catalog change.
export function StoreRealtimeSync({ enabled }: Readonly<{ enabled: boolean }>) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const realtime = new Ably.Realtime({ authUrl: "/api/realtime/token" });
    const channel = realtime.channels.get(REALTIME_CHANNELS.catalog);
    const handleCatalogUpdate = () => router.refresh();
    channel.subscribe("catalog.updated", handleCatalogUpdate);

    return () => {
      channel.unsubscribe("catalog.updated", handleCatalogUpdate);
      realtime.close();
    };
  }, [enabled, router]);

  return null;
}
