import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/** ts-fsrs Card, serialized for jsonb storage (Dates as ISO strings). */
export type FsrsCardJson = {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: string | null;
};

// ------------------------------------------------------------------- enums
export const dimensionEnum = pgEnum("dimension", [
  "grammar",
  "vocab",
  "naturalness",
  "flow",
]);
export const issueClassEnum = pgEnum("issue_class", ["error", "upgrade"]);
export const issueStatusEnum = pgEnum("issue_status", [
  "open",
  "accepted",
  "dismissed",
]);
export const issueSourceEnum = pgEnum("issue_source", ["detector", "llm"]);
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);
export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "analyzing",
  "analyzed",
]);
export const patternStateEnum = pgEnum("pattern_state", [
  "hypothesis",
  "active",
  "improving",
  "resolved",
]);
export const cardTypeEnum = pgEnum("card_type", [
  "correction",
  "spot",
  "contrast",
  "reformulation",
]);
export const reviewRatingEnum = pgEnum("review_rating", [
  "again",
  "hard",
  "good",
  "easy",
]);

// --------------------------------------------------------------- concepts
// The taxonomy backbone (seeded from content/concepts.ts).
export const concepts = pgTable("concepts", {
  slug: text("slug").primaryKey(),
  label: text("label").notNull(),
  dimension: dimensionEnum("dimension").notNull(),
  description: text("description").notNull(),
  peninsularNotes: text("peninsular_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ----------------------------------------------------------- conversations
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicSlug: text("topic_slug"),
  // When set, this conversation is a tense-practice drill (a Tense slug).
  focusTense: text("focus_tense"),
  status: conversationStatusEnum("status").notNull().default("active"),
  model: text("model"),
  // Coaching strengths from the analysis pass (issues live in their own table).
  strengths: jsonb("strengths").$type<string[]>(),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

// --------------------------------------------------------------- messages
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    index: integer("index").notNull(),
    tokens: integer("tokens"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("messages_conversation_idx").on(t.conversationId)],
);

// ----------------------------------------------------------------- issues
// The atomic unit of feedback. Carries the trust signals: class (error vs
// upgrade), confidence, source (detector vs llm), and status (accept/dismiss).
export const issues = pgTable(
  "issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    messageId: uuid("message_id").references(() => messages.id, {
      onDelete: "set null",
    }),
    original: text("original").notNull(),
    correction: text("correction").notNull(),
    explanation: text("explanation").notNull(),
    class: issueClassEnum("class").notNull(),
    dimension: dimensionEnum("dimension").notNull(),
    conceptSlug: text("concept_slug").references(() => concepts.slug),
    severity: integer("severity").notNull(),
    confidence: real("confidence").notNull(),
    status: issueStatusEnum("status").notNull().default("open"),
    source: issueSourceEnum("source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("issues_conversation_idx").on(t.conversationId),
    index("issues_concept_idx").on(t.conceptSlug),
  ],
);

// --------------------------------------------------------- error patterns
export const errorPatterns = pgTable(
  "error_patterns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conceptSlug: text("concept_slug")
      .notNull()
      .references(() => concepts.slug),
    signature: text("signature").notNull(),
    label: text("label").notNull(),
    state: patternStateEnum("state").notNull().default("hypothesis"),
    firstSeen: timestamp("first_seen", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeen: timestamp("last_seen", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("error_patterns_concept_signature_uniq").on(
      t.conceptSlug,
      t.signature,
    ),
  ],
);

// Append-only frequency observations (drive "is this pattern shrinking?").
export const patternObservations = pgTable(
  "pattern_observations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patternId: uuid("pattern_id")
      .notNull()
      .references(() => errorPatterns.id, { onDelete: "cascade" }),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    occurrences: integer("occurrences").notNull(),
    wordsInConversation: integer("words_in_conversation").notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("pattern_observations_pattern_idx").on(t.patternId),
    uniqueIndex("pattern_observations_pattern_conv_uniq").on(
      t.patternId,
      t.conversationId,
    ),
  ],
);

// ------------------------------------------------------------- drill cards
// One card per accepted issue (anchored to the real mistake). Self-graded;
// FSRS state lives in `fsrs` (jsonb), with `due` + `state` mirrored as columns
// for efficient queue queries.
export const drillCards = pgTable(
  "drill_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // A card comes from EITHER an accepted issue (patternId set) OR a course
    // (courseSlug/itemKey set). Both nullable.
    patternId: uuid("pattern_id").references(() => errorPatterns.id, {
      onDelete: "cascade",
    }),
    issueId: uuid("issue_id").references(() => issues.id, {
      onDelete: "set null",
    }),
    courseSlug: text("course_slug"),
    lessonSlug: text("lesson_slug"),
    itemKey: text("item_key"),
    type: cardTypeEnum("type").notNull().default("correction"),
    prompt: text("prompt").notNull(),
    answer: text("answer").notNull(),
    note: text("note"),
    conceptSlug: text("concept_slug").references(() => concepts.slug),
    dimension: dimensionEnum("dimension").notNull(),
    due: timestamp("due", { withTimezone: true }).notNull().defaultNow(),
    state: integer("state").notNull().default(0), // ts-fsrs State
    fsrs: jsonb("fsrs").$type<FsrsCardJson>().notNull(),
    suspended: boolean("suspended").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("drill_cards_due_idx").on(t.due),
    index("drill_cards_state_idx").on(t.state),
    uniqueIndex("drill_cards_issue_uniq").on(t.issueId),
    uniqueIndex("drill_cards_item_uniq").on(t.itemKey),
    index("drill_cards_course_idx").on(t.courseSlug),
  ],
);

// Append-only review history (FSRS tuning, analytics, new-per-day counting).
export const reviewLogs = pgTable(
  "review_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => drillCards.id, { onDelete: "cascade" }),
    rating: reviewRatingEnum("rating").notNull(),
    // Card's ts-fsrs State BEFORE this review (0 = New → counts as an intro).
    prevState: integer("prev_state").notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    logData: jsonb("log_data"),
  },
  (t) => [index("review_logs_reviewed_idx").on(t.reviewedAt)],
);

// ----------------------------------------------------------------- folders
// User-created decks for saved cards ("Dichos", "Vocabulario", …). A card
// belongs to at most one folder; deleting a folder leaves its cards unfiled.
export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("folders_name_uniq").on(t.name)],
);

// -------------------------------------------------------------- saved cards
// Manually-saved practice cards (things the user liked / learned). Reviewed with
// the same FSRS flow. `meaning` is the prompt (front); `phrase` is the answer.
export const savedCards = pgTable(
  "saved_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phrase: text("phrase").notNull(),
    meaning: text("meaning").notNull(),
    note: text("note"),
    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "set null",
    }),
    sourceConversationId: uuid("source_conversation_id").references(
      () => conversations.id,
      { onDelete: "set null" },
    ),
    due: timestamp("due", { withTimezone: true }).notNull().defaultNow(),
    state: integer("state").notNull().default(0),
    fsrs: jsonb("fsrs").$type<FsrsCardJson>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("saved_cards_due_idx").on(t.due),
    index("saved_cards_folder_idx").on(t.folderId),
  ],
);

// ------------------------------------------------------------------- types
export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type SavedCard = typeof savedCards.$inferSelect;
export type NewSavedCard = typeof savedCards.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type ConceptRow = typeof concepts.$inferSelect;
export type ErrorPattern = typeof errorPatterns.$inferSelect;
export type PatternObservation = typeof patternObservations.$inferSelect;
export type DrillCard = typeof drillCards.$inferSelect;
export type NewDrillCard = typeof drillCards.$inferInsert;
export type ReviewLog = typeof reviewLogs.$inferSelect;
