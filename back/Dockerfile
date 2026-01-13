FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
# JSON array - SEM shell issues
CMD ["npx", "nodemon", "api.js"]