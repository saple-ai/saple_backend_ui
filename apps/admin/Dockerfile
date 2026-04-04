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

# RUN pnpm install -g serve

# RUN serve -s build

# CMD ["serve", "-s", "build" , "-l", "3001"]

CMD ["pnpm", "run", "start", "--", "--host", "0.0.0.0", "--port", "3001"]


# FROM nginx:alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
