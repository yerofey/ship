# ---- Build Stage for Bun Application ----
# Start with a base image that has Bun installed
FROM ubuntu:latest as builder

# Install necessary packages including curl and unzip
RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl https://bun.sh/install | bash

# Set the path to include Bun
ENV PATH="/root/.bun/bin:$PATH"

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your application's code
COPY . .

# Build your app (if required)
RUN bun run build

# ---- Production Stage with Nginx ----
# Use the official Nginx image
FROM nginx:alpine

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY config/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
