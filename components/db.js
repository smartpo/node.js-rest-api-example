import models from '../models/index';
import mongoose from 'mongoose';
import config from '../config';

//Mongo connection
mongoose.Promise = Promise;
mongoose.connect(`mongodb://${config.mongo.host}`, {
  useMongoClient: true
});
mongoose.connection.on('error', () => {
  throw new Error('Unable to connect to database');
});

const db = {};
for (let key in models) {
  let instance = new models[key];
  db[key] = mongoose.connection.model(key, instance.schema);
}

module.exports = db;