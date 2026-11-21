// consultas mongodb

// 1. Verificar la base de datos y los 100 documentos

use ecommerce_db
db.productos.countDocuments()

// 2. Crear la segunda colección (ventas) para poder hacer cruces ($lookup)

db.ventas.insertMany([
  { orden_id: 1001, cliente: "Carlos Pérez", producto_id: 1, cantidad: 1, total: 3500000, metodo_pago: "Tarjeta" },
  { orden_id: 1002, cliente: "Ana Gómez", producto_id: 2, cantidad: 2, total: 170000, metodo_pago: "Efectivo" },
  { orden_id: 1003, cliente: "Luis Torres", producto_id: 4, cantidad: 1, total: 750000, metodo_pago: "Transferencia" },
  { orden_id: 1004, cliente: "María Díaz", producto_id: 39, cantidad: 2, total: 380000, metodo_pago: "Tarjeta" },
  { orden_id: 1005, cliente: "Jorge Ruiz", producto_id: 72, cantidad: 1, total: 340000, metodo_pago: "Efectivo" }
])

// 3. Consultas Básicas (CRUD: Inserción, Selección, Actualización y Eliminación)

// Inserción:

db.productos.insertOne({
  producto_id: 101,
  nombre: "Dron con Cámara 4K",
  categoria: "Tecnología",
  precio: 1450000,
  stock: 12,
  activo: true
})

// Selección:

db.productos.find({ producto_id: 101 })

// Actualización:

db.productos.updateOne(
  { producto_id: 101 },
  { $set: { precio: 1350000, stock: 15 } }
)

// Eliminación

db.productos.deleteOne({ producto_id: 101 })

// 4. Consultas con Filtros y Operadores

// Filtro con operadores relacionales:

db.productos.find({
  categoria: "Tecnología",
  precio: { $gt: 500000 },
  stock: { $lt: 50 }
})

// Operador Join:

db.ventas.aggregate([
  {
    $lookup: {
      from: "productos",
      localField: "producto_id",
      foreignField: "producto_id",
      as: "info_producto"
    }
  }
])

// 5. Consultas de Agregación (Contar, Sumar y Promediar)

// Contar:

db.productos.aggregate([
  {
    $group: {
      _id: "$categoria",
      cantidad_productos: { $sum: 1 }
    }
  }
])

// Sumar:

db.productos.aggregate([
  {
    $group: {
      _id: "$categoria",
      total_unidades_stock: { $sum: "$stock" }
    }
  }
])

db.ventas.aggregate([
  { $group: { _id: "$metodo_pago", total_recaudado: { $sum: "$total" } } }
])

// Promediar:

db.productos.aggregate([
  {
    $group: {
      _id: "$categoria",
      precio_promedio: { $avg: "$precio" }
    }
  }
])
