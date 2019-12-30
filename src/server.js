const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const SignUpController = require('./controllers/sign-up.controller');
const SignInController = require('./controllers/sign-in.controller');
const ProjectController = require('./controllers/project.controller');
const ItemController = require('./controllers/item.controller');

class Server {
  app = express();

  constructor() {
    this.connectDB();
    this.setExpressConfig();
    this.setRoutes();
  }

  async connectDB() {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.connect('mongodb://127.0.0.1:27017/tododb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (error) {
      console.error(error);
    }
  }

  setExpressConfig() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.listen('3000');
  }

  setRoutes() {
    this.app.use('/sign-up', new SignUpController().router);
    this.app.use('/sign-in', new SignInController().router);
    this.app.use('/project', new ProjectController().router);
    this.app.use('/item', new ItemController().router);
  }
}

module.exports = new Server().app;