const StudentStaff = require("../models/studentStaff.model");
const tokenService = require("../jwt/token.service");
const bcrypt = require("bcrypt");

class StudentStaffService {

    async signup(name, email, password, role) {
        if (!["STUDENT", "STAFF"].includes(role)) {
            throw new Error("Role must be STUDENT or STAFF");
        }

        const existingUser = await StudentStaff.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await StudentStaff.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role
        });

        const result = user.toObject();
        delete result.password;

        return result;
    }

    async login(email, password, role) {
        if (!["STUDENT", "STAFF"].includes(role)) {
            throw new Error("Role must be STUDENT or STAFF");
        }

        const user = await StudentStaff.findOne({
            email: email.trim().toLowerCase(),
            role
        }).select("+password");

        if (!user) {
            throw new Error("Invalid email, password, or role");
        }

        if (!user.isActive) {
            throw new Error("Account is inactive");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid email, password, or role");
        }

        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };

        const token = tokenService.generateToken(payload);

        const userData = user.toObject();
        delete userData.password;

        return {
            user: userData,
            token
        };
    }

    // GET ALL ACTIVE STUDENTS AND STAFF
    async getAllUser() {
        const users = await StudentStaff.find({
            isActive: true,
            isDeleted: { $ne: true }
        }).select("-password");

        return users;
    }

    // UPDATE USER
   

async updateUser(userId, updates, loggedInUser) {

    if (!loggedInUser || !loggedInUser.id || !loggedInUser.role) {
        throw new Error("Invalid logged-in user information");
    }

    const user = await StudentStaff.findById(userId);

    if (!user || user.isDeleted) {
        throw new Error("User not found");
    }

    const loggedInUserId = String(loggedInUser.id);
    const targetUserId = String(user._id);

    const isOwnAccount = loggedInUserId === targetUserId;

    console.log("Logged-in ID:", loggedInUserId);
    console.log("Target ID:", targetUserId);
    console.log("Logged-in role:", loggedInUser.role);
    console.log("Target role:", user.role);
    console.log("Own account:", isOwnAccount);

    // STAFF permissions
    if (loggedInUser.role === "STAFF") {

        // Staff can edit themselves and students,
        // but not another staff account.
        if (user.role === "STAFF" && !isOwnAccount) {
            throw new Error("Staff cannot modify another staff account");
        }
    }

    // STUDENT permissions
    else if (loggedInUser.role === "STUDENT") {

        if (!isOwnAccount) {
            throw new Error("Students can modify only their own account");
        }
    }

    else {
        throw new Error("Unauthorized access");
    }

    // Update name
    if (updates.name !== undefined) {
        user.name = updates.name;
    }

    // Update email
    if (updates.email !== undefined) {
        const email = updates.email.trim().toLowerCase();

        const existingUser = await StudentStaff.findOne({
            email,
            _id: { $ne: user._id }
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }

        user.email = email;
    }

    // Update password
    if (updates.password) {
        user.password = await bcrypt.hash(updates.password, 10);
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return updatedUser;
}


    // PERMANENT DELETE USER
    async deleteUser(userId) {
        const user = await StudentStaff.findByIdAndDelete(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return {
            message: "User permanently deleted successfully"
        };
    }

    // SOFT DELETE USER
    async softDeleteUser(userId) {
        const user = await StudentStaff.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        });

        if (!user) {
            throw new Error("User not found or already deleted");
        }

        user.isDeleted = true;
        await user.save();

        return {
            message: "User soft deleted successfully"
        };
    }
}

module.exports = new StudentStaffService();