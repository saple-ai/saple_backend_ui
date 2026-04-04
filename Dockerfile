FROM node:18-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

COPY . .

# Set environment variables for build
ARG VITE_API_URL
ARG VITE_MODEL_URL
ARG VITE_URL
ARG VITE_TRAINING_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MODEL_URL=$VITE_MODEL_URL
ENV VITE_URL=$VITE_URL
ENV VITE_TRAINING_URL=$VITE_TRAINING_URL

# Install dependencies
RUN pnpm install

# Build the app
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/apps/bot/dist/ /usr/share/nginx/html/bot
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html/admin
COPY --from=builder /app/apps/app/dist /usr/share/nginx/html/app

CMD ["nginx", "-g", "daemon off;"]
