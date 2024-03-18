import { env } from "~/env";
import type { RouterOutput } from "~/server/api/root";

export const MAX_NUMBER_OF_BOARDS = 3;

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const EXAMPLE_SUGGESTIONS: RouterOutput["boards"]["getPublicBoardData"]["suggestions"] =
  [
    {
      id: 1,
      boardId: 1,
      title: "Make it glow in the dark",
      content: "I want the board to glow in the dark",
      upVotes: 42,
      createdBy: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isUpVoted: false,
      user: {
        name: "Jan Kowalski",
        image: null,
      },
    },
    {
      id: 2,
      boardId: 1,
      title: "Let it fly",
      content: "I want the board to fly",
      upVotes: 2,
      createdBy: "2",
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(),
      isUpVoted: false,
      user: {
        name: "John Doe",
        image: null,
      },
    },
    {
      id: 3,
      boardId: 1,
      title: "Find the treasure",
      content: "I want the board to find the treasure",
      upVotes: 32,
      createdBy: "1",
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(),
      isUpVoted: false,
      user: {
        name: "Vasco da Gama",
        image: null,
      },
    },
  ];
