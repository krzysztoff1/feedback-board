import { env } from "~/env";
import type { RouterOutput } from "~/server/api/root";

export const MAX_NUMBER_OF_BOARDS = 3;

export const SITE_URL = env.SITE_URL;

export const EXAMPLE_SUGGESTIONS: RouterOutput["boards"]["getPublicBoardData"]["suggestions"] =
  [
    {
      id: 1,
      boardId: 1,
      title: "Make it glow in the dark",
      content: "I want the board to glow in the dark",
      upVotes: 1,
      createdBy: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isUpVoted: false,
      user: {
        name: "Jan Kowalski",
        image: null,
      },
    },
  ];
