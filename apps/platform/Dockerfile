# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY packages/types/package.json packages/types/
COPY apps/web/package.json apps/web/
COPY apps/platform/package.json apps/platform/
COPY apps/ai/requirements.txt apps/ai/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build types package
RUN cd packages/types && pnpm run build

# Build platform
RUN cd apps/platform && pnpm run build

# Build web
RUN cd apps/web && pnpm run build

# Stage 2: Production image for platform
FROM node:20-alpine AS platform

WORKDIR /app

COPY --from=builder /app/apps/platform/dist ./dist
COPY --from=builder /app/apps/platform/package.json .
COPY --from=builder /app/apps/platform/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "dist/main"]
