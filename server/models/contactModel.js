import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    replied: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Add index for better query performance
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
