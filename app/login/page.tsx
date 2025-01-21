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
  const [serverMessage, setServerMessage] = useState<string | null>(null); 

  const handleTelegramAuth = async (user: TelegramUser) => {
    console.log("Telegram User Authenticated:", user);
    setUser(user);

    const getUpdateUrl = `https://api.telegram.org/bot7786727966:AAENBDXFKdVcYAPYkKFkpEta2-UlvoyB1q0/getUpdates`;
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
  const response = await fetch("/api/notify-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, message: messageText}),
  });
  const responseData = await response.json();
console.log("Telegram Updates:", responseData);
  if (response.ok) {
    setServerMessage(responseData.message || "Message sent successfully.");
  } else {
    setServerMessage(responseData.message || "Failed to process request.");
  }
} catch (error) {
  console.error("Error sending data to server:", error);
  setServerMessage("Server communication failed.");
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

      {/* <button onClick={() => handleTelegramAuth(
        {
          id: 0, // Replace with your chat ID
          first_name: "John Doe", // Replace with your first name
          last_name: "Doe",
          username: "john_doe",
          photo_url: "https://example.com/profile_photo.jpg",
          auth_date: Date.now() / 1000,
          hash: "abc123",
        }
      )}>
        click me
      </button> */}
    </div>
  );
};

export default LoginPage;
