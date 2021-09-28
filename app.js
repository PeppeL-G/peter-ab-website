const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite = require('sqlite3')

const MIN_NAME_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 5

function getValidationErrors(name, description){
	
	const validationErrors = []
	
	if(name.length < MIN_NAME_LENGTH){
		validationErrors.push("The name needs to be at least "+MIN_NAME_LENGTH+" characters.")
	}
	
	if(description.length < MIN_DESCRIPTION_LENGTH){
		validationErrors.push("The description needs to be at least "+MIN_DESCRIPTION_LENGTH+" characters.")
	}
	
	return validationErrors
	
}

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

app.use(express.urlencoded({
	extended: false
}))

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

app.get('/products/create', function(request, response){
	response.render('create-product.hbs')
})

app.post('/products/create', function(request, response){
	
	const name = request.body.name
	const description = request.body.description
	
	const errors = getValidationErrors(name, description)
	
	if(errors.length == 0){
		
		const query = "INSERT INTO products (name, description) VALUES (?, ?)"
		const values = [name, description]
		
		db.run(query, values, function(error){
			
			if(error){
				
				errors.push("Internal server error.")
				
				const model = {
					errors,
					name,
					description
				}
				
				response.render('create-product.hbs', model)
				
			}else{
				
				const id = this.lastID
				response.redirect('/products/'+id)
				
			}
			
		})
		
	}else{
		
		const model = {
			errors,
			name,
			description
		}
		
		response.render('create-product.hbs', model)
		
	}
	
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