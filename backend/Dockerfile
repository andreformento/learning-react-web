# Use the specified Node version
FROM node:14

# Create a directory for our app inside the image
WORKDIR /app

# Copy package.json and package-lock.json (if available) into the image
COPY package*.json ./

# Install the app dependencies inside the image
RUN npm install

# If you're running your app in a production environment, use:
# RUN npm ci --only=production

# Copy the rest of the application into the image
COPY . .

# Expose the ports your application will run on
EXPOSE 4000

# Default command to run when starting the container
CMD [ "npm", "start" ]
