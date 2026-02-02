"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { UserData } from "@/store/slices/userSlice";

/**
 * Fetches the list of users directly from Supabase Auth using Admin privileges.
 * This runs strictly on the server.
 */
export async function getUsersFromServer(): Promise<UserData[]> {
  try {
    // List users from Supabase Auth (Admin API)
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Supabase Admin Error:", error.message);
      throw new Error(error.message);
    }

    if (!users) return [];

    // Map Supabase User object to our Dashboard UserData interface
    return users.map((u) => ({
      id: u.id,
      email: u.email || "No Email",
      // Check metadata for name, fallback to 'Anonymous' if not found
      fullName:
        u.user_metadata?.full_name || u.user_metadata?.name || "Anonymous",
      // Determine status based on ban timestamp
      status: u.banned_until ? "Banned" : "Active",
      // Use last sign-in date or creation date as fallback
      lastLogin: u.last_sign_in_at || u.created_at,
    }));
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return []; // Return empty array to prevent UI crash
  }
}
