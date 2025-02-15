FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies (without Rollup's ARM package)
RUN npm install --legacy-peer-deps --force

# Now manually install Rollup's ARM package inside Docker
RUN npm install @rollup/rollup-linux-arm64-gnu --force || echo "Skipping ARM package if not needed"

# Copy the rest of the app
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
