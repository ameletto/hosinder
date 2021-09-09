import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { SchoolModel } from "../../models/School";
import { UserModel } from "../../models/User";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.school)) {
                return res.status(406);                        
            }
            
            try {                
                let conditions = {};
                const mongoose = require('mongoose');


                if (req.query.id) conditions["_id"] = req.query.id;
                if (req.query.school) conditions["school"] = mongoose.Types.ObjectId(req.query.school);
                
                         
                await dbConnect();   
            
                if (req.query.school && req.query.removeAdmins) {
                    const thisSchool = await SchoolModel.findById(req.query.school)
                    conditions["_id"] = { $nin: thisSchool.admin }
                }
                const thisObject = await UserModel.aggregate([
                    {$match: conditions},
                    
                ]);
                
                return res.status(200).json({data: thisObject});
                if (!thisObject || !thisObject.length) return res.status(404);
                
                return res.status(200).json({data: thisObject});
            } catch (e) {
                return res.status(500).json({message: e});                        
            }
        }

        case "POST": {
            const session = await getSession({req});
            if (!session) return res.status(403).send("Unauthed");
            if (!req.body.grade || !req.body.school) return res.status(406).send("Missing grade or school");
            
            try {
                await dbConnect();

                const user = await UserModel.findOne({email: session.user.email})
                user.grade = req.body.grade
                user.school = req.body.school
                await user.save();


                return res.status(200).json({message: "Object saved"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        case "DELETE": {
            const session = await getSession({ req });
            if (!session) return res.status(403).send("Unauthed");
            
            
            try {
                await dbConnect();
                               
                await UserModel.deleteOne({email: session.user.email})
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
