import { Link } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle }) => {
    const handleFavorite = async (e) => {
        e.preventDefault();
        try {
            await recipeAPI.toggleFavorite(recipe.id);
            if (onFavoriteToggle) {
                onFavoriteToggle(recipe.id);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    return (
        <Link to={`/recipe/${recipe.id}`} className="recipe-card card card-hover">
            <div className="recipe-image">
                {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} />
                ) : (
                    <div className="recipe-placeholder">
                        <span className="placeholder-icon">🍽️</span>
                    </div>
                )}
                <div className="recipe-overlay">
                    <button
                        onClick={handleFavorite}
                        className="favorite-btn"
                        title={recipe.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {recipe.is_favorited ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>

            <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                {recipe.description && (
                    <p className="recipe-description text-secondary">{recipe.description}</p>
                )}

                <div className="recipe-meta">
                    {recipe.category && (
                        <span className="recipe-badge">{recipe.category}</span>
                    )}
                    {totalTime > 0 && (
                        <span className="recipe-time text-muted">⏱️ {totalTime} min</span>
                    )}
                    {recipe.servings && (
                        <span className="recipe-time text-muted">👥 {recipe.servings}</span>
                    )}
                </div>

                <div className="recipe-author text-muted">
                    By {recipe.username}
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
