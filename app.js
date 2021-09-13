const express = require('express')
const expressHandlebars = require('express-handlebars')

const products = [{
	id: 1,
	name: "Book",
	description: "A very good book."
},{
	id: 2,
	name: "Movie",
	description: "A very good movie."
},{
	id: 3,
	name: "Computer",
	description: "A very good computer (not Mac)."
}]

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
	const model = {
		products
	}
	response.render('products.hbs', model)
})

// /products/3
app.get('/products/:id', function(request, response){
	const id = request.params.id
	const product = products.find((p) => p.id == id)
	const model = {
		product
	}
	response.render('product.hbs', model)
})

app.listen(8080)