"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { type SetStateAction, type Dispatch, memo, useState } from "react";
import { type boards } from "~/server/db/schema";
import { Check, CircleX, Loader } from "lucide-react";
import { convertToSlug } from "~/lib/utils";
import { SITE_URL } from "~/lib/constants";

enum SlugValidationStatus {
  Idle = "Idle",
  Validating = "Validating",
  Valid = "Valid",
  Invalid = "Invalid",
}

const formSchema = z.object({
  name: z.string().min(1).max(256),
  slug: z.string().min(3).max(60),
});

interface CreateBoardFormProps {
  readonly setUserBoards: Dispatch<
    SetStateAction<(typeof boards.$inferSelect)[]>
  >;
}

export const CreateBoardForm = memo(
  ({ setUserBoards }: CreateBoardFormProps) => {
    const [slugValidationStatus, setSlugValidationStatus] = useState(
      SlugValidationStatus.Idle,
    );

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        slug: "",
      },
    });
    const createBoardHandler = api.boards.create.useMutation({
      onSettled: () => {
        form.reset();
      },
    });
    const validateSlugHandler = api.boards.validateBoardSlug.useMutation();

    const validateSlug = async (value: string) => {
      setSlugValidationStatus(SlugValidationStatus.Validating);
      try {
        const isValid = await validateSlugHandler.mutateAsync({
          slug: convertToSlug(value),
        });

        setSlugValidationStatus(
          isValid ? SlugValidationStatus.Valid : SlugValidationStatus.Invalid,
        );

        if (isValid) {
          form.clearErrors("slug");
        } else {
          form.setError("slug", {
            type: "manual",
            message: "This slug is already taken.",
          });
        }
        return isValid;
      } catch (error) {
        setSlugValidationStatus(SlugValidationStatus.Invalid);
        return false;
      }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const isValid = await validateSlug(values.slug);

        if (!isValid) {
          return;
        }

        await createBoardHandler.mutateAsync(values);
        setUserBoards((prev) => [
          ...prev,
          {
            id: Math.random(),
            name: values.name,
            createdById: "new-board",
            createdAt: new Date(),
            updatedAt: new Date(),
            ownerId: "new-board",
            slug: convertToSlug(values.slug),
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Best name ever" {...field} />
                </FormControl>
                <FormDescription>
                  Name of your new board. You can change it later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="best-name-ever"
                      {...field}
                      onBlur={async () => {
                        if (form.formState.errors.slug) {
                          return;
                        }

                        await validateSlug(field.value);
                      }}
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {slugValidationStatus === SlugValidationStatus.Valid ? (
                        <Check className="h-5 w-5 text-emerald-400" size={16} />
                      ) : slugValidationStatus ===
                        SlugValidationStatus.Invalid ? (
                        <CircleX className="h-5 w-5 text-red-400" size={16} />
                      ) : slugValidationStatus ===
                        SlugValidationStatus.Validating ? (
                        <Loader className="animate-spin" size={16} />
                      ) : null}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Slug is used in URLs and must be unique. Your board will be
                  available at{" "}
                  <code>
                    {`${convertToSlug(field.value)}`}.
                    {`${SITE_URL.replace("https://", "")}`}
                  </code>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader className="mr-2 animate-spin" size={16} />
                Creating...
              </>
            ) : (
              "Create Board"
            )}
          </Button>
        </form>
      </Form>
    );
  },
);

CreateBoardForm.displayName = "CreateBoardForm";
