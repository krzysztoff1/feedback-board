"use client";

import { memo } from "react";
import { PublicBoard } from "../public-board/public-board";
import { EXAMPLE_SUGGESTIONS } from "~/lib/constants";

export const BoardPreview = memo(() => {
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="flex flex-col items-center justify-center p-4">
        <h3 className="mb-2 text-2xl font-bold text-primary">
          Place it anywhere
        </h3>
        <p className="max-w-md text-center text-white/90">
          Embed Suggestli board on your website to collect feedback from your
          users or share a link to it.
        </p>
      </div>

      <div className="relative mt-12 w-full max-w-4xl shadow-primary">
        <PublicBoard
          suggestions={EXAMPLE_SUGGESTIONS}
          board={{
            id: 1,
            name: "My board",
            slug: "my-board",
            themeCSS: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: "1",
            ownerId: "1",
            theme: null,
          }}
          isPreview={true}
        />
      </div>
    </div>
  );
});

BoardPreview.displayName = "BoardPreview";
