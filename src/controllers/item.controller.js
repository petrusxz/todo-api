const express = require('express');
const itemModel = require('../models/item.model');
const { authenticate } = require('../auth/auth');

class ItemController {
  /**
   * @type {express.Router}
   */
  router = new express.Router();
  
  constructor() {
    this.router.post('/', authenticate, this.createItem.bind(this));
    this.router.get('/:projectId', authenticate, this.getAllItems.bind(this));
    this.router.delete('/:id', authenticate, this.deleteItem.bind(this));
    this.router.put('/:id', authenticate, this.updateItem.bind(this));
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async createItem(req, res) {
    try {
      const item = await itemModel.create(req.body);
      res.send(item.toResponse());
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async getAllItems(req, res) {
    try {
      const { projectId } = req.params;
      const items = await itemModel.find({ 'projectId': projectId });
      res.send(items.map((i) => i.toResponse()));
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      await itemModel.deleteOne({ '_id': id });
      res.send();
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async updateItem(req, res) {
    try {
      if (!req.body.status) {
        throw '';
      }

      const { id } = req.params;
      const data = await itemModel.updateOne({ '_id': id }, req.body);
      const updatedItem = await itemModel.findOne({ '_id': id });
      
      if (data.n === 0) {
        res.status(400).send('Item not found');
      } else {
        res.send(updatedItem.toResponse());
      }
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }
}

module.exports = ItemController;