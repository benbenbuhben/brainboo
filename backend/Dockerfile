# Use an official Node.js LTS image
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend source code into the container
COPY . .

# Build the app (if needed; if you're removing TS, adjust this step)
# For plain JS, you may remove the build step and simply run the code.
# RUN npm run build

# Expose the port that your server uses
EXPOSE 5000

# Run the server
CMD ["node", "server.js"]
