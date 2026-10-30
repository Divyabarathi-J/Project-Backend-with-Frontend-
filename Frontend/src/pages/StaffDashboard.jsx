import { useEffect, useState } from "react";
import api from "../api";
import {
    Users,
    Search,
    Edit,
    Trash2,
    RefreshCw
} from "lucide-react";

const StaffDashboard = () => {

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [editingUser, setEditingUser] = useState(null);

    const fetchStudents = async () => {

        setLoading(true);
        setError("");

        try {
            const response = await api.get("/users");

            const users = response.data.data || [];

            setStudents(
                users.filter(user => user.role === "STUDENT")
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch students"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (student) => {
        setEditingUser({
            _id: student._id,
            name: student.name,
            email: student.email,
            password: ""
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {

            const payload = {
                name: editingUser.name,
                email: editingUser.email
            };

            if (editingUser.password) {
                payload.password = editingUser.password;
            }

            const response = await api.put(
                `/users/${editingUser._id}`,
                payload
            );

            setMessage("Student updated successfully");

            setEditingUser(null);

            await fetchStudents();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update student"
            );
        }
    };

    const handleDelete = async (studentId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to deactivate this student?"
        );

        if (!confirmDelete) return;

        try {

            await api.patch(
                `/users/soft-delete/${studentId}`
            );

            setMessage("Student soft deleted successfully");

            await fetchStudents();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete student"
            );
        }
    };

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Staff Dashboard</h1>
                    <p>Manage student accounts and records</p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchStudents}
                >
                    <RefreshCw size={17} /> Refresh
                </button>
            </div>

            <div className="stats-container">

                <div className="stat-card">
                    <Users size={30} />
                    <div>
                        <h2>{students.length}</h2>
                        <p>Total Students</p>
                    </div>
                </div>

            </div>

            <div className="table-card">

                <div className="table-header">
                    <h2>Student Management</h2>

                    <div className="search-box">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {message && (
                    <div className="success-message">{message}</div>
                )}

                {loading ? (
                    <p>Loading students...</p>
                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.map(student => (

                                    <tr key={student._id}>

                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <span className="role-badge">
                                                STUDENT
                                            </span>
                                        </td>

                                        <td className="actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(student)}
                                                title="Edit student"
                                            >
                                                <Edit size={17} />
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(student._id)}
                                                title="Deactivate student"
                                            >
                                                <Trash2 size={17} />
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="4">
                                            No students found
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {editingUser && (

                <div className="modal-overlay">

                    <form
                        className="edit-modal"
                        onSubmit={handleUpdate}
                    >

                        <h2>Edit Student</h2>

                        <label>Name</label>

                        <input
                            value={editingUser.name}
                            onChange={e => setEditingUser({
                                ...editingUser,
                                name: e.target.value
                            })}
                            required
                        />

                        <label>Email</label>

                        <input
                            type="email"
                            value={editingUser.email}
                            onChange={e => setEditingUser({
                                ...editingUser,
                                email: e.target.value
                            })}
                            required
                        />

                        <label>New Password (optional)</label>

                        <input
                            type="password"
                            minLength="6"
                            placeholder="Leave blank to keep current password"
                            value={editingUser.password}
                            onChange={e => setEditingUser({
                                ...editingUser,
                                password: e.target.value
                            })}
                        />

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </button>

                            <button className="primary-btn">
                                Save Changes
                            </button>

                        </div>

                    </form>

                </div>
            )}

        </div>
    );
};

export default StaffDashboard;