const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    message: {
        type: String,
        // required: true,
    }
}, { timestamps: true });

// Use the `model` method directly from the named import
const Contact = model("contact", contactSchema);

module.exports = Contact;
