FROM node:21-alpine AS builder
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM node:21-alpine
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "server.js"]