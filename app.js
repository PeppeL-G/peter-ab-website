const express = require('express')
const expressHandlebars = require('express-handlebars')

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
	response.render('products.hbs')
})

app.listen(8080)