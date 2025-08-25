import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defineRelations } from "./schema";

export class Profile {
  static schema = sqliteTable("Profile", {
    id: text("id").primaryKey(),
    bio: text("bio"),
    userId: text("userId"),
  });

  static relations = defineRelations((r) => ({
    Profile: {
      User: r.one.User({
        from: r.Profile.userId,
        to: r.User.id,
      }),
    },
  }));
}

declare module "./schema" {
  interface RegisteredClasses {
    Profile: typeof Profile;
  }
}
