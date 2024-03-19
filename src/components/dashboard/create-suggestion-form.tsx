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
import { api } from "~/trpc/react";
import { memo } from "react";
import { Loader } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1).max(256),
  content: z.string().min(1).max(5000),
});

interface CreateBoardFormProps {
  readonly boardId: number;
}

export const CreateSuggestionForm = memo(
  ({ boardId }: CreateBoardFormProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { title: "", content: "" },
    });
    const handler = api.suggestions.create.useMutation({
      onSettled: () => {
        form.reset();
      },
      onSuccess: () => {
        router.refresh();
      },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await handler.mutateAsync({ boardId, ...values });
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Textarea placeholder="Best title ever" {...field} />
                </FormControl>
                <FormDescription>
                  Title of your new suggestion. Short and sweet.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Best content ever" {...field} />
                </FormControl>
                <FormDescription>
                  Content of your new suggestion. Long and detailed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
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

CreateSuggestionForm.displayName = "CreateSuggestionForm";
