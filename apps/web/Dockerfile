# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY packages/types/package.json packages/types/
COPY apps/web/package.json apps/web/
COPY apps/platform/package.json apps/platform/
COPY apps/ai/requirements.txt apps/ai/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN cd packages/types && pnpm run build
RUN cd apps/web && pnpm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
