import type { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   if (req.method === "POST") {
     const { message } = req.body;
     if (message && message.text === "/start") {
       const chatId = message.chat.id;
       const userName = message.from.first_name || "there";

       if (chatId) {
         // Respond to the user
         const responseMessage = `Hello, ${userName} ${chatId}! Welcome to my bot. How can I assist you today?`;

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
         const responseMessage = `Oops!, User not found!`;

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
       }
       return;
     } else {
       res.status(200).json({ message: "No action taken" });
     }
   } else {
     res.status(405).json({ error: "Method not allowed" });
   }
}
