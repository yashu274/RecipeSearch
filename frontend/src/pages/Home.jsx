import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

const Home = ({ user }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory, searchParams]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const params = {};
            const search = searchParams.get('search');
            if (search) params.search = search;
            if (selectedCategory !== 'All') params.category = selectedCategory;

            const response = await recipeAPI.getAll(params);
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = (recipeId) => {
        setRecipes(recipes.map(recipe =>
            recipe.id === recipeId
                ? { ...recipe, is_favorited: !recipe.is_favorited }
                : recipe
        ));
    };

    return (
        <div className="home-page">
            {!searchParams.get('search') && (
                <section className="hero">
                    <div className="container">
                        <div className="hero-content">
                            <h1 className="hero-title">
                                Discover & Share
                                <br />
                                <span className="gradient-text">Amazing Recipes</span>
                            </h1>
                            <p className="hero-subtitle text-secondary">
                                Join our community of food lovers and explore thousands of delicious recipes
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className="recipes-section">
                <div className="container">
                    <div className="section-header">
                        <h2>{searchParams.get('search') ? 'Search Results' : 'Featured Recipes'}</h2>
                        <div className="category-filters">
                            {CATEGORIES.map(category => (
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

                    {loading ? (
                        <div className="loading">Loading recipes...</div>
                    ) : recipes.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-secondary">No recipes found. {user && 'Be the first to create one!'}</p>
                        </div>
                    ) : (
                        <div className="recipes-grid grid grid-3">
                            {recipes.map(recipe => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onFavoriteToggle={handleFavoriteToggle}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
