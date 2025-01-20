'use client'

import { useState } from "react";
import TelegramLogin from "../components/TelegramLogin"; // Adjust the path based on your file structure

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  const handleTelegramAuth = async (user: TelegramUser)  =>  {
    console.log("Telegram User Authenticated:", user);
    setUser(user);

    await fetch("/api/notify-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

    // Redirect the user to your Telegram bot
    const botUsername = "harula_bot"; // Replace with your bot's username
    const deepLinkUrl = `https://t.me/${botUsername}`;
    window.location.href = deepLinkUrl;
  };

  return (
    <div className="container">
      <h1>Login with Telegram</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.first_name}</h2>
          {user.photo_url && (
            <img src={user.photo_url} alt="Profile" width={100} height={100} />
          )}
          <p>Username: {user.username}</p>
          <p>Auth Date: {new Date(user.auth_date * 1000).toLocaleString()}</p>
        </div>
      ) : (
        <TelegramLogin
          botUsername="harula_bot" // Replace with your bot's username
          onAuth={handleTelegramAuth}
        />
      )}
    </div>
  );
};

export default LoginPage;
