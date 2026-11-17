const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const AppError = require('../errors/AppError');
const repository = require('../repositories/productRepository');

function radiusValue(radius) {
  if (typeof radius === 'string') return parseInt(radius.replace('px', ''), 10);
  return radius;
}
function serializeProduct(product) {
  const plain = product.toJSON();
  return {
    id: plain.id,
    enabled: plain.enabled,
    name: plain.name,
    slug: plain.slug,
    use_in_menu: plain.use_in_menu,
    stock: plain.stock,
    description: plain.description,
    price: plain.price,
    price_with_discount: plain.price_with_discount,
    category_ids: (plain.categories || []).map((category) => category.id),
    images: (plain.images || []).map((image) => ({ id: image.id, enabled: image.enabled, content: image.path })),
    options: (plain.options || []).map((option) => ({ id: option.id, title: option.title, shape: option.shape, radius: option.radius, type: option.type, values: option.values.split(',') }))
  };
}
function saveImage(content, mimeType = 'image/png') {
  if (!content) return null;
  if (/^https?:\/\//i.test(content)) return content;
  const match = content.match(/^data:(.+);base64,(.+)$/);
  const base64 = match ? match[2] : content;
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length) throw new AppError('Invalid base64 image content', 400, 'VALIDATION_ERROR');
  const extension = (match ? match[1].split('/')[1] : mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg');
  const filename = `${crypto.randomUUID()}.${extension}`;
  fs.mkdirSync(path.resolve('uploads'), { recursive: true });
  fs.writeFileSync(path.resolve('uploads', filename), buffer);
  return `/uploads/${filename}`;
}

/** Handles product CRUD, category relations, images and options. */
module.exports = {
  serializeProduct,
  async search(params) {
    const { rows, total } = await repository.search(params);
    return { data: rows.map(serializeProduct), total, limit: params.limit, page: params.page };
  },
  async getById(id) {
    const product = await repository.findById(id);
    if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');
    return serializeProduct(product);
  },
  async create(data) {
    if (await repository.findBySlug(data.slug)) throw new AppError('Product slug already exists', 409, 'CONFLICT');
    const product = {
      enabled: data.enabled, name: data.name, slug: data.slug, use_in_menu: data.use_in_menu,
      stock: data.stock, description: data.description, price: data.price, price_with_discount: data.price_with_discount
    };
    const images = data.images.map((image) => ({ enabled: image.enabled !== false, path: saveImage(image.content, image.type) })).filter((image) => image.path);
    const options = data.options.map((option) => ({
      title: option.title, shape: option.shape, radius: radiusValue(option.radius), type: option.type,
      values: (option.values || option.value || []).join(',')
    }));
    await repository.create({ product, categoryIds: data.category_ids, images, options });
  },
  async update(id, data) {
    if (!await repository.findById(id)) throw new AppError('Product not found', 404, 'NOT_FOUND');
    const product = {};
    ['enabled', 'name', 'slug', 'use_in_menu', 'stock', 'description', 'price', 'price_with_discount'].forEach((key) => {
      if (data[key] !== undefined) product[key] = data[key];
    });
    const deletedImages = [];
    const images = [];
    for (const image of data.images || []) {
      if (image.deleted && image.id) deletedImages.push(image.id);
      else if (image.id && image.content) images.push({ id: image.id, path: saveImage(image.content, image.type), enabled: image.enabled !== false });
      else if (!image.id && image.content) images.push({ path: saveImage(image.content, image.type), enabled: image.enabled !== false });
    }
    const deletedOptions = [];
    const options = [];
    for (const option of data.options || []) {
      if (option.deleted && option.id) deletedOptions.push(option.id);
      else {
        const item = { ...(option.id ? { id: option.id } : {}) };
        ['title', 'shape', 'type'].forEach((key) => { if (option[key] !== undefined) item[key] = option[key]; });
        if (option.radius !== undefined) item.radius = radiusValue(option.radius);
        const values = option.values || option.value;
        if (values) item.values = values.join(',');
        if (option.id || item.title) options.push(item);
      }
    }
    await repository.update(id, { product, categoryIds: data.category_ids, deletedImages, images: images.filter((item) => item.path), deletedOptions, options });
  },
  async remove(id) {
    if (!await repository.findById(id)) throw new AppError('Product not found', 404, 'NOT_FOUND');
    await repository.remove(id);
  }
};
