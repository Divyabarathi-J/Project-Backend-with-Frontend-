import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";

import "./index.css";

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Navigate
            to={user.role === "STAFF"
                ? "/staff-dashboard"
                : "/student-dashboard"}
            replace
        />
    );
};

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>

                    <Route element={
                        <ProtectedRoute allowedRoles={["STAFF"]} />
                    }>
                        <Route
                            path="/staff-dashboard"
                            element={<StaffDashboard />}
                        />
                    </Route>

                    <Route element={
                        <ProtectedRoute allowedRoles={["STUDENT"]} />
                    }>
                        <Route
                            path="/student-dashboard"
                            element={<StudentDashboard />}
                        />
                    </Route>

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>
            </Route>

            <Route path="*" element={<Home />} />

        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;