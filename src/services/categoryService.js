const AppError = require('../errors/AppError');
const repository = require('../repositories/categoryRepository');

/** Handles category CRUD and menu-oriented filtering. */
module.exports = {
  search: (params) => repository.search(params).then(({ rows, total }) => ({ data: rows, total, limit: params.limit, page: params.page })),
  async getById(id) {
    const category = await repository.findById(id);
    if (!category) throw new AppError('Category not found', 404, 'NOT_FOUND');
    return category;
  },
  async create(data) {
    if (await repository.findBySlug(data.slug)) throw new AppError('Category slug already exists', 409, 'CONFLICT');
    return repository.create(data);
  },
  async update(id, data) {
    if (!await repository.findById(id)) throw new AppError('Category not found', 404, 'NOT_FOUND');
    await repository.update(id, data);
  },
  async remove(id) {
    if (!await repository.findById(id)) throw new AppError('Category not found', 404, 'NOT_FOUND');
    await repository.remove(id);
  }
};
