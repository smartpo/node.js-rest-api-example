import config from '../config';
import jwt from 'jsonwebtoken';
import db from './db';

export default class Auth {

  static async Verify(request, response, next){
    try{
      const {body ={}, query = {}, headers = {}} = request;
      const token = body.access_token || query.access_token || headers['x-access-token'];
      if (!token) throw new Error("Auth token required");

      const decoded = await Auth.DecodeToken(token);
      const user = await db.users.findOne({_id: decoded.id}, {__v: false});
      if (!user) throw new Error("User not found");
      
      request.user = user;
      next();
    } catch(error){
      response.status(401).json({
        status: false,
        error: error.message
      });
    }
  }

  static DecodeToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (error, decoded) => {
        if(error) return reject(error);
        resolve(decoded);
      });
    });
  }
  
}