import type { ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigService } from "@nestjs/config";
import { isDev } from "@root/shared/utils/is-dev.util";
import { join } from "node:path";

export const getGraphQLConfig = (config: ConfigService): ApolloDriverConfig => ({
  playground: isDev(config),
  path: config.getOrThrow<string>('GRAPHQL_PREFIX'),
  autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
  sortSchema: true,
  context: ({ req, res }) => ({ req, res }),
  installSubscriptionHandlers: true
})