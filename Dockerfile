# Use the latest Node.js image from Docker Hub
FROM node:latest

# Create and change to the app directory
WORKDIR /usr/src/app

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libgconf-2-4 \
    libnspr4 \
    libnss3 \
    libxss1 \
    lsb-release \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install puppeteer so it's available in the container.
RUN yarn add puppeteer

# Copy application dependency manifests to the container image.
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy local code to the container image.
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the app
CMD [ "node", "index.js" ]
