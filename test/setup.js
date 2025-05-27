module.exports = async () => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test_db';
};