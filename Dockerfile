# Use a newer Node.js image that supports the required features
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your API will run on
EXPOSE 3001

# Define the command to run your application
CMD ["npm", "start"]
