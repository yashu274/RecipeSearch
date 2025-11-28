import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI, mealAPI } from '../services/api';
import './RecipeDetail.css';

const RecipeDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMealPlanModal, setShowMealPlanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [mealPlanData, setMealPlanData] = useState({
        planned_date: new Date().toISOString().split('T')[0],
        meal_type: 'lunch',
    });
    const isDeleting = useRef(false); // Prevent multiple delete operations

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const response = await recipeAPI.getById(id);
            setRecipe(response.data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        // Prevent multiple simultaneous delete operations
        if (isDeleting.current) {
            return;
        }

        isDeleting.current = true;
        setShowDeleteModal(false);

        try {
            await recipeAPI.delete(id);
            navigate('/');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            console.error('Error details:', error.response?.data);
            alert(`Failed to delete recipe: ${error.response?.data?.error || error.message}`);
            isDeleting.current = false;
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleAddToMealPlan = async (e) => {
        e.preventDefault();
        try {
            await mealAPI.create({
                recipe_id: parseInt(id),
                ...mealPlanData,
            });
            setShowMealPlanModal(false);
            alert('Added to meal plan!');
        } catch (error) {
            console.error('Error adding to meal plan:', error);
            alert('Failed to add to meal plan');
        }
    };

    if (loading) {
        return <div className="loading">Loading recipe...</div>;
    }

    if (!recipe) {
        return <div className="error-page">Recipe not found</div>;
    }

    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    // Ensure both IDs are numbers for comparison (handles string/number mismatch)
    const isOwner = user && Number(user.id) === Number(recipe.user_id);

    return (
        <div className="recipe-detail-page">
            <div className="container">
                <div className="recipe-header">
                    <div className="recipe-image-large">
                        {recipe.image_url ? (
                            <img src={recipe.image_url} alt={recipe.title} />
                        ) : (
                            <div className="recipe-placeholder-large">
                                <span className="placeholder-icon">🍽️</span>
                            </div>
                        )}
                    </div>

                    <div className="recipe-info">
                        <div className="recipe-meta-header">
                            {recipe.category && (
                                <span className="recipe-badge">{recipe.category}</span>
                            )}
                            <span className="recipe-author text-muted">By {recipe.username}</span>
                        </div>

                        <h1 className="recipe-title-large">{recipe.title}</h1>

                        {recipe.description && (
                            <p className="recipe-description-large text-secondary">{recipe.description}</p>
                        )}

                        <div className="recipe-stats">
                            {recipe.prep_time > 0 && (
                                <div className="stat">
                                    <span className="stat-icon">⏱️</span>
                                    <div>
                                        <div className="stat-label">Prep Time</div>
                                        <div className="stat-value">{recipe.prep_time} min</div>
                                    </div>
                                </div>
                            )}
                            {recipe.cook_time > 0 && (
                                <div className="stat">
                                    <span className="stat-icon">🔥</span>
                                    <div>
                                        <div className="stat-label">Cook Time</div>
                                        <div className="stat-value">{recipe.cook_time} min</div>
                                    </div>
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="stat">
                                    <span className="stat-icon">👥</span>
                                    <div>
                                        <div className="stat-label">Servings</div>
                                        <div className="stat-value">{recipe.servings}</div>
                                    </div>
                                </div>
                            )}
                            {totalTime > 0 && (
                                <div className="stat">
                                    <span className="stat-icon">⏲️</span>
                                    <div>
                                        <div className="stat-label">Total Time</div>
                                        <div className="stat-value">{totalTime} min</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="recipe-actions">
                            {user && (
                                <button onClick={() => setShowMealPlanModal(true)} className="btn btn-primary">
                                    📅 Add to Meal Plan
                                </button>
                            )}
                            {isOwner && (
                                <>
                                    <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-secondary">
                                        ✏️ Edit
                                    </button>
                                    <button onClick={handleDeleteClick} className="btn btn-ghost">
                                        🗑️ Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="recipe-content">
                    <div className="ingredients-section">
                        <h2>Ingredients</h2>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="ingredient-item">
                                    <input type="checkbox" id={`ingredient-${index}`} />
                                    <label htmlFor={`ingredient-${index}`}>{ingredient}</label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="instructions-section">
                        <h2>Instructions</h2>
                        <ul className="instructions-list">
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index} className="instruction-item">
                                    <span className="step-number">{index + 1}</span>
                                    <p>{instruction}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {showMealPlanModal && (
                <div className="modal-overlay" onClick={() => setShowMealPlanModal(false)}>
                    <div className="modal glass-strong" onClick={(e) => e.stopPropagation()}>
                        <h3>Add to Meal Plan</h3>
                        <form onSubmit={handleAddToMealPlan} className="meal-plan-form">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    value={mealPlanData.planned_date}
                                    onChange={(e) => setMealPlanData({ ...mealPlanData, planned_date: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Meal Type</label>
                                <select
                                    value={mealPlanData.meal_type}
                                    onChange={(e) => setMealPlanData({ ...mealPlanData, meal_type: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowMealPlanModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add to Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal glass-strong" onClick={(e) => e.stopPropagation()}>
                        <h3>⚠️ Delete Recipe</h3>
                        <p>Are you sure you want to delete "{recipe?.title}"? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={handleDeleteCancel} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, hsl(0, 70%, 50%), hsl(0, 70%, 40%))' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetail;
