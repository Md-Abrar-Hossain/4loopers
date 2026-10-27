<div align="center">

# TrackFlix

**A movie and TV show discovery platform with personalized watchlists, smart recommendations, and a built-in movie chatbot.**

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20MySQL-47A248?logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase&logoColor=black)

[Wireframe](https://excalidraw.com/#json=1j6O_pd1f-nCf_djGNN5e,9aE23A0huNrXI9BtTx6-SA) ·
[API Documentation](https://drive.google.com/file/d/1Lws0YKAKssYH4wS8kvJCx8HYHZfNa3Vv/view?usp=sharing) ·
[Project Documentation](https://drive.google.com/file/d/1QWdF-O_mbwETzS7B59SFguSy1OpJ6FGh/view?usp=sharing)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Wireframing](#wireframing)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [Software Architecture](#software-architecture)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

---

## Overview

TrackFlix is a movie and TV show discovery platform where users can explore trending movies, upcoming releases, fan favorites, and top celebrities. With personalized watchlists, tailored recommendations, and an integrated movie chatbot, TrackFlix serves as a single hub for all your entertainment needs.

---

## Features

### Explore Movies & TV Shows

- **Top 10 Movies** of the week
- **Upcoming Movies** releases
- **Fan-Favorite Movies** collection
- **Top Celebrity Popular Movies**
- Two dedicated sections:
  - **Movie Page**
  - **TV Show Page**

### Movie Details

- Movie cards with **ratings** and **trailers**
- Add movies to a **personal watchlist** (login required)
- Personalized **recommendation page**: answer a few short questions and receive a movie suggestion

### User Features

- **Login / Register** system
- Create and manage your **own watchlist**
- Access to the **recommendation system**

### Pro Version (Mock Payment System)

- Unlock premium features through mock payments via **Bkash**, **Nagad**, or **Credit/Debit Card**
- Includes **mock OTP verification**
- Access to an **exclusive movie list and watch option**

### Admin Dashboard

- Add, update, or delete movies and shows
- Manage platform content with ease

### Movie Chatbot

- Integrated **chatbot on the home page**
- Ask anything about movies and get instant answers

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, MySQL |
| **Authentication** | Firebase Authentication |
| **Payment (Mock)** | Custom logic for Bkash, Nagad, and Card |
| **Chatbot** | Rule-based + API-driven |

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)
- A Firebase project for authentication

### Steps

```bash
# Clone the repository
git clone https://github.com/RoBiul-Hasan-Jisan/TrackFlix.git

# Navigate into the project directory
cd TrackFlix

# Install dependencies and start the backend
cd trackflix-backend
npm install
npm run dev

# In a new terminal: install dependencies and start the frontend
cd trackflix-frontend
npm install
npm run dev
```

> **Note:** Both `trackflix-backend` and `trackflix-frontend` require a `.env` file with your own configuration (database connection, Firebase keys, API keys).

---

## Wireframing

The complete wireframe is available on Excalidraw:

[View Wireframe on Excalidraw](https://excalidraw.com/#json=1j6O_pd1f-nCf_djGNN5e,9aE23A0huNrXI9BtTx6-SA)

Quick preview:

![Wireframe Screenshot](./public/images/wireframe1.png.png)

---

## Database Schema

![Screenshot 8](./public/images/Schema.svg)

---

## Screenshots

<table>
  <tr>
    <td width="25%"><img src="./public/images/screenshot8.png" alt="Screenshot 8" /></td>
    <td width="25%"><img src="./public/images/screenshot1.png" alt="Screenshot 1" /></td>
    <td width="25%"><img src="./public/images/screenshot2.png" alt="Screenshot 2" /></td>
    <td width="25%"><img src="./public/images/screenshot3.png" alt="Screenshot 3" /></td>
  </tr>
  <tr>
    <td width="25%"><img src="./public/images/screenshot4.png" alt="Screenshot 4" /></td>
    <td width="25%"><img src="./public/images/screenshot5.png" alt="Screenshot 5" /></td>
    <td width="25%"><img src="./public/images/screenshot6.png" alt="Screenshot 6" /></td>
    <td width="25%"><img src="./public/images/screenshot7.png" alt="Screenshot 7" /></td>
  </tr>
</table>

---

## Documentation

- [API Documentation](https://drive.google.com/file/d/1Lws0YKAKssYH4wS8kvJCx8HYHZfNa3Vv/view?usp=sharing)
- [Project Documentation](https://drive.google.com/file/d/1QWdF-O_mbwETzS7B59SFguSy1OpJ6FGh/view?usp=sharing)

---

## Software Architecture

The architecture of **TrackFlix** is divided into three main layers (Frontend, Backend, and Database), along with user interactions and optional data relationships.

<table>
  <tr>
    <th width="50%">Full Database Diagram</th>
    <th width="50%">Architecture Diagram</th>
  </tr>
  <tr>
    <td><img src="public/images/graphviz%20(5).svg" alt="TrackFlix Architecture" /></td>
    <td><img src="public/images/graphviz%20(4).svg" alt="TrackFlix Full DB" /></td>
  </tr>
</table>

### Layers Overview

#### Frontend Layer

- Built with **React.js** and **Tailwind CSS**
- Handles user interactions and API requests to the backend

#### Backend Layer

- **Node.js** + **Express.js**
- Responsible for:
  - Authentication (Firebase)
  - Movie/TV CRUD operations
  - Recommendations
  - Mock payments
  - Chatbot API integration

#### Database Layer

- **MongoDB**: Users, Watchlist, Movies, FullMovieDetails, Live Shows, Celebrities, Awards, Recommendations, Top10Movies
- **MySQL**: Payment transactions (mock)

#### User Interactions

- Users interact with the **Frontend**, which communicates with the **Backend**
- The Backend manages data in the databases and interacts with external services such as Firebase Auth and Chatbot APIs

#### Optional Data Relationships

- Watchlist contains Movies, FullMovieDetails, Live Shows, and Live TV Shows
- Can also include FanFavorites and Interests

---

## Project Structure

```bash
TrackFlix/
│── public/
│   └── images/                 # Static assets
│
├── trackflix-backend/          # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # Database & server config
│   ├── data/                   # Data utilities
│   ├── dump/                   # Database dump
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express routes
│   ├── importAllData.js        # Data seeding script
│   ├── server.js               # Main backend entry point
│   ├── package.json
│   └── .env
│
├── trackflix-frontend/         # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── animations/         # Animations and Lottie files
│   │   ├── api/                # API calls
│   │   ├── assets/             # Static assets
│   │   ├── chatbot/            # Chatbot feature
│   │   ├── components/         # Reusable UI components
│   │   ├── constants/          # Constant values
│   │   ├── context/            # React Context API
│   │   ├── data/               # Static data
│   │   ├── firebase/           # Firebase config
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Main pages
│   │   ├── ProVersion/         # Premium/Pro features
│   │   ├── RecommendationPage/ # Recommendation engine UI
│   │   ├── userdeshbord/       # User dashboard
│   │   └── utils/              # Helper functions
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── package.json
│   └── .env
│
├── .gitignore
├── .prettierrc
├── CONTRIBUTING.md
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## Future Improvements

- [ ] AI-based movie recommendation system
- [ ] Real payment gateway integration
- [ ] Multi-language support
- [ ] Mobile app version

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated. Please also read [CONTRIBUTING.md](./CONTRIBUTING.md).

If you have suggestions for adding or removing features, feel free to:

1. Open an **issue** to discuss your idea, or
2. Directly create a **pull request** with the necessary changes.

> Please create **individual PRs** for each suggestion or feature.

---

## Authors

- [**Robiul Hasan Jisan**](https://robiulhasanjisan.vercel.app/)
- **Intesar Hossain**
- **Md Abrar Hossain**
- **Ramisa Mahi**

---

## License

Distributed under the MIT License. See the [LICENSE](./LICENSE) file for details.
