const { Op } = require('sequelize');
const { sequelize, Product, ProductImage, ProductOption, Category } = require('../models');

const includes = [
  { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
  { model: ProductImage, as: 'images', attributes: ['id', 'path', 'enabled'] },
  { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] }
];

module.exports = {
  findById: (id) => Product.findByPk(id, { include: includes, distinct: true }),
  findBySlug: (slug) => Product.findOne({ where: { slug } }),
  search: async (queryParams) => {
    const { limit, page, fields, match, category_ids } = queryParams;
    const priceRange = queryParams['price-range'];
    const where = {};
    if (match) where[Op.or] = [
      { name: { [Op.like]: `%${match}%` } },
      { description: { [Op.like]: `%${match}%` } }
    ];
    if (priceRange) {
      const [minimum, maximum] = priceRange.split('-').map(Number);
      if (!Number.isNaN(minimum) && !Number.isNaN(maximum)) where.price = { [Op.between]: [minimum, maximum] };
    }
    const categoryIds = category_ids ? String(category_ids).split(',').map(Number).filter(Number.isInteger) : [];
    const include = categoryIds.length
      ? [{ ...includes[0], through: { attributes: [] }, where: { id: { [Op.in]: categoryIds } }, required: true }, includes[1], includes[2]]
      : includes;
    const attributes = fields ? fields.split(',').filter((field) => ['id', 'enabled', 'name', 'slug', 'use_in_menu', 'stock', 'description', 'price', 'price_with_discount'].includes(field)) : undefined;
    const options = { where, include, distinct: true, attributes };
    if (limit !== -1) { options.limit = limit; options.offset = (page - 1) * limit; }
    const { rows, count } = await Product.findAndCountAll(options);
    return { rows, total: typeof count === 'number' ? count : count.length };
  },
  create: (data) => sequelize.transaction(async (transaction) => {
    const product = await Product.create(data.product, { transaction });
    await product.setCategories(data.categoryIds, { transaction });
    if (data.images.length) await ProductImage.bulkCreate(data.images.map((item) => ({ ...item, product_id: product.id })), { transaction });
    if (data.options.length) await ProductOption.bulkCreate(data.options.map((item) => ({ ...item, product_id: product.id })), { transaction });
    return Product.findByPk(product.id, { include: includes, transaction });
  }),
  update: (id, data) => sequelize.transaction(async (transaction) => {
    await Product.update(data.product, { where: { id }, transaction });
    if (data.categoryIds) {
      const product = await Product.findByPk(id, { transaction });
      await product.setCategories(data.categoryIds, { transaction });
    }
    for (const image of data.deletedImages) await ProductImage.destroy({ where: { id: image, product_id: id }, transaction });
    for (const image of data.images) {
      if (image.id) await ProductImage.update(image, { where: { id: image.id, product_id: id }, transaction });
      else await ProductImage.create({ ...image, product_id: id }, { transaction });
    }
    for (const option of data.deletedOptions) await ProductOption.destroy({ where: { id: option, product_id: id }, transaction });
    for (const option of data.options) {
      if (option.id) await ProductOption.update(option, { where: { id: option.id, product_id: id }, transaction });
      else await ProductOption.create({ ...option, product_id: id }, { transaction });
    }
  }),
  remove: (id) => Product.destroy({ where: { id } })
};
