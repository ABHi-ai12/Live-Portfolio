# Professional Portfolio Website

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.6-blue)
![Vite](https://img.shields.io/badge/Vite-8.0.12-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.0-38B2AC)
![Firebase](https://img.shields.io/badge/Firebase-12.15.0-FFCA28)
![Three.js](https://img.shields.io/badge/Three.js-0.185.1-black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40.0-ff0055)
![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88ce02)

A modern, highly interactive, and fully responsive professional portfolio built with React, Vite, and Tailwind CSS. It features 3D elements powered by Three.js, smooth animations utilizing GSAP and Framer Motion, and a full-fledged backend and admin dashboard powered by Firebase.

## Features

- **Modern UI/UX**: Stunning aesthetic with smooth gradients, micro-animations, and dynamic interactions.
- **3D Graphics**: Integrated Three.js canvas for interactive 3D visualizations.
- **Performant Animations**: Leverages GSAP and Framer Motion for buttery-smooth page transitions and scroll effects.
- **Fully Responsive**: Optimized for all screen sizes, from mobile phones to large desktop displays.
- **Admin Dashboard**: Secure Firebase-backed admin portal to manage portfolio content dynamically.
- **Email Notifications**: Seamless contact form integration utilizing Resend.
- **Real-time Database**: Cloud Firestore integration for robust data storage and retrieval.

## Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP, AOS
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Backend & Database**: Firebase (Auth, Firestore, Hosting)
- **Icons**: Lucide React
- **Email Service**: Resend

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm or yarn
- A Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ABHi-ai12/Live-Portfolio.git
   cd Live-Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase and Resend configurations:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_RESEND_API_KEY=your_resend_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
Live-Portfolio/
├── admin/                 # Admin dashboard application
├── api/                   # Serverless API functions
├── public/                # Static public assets
├── src/
│   ├── assets/            # Images, icons, and fonts
│   ├── components/        # Reusable UI components and effects
│   ├── lib/               # Utility functions, Firebase config, default data
│   ├── pages/             # Page components (Home, About, Contact, etc.)
│   ├── App.jsx            # Main application routing
│   └── main.jsx           # Application entry point
├── .env.local             # Local environment variables (ignored by git)
├── build.js               # Custom build script
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
└── package.json           # Project dependencies and scripts
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/ABHi-ai12/Live-Portfolio](https://github.com/ABHi-ai12/Live-Portfolio)
