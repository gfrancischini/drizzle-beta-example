import {
  createRelationsHelper,
  ExtractTablesFromSchema,
  Relations,
  RelationsBuilder,
  RelationsBuilderConfig,
  Table,
  View,
} from "drizzle-orm";

// ------------------------------
// 1. Base class constructor type
// ------------------------------
export type DrizzleObjectConstructor<T, TSchema> = {
  new (values: any, isNewEntity?: boolean): T;
  schema: TSchema;
  relations?: Relations<any, any>;
};

// ------------------------------
// 2. Registered classes (source of truth)
// ------------------------------
export interface RegisteredClasses
  extends Record<string, DrizzleObjectConstructor<any, any>> {}

// ------------------------------
// 3. Registered schemas & relations automatically derived
// ------------------------------
type RegisteredSchema = {
  [K in keyof RegisteredClasses as string extends K
    ? never
    : K]: RegisteredClasses[K]["schema"];
};

type RegisteredRelations = {
  [K in keyof RegisteredClasses as string extends K
    ? never
    : K]: RegisteredClasses[K]["relations"];
};

// type RemoveIndexSignature<T> = {
//   [K in keyof T as string extends K ? never : K]: T[K];
// };

// ------------------------------
// 4. Extract tables & relations builder
// ------------------------------
// export type Schema = RegisteredSchema;
// type Tables = ExtractTablesFromSchema<Schema>;
// type SchemaRelationsBuilder = RelationsBuilder<Tables>;

let collectedRelations: ((
  helpers: RelationsBuilder<RegisteredSchema>
) => RelationsBuilderConfig<RegisteredSchema>)[] = [];

// ------------------------------
// 5. Type-only helper to define relations
// ------------------------------
export function defineRelations<
  TConfig extends RelationsBuilderConfig<TTables>,
  TTables extends Record<
    string,
    Table | View
  > = ExtractTablesFromSchema<RegisteredSchema>
>(
  relations?: (helpers: RelationsBuilder<TTables>) => TConfig
): Relations<RegisteredSchema, TTables, TConfig> {
  if (relations) {
    collectedRelations.push(relations as any);
  }

  return null as unknown as Relations<RegisteredSchema, TTables, TConfig>;
}

type RelationsConfigOf<R> = R extends Relations<any, any, infer C> ? C : never;

type ExtractConfigs<T extends Record<string, Relations<any, any, any>>> = {
  [K in keyof T]: RelationsConfigOf<T[K]>;
};

type FlattenRelations<T extends Record<string, any>> = {
  [K in keyof T]: T[K][K];
};

type MergedRelationsConfig = FlattenRelations<
  ExtractConfigs<RegisteredRelations>
>;

export function createRelations<TSchema extends Record<string, Table | View>>(
  schema: TSchema
) {
  const relationsHelper = createRelationsHelper(schema);

  let configs = {};

  collectedRelations.forEach((b) => {
    const config = b(relationsHelper as any);
    configs = {
      ...configs,
      ...config,
    };
  });

  const relations = new Relations(schema, schema, configs);

  return relations as unknown as Relations<
    RegisteredSchema,
    RegisteredSchema,
    MergedRelationsConfig
  >;
}
