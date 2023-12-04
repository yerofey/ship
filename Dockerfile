# Start with a base image that has Bun installed
FROM ubuntu:latest

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

# Expose the port the app runs on
EXPOSE 3099

# Define the command to run your app
CMD ["bun", "run", "index.js"]
