ARG NODE=node:21-alpine

FROM ${NODE} AS deps
ENV NODE_ENV development
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then \
  yarn --frozen-lockfile --production && \
  cp -R node_modules prod_node_modules && \
  yarn --frozen-lockfile --production=false; \
  else echo "Lockfile not found." && exit 1; \
  fi
COPY  . .
RUN yarn build


FROM ${NODE} AS runner
ENV NODE_ENV production

WORKDIR /app
COPY --from=deps --chown=node:node /app/prod_node_modules ./node_modules
COPY --from=deps --chown=node:node /app/dist ./dist
COPY --from=deps --chown=node:node /app/package*.json /app/yarn.lock*  ./

USER node

EXPOSE 4000
ENV PORT 4000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["yarn", "start"]