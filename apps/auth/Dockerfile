FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/auth/package.json apps/auth/package.json

RUN npm install -g pnpm

COPY apps/auth apps/auth
COPY libs libs

RUN pnpm install -r 

RUN pnpm run build auth

CMD ["pnpm", "run", "start:dev"]

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/auth/package.json apps/auth/package.json

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/apps/auth/prisma.config.ts ./apps/auth/prisma.config.ts
COPY --from=development /usr/src/app/apps/auth/prisma ./apps/auth/prisma

CMD ["sh", "-c", "cd apps/auth && pnpm prisma migrate deploy && cd ../.. && node dist/apps/auth/main"]