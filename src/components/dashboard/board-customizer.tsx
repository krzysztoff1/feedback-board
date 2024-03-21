"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";
import { memo } from "react";
import { type BoardTheme } from "~/lib/board-theme.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { boardThemes } from "~/lib/board-themes";
import { PublicBoard } from "~/components/public-board/public-board";
import { convertThemeToCssString } from "~/lib/theme-generator";
import { type boards } from "~/server/db/schema";
import { EXAMPLE_SUGGESTIONS } from "~/lib/constants";

const formSchema = z.object({
  name: z.string().min(1).max(256),
});

interface SelectThemeProps {
  readonly theme: BoardTheme | null;
  readonly board: typeof boards.$inferSelect;
}

export const BoardCustomizer = memo(({ theme, board }: SelectThemeProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: theme?.name ?? boardThemes.at(0)!.name },
  });

  const utils = api.useUtils();
  const createBoardHandler = api.boards.setTheme.useMutation({
    onSettled: async () => {
      await utils.boards.get.invalidate();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedTheme = boardThemes.find((t) => t.name === values.name);

      if (!selectedTheme) {
        throw new Error("Invalid theme");
      }

      await createBoardHandler.mutateAsync({
        theme: selectedTheme,
        themeCSS: convertThemeToCssString({
          theme: selectedTheme,
        }),
        id: board.id,
      });
    } catch (error) {
      //
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="rounded-lg border p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select
                onValueChange={(value) => form.setValue("name", value)}
                value={form.watch("name")}
              >
                <SelectTrigger>
                  <SelectValue>{form.watch("name")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {boardThemes.map((theme) => (
                    <SelectItem key={theme.name} value={theme.name}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Theme will be applied to the board
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
      </div>

      <div className="">
        <PublicBoard
          initialSuggestions={EXAMPLE_SUGGESTIONS}
          board={{ ...board, suggestionsCount: EXAMPLE_SUGGESTIONS.length }}
          themeCSS={convertThemeToCssString({
            theme: boardThemes.find((t) => t.name === form.watch("name"))!,
            selector: `.board-main`,
          })}
          isPreview={true}
        />
      </div>
    </div>
  );
});

BoardCustomizer.displayName = "SelectThemeForm";
