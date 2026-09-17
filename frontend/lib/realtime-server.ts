import * as Ably from "ably";

type RealtimeEvent = Readonly<Record<string, unknown>>;

// Publish only server-owned event payloads through Ably; a missing key keeps local development functional.
export async function publishRealtimeEvent(channelName: string, eventName: string, data: RealtimeEvent) {
  const key = process.env.ABLY_API_KEY;
  if (!key) return false;

  try {
    const ably = new Ably.Rest({ key });
    await ably.channels.get(channelName).publish(eventName, data);
    return true;
  } catch {
    return false;
  }
}
