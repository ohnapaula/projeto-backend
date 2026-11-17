const { User } = require('../models');

module.exports = {
  findById: (id) => User.findByPk(id, { attributes: ['id', 'firstname', 'surname', 'email'] }),
  findByEmail: (email) => User.findOne({ where: { email } }),
  create: (data) => User.create(data),
  update: async (id, data) => {
    const [count] = await User.update(data, { where: { id } });
    return count;
  },
  remove: (id) => User.destroy({ where: { id } })
};
