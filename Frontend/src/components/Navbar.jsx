import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, LogOut, UserRound } from "lucide-react";

const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <Link to="/" className="nav-brand">
                <GraduationCap size={27} />
                CampusConnect
            </Link>

            <div className="nav-links">

                {user?.role === "STAFF" && (
                    <Link to="/staff-dashboard">
                        Dashboard
                    </Link>
                )}

                {user?.role === "STUDENT" && (
                    <Link to="/student-dashboard">
                        Dashboard
                    </Link>
                )}

                <Link to="/profile">
                    <UserRound size={16} />
                    Profile
                </Link>

                <button onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                </button>

            </div>

        </nav>
    );
};

export default Navbar;