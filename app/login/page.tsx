'use client';

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
  const [serverMessage, setServerMessage] = useState<string | null>(null); // State for server messages
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

  const handleTelegramAuth = async (user: TelegramUser) => {
    console.log("Telegram User Authenticated:", user);
    setUser(user);

    const getUpdateUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
    const updateResponse = await fetch(getUpdateUrl);
    const updateData = await updateResponse.json();

    // Check if the latest message is "/start"
    const latestUpdate = updateData.result[updateData.result.length - 1];
    const messageText = latestUpdate?.message?.text;

    if (!messageText) {
      setServerMessage("No message detected.");
      return;
    }

    try {
      // Send user data to the API
      const response = await fetch("/api/notify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, messageText }),
      });

      const responseData = await response.json();

      // Set server response messages based on status
      if (response.ok) {
        setServerMessage(responseData.message || "Action completed successfully.");
      } else if (response.status === 404) {
        setServerMessage(responseData.message || "User not found.");
      } else {
        setServerMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error notifying user:", error);
      setServerMessage("Failed to communicate with the server.");
    }
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
      {/* Display server messages */}
      {serverMessage && (
        <div className="server-message">
          <p>{serverMessage}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
