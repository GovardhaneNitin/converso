"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create companion");

  return data[0];
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  let query = supabase.from("companions").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) throw new Error(error.message);

  // Get user's bookmarks
  if (userId) {
    try {
      const { data: bookmarks, error: bookmarkError } = await supabase
        .from("bookmarks")
        .select("companion_id")
        .eq("user_id", userId);

      if (bookmarkError) {
        console.error("Bookmark query error:", bookmarkError);
      }

      const bookmarkedIds = new Set(
        bookmarks?.map((b) => b.companion_id) || []
      );

      // Add bookmarked property to each companion
      return companions?.map((companion) => ({
        ...companion,
        bookmarked: bookmarkedIds.has(companion.id),
      }));
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      // Return companions without bookmarked status if there's an error
      return companions?.map((companion) => ({
        ...companion,
        bookmarked: false,
      }));
    }
  }

  return companions?.map((companion) => ({
    ...companion,
    bookmarked: false,
  }));
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error) return console.log(error);

  return data[0];
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit * 2); // Get more entries to ensure we have enough unique companions

  if (error) throw new Error(error.message);

  // Extract companions and remove duplicates based on ID
  const companions = data.map(({ companions }) => companions).filter(Boolean);
  const seen = new Set<string>();
  const uniqueCompanions = companions.filter((companion) => {
    const companionObj = companion as unknown as { id: string };
    const id = companionObj?.id;
    if (!id || seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });

  // Return only the requested limit of unique companions
  return uniqueCompanions.slice(0, limit);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit * 2); // Get more entries to ensure we have enough unique companions

  if (error) throw new Error(error.message);

  // Extract companions and remove duplicates based on ID
  const companions = data.map(({ companions }) => companions).filter(Boolean);
  const seen = new Set<string>();
  const uniqueCompanions = companions.filter((companion) => {
    const companionObj = companion as unknown as { id: string };
    const id = companionObj?.id;
    if (!id || seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });

  // Return only the requested limit of unique companions
  return uniqueCompanions.slice(0, limit);
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: "pro" })) {
    return true;
  } else if (has({ feature: "3_companion_limit" })) {
    limit = 3;
  } else if (has({ feature: "10_companion_limit" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length;

  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }
};

export const addBookmark = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const removeBookmark = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const isBookmarked = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("companion_id", companionId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message);

  return !!data;
};

export const getUserBookmarks = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();

  // Get bookmarks for the user
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select("companion_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit * 2);

  if (bookmarksError) throw new Error(bookmarksError.message);

  if (!bookmarks || bookmarks.length === 0) {
    return [];
  }

  // Extract companion IDs
  const companionIds = bookmarks.map((b) => b.companion_id);

  // Fetch the companions
  const { data: companions, error: companionsError } = await supabase
    .from("companions")
    .select()
    .in("id", companionIds);

  if (companionsError) throw new Error(companionsError.message);

  // Remove duplicates based on ID
  const seen = new Set<string>();
  const uniqueCompanions = (companions || []).filter((companion) => {
    const id = companion?.id;
    if (!id || seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });

  // Return only the requested limit of unique companions
  return uniqueCompanions.slice(0, limit);
};
