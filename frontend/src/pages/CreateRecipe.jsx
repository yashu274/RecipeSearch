import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import './CreateRecipe.css';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

const CreateRecipe = () => {
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
        setLoading(true);

        try {
            const filteredIngredients = ingredients.filter(i => i.trim());
            const filteredInstructions = instructions.filter(i => i.trim());

            if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
                alert('Please add at least one ingredient and one instruction');
                setLoading(false);
                return;
            }

            // Use FormData for multipart upload
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('prep_time', parseInt(formData.prep_time) || 0);
            formDataToSend.append('cook_time', parseInt(formData.cook_time) || 0);
            formDataToSend.append('servings', parseInt(formData.servings) || 1);
            formDataToSend.append('ingredients', JSON.stringify(filteredIngredients));
            formDataToSend.append('instructions', JSON.stringify(filteredInstructions));

            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            } else if (formData.image_url) {
                formDataToSend.append('image_url', formData.image_url);
            }

            const response = await recipeAPI.create(formDataToSend);
            navigate(`/recipe/${response.data.id}`);
        } catch (error) {
            console.error('Error creating recipe:', error);
            alert('Failed to create recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-recipe-page">
            <div className="container">
                <div className="page-header">
                    <h1>Create New Recipe</h1>
                    <p className="text-secondary">Share your culinary creation with the community</p>
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

                            <div className="form-group form-group-full">
                                <label className="form-label">Recipe Image</label>
                                <div className="image-upload-section">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input"
                                    />
                                    <label htmlFor="image-upload" className="file-upload-label">
                                        {imagePreview ? '📷 Change Image' : '📷 Upload Image'}
                                    </label>
                                    <input
                                        type="url"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="Or paste image URL"
                                        style={{ marginTop: 'var(--space-sm)' }}
                                    />
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                        </div>
                                    )}
                                </div>
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
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;
