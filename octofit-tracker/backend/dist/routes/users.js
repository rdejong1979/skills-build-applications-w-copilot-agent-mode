"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// GET all users
router.get('/', async (_req, res) => {
    try {
        const users = await User_1.default.find().select('-password');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// GET single user
router.get('/:id', async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// POST create user
router.post('/', async (req, res) => {
    try {
        const user = new User_1.default(req.body);
        await user.save();
        const { password: _, ...userObj } = user.toObject();
        res.status(201).json(userObj);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        await User_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.default = router;
