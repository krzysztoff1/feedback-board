import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { api } from "~/trpc/react";

const formSchema = z.object({
  content: z.string().min(1).max(5000),
});

interface CreateCommmentFormProps {
  readonly suggestionId: number;
  readonly boardId: number;
  readonly onSubmission: () => void;
}

export const CreateCommmentForm = memo(
  ({ suggestionId, boardId, onSubmission }: CreateCommmentFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { content: "" },
    });

    const createCommentHandler = api.comments.create.useMutation({
      onSuccess: () => {
        form.reset();
        onSubmission();
      },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      await createCommentHandler.mutateAsync({
        suggestionId,
        boardId,
        content: values.content,
      });
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Best name ever" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader className="mr-2 animate-spin" size={16} />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    );
  },
);

CreateCommmentForm.displayName = "CreateCommmentForm";
