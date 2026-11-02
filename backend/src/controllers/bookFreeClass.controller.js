import * as bookFreeClassService from "../services/bookFreeClass.service.js";

export const sendWhatsappMessage = async (req, res) => {
  try {
    const { program, name, phone } = req.query;
    const data = await bookFreeClassService.sendFreeClassNotification({ program, name, phone });

    if (data && data.success === true) {
      return res.status(200).json({
        message: "WhatsApp message sent successfully.",
        response: data,
      });
    } else {
      return res.status(500).json({
        error: "Failed to send WhatsApp message.",
        response: data,
      });
    }
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Error sending WhatsApp message:", error.message);
    return res.status(500).json({ error: "Failed to send WhatsApp message." });
  }
};

export default {
  sendWhatsappMessage,
};

