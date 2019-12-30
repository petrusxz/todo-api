const express = require('express');
const userModel = require('../models/user.model');
const { getCredetials } = require('../auth/auth');

class SignUpController {
  /**
   * @type {express.Router}
   */
  router = new express.Router();

  constructor() {
    this.router.post('/', this.signUp.bind(this));
  }

  async signUp(req, res) {
    try {
      const user = await userModel.create(req.body);
      const credetials = getCredetials(user);
      res.send(credetials);
    } catch (error) {
      console.log(error.code);
      res.status(400).send('Invalid data');
    }
  }
}

module.exports = SignUpController;