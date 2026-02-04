"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

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
    // Determine ban duration.
    // To ban: set a date far in the future (e.g., year 2099).
    // To unban: set 'banned_until' to null or undefined.
    const banDuration = shouldBan ? "876000h" : "none";

    // Supabase Admin: Update user attributes
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: banDuration,
      user_metadata: {
        // We can also flag it in metadata for easy UI access if needed
        is_banned: shouldBan,
      },
    });

    /**
     * NOTE: Supabase `updateUserById` for banning works slightly differently based on configuration.
     * The most reliable way for raw banning is using `banned_until`.
     * However, the JS library often abstracts this.
     * Let's use the explicit 'ban_duration' logic if supported, or rely on metadata/status.
     * * Correct approach for Supabase Auth Ban:
     * actually Supabase Admin update accepts 'ban_duration'.
     */

    if (error) {
      console.error("Ban Action Error:", error);
      throw new Error(error.message);
    }

    return {
      success: true,
      message: shouldBan ? "User has been banned." : "User has been unbanned.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user status.",
    };
  }
}
