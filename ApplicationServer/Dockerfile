FROM node:12-alpine
RUN apk add --no-cache python g++ make
WORKDIR /OnSatNode
COPY . .
RUN yarn install --production
CMD ["node", "app.js"]