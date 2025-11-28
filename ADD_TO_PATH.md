# How to Add MongoDB to System PATH

1.  **Find the MongoDB Path**:
    *   Open File Explorer.
    *   Go to `C:\Program Files\MongoDB\Server`.
    *   Open the folder with the version number (e.g., `7.0`, `6.0`).
    *   Open the `bin` folder.
    *   **Copy the address** from the top bar (e.g., `C:\Program Files\MongoDB\Server\7.0\bin`).

2.  **Open Environment Variables**:
    *   Press the **Windows Key**.
    *   Type **"env"** and select **"Edit the system environment variables"**.
    *   Click the **"Environment Variables..."** button at the bottom right.

3.  **Edit Path**:
    *   In the **"System variables"** section (bottom box), find the row named **"Path"** and select it.
    *   Click **"Edit..."**.
    *   Click **"New"** on the right side.
    *   **Paste** the path you copied earlier.
    *   Click **OK** on all windows to close them.

4.  **Restart Terminal**:
    *   Close your current VS Code terminal (trash icon).
    *   Open a new terminal (`Ctrl + ~`).
    *   Type `mongod --version` to verify.
