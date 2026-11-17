const Joi = require('joi');

const id = Joi.number().integer().positive().required();
const pagination = Joi.object({
  limit: Joi.number().integer().min(-1).max(1000).default(12),
  page: Joi.number().integer().positive().default(1),
  fields: Joi.string().optional(),
  use_in_menu: Joi.boolean().truthy('true').falsy('false').optional(),
  match: Joi.string().optional(),
  category_ids: Joi.string().optional(),
  'price-range': Joi.string().pattern(/^\d+(?:\.\d+)?-\d+(?:\.\d+)?$/).optional()
}).unknown(true);

const userCreate = Joi.object({
  firstname: Joi.string().trim().min(1).max(100).required(),
  surname: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});
const userUpdate = Joi.object({
  firstname: Joi.string().trim().min(1).max(100).required(),
  surname: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().required()
});
const login = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
const category = Joi.object({
  name: Joi.string().trim().min(1).max(150).required(),
  slug: Joi.string().trim().min(1).max(150).required(),
  use_in_menu: Joi.boolean().default(false)
});
const image = Joi.object({
  id: Joi.number().integer().positive(),
  deleted: Joi.boolean(),
  enabled: Joi.boolean().default(true),
  type: Joi.string(),
  content: Joi.string()
});
const optionCreate = Joi.object({
  id: Joi.number().integer().positive(),
  deleted: Joi.boolean(),
  title: Joi.string().trim().min(1).max(150),
  shape: Joi.string().valid('square', 'circle').default('square'),
  radius: Joi.alternatives().try(Joi.number().integer().min(0), Joi.string().pattern(/^\d+px$/)).default(0),
  type: Joi.string().valid('text', 'color').default('text'),
  value: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())),
  values: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number()))
}).custom((value, helpers) => {
  if (!value.deleted && !value.title) return helpers.message({ custom: 'title is required' });
  if (!value.deleted && !value.value && !value.values) return helpers.message({ custom: 'value or values is required' });
  return value;
});
const productBase = Joi.object({
  enabled: Joi.boolean().default(false),
  name: Joi.string().trim().min(1).max(150).required(),
  slug: Joi.string().trim().min(1).max(150).required(),
  use_in_menu: Joi.boolean().default(false),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow('').max(5000).optional(),
  price: Joi.number().min(0).required(),
  price_with_discount: Joi.number().min(0).required(),
  category_ids: Joi.array().items(Joi.number().integer().positive()).default([]),
  images: Joi.array().items(image).default([]),
  options: Joi.array().items(optionCreate).default([])
});
const productUpdate = productBase.keys({
  name: Joi.string().trim().min(1).max(150),
  slug: Joi.string().trim().min(1).max(150),
  price: Joi.number().min(0),
  price_with_discount: Joi.number().min(0)
}).or('name', 'slug', 'enabled', 'stock', 'description', 'price', 'price_with_discount', 'category_ids', 'images', 'options');

module.exports = { id, pagination, userCreate, userUpdate, login, category, productBase, productUpdate };
