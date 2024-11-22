# 🚀 Quickchat - Real-time Ephemeral Group Chat

A lightweight, modern group chat application built with React, Node.js, and Socket.IO. Create temporary chat rooms, invite others, and chat in real-time. Rooms automatically disappear when inactive, ensuring privacy and cleanup.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Instant Room Creation**: Create chat rooms on the fly with custom names
- **Real-time Communication**: Powered by Socket.IO for seamless messaging
- **Auto-cleanup**: Rooms and messages are automatically deleted when empty
- **No Registration Required**: Jump right in with a temporary username
- **Modern UI**: Clean, responsive design built with Tailwind CSS
- **Room Status**: See active participants in real-time
- **Invite System**: Share room links with others to join

## 🛠️ Tech Stack

### Frontend
- React 18
- TailwindCSS
- Socket.IO Client
- React Router
- Headless UI Components

### Backend
- Node.js
- Express
- Socket.IO
- In-memory data storage

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/quickchat.git

# Install dependencies for backend
cd quickchat/server
npm install

# Install dependencies for frontend
cd ../client
npm install

# Start the backend server (from server directory)
npm run dev

# Start the frontend development server (from client directory)
npm run dev
```

Visit `http://localhost:5173` to start using Quickchat!

## 💡 How It Works

1. **Room Creation**
   - Users can create a new room with a custom name
   - Each room gets a unique identifier
   - Creator automatically joins the room

2. **Joining Rooms**
   - Users can join existing rooms via URL or room ID
   - Enter a temporary username to participate
   - See all active participants in the room

3. **Chat Features**
   - Real-time messaging
   - User join/leave notifications
   - Active user count
   - Message timestamps

4. **Cleanup Process**
   - Rooms are monitored for activity
   - When the last user leaves, room data is cleared
   - No persistent storage, ensuring privacy

## 🔧 Environment Variables

Create `.env` files in both client and server directories:

```env
# Server (.env)
PORT=3000
NODE_ENV=development

# Client (.env)
VITE_WS_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📫 Contact

Suraj H - [@yourtwitter](https://twitter.com/suraj__h)
