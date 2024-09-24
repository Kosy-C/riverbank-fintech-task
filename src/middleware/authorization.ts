import { Request, Response, NextFunction } from "express";
import { UserAttributes, UserInstance } from "../model/userModel";
import { APP_SECRET } from "../DB.config";
import jwt, { JwtPayload } from "jsonwebtoken";

/**===================================== USER AUTH ===================================== **/
export const userAuth = async(req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if(!authorization) {
            return res.status(401).json({ 
                message: 'Access Denied' 
            });
        };

        const token = authorization.slice(7, authorization.length);
    let verified = jwt.verify(token, APP_SECRET) 

    if (!verified) {
        return res.status(401).json({
          Error: "User not verified"
        })
    };
    const { id } = verified as {[key:string]: string}
    
    //find user by id
    const user = await UserInstance.findOne({
        where: { id: id },
      }) as unknown as UserAttributes;
  
      if (!user) {
        return res.status(401).json({
          Error: "Invalid Credentials"
        })
      }
      req.user = verified;
      
      next();

    } catch (err) {
        return res.status(401).json({
            Error: "Unauthorised"
        })
    }
};