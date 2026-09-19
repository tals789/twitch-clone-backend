FROM node:20.17.0-alpine AS base
RUN apk add --no-cache libc6-compat
RUN curl -fsSl https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY . .
RUN bun prisma generate
RUN bun run build

FROM base AS prod
WORKDIR /app
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/nest-cli.json ./nest-cli.json
COPY --from=build /app/package.json /app/bun.lock ./
RUN bun install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/generated ./prisma/generated

CMD ["bun", "--require", "tsconfig-paths/register", "dist/src/main.js"]