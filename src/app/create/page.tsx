"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import "@xixixao/uploadstuff/react/styles.css";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isEmpty } from "lodash";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const [imageA, setImageA] = useState('');
  const [imageB, setImageB] = useState('');
  const [errors, setErrors] = useState(defaultErrorState);
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold mb-8">Create a Design Test</h1>
      <p className="text-lg max-w-md mb-8">
        Create your test so that other people can vote on their favorite design
        & help you redesign or pick the best options.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get("title") as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "Please fill in this field",
            };
          }
          if (!imageA) {
            newErrors = {
              ...newErrors,
              imageA: "Please fill in this field",
            };
          }
          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: "Please fill in this field",
            };
          }

          setErrors(newErrors);

          const hasErrors = Object.values(newErrors).some(Boolean);
          debugger;
          if (hasErrors) {
            toast({
              title: "Form Errors",
              description: "Please fill in all fields on the page",
              variant: "destructive",
            });
            return;
          }

          const thumbnailId = await createThumbnail({
            aImage: imageA,
            bImage: imageB,
            title,
          });

          router.push(`/thumbnails/${thumbnailId}`);
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Your Test Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Label your test to make it easier to manage later."
            required
            className={clsx({
              border: errors.title,
              "border-red-500": errors.title,
            })}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={clsx("flex flex-col gap-4 rounded p-2", {
              border: errors.imageA,
              "border-red-500": errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold">Design A</h2>

            {imageA && (
              <Image
                width="600"
                height="800"
                alt="image test a"
                src={getImageUrl(imageA)}
              />
            )}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                console.log('Upload Response:', uploaded);
                setImageA((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
            {errors.imageA && <p className="text-red-500">{errors.imageA}</p>}
          </div>

          <div
            className={clsx("flex flex-col gap-4 rounded p-2", {
              border: errors.imageB,
              "border-red-500": errors.imageB,
            })}
          >
            <h2 className="text-2xl font-bold">Design B</h2>

            {imageB && (
                <Image
                  width="600"
                  height="800"
                  alt="image test b"
                  src={getImageUrl(imageB)}
                />
              )}

              <UploadButton
                uploadUrl={generateUploadUrl}
                fileTypes={["image/*"]}
                onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                  console.log('Upload Response:', uploaded);
                  setImageB((uploaded[0].response as any).storageId);
                }}
                onUploadError={(error: unknown) => {
                  alert(`ERROR! ${error}`);
                }}
              />
            {errors.imageB && <p className="text-red-500">{errors.imageB}</p>}
          </div>
        </div>
        <Button type="submit">Create Design Test</Button>
      </form>
    </div>
  );
}
