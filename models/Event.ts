import mongoose, {Document, Model} from "mongoose";
import {EventObj} from "../utils/types";

interface EventDoc extends EventObj, Document {}

const EventSchema = new mongoose.Schema({
	name: { required: true, type: String }, 
	description: { required: true, type: String }, 
	labels: { required: false, type: [String] }, 
	image: { required: false, type: String }, 
}, {
	timestamps: true,
});

export const EventModel = mongoose.models.event || mongoose.model<EventDoc>("event", EventSchema);
