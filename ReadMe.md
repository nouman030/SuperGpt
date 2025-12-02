# SuperGpt

SuperGpt is a modern, full-stack AI chat application designed to provide a seamless and interactive user experience. It features a robust chat interface, community showcase, and secure authentication, powered by advanced AI models.

## 🚀 Features

- **AI Chat Interface**: Interact with advanced AI models for text generation.
- **Image Generation**: Generate images using prompts (powered by Bytez/Imagen).
- **Authentication**: Secure Sign Up and Login system using JWT.
- **Chat History**: Automatically saves your chat history for easy access.
- **Community Showcase**: Explore and share content with the community.
- **Responsive Design**: Fully responsive UI with a mobile-friendly sidebar.
- **Dark/Light Mode**: Toggle between dark and light themes for visual comfort.
- **Credits System**: (Demo) View your credits usage.

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: [React](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Styled Components](https://styled-components.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Server (Backend)
- **Runtime**: [Node.js](https://nodejs.org/) / [Bun](https://bun.sh/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT), Bcryptjs
- **AI Integration**: Bytez.js (OpenAI GPT-4.1 Mini, Google Imagen 4.0 Ultra)

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js or Bun installed on your machine.
- MongoDB installed or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SuperGpt
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
# OR
bun install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BYTEZ_API_KEY=your_bytez_api_key
```

Start the server:
```bash
npm start
# OR
bun start
```
The server will run on `http://localhost:3000`.

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
# OR
bun install
```

Start the development server:
```bash
npm run dev
# OR
bun run dev
```
The client will run on `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
SuperGpt/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Images and static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # Context providers (Auth, Theme)
│   │   ├── pages/          # Application pages (Chat, Login, etc.)
│   │   └── ...
│   └── ...
├── server/                 # Backend Express application
│   ├── configs/            # Configuration (DB, LLM)
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── ...
└── ReadMe.md               # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
