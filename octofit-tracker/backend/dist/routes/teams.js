"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Team_1 = __importDefault(require("../models/Team"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const teams = await Team_1.default.find().populate('members', '-password');
        res.json(teams);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const team = await Team_1.default.findById(req.params.id).populate('members', '-password');
        if (!team)
            return res.status(404).json({ error: 'Team not found' });
        res.json(team);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});
router.post('/', async (req, res) => {
    try {
        const team = new Team_1.default(req.body);
        await team.save();
        res.status(201).json(team);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const team = await Team_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('members', '-password');
        if (!team)
            return res.status(404).json({ error: 'Team not found' });
        res.json(team);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await Team_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete team' });
    }
});
exports.default = router;
