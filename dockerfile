# Use the official Node.js image as the base image
FROM node:22 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Get correct prisma client for the platform it's building on (eg amd64, arm64, ... etc)
RUN npx prisma generate

# Define the command to run the app
CMD ["npm", "run", "start"]
