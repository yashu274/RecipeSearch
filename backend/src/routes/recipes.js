import express from 'express';
import db from '../models/database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all recipes with optional filters
router.get('/', (req, res) => {
    try {
        const { search, category, userId } = req.query;
        let query = `
      SELECT r.*, u.username,
      EXISTS(SELECT 1 FROM favorites f WHERE f.recipe_id = r.id AND f.user_id = ?) as is_favorited
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
        const params = [req.user?.id || 0];

        if (search) {
            query += ' AND (r.title LIKE ? OR r.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            query += ' AND r.category = ?';
            params.push(category);
        }

        if (userId) {
            query += ' AND r.user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY r.created_at DESC';

        const recipes = db.prepare(query).all(...params);

        // Parse JSON fields
        const parsedRecipes = recipes.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            instructions: JSON.parse(recipe.instructions),
            is_favorited: Boolean(recipe.is_favorited)
        }));

        res.json(parsedRecipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single recipe
router.get('/:id', (req, res) => {
    try {
        const recipe = db.prepare(`
      SELECT r.*, u.username,
      EXISTS(SELECT 1 FROM favorites f WHERE f.recipe_id = r.id AND f.user_id = ?) as is_favorited
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).get(req.user?.id || 0, req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            instructions: JSON.parse(recipe.instructions),
            is_favorited: Boolean(recipe.is_favorited)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create recipe (authenticated)
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            instructions,
            prep_time,
            cook_time,
            servings,
            image_url,
            category
        } = req.body;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ error: 'Title, ingredients, and instructions are required' });
        }

        // Parse JSON strings if they come as strings
        const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
        const parsedInstructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;

        // Use uploaded file path or provided URL
        let finalImageUrl = image_url;
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        }

        const stmt = db.prepare(`
      INSERT INTO recipes (
        user_id, title, description, ingredients, instructions,
        prep_time, cook_time, servings, image_url, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            req.user.id,
            title,
            description,
            JSON.stringify(parsedIngredients),
            JSON.stringify(parsedInstructions),
            prep_time,
            cook_time,
            servings,
            finalImageUrl,
            category
        );

        res.status(201).json({
            message: 'Recipe created successfully',
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update recipe (authenticated, owner only)
router.put('/:id', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const recipe = db.prepare('SELECT user_id, image_url FROM recipes WHERE id = ?').get(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (Number(recipe.user_id) !== Number(req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to edit this recipe' });
        }

        const {
            title,
            description,
            ingredients,
            instructions,
            prep_time,
            cook_time,
            servings,
            image_url,
            category
        } = req.body;

        // Parse JSON strings if they come as strings
        const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
        const parsedInstructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;

        // Use uploaded file path, provided URL, or keep existing
        let finalImageUrl = image_url || recipe.image_url;
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        }

        const stmt = db.prepare(`
      UPDATE recipes SET
        title = ?, description = ?, ingredients = ?, instructions = ?,
        prep_time = ?, cook_time = ?, servings = ?, image_url = ?, category = ?
      WHERE id = ?
    `);

        stmt.run(
            title,
            description,
            JSON.stringify(parsedIngredients),
            JSON.stringify(parsedInstructions),
            prep_time,
            cook_time,
            servings,
            finalImageUrl,
            category,
            req.params.id
        );

        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete recipe (authenticated, owner only)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const recipe = db.prepare('SELECT user_id FROM recipes WHERE id = ?').get(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (Number(recipe.user_id) !== Number(req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to delete this recipe' });
        }

        db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle favorite (authenticated)
router.post('/:id/favorite', authenticateToken, (req, res) => {
    try {
        const existing = db.prepare(
            'SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?'
        ).get(req.user.id, req.params.id);

        if (existing) {
            db.prepare('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?')
                .run(req.user.id, req.params.id);
            res.json({ message: 'Removed from favorites', favorited: false });
        } else {
            db.prepare('INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)')
                .run(req.user.id, req.params.id);
            res.json({ message: 'Added to favorites', favorited: true });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's favorites
router.get('/user/favorites', authenticateToken, (req, res) => {
    try {
        const favorites = db.prepare(`
      SELECT r.*, u.username, 1 as is_favorited
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      JOIN favorites f ON r.id = f.recipe_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(req.user.id);

        const parsedFavorites = favorites.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            instructions: JSON.parse(recipe.instructions),
            is_favorited: true
        }));

        res.json(parsedFavorites);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
