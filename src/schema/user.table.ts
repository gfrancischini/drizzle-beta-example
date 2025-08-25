import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defineRelations } from "./schema";

export class User {
  /**
   * Users table.
   */
  static schema = sqliteTable("User", {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    supervisor: text("supervisor"),
  });

  static relations = defineRelations((r) => ({
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
}

declare module "./schema" {
  interface RegisteredClasses {
    User: typeof User;
  }
}
