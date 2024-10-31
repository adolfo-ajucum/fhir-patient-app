# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Copy the package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app source code and build the app
COPY . .
RUN yarn build

# Step 2: Serve the React app with a lightweight web server
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
