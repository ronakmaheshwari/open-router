# ---- Base ----
FROM oven/bun:latest AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps

COPY package.json bun.lock ./
COPY turbo.json ./
COPY tsconfig.json ./

COPY apps ./apps
COPY packages ./packages

RUN bun install

# ---- Build ----
FROM deps AS build

RUN bun run build

# ---- Runtime ----
FROM oven/bun:latest AS runner
WORKDIR /app

COPY --from=build /app ./

ENV NODE_ENV=production

# If using Prisma
RUN bun run generate:db

EXPOSE 3000

CMD ["bun", "run", "dev"]