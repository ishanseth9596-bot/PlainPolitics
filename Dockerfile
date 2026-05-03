# ─────────────────────────────────────────────────────────────────
# Stage 1: Build the React frontend
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS client-build

WORKDIR /app/client

# Install deps
COPY client/package*.json ./
RUN npm install --no-package-lock

# Copy source and build
COPY client/ ./
# VITE_API_URL is /api because the Express server handles both
ENV VITE_API_URL=/api
RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 2: Production Express server
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS server

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install server deps
COPY server/package*.json ./
RUN npm install --omit=dev --no-package-lock

# Copy server source
COPY server/ ./

# Copy the React build output from stage 1
COPY --from=client-build /app/client/dist ./client/dist

# Cloud Run injects PORT env var (default 8080)
ENV PORT=8080
ENV NODE_ENV=production

USER appuser

EXPOSE 8080

CMD ["node", "index.js"]
