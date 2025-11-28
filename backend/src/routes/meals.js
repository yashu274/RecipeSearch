import express from 'express';
import db from '../models/database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's meal plan
router.get('/', authenticateToken, (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = `
      SELECT mp.*, r.title, r.image_url, r.prep_time, r.cook_time
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.user_id = ?
    `;
        const params = [req.user.id];

        if (startDate) {
            query += ' AND mp.planned_date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND mp.planned_date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY mp.planned_date, mp.meal_type';

        const meals = db.prepare(query).all(...params);
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add recipe to meal plan
router.post('/', authenticateToken, (req, res) => {
    try {
        const { recipe_id, planned_date, meal_type } = req.body;

        if (!recipe_id || !planned_date || !meal_type) {
            return res.status(400).json({ error: 'Recipe ID, date, and meal type are required' });
        }

        if (!['breakfast', 'lunch', 'dinner'].includes(meal_type)) {
            return res.status(400).json({ error: 'Invalid meal type' });
        }

        const stmt = db.prepare(
            'INSERT INTO meal_plans (user_id, recipe_id, planned_date, meal_type) VALUES (?, ?, ?, ?)'
        );

        const result = stmt.run(req.user.id, recipe_id, planned_date, meal_type);

        res.status(201).json({
            message: 'Added to meal plan',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from meal plan
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const meal = db.prepare('SELECT user_id FROM meal_plans WHERE id = ?').get(req.params.id);

        if (!meal) {
            return res.status(404).json({ error: 'Meal plan entry not found' });
        }

        if (meal.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        db.prepare('DELETE FROM meal_plans WHERE id = ?').run(req.params.id);

        res.json({ message: 'Removed from meal plan' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
