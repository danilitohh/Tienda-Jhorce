import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresh Supabase sessions at the edge without forcing demo mode to configure credentials.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies: Array<{ name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] }>) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });

  // Calling getUser refreshes the token when necessary and keeps server/client auth state aligned.
  await supabase.auth.getUser();
  return response;
}

// Exclude static assets, metadata files and API handlers from session refresh work.
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|api/).*)"] };

