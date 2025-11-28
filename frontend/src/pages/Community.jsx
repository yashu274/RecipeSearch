import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './Home.css';
import './Community.css';

const Community = ({ user }) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        filterRecipes();
    }, [selectedCategory, searchTerm, recipes]);

    const fetchRecipes = async () => {
        try {
            const response = await recipeAPI.getAll();
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterRecipes = () => {
        let filtered = recipes;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(recipe => recipe.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRecipes(filtered);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFavorite = async (recipeId, isFavorited) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await recipeAPI.toggleFavorite(recipeId);
            const updatedRecipes = recipes.map(recipe =>
                recipe.id === recipeId ? { ...recipe, is_favorited: !isFavorited } : recipe
            );
            setRecipes(updatedRecipes);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Group recipes by user
    const recipesByUser = filteredRecipes.reduce((acc, recipe) => {
        const username = recipe.username || 'Unknown User';
        if (!acc[username]) {
            acc[username] = [];
        }
        acc[username].push(recipe);
        return acc;
    }, {});

    const userNames = Object.keys(recipesByUser);

    if (loading) {
        return (
            <div className="home-page">
                <div className="container">
                    <div className="loading">Loading community recipes...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="container">
                    <h1 className="hero-title gradient-text">Community Recipes</h1>
                    <p className="hero-subtitle">Discover delicious recipes from chefs around the world</p>
                </div>
            </div>

            <div className="container">
                <div className="filters-section">
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRecipes.length === 0 ? (
                    <div className="empty-state">
                        <p>No recipes found in this category</p>
                    </div>
                ) : (
                    <>
                        <div className="community-stats">
                            <p className="text-secondary">
                                🌟 {filteredRecipes.length} recipes from {userNames.length} {userNames.length === 1 ? 'chef' : 'chefs'}
                            </p>
                        </div>

                        {/* Group recipes by user */}
                        {userNames.map(username => (
                            <div key={username} className="user-recipes-section">
                                <div className="user-section-header">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="user-section-title">{username}</h2>
                                            <p className="text-muted">
                                                {recipesByUser[username].length} {recipesByUser[username].length === 1 ? 'recipe' : 'recipes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="recipes-grid">
                                    {recipesByUser[username].map(recipe => (
                                        <RecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            onFavorite={handleFavorite}
                                            showFavorite={!!user}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Community;
