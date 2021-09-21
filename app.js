const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite = require('sqlite3')

const db = new sqlite.Database('peter-ab.db')

db.run(`
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		description TEXT
	)
`)

const app = express()

app.use(express.static('static'))

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.get('/', function(request, response){
	response.render('start.hbs')
})

app.get('/about', function(request, response){
	response.render('about.hbs')
})

app.get('/products', function(request, response){
	
	db.all("SELECT * FROM products", function(error, products){
		
		if(error){
			
			const model = {
				hasDatabaseError: true,
				products: []
			}
			response.render('products.hbs', model)
			
		}else{
			
			const model = {
				hasDatabaseError: false,
				products
			}
			response.render('products.hbs', model)
			
		}
		
	})
	
})

// /products/3
app.get('/products/:id', function(request, response){
	
	const id = request.params.id
	
	const query = "SELECT * FROM products WHERE id = ? LIMIT 1"
	const values = [id]
	
	db.get(query, values, function(error, product){
		const model = {
			product
		}
		response.render('product.hbs', model)
	})
	
})

app.listen(8080)