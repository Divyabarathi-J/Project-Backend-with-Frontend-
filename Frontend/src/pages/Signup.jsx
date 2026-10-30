import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {

    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const result = await signup(
                form.name,
                form.email,
                form.password,
                form.role
            );

            setSuccess(result.message);

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Create Account</h1>
                <p>Register as a Student or Staff member</p>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {success && (
                    <div className="success-message">{success}</div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Register As</label>

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="STAFF">Staff</option>
                    </select>

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        minLength="6"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="primary-btn">
                        Create Account
                    </button>

                </form>

                <p className="auth-link">
                    Already registered?
                    <Link to="/login"> Login</Link>
                </p>

            </div>
        </div>
    );
};

export default Signup;