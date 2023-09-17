import { createClient } from "@supabase/supabase-js";
import { UUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    },
  }
);

export function getSupabaseClient() {
  return supabase;
}

export function getSupabaseAuth() {
  return supabase.auth;
}

export function supabaseLogin() {
  return supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { scopes: "identify, email, guilds" },
  });
}

export function supabaseLogout() {
  return supabase.auth.signOut();
}

async function _supabaseGetUser() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        return null;
      }
      if (userData.user) {
        return userData.user;
      }
    }
    if (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export function supabaseGetUser() {
  return _supabaseGetUser().then((data) => {
    return data;
  })
}

async function _supabaseAddChart(chartID: string, title: string, artist: string, author: string, author_id: string, difficulty: number, description: string, event: string, tags: string, useHID: boolean, uid: string) {
  const { data, error } = await supabase.from("charts").insert([
    {
      id: chartID,
      title: title,
      artist: artist,
      author: author,
      author_id: author_id,
      difficulty: difficulty,
      desc: description,
      event: event,
      tags: tags,
      play_count: 0,
      like_count: 0,
      testing: true,
      activated: true,
      user: uid,
      HID: useHID,
      publish_at: null,
    },
  ]);
  if (error) {
    return null;
  }
  if (data) {
    return data;
  }
}

export function supabaseAddChart(chartID: string, title: string, artist: string, author: string, author_id: string, difficulty: number, description: string, event: string, tags: string, useHID: boolean, uid: string) {
  _supabaseAddChart(chartID, title, artist, author, author_id, difficulty, description, event, tags, useHID, uid).then((data) => {
    return data;
  })
}

export async function _supabaseGetUserCharts() {

  const user = await _supabaseGetUser();
  if (!user) {
    return null;
  }
  const uid = user.id;
  const { data, error } = await supabase.from("charts").select("*").eq("user", uid);
  if (error) {
    return error as any;
  }
  if (data) {
    return data;
  }
}

export function supabaseGetUserCharts() {
  console.log();
  return _supabaseGetUserCharts().then((data) => {
    return data;
  })
}