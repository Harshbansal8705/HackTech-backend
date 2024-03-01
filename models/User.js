const { Schema, model, models } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email is required!"]
    },
    rollNo: {
        type: String,
        length: 9,
        required: [true, "Roll No is required!"]
    },
    department: {
        type: String,
        required: [true, "Department is required!"]
    },
    sg: {
        type: [Number],
        required: [true, "SG is required!"]
    },
    cg: {
        type: Number,
        required: [true, "CG is required!"]
    }
});

exports.User = models.User || model("User", userSchema);