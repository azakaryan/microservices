# Use as a base
FROM node:alpine

WORKDIR /app

# Download and install dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Tell the image what to do
# as a container
CMD ["npm", "start"]