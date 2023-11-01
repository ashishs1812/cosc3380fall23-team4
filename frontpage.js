const mysql = require('mysql2');
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const sleep = require('system-sleep');
const { connect } = require('http2');


const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 3000;
//server.listen(port);
console.debug('Server listening on port ' + port);


const connection = mysql.createConnection({
	host     : '172.25.114.132',
	user     : '',
	password : '',
	database : 'artmuseum'
}, (err , data) => {
	if (err) throw err;
	console.log(data);
});

console.log('new connection est');


app.use(cookieSession({
	secret: 'secret'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/static/frontpage.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
    //console.log(request);
	// Capture the input fields
	//response.send('checking credentials');
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty

	if (username && password) {
		//when login is by a visitor
		console.log(username.includes('.com'))
		if(username.includes('.com')) {
			// Execute SQL query that'll select the account from the database based on the specified username and password
			connection.query('SELECT * FROM visitor WHERE EMAIL = ? AND PASSWORD = ?', [username, password], function(error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				console.log(error);
				// If the account exists
				if (results.length > 0) {

						// Authenticate the user
						request.session.loggedin = true;
						request.session.username = username;
						// Redirect to visitor front page
						response.redirect('/visitor_login_frontpage.html');
				} 
				else {
						response.send('Incorrect Username and/or Password!');
				}			
				response.end();
			});
		}
		//when login is by an employee,manager
		else {
			connection.query('SELECT * FROM employee WHERE EMPLOYEE_ID = ? AND PASSWORD = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			console.log(error);
			// If the account exists
			if (results.length > 0) {
				//checks the 'role' attribute of the employee table 
				if(results.at(0)['ROLE'] === 'manager') {
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;
					// Redirect to manager front page
					response.redirect('/manager_login_frontpage.html');
				}
				else if(results.at(0)['ROLE'] === 'employee') {
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;
					// Redirect to employee front page
					response.redirect('/employee_login_frontpage.html');	

				}
			}
			else {
					response.send('Incorrect Username and/or Password!');
				}			
				response.end();
			});			
		}
		
	} 
	else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});





app.listen(3000, '0.0.0.0');
