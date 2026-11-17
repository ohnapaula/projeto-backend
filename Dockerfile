FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir -p uploads && chown -R node:node /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .sequelizerc ./
COPY --chown=node:node src ./src
COPY --chown=node:node uploads ./uploads
USER node
EXPOSE 3000
CMD ["sh", "-c", "npx sequelize db:migrate && node src/server.js"]
