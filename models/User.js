const { Schema, model, models } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    email: {
			type: String, required: [true, 'email is required'],
			unique: [true, 'email is already registered'],
			validate: {
				validator: function (v) {
					// Regular expression for email validation
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
				},
				message: props => `${props.value} is not a valid email address!`
			}
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
        required: [true, "SG is required!"],
        default : [0,0,0,0,0,0,0,0,0,0]
    },
    cg: {
        type: Number,
        required: [true, "CG is required!"],
        default : 10
    }
}, {
    virtuals: {
        id: function () {
            return this._id;
        }
    },
    toJSON: {
        versionKey: false,
        virtuals: true,
        transform: (doc, ret, options) => {
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        versionKey: false,
        virtuals: true,
        transform: (doc, ret, options) => {
            delete ret._id;
            return ret;
        }
    }
});

userSchema.pre("save", function (next) {
    this.email = this.email.toLowerCase();
    next();
});

exports.User = models.User || model("User", userSchema);