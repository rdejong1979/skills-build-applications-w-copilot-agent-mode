"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Activity_1 = __importDefault(require("../models/Activity"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const activities = await Activity_1.default.find().populate('user', '-password').sort({ date: -1 });
        res.json(activities);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity_1.default.findById(req.params.id).populate('user', '-password');
        if (!activity)
            return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});
router.post('/', async (req, res) => {
    try {
        const activity = new Activity_1.default(req.body);
        await activity.save();
        res.status(201).json(activity);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const activity = await Activity_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!activity)
            return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await Activity_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Activity deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});
exports.default = router;
