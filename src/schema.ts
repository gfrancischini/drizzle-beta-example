import { defineRelations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Users table.
 */
export const User = sqliteTable("User", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  supervisor: text("supervisor"),
});

// /**
//  * Users relations:
//  * A user has many posts. (1=>N)
//  * A user has one profile. (1=>1)
//  */
// export const usersRelations = relations(User, ({ one /*, many*/ }) => ({
//   //Posts: many(Post), // TODO: remove throw from getPropertyRelationHelpers for relation many.
//   Profile: one(Profile, {
//     fields: [User.id],
//     references: [Profile.userId],
//   }),
//   Supervisor: one(User, {
//     fields: [User.supervisor],
//     references: [User.id],
//   }),
// }));

/**
 * Profiles table.
 */
export const Profile = sqliteTable("Profile", {
  id: text("id").primaryKey(),
  bio: text("bio"),
  userId: text("userId")
    .unique()
    .notNull()
    .references(() => User.id),
});

// /**
//  * Profiles relations:
//  * A profile belongs to a user. (1=>1)
//  */
// export const profilesRelations = relations(Profile, ({ one }) => ({
//   User: one(User, {
//     fields: [Profile.userId],
//     references: [User.id],
//   }),
// }));

/**
 * Posts table.
 */
export const Post = sqliteTable("Post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: text("authorId")
    .notNull()
    .references(() => User.id),
});

export const schema = {
  User,
  Profile,
  Post,
};

export const relations = defineRelations(schema, (r) => ({
  User: {
    Supervisor: r.one.User({
      from: r.User.supervisor,
      to: r.User.id,
    }),
    Profile: r.one.Profile({
      from: r.User.id,
      to: r.Profile.userId,
    }),
  },
}));
