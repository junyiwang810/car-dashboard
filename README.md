Auto Dashboard
Auto Dashboard is a React-based web application that serves as an interactive educational display for learning about car parts. It features a high-fidelity 3D model of a car and uses a mobile "NFC Relay" to trigger specific lessons when physical components are scanned.

Features
Interactive 3D Viewer: Uses @react-three/fiber and @react-three/drei to render a 3D car model (golf.glb) with dynamic camera transitions based on the selected lesson.

Physical-to-Digital Sync: Utilizes Firebase Realtime Database to synchronize a desktop "Dashboard" with a mobile "Tap Remote".

NFC Lesson Triggering: The mobile TapRemote detects URL parameters (intended to be written to NFC tags) to automatically update the main display to the corresponding automotive part.

Guided Educational Content: Includes structured lessons for the Engine, Brakes, and Drivetrain, featuring multi-step slides and progress tracking.

Introductory Wizard: A step-by-step onboarding flow powered by framer-motion to guide users on how to use the physical and digital exhibit.

Tech Stack
Frontend: React 19, Vite

3D Rendering: Three.js, React Three Fiber, React Three Drei

Animation: Framer Motion

Backend/Realtime: Firebase Realtime Database & Hosting

Routing: React Router DOM

Project Structure
src/pages/Dashboard.jsx: The main exhibit view. It handles 3D model rendering, camera controls, and the educational overlay UI.

src/pages/TapRemote.jsx: The mobile interface. It acts as a relay that sends "scanned" part data to Firebase.

src/lib/firebase.js: Configuration and initialization for the Firebase connection.

src/data/dashboardContent.js: The central store for educational text, 3D hotspot coordinates, and camera positions.

Getting Started
Prerequisites
Node.js installed

A Firebase project with a Realtime Database enabled

Installation
Clone the repository.

Install dependencies:

Bash
npm install
Configure environment variables by creating a .env file (see .env.example) with your Firebase credentials:

VITE_FIREBASE_API_KEY

VITE_FIREBASE_PROJECT_ID

(And other standard Firebase config fields)

Development
Run the development server:

Bash
npm run dev
Deployment
To build and deploy the hosting site to Firebase:

Bash
npm run deploy:hosting
How the NFC Integration Works
Mobile Relay: A smartphone with the TapRemote page open acts as the scanner.

Tag Scan: When an NFC tag is scanned, it directs the phone to a URL like https://<your-app>.web.app/tap?part=engine.

Database Update: The TapRemote component detects the part query parameter and updates the dashboard/activeCarPart path in Firebase.

Dashboard Reaction: The main Dashboard page listens for changes to that database path and automatically pivots the 3D camera to the engine while displaying the relevant lesson slides.
