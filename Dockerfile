FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g typescript
RUN tsc
EXPOSE 4002
CMD ["node", "dist/app.js"]
