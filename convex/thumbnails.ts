import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getUser, getUserId } from "./utils";

export const createThumbnail = mutation({
  args: {
    title: v.string(),
    aImage: v.string(),
    bImage: v.string(),
    profileImage: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("You must be logged in to add a design!");
    }
    return await ctx.db.insert("thumbnails", {
      //this adds values coming from args to the convex table(in our case: thumbnails)
      title: args.title,
      userId: user.subject,
      aImage: args.aImage,
      aVotes: 0,
      bImage: args.bImage,
      bVotes: 0,
      voteIds: [],
      profileImage: args.profileImage,
      comments: [],
    });
  },
});

export const addComment = mutation({
  args: {
    text: v.string(),
    thumbnailId: v.id("thumbnails"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) {
      throw new Error("You must be logged in to leave a comment");
    }

    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("thumbnail by id didnot exist.");
    }

    if(!thumbnail.comments){
      thumbnail.comments= [];
    }
    
    thumbnail.comments.unshift({
      createdAt: Date.now(),
      text: args.text,
      userId: user.subject,
      name: user.name?? "Annonymous",
      profileUrl: user.pictureUrl?? "",

    });

    await ctx.db.patch(thumbnail._id, {
      comments: thumbnail.comments,
    });
  },
});

export const getThumbnail = query({
  args: { thumbnailId: v.id("thumbnails") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailId);
  },
});

export const getRecentThumbnails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("thumbnails")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const voteOnThumbnail = mutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in to vote!");
      return [];
    }

    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("Invalid Thumbnail Id");
    }

    if (thumbnail.voteIds.includes(userId)) {
      throw new Error("You've already voted!");
    }

    if (thumbnail.aImage === args.imageId) {
      thumbnail.aVotes++;
      await ctx.db.patch(thumbnail._id, {
        aVotes: thumbnail.aVotes,
        voteIds: [...thumbnail.voteIds, userId],
      });
    } else {
      thumbnail.bVotes++;
      await ctx.db.patch(thumbnail._id, {
        bVotes: thumbnail.bVotes,
        voteIds: [...thumbnail.voteIds, userId],
      });
    }

    await ctx.db.patch(thumbnail._id, {});
  },
});
