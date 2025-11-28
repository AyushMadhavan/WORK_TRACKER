# Database Setup Required

The application failed to start because **MongoDB is not installed or running** on your computer. You need a working database connection.

## Option 1: Use MongoDB Atlas (Cloud) - **Easiest**
No installation required.
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (free).
2.  Create a free cluster.
3.  Click **Connect** > **Drivers**.
4.  Copy the **Connection String**. It will look like:
    `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority`
5.  Open `server/.env` in this project.
6.  Replace `MONGODB_URI=mongodb://localhost:27017/employee_attendance` with your copied string.
    *Remember to replace `<password>` with your actual database user password.*

## Option 2: Install MongoDB Locally
1.  Download [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2.  Install it (Select "Run as Network Service User" recommended).
3.  Once installed, the service usually starts automatically.
4.  If not, you may need to add the `bin` folder (e.g., `C:\Program Files\MongoDB\Server\7.0\bin`) to your System PATH environment variable to run `mongod` from the terminal.

## After Setup
Run the app again:
```bash
npm run dev
```
