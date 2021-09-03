import mongoose, { Document } from "mongoose";
import { SchoolObj } from "../utils/types";

interface SchoolDoc extends SchoolObj, Document {}

const SchoolSchema = new mongoose.Schema({
	name: { required: true, type: String }, 
	admin: { required: true, type: [mongoose.Schema.Types.ObjectId] }, 
	description: { required: false, type: String }, 
	image: { required: false, type: String }, 
}, {
	timestamps: true,
});

export const SchoolModel = mongoose.models.school || mongoose.model<SchoolDoc>("school", SchoolSchema);