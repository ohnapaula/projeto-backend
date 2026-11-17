const service = require('../services/categoryService');
module.exports = {
  async search(req, res) { res.status(200).json(await service.search(req.query)); },
  async getById(req, res) { res.status(200).json(await service.getById(req.params.id)); },
  async create(req, res) { res.status(201).json(await service.create(req.body)); },
  async update(req, res) { await service.update(req.params.id, req.body); res.status(204).send(); },
  async remove(req, res) { await service.remove(req.params.id); res.status(204).send(); }
};
