import { useState, useEffect } from 'react';
import { mealAPI, recipeAPI } from '../services/api';
import './MealPlan.css';

const MealPlan = () => {
    const [mealPlan, setMealPlan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchMealPlan();
    }, [selectedDate]);

    const fetchMealPlan = async () => {
        setLoading(true);
        try {
            const startDate = new Date(selectedDate);
            startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6); // End of week

            const response = await mealAPI.getAll({
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            });
            setMealPlan(response.data);
        } catch (error) {
            console.error('Error fetching meal plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeMeal = async (mealId) => {
        try {
            await mealAPI.delete(mealId);
            setMealPlan(mealPlan.filter(meal => meal.id !== mealId));
        } catch (error) {
            console.error('Error removing meal:', error);
        }
    };

    const getWeekDays = () => {
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay());
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const getMealsForDay = (date, mealType) => {
        const dateStr = date.toISOString().split('T')[0];
        return mealPlan.filter(
            meal => meal.planned_date === dateStr && meal.meal_type === mealType
        );
    };

    const weekDays = getWeekDays();
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    return (
        <div className="meal-plan-page">
            <div className="container">
                <div className="page-header">
                    <h1>Weekly Meal Plan</h1>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input date-input"
                    />
                </div>

                {loading ? (
                    <div className="loading">Loading meal plan...</div>
                ) : (
                    <div className="meal-plan-grid">
                        <div className="grid-header">
                            <div className="header-cell"></div>
                            {weekDays.map(day => (
                                <div key={day.getTime()} className="header-cell day-header">
                                    <div className="day-name">
                                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className="day-number">
                                        {day.getDate()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {mealTypes.map(mealType => (
                            <div key={mealType} className="meal-row">
                                <div className="meal-type-header">
                                    <span className="meal-icon">
                                        {mealType === 'breakfast' ? '🌅' : mealType === 'lunch' ? '☀️' : '🌙'}
                                    </span>
                                    <span className="meal-type-name">{mealType}</span>
                                </div>

                                {weekDays.map(day => {
                                    const meals = getMealsForDay(day, mealType);
                                    return (
                                        <div key={`${day.getTime()}-${mealType}`} className="meal-cell">
                                            {meals.map(meal => (
                                                <div key={meal.id} className="meal-item glass">
                                                    <div className="meal-content">
                                                        {meal.image_url && (
                                                            <img src={meal.image_url} alt={meal.title} className="meal-image" />
                                                        )}
                                                        <div className="meal-title">{meal.title}</div>
                                                        {(meal.prep_time || meal.cook_time) && (
                                                            <div className="meal-time text-muted">
                                                                ⏱️ {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeMeal(meal.id)}
                                                        className="remove-meal-btn"
                                                        title="Remove from plan"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            {meals.length === 0 && (
                                                <div className="empty-meal text-muted">No meal planned</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlan;
