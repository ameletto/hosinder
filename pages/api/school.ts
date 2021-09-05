import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { SchoolModel } from "../../models/School";
import cleanForJSON from "../../utils/cleanForJSON";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            
            try {
                if (!req.query.id) {
                    const allSchools = await SchoolModel.find();
                    if (!allSchools || !allSchools.length) return res.status(404);
                    return res.status(200).json({data: allSchools});
                }
                // let conditions = {};
                // conditions["admin"] = req.query.admin;

                // if (req.query.admin && req.query.admin !== session.usre)

                const mongoose = require('mongoose');

                const id = mongoose.Types.ObjectId(`${req.query.id}`);
                
                         
                await dbConnect();  


            
                // return res.status(200).json({data: cleanForJSON(school)});
                const thisObject = await SchoolModel.aggregate([
                    {$match: {_id: id}},
                    {$lookup: {
                        from: "users",
                        // localField: "admin",
                        // foreignField: "_id",
                        let: {"ad": "$admin"},
                        pipeline: [
                            {$match: {$expr: {$and: [{$in: ["$_id", "$$ad"]}, ]}}},
                        ],
                        as: "adminsArr", 
                    }},                    
                    {$lookup: {
                        from: "events",
                        localField: "_id",
                        foreignField: "school",
                        as: "eventsArr",
                    }},
                ]);
                
                if (!thisObject || !thisObject.length) return res.status(404);
                
                return res.status(200).json({data: cleanForJSON(thisObject[0])});
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
                    if (!(req.body.name || req.body.admin)) {
                        return res.status(406);            
                    }
                    const thisObject = await SchoolModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    thisObject.name = req.body.name;
                    thisObject.admin = req.body.admin;
                    thisObject.description = req.body.description;
                    thisObject.image = req.body.image;
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.name)) {
                        return res.status(406);            
                    }

                    if (!(req.body.admin)) return res.status(406).send("Missing admin");
                    
                    const newSchool = new SchoolModel({
                        name: req.body.name,
                        admin: req.body.admin,
                        description: req.body.description || "",                             
                        image: req.body.image || "",                             
                    });
                    
                    // return res.status(200).json({message: newSchool});
                    const savedSchool = await newSchool.save();
                    
                    return res.status(200).json({message: "Object created", id: savedSchool._id.toString()});
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
                               
                const thisObject = await SchoolModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await SchoolModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
