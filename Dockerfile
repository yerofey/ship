# Use the official Bun image as a parent image
FROM thebun/bun:edge as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of your application's code
COPY . .

# Build the application (if you have a build step)
RUN bun run build

# ---- Production Stage with Nginx ----
FROM nginx:alpine

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
