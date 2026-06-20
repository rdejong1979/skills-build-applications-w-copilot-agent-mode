"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Workout_1 = __importDefault(require("../models/Workout"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.fitnessLevel)
            filter.fitnessLevel = req.query.fitnessLevel;
        const workouts = await Workout_1.default.find(filter);
        res.json(workouts);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const workout = await Workout_1.default.findById(req.params.id);
        if (!workout)
            return res.status(404).json({ error: 'Workout not found' });
        res.json(workout);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch workout' });
    }
});
router.post('/', async (req, res) => {
    try {
        const workout = new Workout_1.default(req.body);
        await workout.save();
        res.status(201).json(workout);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const workout = await Workout_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!workout)
            return res.status(404).json({ error: 'Workout not found' });
        res.json(workout);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await Workout_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workout deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete workout' });
    }
});
exports.default = router;
