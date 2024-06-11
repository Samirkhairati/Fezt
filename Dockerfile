# Use a base node image
FROM node:14 AS build

# Set the working directory to /app
WORKDIR /app

# Copy the root package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the .env file
COPY .env .env

# Copy the client and server directories
COPY client ./client
COPY server ./server

# Build the client
RUN npm run prefull

# Remove unnecessary files and install production dependencies for the server
RUN rm -rf client && cd server && npm install --production

# Use a minimal node image for the final stage
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the built server files from the build stage
COPY --from=build /app/server /app/server
COPY .env .env

# Expose the port the server runs on
EXPOSE 3000

# Set the command to run the server
CMD ["npm", "run", "full"]
