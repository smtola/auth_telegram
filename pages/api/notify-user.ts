import type { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   if (req.method === "POST") {
     const {user, message } = req.body;
      console.log(user);
     if (message && message.text === "/start") {
       const chatId = message.chat.id;
       const userName = message.from.first_name || "there";

       // Respond to the user
       const responseMessage = `Hello, ${userName}! Welcome to my bot. How can I assist you today?`;

       // Send the message using Telegram's API
       const apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

       await fetch(apiUrl, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           chat_id: chatId,
           text: responseMessage,
         }),
       });

       res.status(200).json({ success: true });
     } else {
       res.status(200).json({ message: "No action taken" });
     }
   } else {
     res.status(405).json({ error: "Method not allowed" });
   }
}
