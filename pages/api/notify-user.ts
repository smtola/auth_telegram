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
       const responseMessage = `Hello, ${userName}! Welcome to my bot. How can I assist you today?
       ${user.first_name} 
       ${user.last_name} 
       ${user.username} 
       ${user.id}
       ${user.photo_url} 
       ${user.auth_date} 
       ${user.hash}
       ${message.message_id} 
       ${message.date} 
       ${message.from.id} 
       ${message.from.is_bot} 
       ${message.from.first_name} 
       ${message.from.last_name} 
       ${message.from.username} 
       ${message.from.language_code}
       ${message.chat.id} 
       ${message.chat.type} 
       ${message.chat.title} 
       ${message.chat.username} 
       ${message.chat.first_name} 
       ${message.chat.last_name} 
       ${message.chat.photo_url} 
       ${message.chat.description} 
       ${message.chat.invite_link} 
       ${message.chat.pinned_message_id} 
       ${message.chat.permissions.can_send_messages} 
       ${message.chat}
       ${message.reply_to_message_id} 
       ${message.reply_markup} 
       ${message.entities} 
       ${message.caption} 
       ${message.caption_entities} 
       ${message.audio} 
       ${message.document} 
       ${message.photo} 
       ${message.sticker} 
       ${message.video} 
       ${message.video_note} 
       ${message.voice} 
       ${message.location} 
       ${message.venue} 
       ${message.contact}
       ${message.poll}
        ${message.dice}
       `;

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
