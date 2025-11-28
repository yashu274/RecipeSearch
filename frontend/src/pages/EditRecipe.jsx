import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import './CreateRecipe.css';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Lunch',
        prep_time: '',
        cook_time: '',
        servings: '',
        image_url: '',
    });
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const response = await recipeAPI.getById(id);
            const recipe = response.data;

            setFormData({
                title: recipe.title || '',
                description: recipe.description || '',
                category: recipe.category || 'Lunch',
                prep_time: recipe.prep_time || '',
                cook_time: recipe.cook_time || '',
                servings: recipe.servings || '',
                image_url: recipe.image_url || '',
            });
            setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : ['']);
            setInstructions(recipe.instructions.length > 0 ? recipe.instructions : ['']);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            alert('Failed to load recipe');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const addInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const removeInstruction = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const filteredIngredients = ingredients.filter(i => i.trim());
            const filteredInstructions = instructions.filter(i => i.trim());

            if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
                alert('Please add at least one ingredient and one instruction');
                setSaving(false);
                return;
            }

            const recipeData = {
                ...formData,
                ingredients: filteredIngredients,
                instructions: filteredInstructions,
                prep_time: parseInt(formData.prep_time) || 0,
                cook_time: parseInt(formData.cook_time) || 0,
                servings: parseInt(formData.servings) || 1,
            };

            await recipeAPI.update(id, recipeData);
            navigate(`/recipe/${id}`);
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert(error.response?.data?.error || 'Failed to update recipe');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="create-recipe-page">
                <div className="container">
                    <div className="loading">Loading recipe...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="create-recipe-page">
            <div className="container">
                <div className="page-header">
                    <h1>Edit Recipe</h1>
                    <p className="text-secondary">Update your recipe details</p>
                </div>

                <form onSubmit={handleSubmit} className="recipe-form">
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Recipe Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    placeholder="e.g., Classic Chocolate Chip Cookies"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group form-group-full">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Brief description of your recipe..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Prep Time (minutes)</label>
                                <input
                                    type="number"
                                    name="prep_time"
                                    value={formData.prep_time}
                                    onChange={handleChange}
                                    className="input"
                                    min="0"
                                    placeholder="15"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cook Time (minutes)</label>
                                <input
                                    type="number"
                                    name="cook_time"
                                    value={formData.cook_time}
                                    onChange={handleChange}
                                    className="input"
                                    min="0"
                                    placeholder="30"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Servings</label>
                                <input
                                    type="number"
                                    name="servings"
                                    value={formData.servings}
                                    onChange={handleChange}
                                    className="input"
                                    min="1"
                                    placeholder="4"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header-flex">
                            <h2>Ingredients *</h2>
                            <button type="button" onClick={addIngredient} className="btn btn-secondary btn-sm">
                                + Add Ingredient
                            </button>
                        </div>
                        <div className="dynamic-list">
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="dynamic-item">
                                    <input
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                        className="input"
                                        placeholder="e.g., 2 cups all-purpose flour"
                                    />
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header-flex">
                            <h2>Instructions *</h2>
                            <button type="button" onClick={addInstruction} className="btn btn-secondary btn-sm">
                                + Add Step
                            </button>
                        </div>
                        <div className="dynamic-list">
                            {instructions.map((instruction, index) => (
                                <div key={index} className="dynamic-item">
                                    <span className="step-label">{index + 1}.</span>
                                    <textarea
                                        value={instruction}
                                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                                        className="input"
                                        placeholder="Describe this step..."
                                        rows="2"
                                    />
                                    {instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(`/recipe/${id}`)} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipe;
