import { useState, useEffect } from 'react';
import { recipeAPI } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './Profile.css';

const Profile = ({ user }) => {
    const [myRecipes, setMyRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('my-recipes');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recipesResponse, favoritesResponse] = await Promise.all([
                recipeAPI.getAll({ userId: user.id }),
                recipeAPI.getFavorites(),
            ]);
            setMyRecipes(recipesResponse.data);
            setFavorites(favoritesResponse.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = (recipeId) => {
        setFavorites(favorites.filter(recipe => recipe.id !== recipeId));
        setMyRecipes(myRecipes.map(recipe =>
            recipe.id === recipeId
                ? { ...recipe, is_favorited: !recipe.is_favorited }
                : recipe
        ));
    };

    const currentRecipes = activeTab === 'my-recipes' ? myRecipes : favorites;

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header glass">
                    <div className="profile-avatar">
                        <span className="avatar-icon">👤</span>
                    </div>
                    <div className="profile-info">
                        <h1>{user.username}</h1>
                        <p className="text-secondary">{user.email}</p>
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{myRecipes.length}</span>
                                <span className="stat-label">Recipes</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{favorites.length}</span>
                                <span className="stat-label">Favorites</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab ${activeTab === 'my-recipes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-recipes')}
                    >
                        My Recipes ({myRecipes.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        Favorites ({favorites.length})
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : currentRecipes.length === 0 ? (
                    <div className="empty-state">
                        <p className="text-secondary">
                            {activeTab === 'my-recipes'
                                ? 'You haven\'t created any recipes yet'
                                : 'You haven\'t favorited any recipes yet'}
                        </p>
                    </div>
                ) : (
                    <div className="recipes-grid grid grid-3">
                        {currentRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
