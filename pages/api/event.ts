import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { EventModel } from "../../models/Event";
import { UserModel } from "../../models/User";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);

            const mongoose = require('mongoose');

            try {                
                let conditions = {};
                if (req.query.id) conditions["_id"] = mongoose.Types.ObjectId(`${req.query.id}`);
                if (req.query.name) conditions["name"] = req.query.name;
                if (req.query.description) conditions["description"] = req.query.description;
                if (req.query.labels) conditions["labels"] = req.query.labels;
                if (req.query.image) conditions["image"] = req.query.image;
                if (req.query.school) conditions["school"] = mongoose.Types.ObjectId(`${req.query.school}`);
                
                         
                await dbConnect();   
            
                const thisObject = await EventModel.aggregate([
                    {$match: conditions},
                    
                ]);
                
                if (!thisObject || !thisObject.length) return res.status(404);
                
                const thisUser = await UserModel.findOne({email: session.user.email});
                if (!req.query.school || !thisUser.labels || thisUser.labels.length === 0) return res.status(200).json({data: thisObject});

                let sortedEvents = []
                if (thisUser.labels.length === 1) {
                    for (var event of thisObject) {
                        if (event.labels.includes(thisUser.labels[0])) sortedEvents.push(event)
                    }
                    for (var event of thisObject) {
                        if (!(event.labels.includes(thisUser.labels[0]))) sortedEvents.push(event)
                    }
                } else {
                    for (var event of thisObject) {
                        if (event.labels.includes(thisUser.labels[0]) && event.labels.includes(thisUser.labels[1])) sortedEvents.push(event)
                    }
                    for (var event of thisObject) {
                        if ((event.labels.includes(thisUser.labels[0]) || event.labels.includes(thisUser.labels[1])) && !(event.labels.includes(thisUser.labels[0]) && event.labels.includes(thisUser.labels[1]))) sortedEvents.push(event)
                    }
                    for (var event of thisObject) {
                        if (!event.labels.includes(thisUser.labels[0]) && !event.labels.includes(thisUser.labels[1])) sortedEvents.push(event)
                    }
                }
                return res.status(200).json({data: sortedEvents});
            } catch (e) {
                return res.status(500).json({message: e});                        
            }
        }
            
        case "POST": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            try {
                await dbConnect();
                
                if (req.body.id) {
                    if (!(req.body.name || req.body.description || req.body.labels || req.body.image)) {
                        return res.status(406);            
                    }
                    const thisObject = await EventModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    if (req.body.name) thisObject.name = req.body.name;
                    if (req.body.description) thisObject.description = req.body.description;
                    if (req.body.labels) thisObject.labels = req.body.labels;
                    if (req.body.image) thisObject.image = req.body.image;
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.name && req.body.description && req.body.school)) {
                        return res.status(406);            
                    }
                    
                    const newEvent = new EventModel({
                        name: req.body.name,
                        description: req.body.description,
                        school: req.body.school,
                        labels: req.body.labels || [],
                        image: req.body.image || "",              
                    });
                    
                    const savedEvent = await newEvent.save();
                    
                    return res.status(200).json({message: "Object created", id: savedEvent._id.toString()});
                }            
            } catch (e) {
                return res.status(500).json({message: e});            
            }
        }
        
        case "DELETE": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            
            if (!req.body.id) return res.status(406);
            
            try {
                await dbConnect();
                               
                const thisObject = await EventModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                // if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await EventModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
