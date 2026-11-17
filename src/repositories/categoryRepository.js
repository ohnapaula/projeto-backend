const { Category } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  findById: (id) => Category.findByPk(id),
  findBySlug: (slug) => Category.findOne({ where: { slug } }),
  create: (data) => Category.create(data),
  update: async (id, data) => (await Category.update(data, { where: { id } }))[0],
  remove: (id) => Category.destroy({ where: { id } }),
  search: async ({ limit, page, fields, use_in_menu }) => {
    const where = {};
    if (use_in_menu !== undefined) where.use_in_menu = use_in_menu;
    const attributes = fields ? fields.split(',').filter((field) => ['id', 'name', 'slug', 'use_in_menu'].includes(field)) : undefined;
    const query = { where, attributes };
    if (limit !== -1) {
      query.limit = limit;
      query.offset = (page - 1) * limit;
    }
    const { rows, count } = await Category.findAndCountAll(query);
    return { rows, total: count };
  }
};
