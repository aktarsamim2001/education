import { validationResult } from 'express-validator';
import Contact from '../models/contactModel.js';
import { createNotification } from './notificationController.js';
import User from '../models/userModel.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const contact = new Contact({
            ...req.body
        });

        const savedContact = await contact.save();

        // Find an admin to send notification to
        const admin = await User.findOne({ role: 'admin' });
        
        if (!admin) {
            console.error('No admin found in the system');
        } else {
            // Create notification for admin
            await createNotification(
                admin._id,
                'New Contact Form Submission',
                `${contact.name} has sent a message: ${contact.subject}`,
                'other',
                savedContact._id,
                'Contact'
            );
        }

        res.status(201).json(savedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort('-createdAt')
            .limit(50);
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update contact reply status
// @route   PATCH /api/contact/:id/reply
// @access  Private/Admin
export const markAsReplied = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { replied: true },
            { new: true }
        );
        if (!contact) {
            return res.status(404).json({ message: 'Contact submission not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact submission not found' });
        }
        res.json({ message: 'Contact submission removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
