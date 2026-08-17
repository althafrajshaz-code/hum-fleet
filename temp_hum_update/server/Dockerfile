# ── Stage: production ───────────────────────────────────────────────
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (layer cache optimisation)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Fly.io uses PORT env var; default to 8080
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
