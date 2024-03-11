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
import { type SetStateAction, type Dispatch, memo } from "react";
import { type boards } from "~/server/db/schema";

const formSchema = z.object({
  name: z.string().min(1).max(256),
});

interface CreateBoardFormProps {
  readonly setUserBoards: Dispatch<
    SetStateAction<(typeof boards.$inferSelect)[]>
  >;
}

export const CreateBoardForm = memo(
  ({ setUserBoards }: CreateBoardFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { name: "" },
    });
    const handler = api.boards.create.useMutation({
      onSettled: () => {
        form.reset();
      },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      await handler.mutateAsync(values);
      setUserBoards((prev) => [
        ...prev,
        {
          id: Math.random(),
          name: values.name,
          createdById: "new-board",
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: "new-board",
        },
      ]);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Board"}
          </Button>
        </form>
      </Form>
    );
  },
);

CreateBoardForm.displayName = "CreateBoardForm";
