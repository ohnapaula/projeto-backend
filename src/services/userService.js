const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const repository = require('../repositories/userRepository');

/** Handles user registration, lookup, updates and authentication. */
module.exports = {
  async getById(id) {
    const user = await repository.findById(id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    return user;
  },
  async create(data) {
    const existing = await repository.findByEmail(data.email);
    if (existing) throw new AppError('Email already registered', 409, 'CONFLICT');
    const password = await bcrypt.hash(data.password, 12);
    const user = await repository.create({ firstname: data.firstname, surname: data.surname, email: data.email, password });
    return { id: user.id, firstname: user.firstname, surname: user.surname, email: user.email };
  },
  async update(id, data) {
    if (!await repository.findById(id)) throw new AppError('User not found', 404, 'NOT_FOUND');
    await repository.update(id, data);
  },
  async remove(id) {
    if (!await repository.findById(id)) throw new AppError('User not found', 404, 'NOT_FOUND');
    await repository.remove(id);
  },
  async login(email, password) {
    const user = await repository.findByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) throw new AppError('Invalid email or password', 400, 'INVALID_CREDENTIALS');
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    return { token };
  }
};
