import axios from "axios";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export const sendFreeClassNotification = async ({ program, name, phone }) => {
  if (!program || !name || !phone) {
    throw new ApiError(400, "Program, name, and phone number are required.");
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new ApiError(400, "Invalid phone number format. Please provide a 10-digit phone number.");
  }

  const token = env.WHATSAPP_API_TOKEN;
  const apiUrl = env.WHATSAPP_API_URL;

  if (!token || !apiUrl) {
    throw new ApiError(500, "Server configuration error. Missing WhatsApp API token or API URL.");
  }

  const messageText = `Hello ${name},\nThank you for your interest in the ${program} program! We will get in touch with you shortly.`;
  const encodedMessage = encodeURIComponent(messageText);
  const whatsappApiUrl = `${apiUrl}?receiver=91${phone}&msgtext=${encodedMessage}&token=${token}`;

  const response = await axios.get(whatsappApiUrl);
  return response.data;
};

export default {
  sendFreeClassNotification,
};

