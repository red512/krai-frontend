# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY public/ public/
COPY src/ src/
RUN npm run build

# Stage 2: Serve
FROM node:20-slim
RUN npm install -g serve@14
WORKDIR /app
COPY --from=build /app/build ./build
USER node
EXPOSE 8080

CMD ["serve", "-s", "build", "-l", "8080"]
