import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {

    const { user, updateUser } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: ""
    });

    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const payload = {
                name: form.name,
                email: form.email
            };

            if (form.password) {
                payload.password = form.password;
            }

            const response = await api.put(
                `/users/${user._id}`,
                payload
            );

            updateUser(response.data.data);

            setForm({
                name: response.data.data.name,
                email: response.data.data.email,
                password: ""
            });

            setMessage("Profile updated successfully!");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update profile"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">

            <div className="dashboard-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your personal information</p>
                </div>
            </div>

            <div className="profile-form-card">

                <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <h2>{user?.name}</h2>

                <span className="role-badge">
                    {user?.role}
                </span>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email Address</label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>New Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Leave blank to keep current password"
                        minLength="6"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Profile;