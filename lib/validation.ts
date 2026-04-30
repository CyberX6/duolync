import { z } from "zod";

// ========== Content Validation Schemas ==========

export const postContentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(5000, "Post must be 5,000 characters or less"),
});

export const commentContentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be 1,000 characters or less"),
});

export const messageContentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2,000 characters or less"),
});

// ========== Social Account Validation ==========

export const socialAccountSchema = z.object({
  platform: z.enum(["youtube", "tiktok", "instagram", "twitter", "twitch", "linkedin"], {
    required_error: "Please select a platform",
  }),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(100, "Username must be 100 characters or less"),
  profile_url: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL" }
    )
    .optional()
    .or(z.literal("")),
  followers: z
    .number()
    .int()
    .min(0, "Followers must be a positive number")
    .max(1000000000, "Followers count seems too high")
    .optional()
    .or(z.nan()),
  total_views: z
    .number()
    .int()
    .min(0, "Views must be a positive number")
    .max(100000000000, "Views count seems too high")
    .optional()
    .or(z.nan()),
  engagement_rate: z
    .number()
    .min(0, "Engagement rate must be between 0 and 100")
    .max(100, "Engagement rate must be between 0 and 100")
    .optional()
    .or(z.nan()),
});

// ========== Profile Validation ==========

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(100, "Name must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(1000, "Bio must be 1,000 characters or less")
    .optional()
    .or(z.literal("")),
  company_name: z
    .string()
    .trim()
    .max(200, "Company name must be 200 characters or less")
    .optional()
    .or(z.literal("")),
  niche: z
    .string()
    .trim()
    .max(100, "Niche must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(100, "Location must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .max(500, "Website URL must be 500 characters or less")
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL" }
    )
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .trim()
    .max(100, "Industry must be 100 characters or less")
    .optional()
    .or(z.literal("")),
});

// ========== Type Exports ==========

export type PostContent = z.infer<typeof postContentSchema>;
export type CommentContent = z.infer<typeof commentContentSchema>;
export type MessageContent = z.infer<typeof messageContentSchema>;
export type SocialAccountInput = z.infer<typeof socialAccountSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

// ========== Helper Functions ==========

export function validatePostContent(content: string): { success: true; data: string } | { success: false; error: string } {
  const result = postContentSchema.safeParse({ content });
  if (result.success) {
    return { success: true, data: result.data.content };
  }
  return { success: false, error: result.error.errors[0]?.message || "Invalid content" };
}

export function validateCommentContent(content: string): { success: true; data: string } | { success: false; error: string } {
  const result = commentContentSchema.safeParse({ content });
  if (result.success) {
    return { success: true, data: result.data.content };
  }
  return { success: false, error: result.error.errors[0]?.message || "Invalid content" };
}

export function validateMessageContent(content: string): { success: true; data: string } | { success: false; error: string } {
  const result = messageContentSchema.safeParse({ content });
  if (result.success) {
    return { success: true, data: result.data.content };
  }
  return { success: false, error: result.error.errors[0]?.message || "Invalid content" };
}
