FROM node:22-alpine
COPY package.json package.json
COPY scripts/cesium-fix.js scripts/cesium-fix.js
RUN npm install && npm audit fix
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
