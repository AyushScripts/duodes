import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  thumbnails: defineTable({
    title: v.string(),
    userId: v.string(),
    aImage: v.string(),
    aVotes: v.number(),
    bImage: v.string(),
    bVotes: v.number(),
    voteIds: v.array(v.string()),
    profileImage: v.optional(v.string()),
    name: v.optional(v.string()),
    comments: v.optional(
      v.array(
        v.object({
          userId: v.string(),
          text: v.string(),
          createdAt: v.number(),
          name: v.string(),
          profileUrl: v.string(),
        })
      )
    ),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
  }),
});
