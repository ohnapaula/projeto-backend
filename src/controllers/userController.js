const service = require('../services/userService');

/** Receives user HTTP requests and delegates business rules to the service. */
module.exports = {
  async getById(req, res) { res.status(200).json(await service.getById(req.params.id)); },
  async create(req, res) { res.status(201).json(await service.create(req.body)); },
  async update(req, res) { await service.update(req.params.id, req.body); res.status(204).send(); },
  async remove(req, res) { await service.remove(req.params.id); res.status(204).send(); },
  async token(req, res) { res.status(200).json(await service.login(req.body.email, req.body.password)); }
};
