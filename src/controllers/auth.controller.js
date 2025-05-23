const userModel = require('../models/user.model');
const AppDataSource = require('../config/data-source');
const bcrypt = require('bcrypt');

class AuthController {
  async login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValid = await userModel.comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = userModel.generateToken(user);
    
    // Crear objeto con la información del usuario que quieres devolver
    const userData = {
      id: user.id,
      cc: user.cc,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
      warehouse_id: user.warehouse_id,
      status: user.status
      // Puedes incluir o excluir campos según lo necesites
    };

    // Devolver tanto el token como la información del usuario
    res.json({ 
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
}
  async register(req, res) {
    try {
      let { cc, name, email, password, phone, role_id, warehouse_id } = req.body;
      
      const roleRepository = AppDataSource.getRepository("Role");
      const role = await roleRepository.findOneBy({ id: role_id });
      if (!role) {
        return res.status(400).json({ error: "Rol no válido" });
      }

      if (warehouse_id) {
        const warehouseRepository = AppDataSource.getRepository("Warehouse");
        const warehouse = await warehouseRepository.findOneBy({ id: warehouse_id });
        if (!warehouse) {
          return res.status(400).json({ error: "Bodega no válida" });
        }
      }

      const userRepository = AppDataSource.getRepository("User");
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!warehouse_id) {
        warehouse_id = null;
      }
      console.log("Datos recibidos para registro:", { cc, name, email, password, phone, role_id, warehouse_id });

      const newUser = userRepository.create({
        cc,
        name,
        email,
        password: hashedPassword,
        phone,
        role_id,
        warehouse_id,
        status: true
      });

      const savedUser = await userRepository.save(newUser);
      res.status(201).json({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role_id: savedUser.role_id
      });
    } catch (error) {
      if (error.code === '23505') {
        res.status(400).json({ error: "El email o ID CC ya está registrado" });
      } else {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el usuario" });
      }
    }
  }

}

module.exports = new AuthController();