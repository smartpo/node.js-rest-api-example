import db from '../components/db';
import config from '../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class UserController {

  async list(request, response){
    try {
      let {limit, skip} = request.query;
      limit = parseInt(limit) || 30;
      skip = parseInt(skip) || 0;

      response.json({
        status: true,
        users: await db.users.find({}, {_id: false, firstName: true, lastName: true, email: true}).limit(limit).skip(skip)
      });
    } catch(error){
      this.error(response, error);
    }
  }

  async create(request, response){
    try {
      await db.users.create(request.body);
      response.status(201).json({
        status: true
      });
    } catch(error){
      this.error(response, error);
    }
  }

  async login(request, response){
    try {
      const {email, password} = request.body;
      const user = await db.users.findOne({email});
      if(!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.password);
      if(!isValid) throw new Error('Wrong email or password');

      const token = jwt.sign({id: user.id}, config.secret);
      response.json({
        status: true,
        token: token
      });
    } catch(error){
      this.error(response, error);
    }
  }

  view(request, response){
    const {email, firstName, lastName} = request.user;
    response.json({
      status: true,
      user: {
        email: email,
        name: `${firstName} ${lastName}`
      }
    });
  }

  error(response, error, status = 400){
    response.status(status).json({
      status: false,
      error: error.message
    });
  }

}