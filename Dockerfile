# Use a Node.js official image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies, including devDependencies (for nodemon)
RUN npm install

# Copy the .env file into the Docker image (so it can be loaded by dotenv)
COPY .env .env

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Run the start script
CMD ["sh", "start.sh"]