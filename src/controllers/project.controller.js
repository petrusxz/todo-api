const express = require('express');
const { authenticate } = require('../auth/auth');
const projectModel = require('../models/project.model');
const itemModel = require('../models/item.model');

class ProjectController {
  /**
   * @type {express.Router}
   */
  router = new express.Router();

  constructor() {
    this.router.post('/', authenticate, this.createProject.bind(this));
    this.router.get('/', authenticate, this.getAllProjects.bind(this));
    this.router.delete('/:id', authenticate, this.deleteProject.bind(this));
    this.router.put('/:id', authenticate, this.updateProject.bind(this));
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async createProject(req, res) {
    try {
      const obj = { userId: req.user._id, ...req.body };
      const project = await projectModel.create(obj);
      res.send(project.toResponse());
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async getAllProjects(req, res) {
    try {
      const projects = await projectModel.find({ 'userId': req.user._id });
      const projectsWithItems = [];

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const items = await itemModel.find({ 'projectId': project._id });
        projectsWithItems.push({
          ...project.toResponse(),
          items: items.map((i) => i.toResponse())
        });
      }

      res.send(projectsWithItems);
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      await projectModel.deleteOne({ '_id': id });
      res.send();
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  async updateProject(req, res) {
    try {
      if (!req.body.title) {
        throw '';
      }

      const { id } = req.params;
      const data = await projectModel.updateOne({ '_id': id }, req.body);

      if (data.n === 0) {
        res.status(400).send('Project not found');
      } else {
        res.send();
      }
    } catch (error) {
      res.status(400).send('Invalid data');
    }
  }
}

module.exports = ProjectController;