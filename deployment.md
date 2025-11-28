# Deployment Guide

This guide explains how to deploy the Employee Attendance System to Vercel.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
3.  **Vercel CLI**: Install globally via `npm i -g vercel` (optional, can also deploy via Git).

## Step 1: Setup MongoDB Atlas (Cloud Database)

Since Vercel is serverless, you cannot use a local MongoDB. You must use a cloud database.

1.  Create a free cluster on MongoDB Atlas.
2.  Create a database user (username/password).
3.  Whitelist IP `0.0.0.0/0` (allow access from anywhere) in Network Access.
4.  Get the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).

## Step 2: Prepare for Deployment

The project is already configured for Vercel:
-   `vercel.json` handles the build and routing for both client and server.
-   `client/.env` uses `VITE_API_URL` which will be set in Vercel.

## Step 3: Deploy using Vercel CLI

1.  Open a terminal in the project root (`webgeon`).
2.  Run `vercel login` and follow instructions.
3.  Run `vercel`.
4.  Follow the prompts:
    -   Set up and deploy? **Yes**
    -   Scope? **[Your Name]**
    -   Link to existing project? **No**
    -   Project Name? **employee-attendance-system**
    -   Directory? **./** (Root)
5.  **Environment Variables**:
    -   Vercel will ask if you want to modify settings. Say **No** for now.
    -   Go to the Vercel Dashboard for your new project.
    -   Go to **Settings > Environment Variables**.
    -   Add the following:
        -   `MONGODB_URI`: Your MongoDB Atlas connection string.
        -   `JWT_SECRET`: A secure random string.
        -   `VITE_API_URL`: The URL of your deployed Vercel app + `/api` (e.g., `https://employee-attendance-system.vercel.app/api`). **Important**: You might need to redeploy after setting this if it's needed at build time, but for Vite it's usually runtime or build time. For this setup, set it to `/api` (relative path) might work if on same domain, but full URL is safer. Actually, for the first deploy, you can set it to `/api`.

## Step 4: Redeploy

1.  Run `vercel --prod` to trigger a production deployment with the new environment variables.

## Alternative: Deploy via GitHub

1.  Push your code to a GitHub repository.
2.  Import the repository in Vercel.
3.  Set the **Root Directory** to `./`.
4.  Add the Environment Variables in the Vercel UI.
5.  Deploy.

## Troubleshooting

-   **CORS Issues**: If frontend can't talk to backend, ensure `server/index.js` CORS settings allow the Vercel domain. Currently it allows all (`app.use(cors())`), which is fine for testing.
-   **Database Connection**: Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`.
