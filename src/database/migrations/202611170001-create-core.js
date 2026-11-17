module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      firstname: { type: Sequelize.STRING(100), allowNull: false },
      surname: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(150), allowNull: false },
      slug: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      use_in_menu: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      name: { type: Sequelize.STRING(150), allowNull: false },
      slug: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      use_in_menu: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.FLOAT, allowNull: false },
      price_with_discount: { type: Sequelize.FLOAT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable('product_images', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      product_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      path: { type: Sequelize.STRING(500), allowNull: false }
    });
    await queryInterface.createTable('product_options', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      product_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      title: { type: Sequelize.STRING(150), allowNull: false },
      shape: { type: Sequelize.ENUM('square', 'circle'), allowNull: false, defaultValue: 'square' },
      radius: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      type: { type: Sequelize.ENUM('text', 'color'), allowNull: false, defaultValue: 'text' },
      values: { type: Sequelize.STRING(1000), allowNull: false }
    });
    await queryInterface.createTable('product_categories', {
      product_id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, references: { model: 'products', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      category_id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, references: { model: 'categories', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }
    });
    await queryInterface.addIndex('users', ['email'], { unique: true, name: 'idx_users_email' });
    await queryInterface.addIndex('categories', ['slug'], { unique: true, name: 'idx_categories_slug' });
    await queryInterface.addIndex('categories', ['use_in_menu'], { name: 'idx_categories_menu' });
    await queryInterface.addIndex('products', ['slug'], { unique: true, name: 'idx_products_slug' });
    await queryInterface.addIndex('products', ['enabled', 'price'], { name: 'idx_products_filters' });
    await queryInterface.addIndex('product_images', ['product_id'], { name: 'idx_product_images_product' });
    await queryInterface.addIndex('product_options', ['product_id'], { name: 'idx_product_options_product' });
    await queryInterface.addIndex('product_categories', ['category_id'], { name: 'idx_product_categories_category' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('product_categories');
    await queryInterface.dropTable('product_options');
    await queryInterface.dropTable('product_images');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('users');
  }
};
