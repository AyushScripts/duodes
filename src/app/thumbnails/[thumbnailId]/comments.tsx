"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../../convex/_generated/dataModel";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { formatDistance } from "date-fns";

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

export function Comments({ thumbnail }: { thumbnail: Doc<"thumbnails"> }) {
  const addComment = useMutation(api.thumbnails.addComment);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addComment({
      text: values.text,
      thumbnailId: thumbnail._id,
    })
      .then(() => {
        toast({
          title: "Comment Posted!",
          description: "Thanks for your feedback.",
        });

        form.reset();
      })
      .catch(() => {
        toast({
          title: "Error posting your comment. Try again later!",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="mb-20">
      <h2 className="my-8 text-4xl font-bold text-center">Comments</h2>

      <div className="max-w-lg mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="I like Design B but you know what..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave a comment for the designer to improve their design.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </Form>

        <div className=" mt-12 space-y-8">
          {thumbnail.comments?.map((comment) => {
            return (
              <div
                key={`${comment.text}_${comment.createdAt}`}
                className="border p-4 rounded"
              >
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={comment.profileUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div>{comment.name}</div>
                    <div>
                      {formatDistance(new Date(comment.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                    <div>{comment.text}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
