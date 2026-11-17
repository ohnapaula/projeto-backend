const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  firstname: { type: DataTypes.STRING(100), allowNull: false },
  surname: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false }
}, { tableName: 'users', underscored: true });

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING(150), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  use_in_menu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'categories', underscored: true });

const Product = sequelize.define('Product', {
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  use_in_menu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  price_with_discount: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'products', underscored: true });

const ProductImage = sequelize.define('ProductImage', {
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  path: { type: DataTypes.STRING(500), allowNull: false }
}, { tableName: 'product_images', underscored: true, timestamps: false });

const ProductOption = sequelize.define('ProductOption', {
  title: { type: DataTypes.STRING(150), allowNull: false },
  shape: { type: DataTypes.ENUM('square', 'circle'), allowNull: false, defaultValue: 'square' },
  radius: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  type: { type: DataTypes.ENUM('text', 'color'), allowNull: false, defaultValue: 'text' },
  values: { type: DataTypes.STRING(1000), allowNull: false }
}, { tableName: 'product_options', underscored: true, timestamps: false });

Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductOption, { as: 'options', foreignKey: 'product_id', onDelete: 'CASCADE' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id' });
Product.belongsToMany(Category, { through: 'product_categories', as: 'categories', foreignKey: 'product_id', otherKey: 'category_id', timestamps: false });
Category.belongsToMany(Product, { through: 'product_categories', as: 'products', foreignKey: 'category_id', otherKey: 'product_id', timestamps: false });

module.exports = { sequelize, User, Category, Product, ProductImage, ProductOption };
