import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Lock, Mail } from "lucide-react";

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "STUDENT"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const user = await login(
                form.email,
                form.password,
                form.role
            );

            navigate(
                user.role === "STAFF"
                    ? "/staff-dashboard"
                    : "/student-dashboard"
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <div className="logo">
                    <GraduationCap size={35} />
                </div>

                <h1>Welcome Back</h1>
                <p>Sign in to your Campus Portal</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Login As</label>

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="STAFF">Staff</option>
                    </select>

                    <label>Email Address</label>

                    <div className="input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Password</label>

                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-btn"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </form>

                <p className="auth-link">
                    Don't have an account?
                    <Link to="/signup"> Register</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;