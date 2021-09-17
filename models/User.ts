import mongoose, { Document, Model } from "mongoose";
import { DatedObj, UserObj } from "../utils/types";

const UserSchema = new mongoose.Schema({
    email: { required: true, type: String },
    name: { required: true, type: String },
    image: { required: true, type: String },
    grade: { required: true, type: Number },
    school: { required: false, type: mongoose.Schema.Types.ObjectId },
    labels: { required: false, type: [String] },
    previousEvents: { required: false, type: [mongoose.Schema.Types.ObjectId] },
    preferredEvents: { required: false, type: [mongoose.Schema.Types.ObjectId] },
    notWantedEvents: { required: false, type: [mongoose.Schema.Types.ObjectId] },
}, {
    timestamps: true,
});

export const UserModel: Model<DatedObj<UserObj>> = mongoose.models.user || mongoose.model("user", UserSchema);