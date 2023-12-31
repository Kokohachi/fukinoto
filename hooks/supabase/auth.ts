import { PostgrestError, createClient } from "@supabase/supabase-js";
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

export async function _supabaseGetChart(id: string) {
  const { data, error } = await supabase.from("charts").select("*").eq("id", id);
  if (error) {
    return error as any;
  }
  if (data) {
    return data;
  }
}

export function supabaseGetChart(id: string) {
  return _supabaseGetChart(id).then((data) => {
    return data;
  })
}

export async function _supabaseUpdateChart(id: string, title: string, artist: string, author: string, author_id: string, difficulty: number, description: string, event: string, tags: string, useHID: boolean, uid: string) {
  const { data, error } = await supabase.from("charts").update({ title: title, artist: artist, author: author, author_id: author_id, difficulty: difficulty, desc: description, event: event, tags: tags, HID: useHID }).eq("id", id);
  if (error) {
    return error as any;
  }
  if (data) {
    return data;
  }
}

export function supabaseUpdateChart(id: string, title: string, artist: string, author: string, author_id: string, difficulty: number, description: string, event: string, tags: string, useHID: boolean, uid: string) {
  return _supabaseUpdateChart(id, title, artist, author, author_id, difficulty, description, event, tags, useHID, uid).then((data) => {
    return data;
  })
}

export async function _supabaseGetAllCharts() {
  const { data, error } = await supabase.from("charts").select("*");
  if (error) {
    return error as any;
  }
  if (data) {
    return data;
  }
}

export function supabaseGetAllCharts() {
  return _supabaseGetAllCharts().then((data) => {
    return data;
  })
}

export async function _supabaseLikeChart(id: string) {
  const user = await _supabaseGetUser();
  if (!user) {
    return null;
  }
  const uid = user.id;
  //get date 4 digit
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  //make digit like 20230901
  const dateDigit = year * 10000 + month * 100 + day * 1 + hour * 0.01 + minute * 0.0001 + second * 0.000001;
  const { data, error } = await supabase.from("liked").insert([
    {
      event_id: uid + "-" + id + "-" + dateDigit,
      liked_by: uid,
      chart_id: id,
    },
  ]);
  //get chart data
  const chartData = await _supabaseGetChart(id);
  if (!chartData) {
    return null;
  }
  //get like count
  const likeCount = chartData[0].like_count;
  //update like count
  const { data: data2, error: error2 } = await supabase.from("charts").update({ like_count: likeCount + 1 }).eq("id", id);
  if (error) {
    return error as PostgrestError;
  }
  if (data) {
    return data;
  }
}

export function supabaseLikeChart(id: string) {
  return _supabaseLikeChart(id).then((data) => {
    return data;
  })
}

export async function _getLikedCharts() {
  const user = await _supabaseGetUser();
  if (!user) {
    return null;
  }
  const uid = user.id;
  const { data, error } = await supabase.from("liked").select("*").eq("liked_by", uid);
  if (error) {
    return error as any;
  }
  if (data) {
    return data;
  }
}

export function getLikedCharts() {
  return _getLikedCharts().then((data) => {
    return data;
  })
}
