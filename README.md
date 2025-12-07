# Movie Recommendation Engine Capstone

## Overview
A full-stack MERN application (MongoDB, Express, React, Node) allowing users to browse movies, log in via Google, and manage a personalized watchlist.

## Architecture
- **Frontend:** React (Vite), TailwindCSS
- **Backend:** Express.js, REST API
- **Database:** MongoDB Atlas
- **Auth:** Firebase (Google OAuth)

## How to Run (Dev Container)
1. Open this folder in VS Code.
2. Ensure Docker Desktop is running.
3. Click "Reopen in Container" when prompted.
4. Run `npm install` in both `/client` and `/server`.

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
        R->>A: POST /watchlist (userId, movieId, title...)
        A->>A: Validate Data & Check Duplicates
        A->>D: Save New Document
        D-->>A: Return Success/Failure
        A-->>R: Return JSON Response
        R-->>U: Button turns Green ("In Watchlist")
    end

    ### Task 2: Attribution (Footer)
The rubric requires "Attribution of all external sources." We are using TMDB for data.

**Action:** Open **`client/src/App.jsx`**. Scroll down to the `<footer>` section we added yesterday and update the text to be compliant:

```jsx
// Find the footer at the bottom of the return statement
<footer className="app-footer">
  <p>&copy; 2025 RRH. Built for Capstone Project.</p>
  <p style={{ fontSize: '0.8rem', marginTop: '5px', opacity: '0.7' }}>
    This product uses the TMDB API but is not endorsed or certified by TMDB.
  </p>
</footer>