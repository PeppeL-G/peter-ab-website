const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite = require('sqlite3')
const expressSession = require('express-session')

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

app.use(expressSession({
	secret: "asdsasdadsasdasdasds",
	saveUninitialized: false,
	resave: false,
	// TODO: Save the sessions in a session store.
}))

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.use(function(request, response, next){
	// Make the session available to all views.
	response.locals.session = request.session
	next()
})

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
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
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

function getProductById(id, callback){
	
	const query = "SELECT * FROM products WHERE id = ? LIMIT 1"
	const values = [id]
	
	db.get(query, values, function(error, product){
		callback(error, product)
	})
	
}

// /products/3
app.get('/products/:id', function(request, response){
	
	const id = request.params.id
	
	getProductById(id, function(error, product){
		// TODO: Handle error.
		const model = {
			product
		}
		response.render('product.hbs', model)
	})
	
})

app.get('/products/:id/update', function(request, response){
	
	const id = request.params.id
	
	getProductById(id, function(error, product){
		
		// TODO: Handle error.
		
		const model = {
			product
		}
		
		response.render('update-product.hbs', model)
		
	})
	
})

app.post('/products/:id/update', function(request, response){
	
	const id = request.params.id
	const name = request.body.name
	const description = request.body.description
	
	const errors = getValidationErrors(name, description)
	
	if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
	
	if(errors.length == 0){
		
		const query = "UPDATE products SET name = ?, description = ? WHERE id = ?"
		const values = [name, description, id]
		
		db.run(query, values, function(error){
			
			// TODO: Handle error.
			
			response.redirect('/products/'+id)
			
		})
		
	}else{
		
		const model = {
			errors,
			product: {
				id,
				name,
				description
			}
		}
		
		response.render('update-product.hbs', model)
		
	}
	
})

app.get('/products/:id/delete', function(request, response){
	
	const id = request.params.id
	
	getProductById(id, function(error, product){
		
		// TODO: Handle error.
		
		const model = {
			product
		}
		
		response.render('delete-product.hbs', model)
		
	})
	
})

app.post('/products/:id/delete', function(request, response){
	
	const id = request.params.id
	
	// TODO: Check if the user is logged in, and only carry
	// out the request if the user is.
	
	const query = "DELETE FROM products WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
		
		// TODO: Handle error.
		
		response.redirect('/products')
		
	})
	
})

app.get('/login', function(request, response){
	response.render('login.hbs')
})

app.post('/login', function(request, response){
	
	const username = request.body.username
	const password = request.body.password
	
	// TODO: Don't use hardcoded values.
	if(username == 'Alice' && password == 'abc123'){
		request.session.isLoggedIn = true
		// TODO: Do something better than redirecting to start page.
		response.redirect('/')
	}else{
		// TODO: Display error message to the user.
		response.render('login.hbs')
	}
	
})

app.listen(8080)