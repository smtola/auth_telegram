import type { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, first_name } = req.body; // Extract user info from the request

  if (!id) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  try {
    // Send a message to the user
    const message = `Hello ${first_name}, welcome to our bot!`;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

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
      .json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
