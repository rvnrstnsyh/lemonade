FROM denoland/deno:latest

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /lemonade

COPY . .
RUN deno task build
RUN deno cache _dist/server.js

EXPOSE 5173

CMD ["serve", "-A", "_dist/server.js"]
