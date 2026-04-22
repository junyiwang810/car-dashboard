# 🚗 Auto Dashboard

Auto Dashboard is a React-based interactive educational exhibit designed to teach car mechanics through a high-fidelity 3D interface. The project features a unique **Physical-to-Digital sync** system where a mobile "NFC Relay" triggers real-time 3D lessons on a main dashboard display.

## 🌟 Key Features

* **Interactive 3D Viewer**: Utilizes `react-three-fiber` to render a detailed 3D car model (`golf.glb`) with dynamic camera transitions that focus on specific components during lessons.
* **Physical-to-Digital Sync**: Uses Firebase Realtime Database to synchronize the state between a desktop "Dashboard" and a mobile "Tap Remote".
* **NFC Lesson Triggering**: Mobile devices detect URL parameters (intended for NFC tags) to automatically update the dashboard to the corresponding automotive part, such as the engine or brakes.
* **Guided Educational Content**: Includes structured lessons for the Engine, Brakes, and Drivetrain, featuring multi-step slides and progress tracking.
* **Introductory Wizard**: A step-by-step onboarding flow powered by `framer-motion` to guide users through the physical and digital exhibit.

## 🛠️ Tech Stack

* **Frontend**: React 19 and Vite.
* **3D Rendering**: Three.js, React Three Fiber, and React Three Drei.
* **Animation**: Framer Motion.
* **Backend/Realtime**: Firebase Realtime Database and Firebase Hosting.
* **Routing**: React Router DOM.

## 📂 Project Structure

* **`src/pages/Dashboard.jsx`**: The main exhibit view. It handles 3D rendering, camera controls, and the educational overlay UI.
* **`src/pages/TapRemote.jsx`**: The mobile interface that acts as a relay, sending "scanned" part data to Firebase.
* **`src/lib/firebase.js`**: Centralized configuration and initialization for Firebase services.
* **`src/data/dashboardContent.js`**: The central store for educational text, 3D hotspot coordinates, and camera positions.

## 📡 How the NFC Integration Works

1.  **Mobile Relay**: A smartphone with the `TapRemote` page open acts as the scanner.
2.  **Tag Scan**: When an NFC tag is scanned, it directs the phone to a URL such as `https://<your-app>.web.app/tap?part=engine`.
3.  **Database Update**: The `TapRemote` component detects the `part` query parameter and updates the `dashboard/activeCarPart` path in the Firebase Realtime Database.
4.  **Dashboard Reaction**: The main Dashboard page listens for changes to that database path and automatically pivots the 3D camera to the part while displaying the relevant lesson.

## 🚀 Getting Started

### Prerequisites
* Node.js installed.
* A Firebase project with Realtime Database enabled.

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in a `.env` file with your Firebase credentials (see `src/lib/firebase.js` for required fields):
    * `VITE_FIREBASE_API_KEY`
    * `VITE_FIREBASE_PROJECT_ID`
    * `VITE_FIREBASE_DATABASE_URL`

### Development
Run the development server:
```bash
npm run dev
