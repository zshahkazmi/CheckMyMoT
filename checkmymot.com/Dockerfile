FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/types ./types
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example .env

RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]