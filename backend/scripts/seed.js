import db from '../src/models/database.js';

// Sample recipes data
const sampleRecipes = [
    {
        user_id: 1,
        title: "Fluffy Pancakes",
        description: "Light and fluffy breakfast pancakes that melt in your mouth",
        category: "Breakfast",
        prep_time: 10,
        cook_time: 15,
        servings: 4,
        image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500",
        ingredients: [
            "2 cups all-purpose flour",
            "2 tablespoons sugar",
            "2 teaspoons baking powder",
            "1/2 teaspoon salt",
            "2 eggs",
            "1 3/4 cups milk",
            "4 tablespoons melted butter",
            "1 teaspoon vanilla extract"
        ],
        instructions: [
            "Mix flour, sugar, baking powder, and salt in a large bowl",
            "In another bowl, whisk eggs, milk, melted butter, and vanilla",
            "Pour wet ingredients into dry ingredients and mix until just combined",
            "Heat a griddle over medium heat and lightly grease",
            "Pour 1/4 cup batter for each pancake",
            "Cook until bubbles form on surface, then flip and cook until golden"
        ]
    },
    {
        user_id: 1,
        title: "Mediterranean Quinoa Bowl",
        description: "Healthy and colorful quinoa bowl with Mediterranean flavors",
        category: "Lunch",
        prep_time: 15,
        cook_time: 20,
        servings: 2,
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
        ingredients: [
            "1 cup quinoa",
            "2 cups vegetable broth",
            "1 cucumber, diced",
            "1 cup cherry tomatoes, halved",
            "1/2 red onion, diced",
            "1/2 cup kalamata olives",
            "1/2 cup feta cheese",
            "3 tablespoons olive oil",
            "2 tablespoons lemon juice",
            "Fresh parsley and mint"
        ],
        instructions: [
            "Cook quinoa in vegetable broth according to package directions",
            "Let quinoa cool to room temperature",
            "Dice cucumber, tomatoes, and red onion",
            "Mix quinoa with all vegetables and olives",
            "Whisk together olive oil and lemon juice",
            "Toss salad with dressing and top with feta",
            "Garnish with fresh herbs"
        ]
    },
    {
        user_id: 1,
        title: "Honey Garlic Salmon",
        description: "Perfectly glazed salmon with a sweet and savory sauce",
        category: "Dinner",
        prep_time: 10,
        cook_time: 15,
        servings: 4,
        image_url: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500",
        ingredients: [
            "4 salmon fillets",
            "3 cloves garlic, minced",
            "1/4 cup honey",
            "3 tablespoons soy sauce",
            "2 tablespoons lemon juice",
            "1 tablespoon olive oil",
            "Salt and pepper to taste",
            "Sesame seeds for garnish",
            "Green onions, sliced"
        ],
        instructions: [
            "Preheat oven to 400°F (200°C)",
            "Mix honey, soy sauce, lemon juice, and garlic",
            "Season salmon with salt and pepper",
            "Heat olive oil in oven-safe skillet over medium-high heat",
            "Sear salmon for 2-3 minutes per side",
            "Pour honey garlic sauce over salmon",
            "Transfer to oven and bake for 8-10 minutes",
            "Garnish with sesame seeds and green onions"
        ]
    },
    {
        user_id: 1,
        title: "Creamy Tomato Basil Pasta",
        description: "Rich and comforting pasta in a creamy tomato basil sauce",
        category: "Dinner",
        prep_time: 10,
        cook_time: 20,
        servings: 4,
        image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
        ingredients: [
            "1 lb penne pasta",
            "2 tablespoons olive oil",
            "4 cloves garlic, minced",
            "1 can (28 oz) crushed tomatoes",
            "1 cup heavy cream",
            "1/4 cup fresh basil, chopped",
            "1/2 cup parmesan cheese",
            "Salt and pepper to taste",
            "Red pepper flakes (optional)"
        ],
        instructions: [
            "Cook pasta according to package directions",
            "Heat olive oil in a large pan over medium heat",
            "Sauté garlic until fragrant, about 1 minute",
            "Add crushed tomatoes and simmer for 10 minutes",
            "Stir in heavy cream and bring to a gentle simmer",
            "Add fresh basil and parmesan cheese",
            "Toss cooked pasta with sauce",
            "Season with salt, pepper, and red pepper flakes"
        ]
    },
    {
        user_id: 1,
        title: "Avocado Toast with Poached Egg",
        description: "Classic breakfast favorite with creamy avocado and perfectly poached egg",
        category: "Breakfast",
        prep_time: 5,
        cook_time: 10,
        servings: 2,
        image_url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500",
        ingredients: [
            "4 slices whole grain bread",
            "2 ripe avocados",
            "4 eggs",
            "1 tablespoon white vinegar",
            "Cherry tomatoes",
            "Red pepper flakes",
            "Salt and pepper",
            "Fresh herbs (optional)"
        ],
        instructions: [
            "Toast bread until golden brown",
            "Mash avocados with salt and pepper",
            "Bring a pot of water to simmer and add vinegar",
            "Crack eggs into water and poach for 3-4 minutes",
            "Spread mashed avocado on toast",
            "Top with poached egg",
            "Garnish with cherry tomatoes, red pepper flakes, and herbs"
        ]
    },
    {
        user_id: 1,
        title: "Thai Green Curry",
        description: "Aromatic and spicy Thai curry with vegetables and coconut milk",
        category: "Dinner",
        prep_time: 15,
        cook_time: 25,
        servings: 4,
        image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500",
        ingredients: [
            "2 tablespoons green curry paste",
            "1 can (14 oz) coconut milk",
            "1 lb chicken breast, cubed",
            "1 bell pepper, sliced",
            "1 cup bamboo shoots",
            "1 eggplant, cubed",
            "2 tablespoons fish sauce",
            "1 tablespoon brown sugar",
            "Fresh Thai basil",
            "Jasmine rice for serving"
        ],
        instructions: [
            "Heat coconut cream in a large pan until oil separates",
            "Add green curry paste and fry until fragrant",
            "Add chicken and cook until no longer pink",
            "Pour in remaining coconut milk and bring to simmer",
            "Add vegetables and cook until tender",
            "Season with fish sauce and brown sugar",
            "Stir in Thai basil leaves",
            "Serve over jasmine rice"
        ]
    },
    {
        user_id: 1,
        title: "Chocolate Chip Brownies",
        description: "Fudgy, rich chocolate brownies loaded with chocolate chips",
        category: "Dessert",
        prep_time: 15,
        cook_time: 30,
        servings: 12,
        image_url: "https://images.unsplash.com/photo-1607920592800-db7a4c6f6e05?w=500",
        ingredients: [
            "1 cup butter, melted",
            "2 cups sugar",
            "4 eggs",
            "1 teaspoon vanilla extract",
            "3/4 cup cocoa powder",
            "1 cup all-purpose flour",
            "1/2 teaspoon salt",
            "1/2 teaspoon baking powder",
            "1 cup chocolate chips"
        ],
        instructions: [
            "Preheat oven to 350°F (175°C)",
            "Grease a 9x13 inch baking pan",
            "Mix melted butter and sugar until combined",
            "Beat in eggs and vanilla",
            "Sift in cocoa powder, flour, salt, and baking powder",
            "Fold in chocolate chips",
            "Pour into prepared pan",
            "Bake for 25-30 minutes until edges are set",
            "Cool completely before cutting"
        ]
    },
    {
        user_id: 1,
        title: "Greek Salad",
        description: "Fresh and crisp Mediterranean salad with feta and olives",
        category: "Lunch",
        prep_time: 15,
        cook_time: 0,
        servings: 4,
        image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500",
        ingredients: [
            "4 large tomatoes, chopped",
            "1 cucumber, sliced",
            "1 red onion, thinly sliced",
            "1 green bell pepper, chopped",
            "1 cup kalamata olives",
            "8 oz feta cheese, cubed",
            "1/4 cup olive oil",
            "2 tablespoons red wine vinegar",
            "1 teaspoon dried oregano",
            "Salt and pepper"
        ],
        instructions: [
            "Chop all vegetables into bite-sized pieces",
            "Combine tomatoes, cucumber, onion, and bell pepper in a bowl",
            "Add olives and feta cheese",
            "Whisk together olive oil, vinegar, and oregano",
            "Pour dressing over salad",
            "Season with salt and pepper",
            "Toss gently and serve immediately"
        ]
    },
    {
        user_id: 1,
        title: "Banana Smoothie Bowl",
        description: "Thick and creamy smoothie bowl topped with fresh fruits and granola",
        category: "Breakfast",
        prep_time: 10,
        cook_time: 0,
        servings: 2,
        image_url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
        ingredients: [
            "3 frozen bananas",
            "1/2 cup almond milk",
            "1/4 cup Greek yogurt",
            "1 tablespoon honey",
            "Fresh berries for topping",
            "Granola for topping",
            "Sliced almonds",
            "Chia seeds",
            "Coconut flakes"
        ],
        instructions: [
            "Blend frozen bananas with almond milk until smooth",
            "Add Greek yogurt and honey, blend again",
            "Pour into bowls",
            "Arrange fresh berries on top",
            "Sprinkle with granola, almonds, and chia seeds",
            "Add coconut flakes",
            "Serve immediately"
        ]
    },
    {
        user_id: 1,
        title: "Chicken Caesar Wrap",
        description: "Quick and easy lunch wrap with grilled chicken and Caesar dressing",
        category: "Lunch",
        prep_time: 10,
        cook_time: 10,
        servings: 2,
        image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500",
        ingredients: [
            "2 chicken breasts",
            "2 large tortillas",
            "2 cups romaine lettuce, chopped",
            "1/4 cup Caesar dressing",
            "1/4 cup parmesan cheese, shredded",
            "1/2 cup croutons, crushed",
            "Salt and pepper",
            "1 tablespoon olive oil"
        ],
        instructions: [
            "Season chicken with salt and pepper",
            "Heat olive oil in a pan and cook chicken until done",
            "Slice chicken into strips",
            "Warm tortillas slightly",
            "Mix lettuce with Caesar dressing",
            "Place lettuce mixture on tortilla",
            "Add chicken strips, parmesan, and crushed croutons",
            "Roll up tightly and serve"
        ]
    },
    {
        user_id: 1,
        title: "Mango Lassi",
        description: "Refreshing Indian yogurt drink with sweet mango",
        category: "Beverage",
        prep_time: 5,
        cook_time: 0,
        servings: 2,
        image_url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500",
        ingredients: [
            "2 ripe mangoes, peeled and chopped",
            "1 cup plain yogurt",
            "1/2 cup milk",
            "2 tablespoons honey",
            "1/4 teaspoon cardamom powder",
            "Ice cubes",
            "Mint leaves for garnish"
        ],
        instructions: [
            "Add mangoes, yogurt, milk, and honey to blender",
            "Add cardamom powder",
            "Blend until smooth",
            "Add ice cubes and blend again",
            "Pour into glasses",
            "Garnish with mint leaves",
            "Serve chilled"
        ]
    },
    {
        user_id: 1,
        title: "Caprese Salad",
        description: "Simple Italian salad with tomatoes, mozzarella, and basil",
        category: "Snack",
        prep_time: 10,
        cook_time: 0,
        servings: 4,
        image_url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500",
        ingredients: [
            "4 large tomatoes, sliced",
            "1 lb fresh mozzarella, sliced",
            "Fresh basil leaves",
            "3 tablespoons extra virgin olive oil",
            "2 tablespoons balsamic glaze",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Slice tomatoes and mozzarella into 1/4 inch rounds",
            "Arrange alternating slices on a platter",
            "Tuck basil leaves between slices",
            "Drizzle with olive oil and balsamic glaze",
            "Season with salt and pepper",
            "Serve at room temperature"
        ]
    }
];

console.log('Starting database seed...\n');

// Insert sample recipes
for (const recipe of sampleRecipes) {
    try {
        const stmt = db.prepare(`
      INSERT INTO recipes (
        user_id, title, description, ingredients, instructions,
        prep_time, cook_time, servings, image_url, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            recipe.user_id,
            recipe.title,
            recipe.description,
            JSON.stringify(recipe.ingredients),
            JSON.stringify(recipe.instructions),
            recipe.prep_time,
            recipe.cook_time,
            recipe.servings,
            recipe.image_url,
            recipe.category
        );

        console.log(`✅ Added: ${recipe.title} (ID: ${result.lastInsertRowid})`);
    } catch (error) {
        console.error(`❌ Error adding ${recipe.title}:`, error.message);
    }
}

console.log('\n✨ Database seeding completed!');
console.log(`📊 Total recipes added: ${sampleRecipes.length}`);

// Show recipe count by category
const categoryCounts = db.prepare(`
  SELECT category, COUNT(*) as count 
  FROM recipes 
  GROUP BY category
`).all();

console.log('\n📋 Recipes by category:');
categoryCounts.forEach(row => {
    console.log(`   ${row.category}: ${row.count} recipes`);
});
