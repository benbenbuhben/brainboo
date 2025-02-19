# BrainBoo

BrainBoo is a full-stack web application that enhances student collaboration by making peer learning more effective. It connects students for study sessions through matchmaking, real-time chat, scheduling, and robust profile management—all secured via Auth0 authentication.

## Project Overview

BrainBoo currently consists of:

- **Frontend:**  
  A React-based web application using Vite, Material UI, React Router, and Auth0 for authentication. It includes pages for landing, login, profile (with view and edit tabs), matches, and discovery.
  
- **Backend:**  
  An Express server with MongoDB for storing user profiles. It includes endpoints for fetching, creating, and updating user profiles. The backend uses Mongoose to enforce a unique index on user `auth0Id` to avoid duplicate profiles.

- **Authentication:**  
  Auth0 is used to authenticate users, and profile data is automatically created or updated based on the authenticated user's information.

- **Docker Compose:**  
  The entire application (frontend, backend, MongoDB, and Mongo Express) is containerized with Docker Compose for easy development and deployment.

## Getting Up and Running in Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Environment Variables

Create `.env` files in both the `frontend` and `backend` directories with the following variables:

#### Frontend (`./frontend/.env`)

```
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

Replace `your-auth0-domain` and `your-auth0-client-id` with your actual Auth0 credentials.

#### Backend (`./backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://mongo:27017/brainboo
AUTH0_DOMAIN=your-auth0-domain
```

Replace `your-auth0-domain` with your actual Auth0 domain. Note that the `MONGO_URI` is set up for Docker networking (using the service name `mongo`).

### Running the Application

1. **Clone the Repository:**

```
git clone https://github.com/yourusername/brainboo.git
cd brainboo
```

2. **Start the Application with Docker Compose:**

```
docker-compose up --build
```

This command builds and starts the containers for MongoDB, Mongo Express, the backend, and the frontend.

3. **Access the Application:**

- **Frontend:** Open your browser to [http://localhost:3000](http://localhost:3000)
- **Mongo Express:** Open your browser to [http://localhost:8081](http://localhost:8081) (login credentials are set in the docker-compose file)

## Seeding the Database

BrainBoo includes a seed script (seedFakeUsers.js) to insert fake users and generate random swipe records. The script features interactive prompts that:

- Warn you if there are already more than 10 users in the database.
- Notify you if no users exist (suggesting you log in to create your own user first).
- Ask for confirmation before proceeding.
- Insert fake user data without overwriting existing users.
- Optionally add random swipe records for the new users.

### How to Run the Seed Script

1. Ensure the Docker Compose stack is up and running.

2. Run the Seed Script in the Backend Container:

```bash
docker exec -it brainboo-backend node seedFakeUsers.js
```
This command opens an interactive terminal in the backend container. Follow the prompts to complete the seeding process.

## Current State and Next Steps

### Current State

- **Authentication & Profile Management:**  
  Users can log in using Auth0. Upon login, a profile is automatically created or fetched from MongoDB. The profile page includes two tabs:
  - **View Profile:** Displays the user's profile picture (or a placeholder if not set) and saved details.
  - **Edit Profile:** Provides a form (using React Hook Form) to update the profile data.
  
- **Backend API:**  
  The backend provides endpoints to fetch (`GET /api/users/me`), create (`POST /api/users`), and update (`PUT /api/users/me`) a user profile. Unique indexes ensure that duplicate profiles are not created.

- **Dockerized Environment:**  
  The application is containerized for development using Docker Compose, making it easy to set up and run locally.

### Next Steps

- **Enhance Collaboration Features:**  
  Develop additional pages and functionality for real-time chat, study session scheduling, and partner matchmaking.
  
- **Improve UI/UX:**  
  Refine the Material UI components and overall design for a more polished user experience.

- **Testing & Deployment:**  
  Write unit and integration tests for both frontend and backend components. Prepare for deployment by setting up CI/CD pipelines.

- **Refinement of Profile Management:**  
  Consider additional profile fields (e.g., major, topics of interest, bio) and validations. Further refine error handling and logging for production use.

- **Authentication Enhancements:**  
  Explore additional Auth0 features for roles, permissions, or multi-factor authentication.

## Conclusion

BrainBoo is a robust foundation for a peer learning platform. With a modular design for both the frontend and backend, Dockerized development, and a focus on user profile management, the next steps will focus on enhancing collaboration features and refining the overall user experience.
