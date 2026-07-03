const TYPE_LABEL = {
  graduation: "Graduation Ceremony",
  honor_girls: "Honor Ceremony - Girls",
  honor_first: "Honor Ceremony - First Honor",
  honor_second: "Honor Ceremony - Second Honor",
  honor_third: "Honor Ceremony - Third Honor",
};

export async function notifyTelegram(listing) {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const phone = (listing.sellerPhone || "").replace(/[^\d]/g, "");
  const waLink = `https://wa.me/${phone}`;
  const typeLabel = TYPE_LABEL[listing.ticketType] || listing.ticketType;

  const text =
    `🎓 *New ticket listed!*\n\n` +
    `🎟️ *Type:* ${typeLabel}\n` +
    `💰 *Price:* ${listing.price} SAR\n` +
    `🔢 *Quantity:* ${listing.quantity}\n` +
    `👤 *Seller:* ${listing.sellerName}\n\n` +
    `📱 [Contact on WhatsApp](${waLink})\n` +
    `🌐 [View all listings](https://graduation-tickets.web.app/buy)`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    console.error("Telegram notify failed:", e);
  }
}
