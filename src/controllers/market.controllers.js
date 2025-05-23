import { pool } from '../db.js'



// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM usuarios')
        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const getUsuario = async (req, res) => {
    try {
      const { username, password } = req.body; 
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE nombre = ? AND clave = ?", [
        username, password
      ]);
      if (rows.length <= 0) {
        return res.status(404).json({ message: "Usuario no Encontrado" });
      }
      res.json({ message: "Encontrado" });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salio mal'});
    }
  };
// Obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos");
        
        if (rows.length <= 0) {
            return res.status(404).json({ message: "No hay productos registrados" });
        }
        
        res.json(rows);
        
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener productos" });
    }
};

// Obtener producto por ID
export const getProductosId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
        
        if (rows.length <= 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.json(rows[0]);
        
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el producto" });
    }
};

// Crear nuevo producto (MANTENIENDO fototgrafia)
export const postProductos = async (req, res) => {
    try {
        const { name, description, price_cost, price_sale, quantity, image } = req.body;

        // Consultar el último ID
        const [result] = await pool.query("SELECT MAX(id) AS last_id FROM productos");
        const lastId = result[0].last_id || 0;
        const newId = lastId + 1;

        // Insertar nuevo producto (manteniendo fototgrafia)
        const [insertResult] = await pool.query(
            "INSERT INTO productos (id, nombre, descripcion, precio_costo, precio_venta, cantidad, fototgrafia) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [newId, name, description, price_cost, price_sale, quantity, image || ""]
        );

        if (insertResult.affectedRows > 0) {
            res.status(201).json({ 
                message: "Producto agregado exitosamente", 
                id: newId,
                product: { id: newId, name, description, price_cost, price_sale, quantity, image }
            });
        } else {
            res.status(400).json({ message: "No se pudo agregar el producto" });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
};

export const putProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price_cost, price_sale, quantity, image } = req.body;

        // 1. Validar datos requeridos
        if (!name || !description || isNaN(price_cost) || isNaN(price_sale) || isNaN(quantity)) {
            return res.status(400).json({ 
                message: "Datos inválidos",
                details: "Todos los campos son requeridos y los precios/cantidad deben ser números"
            });
        }

        // 2. Verificar que el producto existe
        const [product] = await pool.query("SELECT id FROM productos WHERE id = ?", [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
        }

        // 3. Actualizar (¡Asegúrate que los nombres coincidan con tu DB!)
        const [result] = await pool.query(
            `UPDATE productos SET 
                nombre = ?, 
                descripcion = ?, 
                precio_costo = ?, 
                precio_venta = ?, 
                cantidad = ?, 
                fototgrafia = ? 
             WHERE id = ?`,
            [name, description, parseFloat(price_cost), parseFloat(price_sale), parseInt(quantity), image || "", id]
        );

        // 4. Respuesta
        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "No se realizaron cambios" });
        }

        // Devuelve el producto actualizado
        const [updatedProduct] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
        res.json({
            message: "Producto actualizado con éxito",
            product: updatedProduct[0]
        });

    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: error.message  // Esto muestra el error real (útil para depurar)
        });
    }
};
// Eliminar producto
export const deleteProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.json({ message: "Producto eliminado exitosamente" });
        
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};
