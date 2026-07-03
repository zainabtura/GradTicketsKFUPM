const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");

const TELEGRAM_BOT_TOKEN = defineSecret("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = defineSecret("TELEGRAM_CHAT_ID");

const TYPE_LABEL = {
  graduation: "Graduation Ceremony",
  honor_girls: "Honor Ceremony - Girls",
  honor_first: "Honor Ceremony - First Honor",
  honor_second: "Honor Ceremony - Second Honor",
  honor_third: "Honor Ceremony - Third Honor",
};

exports.notifyNewListing = onDocumentCreated(
  {
    document: "listings/{id}",
    region: "europe-west1",
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const phone = (data.sellerPhone || "").replace(/[^\d]/g, "");
    const waLink = `https://wa.me/${phone}`;
    const typeLabel = TYPE_LABEL[data.ticketType] || data.ticketType;

    const text =
      `🎓 *New ticket listed!*\n\n` +
      `🎟️ *Type:* ${typeLabel}\n` +
      `💰 *Price:* ${data.price} SAR\n` +
      `🔢 *Quantity:* ${data.quantity}\n` +
      `👤 *Seller:* ${data.sellerName}\n\n` +
      `📱 [Contact on WhatsApp](${waLink})\n` +
      `🌐 [View all listings](https://graduation-tickets.web.app/buy)`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN.value()}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID.value(),
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      console.error("Telegram API error:", res.status, await res.text());
    }
  }
);
