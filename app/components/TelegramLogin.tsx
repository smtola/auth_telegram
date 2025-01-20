'use client'
import { useEffect } from "react";

interface TelegramLoginProps {
  botUsername: string; // The username of your Telegram bot
  onAuth: (user: TelegramUser) => void; // Callback function when user logs in
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({
  botUsername,
  onAuth,
}) => {
  useEffect(() => {
    // Dynamically load the Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.dataset.telegramLogin = botUsername;
    script.dataset.size = "large"; // Options: 'small', 'medium', 'large'
    script.dataset.onauth = "handleTelegramAuth(user)";
    script.dataset.requestAccess = "write"; // Optional, if you need write access to messages
    document.getElementById("telegram-login-container")?.appendChild(script);

    // Define the callback function globally
    (window as any).handleTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    return () => {
      // Clean up the script and global function when the component unmounts
      delete (window as any).handleTelegramAuth;
      script.remove();
    };
  }, [botUsername, onAuth]);

  return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
