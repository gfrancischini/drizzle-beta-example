// import {
//   defineRelations,
//   ExtractTablesFromSchema,
//   RelationsBuilder,
// } from "drizzle-orm";
// import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// // import { RegisteredClasses } from "@drizzlex";
// // console.log("RegisteredClasses", RegisteredClasses);
// // let relationHelpers: any;

// // export function relations<
// //   TSchema extends Record<string, unknown>,
// //   TConfig extends RelationsBuilderConfig<TTables>,
// //   TTables extends Record<
// //     string,
// //     Table | View
// //   > = ExtractTablesFromSchema<TSchema>
// // >(
// //   schema: TSchema,
// //   relations?: (helpers: RelationsBuilder<TTables>) => TConfig
// // ): Relations<TSchema, TTables, TConfig> {
// //   if (relationHelpers == null) {
// //     relationHelpers = createRelationsHelper(schema as unknown as TTables);
// //   }
// //   return new Relations(
// //     schema,
// //     schema as unknown as TTables,
// //     relations!(relationHelpers)
// //   ) as Relations<TSchema, TTables, TConfig>;
// // }

// /**
//  * Users table.
//  */
// export const User = sqliteTable("User", {
//   id: text("id").primaryKey(),
//   username: text("username").notNull(),
//   supervisor: text("supervisor"),
// });

// // /**
// //  * Users relations:
// //  * A user has many posts. (1=>N)
// //  * A user has one profile. (1=>1)
// //  */
// // export const usersRelations = relations(User, ({ one /*, many*/ }) => ({
// //   //Posts: many(Post), // TODO: remove throw from getPropertyRelationHelpers for relation many.
// //   Profile: one(Profile, {
// //     fields: [User.id],
// //     references: [Profile.userId],
// //   }),
// //   Supervisor: one(User, {
// //     fields: [User.supervisor],
// //     references: [User.id],
// //   }),
// // }));

// /**
//  * Profiles table.
//  */
// export const Profile = sqliteTable("Profile", {
//   id: text("id").primaryKey(),
//   bio: text("bio"),
//   userId: text("userId")
//     .unique()
//     .notNull()
//     .references(() => User.id),
// });

// // /**
// //  * Profiles relations:
// //  * A profile belongs to a user. (1=>1)
// //  */
// // export const profilesRelations = relations(Profile, ({ one }) => ({
// //   User: one(User, {
// //     fields: [Profile.userId],
// //     references: [User.id],
// //   }),
// // }));

// /**
//  * Posts table.
//  */
// export const Post = sqliteTable("Post", {
//   id: text("id").primaryKey(),
//   title: text("title").notNull(),
//   content: text("content"),
//   authorId: text("authorId")
//     .notNull()
//     .references(() => User.id),
// });

// export const schema = {
//   User,
//   Profile,
//   //Post,
// };

// // type RelationsBuilder = Parameters<
// //   Parameters<typeof defineRelations<typeof schema, any>>[1]
// // >[0];

// // type A = Parameters<
// //   typeof import("drizzle-orm").defineRelations<typeof schema, any>
// // >;

// type Tables = ExtractTablesFromSchema<typeof schema>;

// export type SchemaRelationsBuilder = RelationsBuilder<Tables>;

// export const userRelations = (r: SchemaRelationsBuilder) => ({
//   User: {
//     Supervisor: r.one.User({
//       from: r.User.supervisor,
//       to: r.User.id,
//     }),

//     Profile: r.one.Profile({
//       from: r.User.id,
//       to: r.Profile.userId,
//     }),
//   },
// });

// export const profileRelations = (r: SchemaRelationsBuilder) => ({
//   Profile: {
//     User: r.one.User({
//       from: r.Profile.userId,
//       to: r.User.id,
//     }),
//   },
// });

// function mergeRelations<T extends Record<string, any>[]>(
//   ...defs: T
// ): UnionToIntersection<T[number]> {
//   return defs.reduce((acc, d) => ({ ...acc, ...d }), {}) as any;
// }

// // helper type: turn union into intersection
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
//   k: infer I
// ) => void
//   ? I
//   : never;

// // function mergeRelations<T extends Record<string, any>>(...defs: T[]): T {
// //   return defs.reduce((acc, d) => ({ ...acc, ...d }), {} as T);
// // }

// export const schemaRelations = defineRelations(schema, (r) =>
//   mergeRelations(userRelations(r), profileRelations(r))
// );

// export const relationsUser = defineRelations(schema, (r) => ({
//   User: {
//     Supervisor: r.one.User({
//       from: r.User.supervisor,
//       to: r.User.id,
//     }),
//     Profile: r.one.Profile({
//       from: r.User.id,
//       to: r.Profile.userId,
//     }),
//   },
// }));

// // export const relationsPost = defineRelations(schema, (r) => ({
// //   Post: {
// //     User: r.one.User({
// //       from: r.Post.authorId,
// //       to: r.User.id,
// //     }),
// //   },
// // }));

// // export const relationsProfile = defineRelations(schema, (r) => ({
// //   Profile: {
// //     User: r.one.User({
// //       from: r.Profile.userId,
// //       to: r.User.id,
// //     }),
// //   },
// // }));

// // export const schemaRelations = new Relations(
// //     schema,
// //     schema
// //     relationHelpers
// //   ) as Relations<TSchema, TTables, TConfig>;

// // export const schemarelations = { ...relationsUser, ...relationsPost };

// // export const schemaRelations = defineRelations(schema, (r) => ({
// //   User: {
// //     // Supervisor: r.one.User({
// //     //   from: r.User.supervisor,
// //     //   to: r.User.id,
// //     // }),
// //     Profile: r.one.Profile({
// //       from: r.User.id,
// //       to: r.Profile.userId,
// //     }),
// //   },
// //   // Post: {
// //   //   User: r.one.User({
// //   //     from: r.Post.authorId,
// //   //     to: r.User.id,
// //   //   }),
// //   // },
// //   // Profile: {
// //   //   User: r.one.User({
// //   //     from: r.Profile.userId,
// //   //     to: r.User.id,
// //   //   }),
// //   // },
// // }));

// // interface Test extends Record<string, any> {
// //   //Post: typeof relationsProfile;
// //   User: typeof User;
// // }

// // type ExpandRecursively<T> = T extends object
// //   ? { [K in keyof T]: ExpandRecursively<T[K]> }
// //   : T;

// // // type TestI = ExpandRecursively<Test>;

// // type Schema = typeof schema;

// // type TSchema = { User: typeof User; Post: typeof Post };
// // type TTables = ExtractTablesFromSchema<TSchema>;

// // // type TSchema = Record<string, unknown>,
// // // type	TConfig extends RelationsBuilderConfig<TTables>,
// // // type	TTables extends Record<string, Table | View> = ExtractTablesFromSchema<TSchema>,

// // type SchemaRelation = Relations<
// //   TSchema,
// //   RelationsBuilderConfig<TTables>,
// //   TTables
// // >;

// // type SchemaRelationsDynamic = Relations<TSchema, any, TTables>;

// // type SchemaRelations = typeof schemaRelations;
// // type TablesRelationsSchemaRelations =
// //   ExtractTablesWithRelations<SchemaRelations>;

// // type TablesRelations = ExtractTablesWithRelations<SchemaRelationsDynamic>;
// // type A = ExtractTablesFromSchema<typeof schema>;
// // type Relations1 = RelationsFilter<TablesRelations["Profile"], TablesRelations>;

// // const a: Relations1 = {
// //   User: {
// //     Supervisor: {
// //       id: 1,
// //     },
// //   },
// // };
