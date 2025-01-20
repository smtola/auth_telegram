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

  const getUpdateUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;

  try {
    // Fetch updates from Telegram bot
    const updateResponse = await fetch(getUpdateUrl);
    const updateData = await updateResponse.json();

    if (!updateResponse.ok || !updateData.result.length) {
      return res.status(400).json({ error: "No updates found" });
    }

    // Check if the latest message is "/start"
    const latestUpdate = updateData.result[updateData.result.length - 1];
    const messageText = latestUpdate.message?.text;

    if (messageText === "/start") {
      const message = `Hello ${first_name}, welcome to our bot!`;

      const sendMessageUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      const sendResponse = await fetch(sendMessageUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: id,
          text: message,
        }),
      });

      if (!sendResponse.ok) {
        throw new Error("Failed to send Telegram message");
      }

      return res
        .status(200)
        .json({ success: true, message: "Welcome message sent" });
    }

    return res.status(200).json({ success: true, message: "No action taken" });
  } catch (error) {
    console.error("Error processing Telegram updates:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
