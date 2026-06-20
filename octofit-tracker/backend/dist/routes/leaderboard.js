"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Leaderboard_1 = __importDefault(require("../models/Leaderboard"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const entries = await Leaderboard_1.default.find()
            .populate('user', '-password')
            .sort({ score: -1 });
        const ranked = entries.map((entry, index) => ({
            ...entry.toObject(),
            rank: index + 1,
        }));
        res.json(ranked);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});
router.post('/', async (req, res) => {
    try {
        const entry = new Leaderboard_1.default(req.body);
        await entry.save();
        res.status(201).json(entry);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const entry = await Leaderboard_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!entry)
            return res.status(404).json({ error: 'Entry not found' });
        res.json(entry);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
