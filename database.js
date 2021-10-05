const sqlite = require('sqlite3')
const db = new sqlite.Database('peter-ab.db')

db.run(`
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		description TEXT
	)
`)

exports.getAllProducts = function(callback){
	
	const query = "SELECT * FROM products"
	
	db.all(query, function(error, products){
		callback(error, products)
	})
	
}

exports.createProduct = function(name, description, callback){
	
	const query = "INSERT INTO products (name, description) VALUES (?, ?)"
	const values = [name, description]
	
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
	
}

exports.getProductById = function(id, callback){
	
	const query = "SELECT * FROM products WHERE id = ? LIMIT 1"
	const values = [id]
	
	db.get(query, values, function(error, product){
		callback(error, product)
	})
	
}

exports.updateProductById = function(id, name, description, callback){
	
	const query = "UPDATE products SET name = ?, description = ? WHERE id = ?"
	const values = [name, description, id]
	
	db.run(query, values, function(error){
		callback(error)
	})
	
}

exports.deleteProductById = function(id, callback){
	
	const query = "DELETE FROM products WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
		callback(error)
	})
	
}