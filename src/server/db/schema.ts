import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import type { BoardTheme } from "~/lib/board-theme.schema";
import { boardThemes } from "~/lib/board-themes";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `feedback-board_${name}`);

export const boards = createTable(
  "boards",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    description: text("description").default("").notNull(),
    slug: varchar("slug", { length: 256 }).unique(),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    ownerId: varchar("ownerId", { length: 255 })
      .notNull()
      .references(() => users.id),
    theme: json("theme").default(boardThemes.at(0)!).$type<BoardTheme>(),
    themeCSS: text("themeCSS"),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
    ownerIdIdx: index("ownerId_idx").on(example.ownerId),
  }),
);

export const suggestions = createTable(
  "suggestions",
  {
    id: serial("id").primaryKey(),
    boardId: integer("boardId")
      .notNull()
      .references(() => boards.id),
    title: varchar("title", { length: 255 }),
    content: text("content").notNull(),
    createdBy: varchar("createdBy", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    upVotes: integer("upVotes").default(0),
  },
  (example) => ({
    boardIdIdx: index("boardId_idx").on(example.boardId),
    createdByIdx: index("createdBy_idx").on(example.createdBy),
  }),
);

export const comments = createTable(
  "Comments",
  {
    id: serial("id").primaryKey(),
    boardId: integer("boardId")
      .notNull()
      .references(() => boards.id),
    suggestionId: integer("suggestionId")
      .notNull()
      .references(() => suggestions.id),
    createdBy: varchar("createdBy", { length: 255 })
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    boardIdIdx: index("comment_boardId_idx").on(example.boardId),
    suggestionIdIdx: index("comment_suggestionId_idx").on(example.suggestionId),
    userIdIdx: index("comment_userId_idx").on(example.createdBy),
  }),
);

export const suggestionsUpVotes = createTable("suggestionsUpVotes", {
  id: serial("id").primaryKey(),
  boardId: integer("boardId")
    .notNull()
    .references(() => boards.id),
  suggestionId: integer("suggestionId")
    .notNull()
    .references(() => suggestions.id),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
