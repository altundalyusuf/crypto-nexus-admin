"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server"; // Import server client to check session
import { revalidatePath } from "next/cache";

// Define the response type for client handling
type ActionResponse = {
  success: boolean;
  message: string;
};

/**
 * Bans or Unbans a user using Supabase Admin API.
 * @param userId - The UUID of the user.
 * @param shouldBan - true to ban, false to unban.
 */
export async function toggleUserBanStatus(
  userId: string,
  shouldBan: boolean,
): Promise<ActionResponse> {
  try {
    // --- DEMO MODE PROTECTION START ---

    // We need to identify the current user to enforce Demo Mode restrictions.
    // Note: createClient is async because cookies() is async in newer Next.js versions.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If the action is triggered by the Demo Account, prevent database mutation.
    if (user?.email === "demo@admin.com") {
      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: shouldBan
          ? "Demo Mode: User ban simulated (No changes made)."
          : "Demo Mode: User unban simulated (No changes made).",
      };
    }
    // --- DEMO MODE PROTECTION END ---

    // Determine ban duration and execute update.
    // To ban: set a date far in the future (e.g., year 2099).
    // To unban: set 'banned_until' to null or undefined.

    // Explicitly separating the logic ensures the 'none' string is sent correctly for unbanning.
    if (shouldBan) {
      // BAN USER
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: "876000h",
        user_metadata: {
          // We can also flag it in metadata for easy UI access if needed
          is_banned: true,
        },
      });
      if (error) throw new Error(error.message);
    } else {
      // UNBAN USER
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: "none",
        user_metadata: {
          is_banned: false,
        },
      });
      if (error) throw new Error(error.message);
    }

    /**
     * NOTE: Supabase `updateUserById` for banning works slightly differently based on configuration.
     * The most reliable way for raw banning is using `banned_until`.
     * However, the JS library often abstracts this.
     * Let's use the explicit 'ban_duration' logic if supported, or rely on metadata/status.
     * * Correct approach for Supabase Auth Ban:
     * actually Supabase Admin update accepts 'ban_duration'.
     */

    // Revalidate the dashboard users page to refresh data immediately
    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: shouldBan ? "User has been banned." : "User has been unbanned.",
    };
  } catch (error) {
    console.error("Ban Action Error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user status.",
    };
  }
}
