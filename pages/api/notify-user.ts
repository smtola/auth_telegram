import type { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, first_name, messageText } = req.body;

  if (!id || !messageText) {
    return res
      .status(400)
      .json({ error: "Invalid user data or missing messageText" });
  }

  try {
    // Your logic to verify if the user ID is valid (replace this with your database or stored IDs logic)
    const validUserId = true; // Placeholder: Replace this with actual validation logic

    if (messageText === "/start") {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      // If user ID is valid, send a welcome message
      if (validUserId) {
        const message = `Hello ${first_name}, welcome to our bot!`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: id,
            text: message,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send Telegram message");
        }

        return res
          .status(200)
          .json({ success: true, message: "Welcome message sent" });
      } else {
        // User ID not found, send a "User not found" message
        const notFoundMessage = "User not found.";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: id,
            text: notFoundMessage,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send 'User not found' message");
        }

        return res
          .status(404)
          .json({ success: true, message: "User not found message sent" });
      }
    }

    // If the message is not "/start"
    return res.status(200).json({ success: true, message: "No action taken" });
  } catch (error) {
    console.error("Error handling Telegram notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
