import type { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body; // Extract message object from the request

  if (!message || !message.text || !message.chat || !message.chat.id) {
    return res.status(400).json({ error: "User not found" }); // User not found error
  }

  const { id } = message.chat;
  const { first_name } = message.chat;
  const text = message.text;

  try {
    // Check if the message text is '/start'
    if (text === "/start") {
      const welcomeMessage = `Hello ${first_name}, welcome to our bot!`;

      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: id,
          text: welcomeMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send Telegram message");
      }

      return res
        .status(200)
        .json({ success: true, message: "Welcome message sent" });
    }

    // Handle other messages if necessary
    return res.status(200).json({ success: true, message: "No action taken" });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
