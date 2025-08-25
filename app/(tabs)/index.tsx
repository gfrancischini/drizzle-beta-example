import { Image } from "expo-image";
import { Button, StyleSheet, Text, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Profile } from "@/src/schema/profile.table";
import { createRelations } from "@/src/schema/schema";
import { User } from "@/src/schema/user.table";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { openDatabaseSync } from "expo-sqlite";
import { useMemo } from "react";
import migrations from "../../src/drizzle/migrations";

const expo = openDatabaseSync("db3.db");

const schema = {
  User: User.schema,
  Profile: Profile.schema,
};

export default function HomeScreen() {
  const db = useMemo(() => {
    const relations = createRelations(schema);
    const db = drizzle(expo, { schema: schema, relations: relations });
    return db;
  }, []);

  useDrizzleStudio(expo);

  const { success, error } = useMigrations(db, migrations);
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <Button
        title="Load Data"
        onPress={() => {
          db.insert(schema.User)
            .values({
              id: "1",
              username: "postUsers",
              supervisor: "2",
            })
            .then((result) => {
              console.log("result", result);
            });

          db.insert(schema.User)
            .values({
              id: "2",
              username: "no post",
              supervisor: "1",
            })
            .then((result) => {
              console.log("result", result);
            });

          // db.insert(schema.Post)
          //   .values({
          //     authorId: "1",
          //     id: "1",
          //     title: "Hello World 1",
          //     content: "This is a post test",
          //   })
          //   .then((result) => {
          //     console.log("result", result);
          //   });
          // db.insert(schema.Post)
          //   .values({
          //     authorId: "1",
          //     id: "2",
          //     title: "Hello World 2",
          //     content: "This is a second post test",
          //   })
          //   .then((result) => {
          //     console.log("result", result);
          //   });

          db.insert(schema.Profile)
            .values({
              id: "1",
              userId: "1",
              bio: "This is a user profile for user 1",
            })
            .then((result) => {
              console.log("result", result);
            });
        }}
      />
      <ThemedText type="subtitle">
        {/* {JSON.stringify(
          db.query.Profile.findFirst({
            where: {
              User: {
                Supervisor: {
                  id: "2",
                },
              },
            },
            with: {
              User: true,
            },
          }).sync()
        )} */}

        {JSON.stringify(
          db.query.User.findFirst({
            where: {
              Supervisor: {
                id: "2",
              },
              Profile: {
                id: "1",
              },
            },
            with: {
              Profile: true,
            },
          }).sync()
        )}
      </ThemedText>

      {/* {db.select().from(Post).$dynamic().where({})} */}

      {/* <ThemedText type="subtitle">
        {JSON.stringify(
          db.query.Post.findMany({
            where: {
              User: {
                id: "1",
              },
            },
          }).sync()
          // db.select().from(Post).where({}).all()
        )}
      </ThemedText> */}
      <ThemedText type="subtitle">
        {JSON.stringify(
          db.query.Profile.findMany({
            with: {
              User: true,
            },
            where: {
              User: {
                Supervisor: {
                  id: "2",
                },
              },
            },
          }).sync()
        )}
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
