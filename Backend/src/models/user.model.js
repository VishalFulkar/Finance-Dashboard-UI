const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [50, "Name must be at most 50 characters long"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    avatar: {
        type: String,
        required: [true, "Avatar is required"],
        default: "avatar.png"
    },
    role: {
        type: String,
        enum: ["admin", "viewer"],
        default: "viewer",
        immutable: true,
        select: false
    }
}, { timestamps: true })

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const hash = await bcryptjs.hash(this.password, 10);

    this.password = hash;
    return;
});

userSchema.methods.comparePassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema)
module.exports = userModel;