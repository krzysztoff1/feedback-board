"use client";

import { memo } from "react";
import type { RouterOutput } from "~/server/api/root";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";
import { TipTap } from "./tiptap";

const formSchema = z.object({
  description: z.string().min(1).max(5000),
});

interface EditBoardDescriptionFormProps {
  readonly board: RouterOutput["boards"]["get"];
}

export const EditBoardDescriptionForm = memo(
  ({ board }: EditBoardDescriptionFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        description: board?.description,
      },
    });
    const editBoardDescriptionHandler = api.boards.edit.useMutation();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        if (!board) {
          return;
        }

        await editBoardDescriptionHandler.mutateAsync({
          id: board.id,
          ...values,
        });
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <TipTap
                onChange={(value) => form.setValue("description", value)}
                value={form.watch("description")}
              />
            </FormControl>
            <FormDescription>
              Please provide a description for your board.
            </FormDescription>
            <FormMessage />
          </FormItem>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader className="mr-2 animate-spin" size={16} />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    );
  },
);

EditBoardDescriptionForm.displayName = "EditBoardDescriptionForm";
