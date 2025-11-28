import db from '../src/models/database.js';

console.log('Updating Chocolate Chip Brownies recipe image...\n');

try {
    const stmt = db.prepare(`
    UPDATE recipes 
    SET image_url = ? 
    WHERE title = 'Chocolate Chip Brownies'
  `);

    const result = stmt.run('https://images.unsplash.com/photo-1607920592800-db7a4c6f6e05?w=500&q=80');

    console.log(`✅ Updated ${result.changes} recipe(s)`);

    // Verify the update
    const recipe = db.prepare('SELECT id, title, image_url FROM recipes WHERE title = ?')
        .get('Chocolate Chip Brownies');

    console.log('\n📋 Recipe details:');
    console.log(`   ID: ${recipe.id}`);
    console.log(`   Title: ${recipe.title}`);
    console.log(`   Image URL: ${recipe.image_url}`);

} catch (error) {
    console.error('❌ Error updating recipe:', error.message);
}
