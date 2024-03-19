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
import { Loader } from "lucide-react";
import { memo } from "react";

const formSchema = z.object({
  name: z.string().min(1).max(256),
});

interface EditNameFormProps {
  readonly name: string;
}

export const EditNameForm = memo(({ name }: EditNameFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name },
  });
  const createBoardHandler = api.users.editName.useMutation({
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createBoardHandler.mutateAsync(values);
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
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Public facing profile name. </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
});

EditNameForm.displayName = "EditNameForm";
