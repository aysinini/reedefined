// Supabase Edge Function: delete-account
// Permanently deletes the calling user's account: their auth user record,
// their profile, and every row/file they own across the app. This needs the
// service_role key, which must never reach the browser, so the actual
// deletion happens here, server-side. The client only ever sends its own
// access token; that token is verified before anything is deleted.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the caller is who they say they are, using their own token —
    // never trust a user id passed in the request body.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Remove stored files: avatar (avatars/{userId}_*) and any article
    // photos (contributions/{userId}/*) the user uploaded.
    const { data: avatarFiles } = await admin.storage.from("media").list("avatars", { limit: 1000 });
    const avatarPaths = (avatarFiles || [])
      .filter((f) => f.name.startsWith(userId))
      .map((f) => `avatars/${f.name}`);
    if (avatarPaths.length > 0) {
      await admin.storage.from("media").remove(avatarPaths);
    }

    const { data: contribFiles } = await admin.storage.from("media").list(`contributions/${userId}`, { limit: 1000 });
    const contribPaths = (contribFiles || []).map((f) => `contributions/${userId}/${f.name}`);
    if (contribPaths.length > 0) {
      await admin.storage.from("media").remove(contribPaths);
    }

    // Remove database rows this user owns or appears in.
    await admin.from("comments").delete().eq("user_id", userId);
    await admin.from("likes").delete().eq("user_id", userId);
    await admin.from("notifications").delete().eq("user_id", userId);
    await admin.from("notifications").delete().eq("actor_id", userId);
    await admin.from("follows").delete().eq("user_id", userId);
    await admin.from("follows").delete().eq("contributor_id", userId);
    await admin.from("platform_connections").delete().eq("user_id", userId);
    await admin.from("public_issues").delete().eq("user_id", userId);
    await admin.from("contributions").delete().eq("user_id", userId);
    await admin.from("profiles").delete().eq("id", userId);

    // Finally, delete the auth user itself.
    const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      return new Response(JSON.stringify({ error: "Failed to delete auth user", detail: deleteErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
