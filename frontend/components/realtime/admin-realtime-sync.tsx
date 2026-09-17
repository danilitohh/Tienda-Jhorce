"use client";

import * as Ably from "ably";
import { Broadcast } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { REALTIME_CHANNELS } from "@/lib/realtime";

type ConnectionStatus = "connecting" | "connected" | "offline";

// Keep the owner's server-rendered metrics synchronized with catalog and order events from trusted backend publishers.
export function AdminRealtimeSync({ enabled }: Readonly<{ enabled: boolean }>) {
  const router = useRouter();
  const [status, setStatus] = useState<ConnectionStatus>(enabled ? "connecting" : "offline");

  useEffect(() => {
    if (!enabled) return;
    const realtime = new Ably.Realtime({ authUrl: "/api/realtime/token" });
    const catalogChannel = realtime.channels.get(REALTIME_CHANNELS.catalog);
    const adminChannel = realtime.channels.get(REALTIME_CHANNELS.admin);
    const refreshDashboard = () => router.refresh();
    const handleConnection = (stateChange: Ably.ConnectionStateChange) => setStatus(stateChange.current === "connected" ? "connected" : stateChange.current === "failed" || stateChange.current === "suspended" ? "offline" : "connecting");

    realtime.connection.on(handleConnection);
    catalogChannel.subscribe("catalog.updated", refreshDashboard);
    adminChannel.subscribe(["order.created", "order.updated", "payment.updated"], refreshDashboard);

    return () => {
      realtime.connection.off(handleConnection);
      catalogChannel.unsubscribe("catalog.updated", refreshDashboard);
      adminChannel.unsubscribe(["order.created", "order.updated", "payment.updated"], refreshDashboard);
      realtime.close();
    };
  }, [enabled, router]);

  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status === "connected" ? "bg-success/10 text-success" : "bg-ink/5 text-muted"}`} role="status"><Broadcast size={14} weight="light" />{status === "connected" ? "En vivo" : status === "connecting" ? "Conectando" : "Sin conexión en vivo"}</span>;
}
