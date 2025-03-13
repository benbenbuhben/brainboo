# BrainBoo

BrainBoo is a full-stack web application designed to enhance student collaboration by matching study partners. It brings together real-time chat, profile management, and intelligent matchmaking based on user interests and majors.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started in Development](#getting-started-in-development)
- [Production Deployment on EC2](#production-deployment-on-ec2)
- [Seeding the Database](#seeding-the-database)
- [Project Structure](#project-structure)
- [Next Steps](#next-steps)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

BrainBoo connects students by matching them based on similar majors and overlapping topics of interest. Users sign in via Auth0, and their profiles are stored in MongoDB. Key features include:

- **Real-Time Chat:** Powered by Socket.IO for instant messaging.
- **Smart Matching:** Users are suggested potential study partners based on shared majors and topics.
- **Profile Management:** Users can view and edit their profile details with fields such as bio, profile picture, major, and topics.
- **AI Chat Summarization:** Conversations can be summarized using a streaming response from the Ollama service.

---

## Architecture

- **Frontend:**  
  - Built with React (via Vite), Material UI, and React Router.
  - Uses Auth0 for authentication.
  - Contains pages for landing, login, profile (with view/edit tabs), matches, and discovery.
  - Dockerized with a dedicated production build that uses Caddy to serve the app.

- **Backend:**  
  - Built with Express, MongoDB, and Mongoose.
  - Provides RESTful endpoints for user profiles, swipes, matches, chats, and chat summaries.
  - Uses Socket.IO for real-time chat communication.
  - Protected endpoints using Auth0 JWT verification.

- **Docker & Deployment:**  
  - Development uses a local Docker Compose file.
  - Production deployment is managed via `docker-compose.prod.yml`, which is configured for deployment on an EC2 instance.
  - Services include MongoDB, Mongo Express, the backend, the frontend (served by Caddy), and Ollama for AI functionalities.

---

## Getting Started in Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
- Local environment configured with necessary credentials.

### Environment Variables

Create a `.env` file in both the **frontend** and **backend** directories.

#### Frontend (`./frontend/.env`)
```
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_API_URL=http://localhost:5001
```

Replace with your actual Auth0 credentials and API URL.

#### Backend (`./backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://mongo:27017/brainboo
AUTH0_DOMAIN=your-auth0-domain
```

Replace with your Auth0 domain. (Note: the `MONGO_URI` is set for Docker networking.)

### Running the Development Environment

1. **Clone the Repository:**
   ```
   git clone https://github.com/yourusername/brainboo.git
   cd brainboo
   ```

2. **Start the Local Stack:**
   Use the local development Docker Compose file (typically the default one in the repository):
   ```
   docker-compose up --build
   ```
   This will start MongoDB, Mongo Express, the backend (with hot-reloading via nodemon), and the frontend (using the local development Dockerfile).

3. **Access the Application:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Mongo Express:** [http://localhost:8081](http://localhost:8081)  
     (Login credentials are set in the `docker-compose.yml` file.)

---

## Production Deployment on EC2

The production setup uses `docker-compose.prod.yml` to build and deploy all services to an EC2 instance. Follow these steps:

### Prerequisites on Your EC2 Instance

- An EC2 instance running a Linux distribution.
- Docker and Docker Compose installed.
- Security groups configured to allow HTTP (80), HTTPS (443), and any additional ports required (e.g., MongoDB on 27017 if needed).

### Deployment Steps

1. **Clone the Repository on Your EC2 Instance:**
   ```
   git clone https://github.com/yourusername/brainboo.git
   cd brainboo
   ```

2. **Set Up Environment Variables:**
   Ensure that your `./frontend/.env` and `./backend/.env` files are updated with production credentials (for Auth0, API URLs, etc.).

3. **Build and Deploy with Docker Compose Prod:**
   Use the production compose file to build and start the containers:
   ```
   docker-compose -f docker-compose.prod.yml up --build -d
   ```
   This command builds the images and starts the services in detached mode.

4. **Access the Application:**
   The frontend will be available on ports 80 and 443. Make sure your EC2 security groups allow traffic on these ports.

5. **Monitoring and Logs:**
   You can view logs for each container using:
   ```
   docker-compose -f docker-compose.prod.yml logs -f
   ```

---

## Seeding the Database

BrainBoo includes a script to seed the database with fake user data.

### Running the Seed Script

1. Ensure your Docker Compose stack is running.
2. Execute the seed script in the backend container:
   ```
   docker exec -it brainboo-backend node seedFakeUsers.js
   ```
3. Follow the interactive prompts to insert fake users and optionally random swipe records.

---

## Project Structure

```
brainboo/
├── backend/
│   ├── models/             # Mongoose models (User, Message, Swipe, Match)
│   ├── routes/             # API routes (users, discover, swipes, matches, chats, chatSummary)
│   ├── seedFakeUsers.js    # Script to seed the database
│   ├── Dockerfile          # Dockerfile for the backend
│   ├── app.js              # Express app configuration
│   └── ...                 
├── frontend/
│   ├── public/             # Public assets (images, favicon, etc.)
│   ├── src/                # React source code (pages, components, hooks, api)
│   ├── Dockerfile          # Production Dockerfile (used in docker-compose.prod.yml)
│   ├── local.Dockerfile    # Development Dockerfile
│   ├── vite.config.js      # Vite configuration
│   └── ...                 
├── docker-compose.yml      # Docker Compose file for development
├── docker-compose.prod.yml # Docker Compose file for production deployment on EC2
└── README.md               # This file
```

## Next Steps

- **Enhanced Collaboration:** Add features like study session scheduling and group chats.
- **Testing:** Implement unit and integration tests for both frontend and backend.
- **CI/CD Pipeline:** Automate deployment pipelines to streamline production updates.

---

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests. For major changes, open an issue first to discuss your proposed changes.

---

## License

[MIT License](LICENSE)