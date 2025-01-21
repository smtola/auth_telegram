import type { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   if (req.method !== "POST") {
     return res.status(405).json({ error: "Method not allowed" });
   }

   const { user, message } = req.body;

   if (!user || !message) {
     return res.status(400).json({ error: "Missing user data or messageText" });
   }

    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      if (message === "/start") {
        const messageText = `Hello ${user.first_name}, welcome to our bot!`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: user.id,
            text: messageText,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send Telegram message");
        }

        return res
          .status(200)
          .json({ success: true, message: "Welcome message sent" });
      }

      // If the message is not "/start"
      return res
        .status(200)
        .json({ success: true, message: "No action taken" });
    } catch (error) {
      console.error("Error handling Telegram notification:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
}
