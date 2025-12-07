# Movie Recommendation Engine Capstone

## Overview

A full-stack MERN application (MongoDB, Express, React, Node) allowing users to browse movies, log in via Google, and manage a personalized watchlist.

## Architecture

* **Frontend:** React (Vite), TailwindCSS, Framer Motion

* **Backend:** Express.js, REST API

* **Database:** MongoDB Atlas

* **Auth:** Firebase (Google OAuth)

## How to Run

1. Open this folder in VS Code.

2. Ensure Docker Desktop is running.

3. Click "Reopen in Container" when prompted.

4. Run `npm install` in both `/client` and `/server`.

5. Start Backend: `cd server && npm run dev`

6. Start Frontend: `cd client && npm run dev`

## System Architecture

### "Add to Watchlist" Sequence Diagram

This diagram illustrates the data flow when a user saves a movie to their personal list.

```mermaid
sequenceDiagram
    participant U as User
    participant R as React Frontend
    participant A as Express API
    participant D as MongoDB
    
    U->>R: Clicks "Add to Watchlist"
    R->>R: Checks if User is Logged In
    alt User is NOT Logged In
        R-->>U: Shows "Please Login" Alert
    else User IS Logged In
        R->>A: POST /watchlist
        A->>A: Validate Data & Check Duplicates
        A->>D: Save New Document
        D-->>A: Return Success
        A-->>R: Return JSON Response
        R-->>U: Button turns Green ("In Watchlist")
    end
```