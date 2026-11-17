const app = require('./app');
const { sequelize } = require('./models');

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => console.log(`API listening on port ${port}`));
function shutdown(signal) {
  console.log(`${signal} received, closing server`);
  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
