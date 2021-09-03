import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { SchoolModel } from "../../models/School";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            
            try {                
                let conditions = {};

                if (req.query.id) conditions["_id"] = req.query.id;
                if (req.query.name) conditions["name"] = req.query.name;
                if (req.query.admin) conditions["admin"] = req.query.admin;
                if (req.query.description) conditions["description"] = req.query.description;
                
                         
                await dbConnect();   
            
                const thisObject = await SchoolModel.aggregate([
                    {$match: conditions},
                    
                ]);
                
                if (!thisObject || !thisObject.length) return res.status(404);
                
                return res.status(200).json({data: thisObject});
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
