import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

export const sendWhatsappMessage = async (req, res) => {
  try {
    const { program, name, phone } = req.query;
console.log(program, name, phone);

    if (!program || !name || !phone) {
      return res.status(400).json({ message: "Program, name, and phone number are required." });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format. Please provide a 10-digit phone number." });
    }

    const token = process.env.WHATSAPP_API_TOKEN;
    const apiUrl = process.env.WHATSAPP_API_URL;

    if (!token || !apiUrl) {
      return res.status(500).json({ message: "Server configuration error. Missing WhatsApp API token or API URL." });
    }

    const messageText = `Hello ${name},\nThank you for your interest in the ${program} program! We will get in touch with you shortly.`;
    const encodedMessage = encodeURIComponent(messageText);

    const whatsappApiUrl = `${apiUrl}?receiver=91${phone}&msgtext=${encodedMessage}&token=${token}`;

    console.log('Constructed WhatsApp API URL:', whatsappApiUrl);

    const response = await axios.get(whatsappApiUrl);
    console.log('WhatsApp API Response:', response.data);

    if (response.data && response.data.success === true) {
      return res.status(200).json({
        message: "WhatsApp message sent successfully.",
        response: response.data,
      });
    } else {
      return res.status(500).json({
        error: "Failed to send WhatsApp message.",
        response: response.data,
      });
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
    return res.status(500).json({ error: "Failed to send WhatsApp message." });
  }
};
