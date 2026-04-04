FROM node:18-alpine AS base
# Build stage

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the app
RUN pnpm run build



CMD ["pnpm", "run", "start", "--", "--host", "0.0.0.0", "--port", "3000"]
