const studentStaffService = require("../services/studentStaff.service");

class StudentStaffController {

    // SIGNUP
    async signup(req, res) {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    message: "Name, email, password, and role are required"
                });
            }

            if (typeof password !== "string" || password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters"
                });
            }

            const user = await studentStaffService.signup(
                name, email, password, role
            );

            return res.status(201).json({
                message: "Account created successfully",
                data: user
            });

        } catch (error) {
            const status = error.code === 11000 ||
                error.message === "Email already exists"
                ? 409 : 400;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    // LOGIN
    async login(req, res) {
        try {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                return res.status(400).json({
                    message: "Email, password, and role are required"
                });
            }

            const result = await studentStaffService.login(
                email, password, role
            );

            return res.status(200).json({
                message: "Login successful",
                ...result
            });

        } catch (error) {
            const status = error.message === "Account is inactive"
                ? 403 : 401;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    // GET ALL USERS
    async getAllUser(req, res) {
        try {
            const users = await studentStaffService.getAllUser();

            return res.status(200).json({
                message: "Users retrieved successfully",
                count: users.length,
                data: users
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }

    // UPDATE USER
   async updateUser(req, res) {
    try {
        const { userId } = req.params;

        console.log("JWT USER:", req.user);
        console.log("TARGET USER ID:", userId);

        const updatedUser = await studentStaffService.updateUser(
            userId,
            req.body,
            req.user
        );

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.log("UPDATE ERROR:", error.message);

        const status =
            error.message.includes("cannot modify") ||
            error.message.includes("only their own") ||
            error.message === "Unauthorized access"
                ? 403
                : error.message === "User not found"
                ? 404
                : 400;

        return res.status(status).json({
            message: error.message
        });
    }
}
    // PERMANENT DELETE
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            const result = await studentStaffService.deleteUser(userId);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    // SOFT DELETE
    async softDeleteUser(req, res) {
        try {
            const { userId } = req.params;

            const result = await studentStaffService.softDeleteUser(userId);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }
}

module.exports = new StudentStaffController();