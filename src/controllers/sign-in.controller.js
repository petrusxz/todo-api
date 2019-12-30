const express = require('express');
const userModel = require('../models/user.model');
const { getCredetials } = require('../auth/auth');
const bcrypt = require('bcrypt');

class SignInController {
  /**
   * @type {express.Router}
   */
  router = new express.Router();

  constructor() {
    this.router.post('/', this.signIn.bind(this));
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async signIn(req, res) {
    try {
      if (!req.body.email || !req.body.email) {
        throw '';
      }

      const user = await userModel.findOne({ 'email': req.body.email });
      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if (validPassword) {
        const credetials = getCredetials(user);
        res.send(credetials);
      } else {
        res.status(401).send('Wrong credentials');
      }
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }
}

module.exports = SignInController;