import mongoose, {Document, Model} from "mongoose";
import {SubmissionObj} from "../utils/types";

interface SubmissionDoc extends SubmissionObj, Document {}

const SubmissionSchema = new mongoose.Schema({
	user: { required: true, type: mongoose.Schema.Types.ObjectId }, 
	top3events: { required: true, type: [mongoose.Schema.Types.ObjectId] }, 
}, {
	timestamps: true,
});

export const SubmissionModel = mongoose.models.submission || mongoose.model<SubmissionDoc>("submission", SubmissionSchema);
