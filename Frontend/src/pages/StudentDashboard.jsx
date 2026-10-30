import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
    UserRound,
    Mail,
    ShieldCheck,
    Edit
} from "lucide-react";

const StudentDashboard = () => {

    const { user } = useAuth();

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>

                <Link
                    to="/profile"
                    className="primary-btn link-btn"
                >
                    <Edit size={17} />
                    Edit Profile
                </Link>
            </div>

            <div className="student-welcome">
                <div>
                    <h2>Hello, {user?.name}!</h2>
                    <p>
                        Welcome to your personal student portal.
                        Manage your account information here.
                    </p>
                </div>

                <div className="welcome-icon">
                    <UserRound size={65} />
                </div>
            </div>

            <div className="profile-grid">

                <div className="profile-card">
                    <UserRound size={25} />

                    <span>Full Name</span>

                    <h3>{user?.name}</h3>
                </div>

                <div className="profile-card">
                    <Mail size={25} />

                    <span>Email Address</span>

                    <h3>{user?.email}</h3>
                </div>

                <div className="profile-card">
                    <ShieldCheck size={25} />

                    <span>Account Role</span>

                    <h3>{user?.role}</h3>
                </div>

            </div>

        </div>
    );
};

export default StudentDashboard;