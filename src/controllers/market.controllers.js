import { pool } from '../db.js'

export const getUsuarios=async(req,res)=>{
    try{
        const [result]=await pool.query('SELECT * FROM usuarios')
        res.json(result)
    }catch(error){
        return res.status(500).json({ message: "Algo salio mal" });
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
  
  export const getProductos=async(req,res)=>{
    try{
      const [rows] = await pool.query("SELECT * FROM productos");
      if (rows.length <= 0) {
        return res.status(404).json({ message: "No hay productos registrados" });
      }
      res.json({ productos: rows });
    }catch(error){
        return res.status(500).json({ message: "Algo salio mal" });
    }
  };

  export const getProductosId=async(req,res)=>{
    try{
      const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
      const [rows] = await pool.query("SELECT * FROM productos where id=?",[id]);
      if (rows.length <= 0) {
        return res.status(404).json({ message: "No hay productos registrados" });
      }
      res.json({ productos: rows });
    }catch(error){
        return res.status(500).json({ message: "Algo salio mal" });
    }
  };


  export const postProductos=async(req,res)=>{
    try {
      const { name, description, price_cost, price_sale,quantity,image } = req.body; 
      const [rows] = await pool.query("INSERT INTO productos (nombre,descripcion,precio_costo,precio_venta,cantidad,fotografia) VALUES (?,?,?,?,?,?)", [
        name, description, price_cost, price_sale,quantity,image
      ]);
      if (rows.length <= 0) {
        return res.status(404).json({ message: "No se ingreso el producto" });
      }
      res.json({ message: "Producto Agregado" });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salio mal'});
    }
  };

  export const putProductos = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
      const { name, description, price_cost, price_sale, quantity, image } = req.body;
  
      // Actualizar el producto en la base de datos
      const [result] = await pool.query(
        "UPDATE productos SET nombre = ?, descripcion = ?, precio_costo = ?, precio_venta = ?, cantidad = ?, fotografia = ? WHERE id = ?",
        [name, description, price_cost, price_sale, quantity, image, id]
      );
  
      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json({ message: "Producto actualizado" });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  };
  

  export const deleteProductos = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID del producto desde los parámetros de la URL
  
      // Eliminar el producto de la base de datos
      const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
  
      // Verificar si se eliminó algún registro
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  };
  
