import {SubmissionObj} from "../../utils/types";
import {SubmissionModel} from "../../models/Submission";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
            
        case "POST": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            try {
                await dbConnect();
                
                if (req.body.id) {
                    if (!(req.body.user || req.body.top3events)) {
                        return res.status(406);            
                    }
                    const thisObject = await SubmissionModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    thisObject.user = req.body.user;
                    thisObject.top3events = req.body.top3events;
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.user && req.body.top3events)) {
                        return res.status(406);            
                    }
                    
                    const newSubmission = new SubmissionModel({
                        user: req.body.user,
			            top3events: req.body.top3events,                             
                    });
                    
                    const savedSubmission = await newSubmission.save();
                    
                    return res.status(200).json({message: "Object created", id: savedSubmission._id.toString()});
                }            
            } catch (e) {
                return res.status(500).json({message: e});            
            }
        }
        
        
        default:
            return res.status(405);
    }
}