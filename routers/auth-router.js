const express = require('express')

const ADMIN_USERNAME = 'Alice'
const ADMIN_PASSWORD = 'abc123'

const router = express.Router()

router.get('/login', function(request, response){
	response.render('login.hbs')
})

router.post('/login', function(request, response){
	
	const username = request.body.username
	const password = request.body.password
	
	if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
		request.session.isLoggedIn = true
		// TODO: Do something better than redirecting to start page.
		response.redirect('/')
	}else{
		// TODO: Display error message to the user.
		response.render('login.hbs')
	}
	
})

module.exports = router