FROM node:25-alpine

# Create app directory
WORKDIR /app

# Install dependencies (only package.json first to leverage caching)
COPY package*.json ./

# Install build tools required for native module compilation and git (some deps need it)
RUN apk add --no-cache python3 make g++ git 

# Use npm: prefer npm ci if package-lock.json exists; otherwise npm install
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

# Copy rest of the project
# COPY . .


# Environment: ensure Expo devtools are accessible
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Default command: start Expo using LAN (avoids ngrok prompt and works on local networks)
CMD ["npm", "run", "start", "--", "--host", "lan"]
