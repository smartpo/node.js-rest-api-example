import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export default class UserModel {

  get schema(){
    const schema = new mongoose.Schema({ 
      firstName: {
        type: String,
        required: true
      },
      lastName: String,
      password: String,
      email: {
        type: String,
        unique: true
      }
    });
    schema.pre("save", this.beforeSave);
    return schema;
  }

  async beforeSave(next){
    try {
      const user = this;
      if(user.isNew || user.isModified('password')){
        const saltRounds = 8;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
      return next();
    } catch(error){
      return next(error);
    }
  }

}