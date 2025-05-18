const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const jwtConfig = require('../config/jwt');

class UserModel {
  constructor() {
    this.repository = AppDataSource.getRepository("User");
  }

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.repository.create({
      ...userData,
      password: hashedPassword
    });
    return await this.repository.save(user);
  }

  async findByEmail(email) {
    return await this.repository.findOne({ 
      where: { email },
      relations: ["role", "warehouse"]
    });
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role.name,
        warehouse: user.warehouse?.id || null
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  }
}

module.exports = new UserModel();