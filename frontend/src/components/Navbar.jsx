import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout, onSearch }) => {
    return (
        <header className="navbar glass">
            <div className="container">
                <div className="navbar-content">
                    {/* Left: Logo */}
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">🍳</span>
                        <span className="brand-name">RecipeShare</span>
                    </Link>

                    {/* Center: Navigation Links */}
                    <nav className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/community" className="nav-link">Community</Link>
                        {user && <Link to="/meal-plan" className="nav-link">Meal Plan</Link>}
                        {user && <Link to="/profile" className="nav-link">Profile</Link>}
                    </nav>

                    {/* Right: Search & Actions */}
                    <div className="navbar-actions">
                        <div className="navbar-search">
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                onChange={(e) => onSearch && onSearch(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {user ? (
                            <>
                                <Link to="/create" className="btn btn-primary">+ Create</Link>
                                <button onClick={onLogout} className="btn btn-ghost">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
