import { env } from "~/env";
import type { RouterOutput } from "~/server/api/root";

export const MAX_NUMBER_OF_BOARDS = 3;

export const PAGE_SIZE = 20;

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const DISSALLOWED_BOARD_SLUGS = [
  "new",
  "boards",
  "login",
  "register",
  "app",
  "admin",
  "api",
  "auth",
  "settings",
  "profile",
  "logout",
  "reset-password",
  "forgot-password",
  "verify-email",
  "feedback",
];

export const EXAMPLE_SUGGESTIONS: RouterOutput["suggestions"]["get"] = [
  {
    id: 1,
    boardId: 1,
    title: "Make it glow in the dark",
    content: "I want the board to glow in the dark",
    upVotes: 42,
    createdAt: new Date(),
    createdBy: "1",
    updatedAt: null,
    isUpVoted: false,
    user: {
      id: "1",
      name: "Jan Kowalski",
      image: null,
    },
    status: "backlog",
  },
  {
    id: 1,
    boardId: 1,
    title: "Make it glow in the dark",
    content: "I want the board to glow in the dark",
    upVotes: 42,
    createdAt: new Date(),
    createdBy: "1",
    updatedAt: null,
    isUpVoted: false,
    user: {
      id: "1",
      name: "Jan Kowalski",
      image: null,
    },
    status: "backlog",
  },
  {
    id: 1,
    boardId: 1,
    title: "Make it glow in the dark",
    content: "I want the board to glow in the dark",
    upVotes: 42,
    createdAt: new Date(),
    createdBy: "1",
    updatedAt: null,
    isUpVoted: false,
    user: {
      id: "1",
      name: "Jan Kowalski",
      image: null,
    },
    status: "backlog",
  },
];
