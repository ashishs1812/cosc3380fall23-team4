const mysql = require('mysql2');
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const { connect } = require('http2');


const http = require('http');

const app = express();
const server = http.createServer(app);
const port = 3000;
//server.listen(port);
console.debug('Server listening on port ' + port);


const connection = mysql.createConnection({
	host     : '172.17.41.205', 			// REPLACE with your current 'IPv4 address' 
	user     : 'root',
	password : 'absingh3COSC3380',		// REPLACE with your own MySQL Workbench root password
	database : 'museum'
}, (err , data) => {
	if (err) throw err;
	console.log(data);
});

console.log('new site connection est at:' + Date.now());


app.use(express.static(__dirname + '/static'));
app.set('view engine', 'ejs');

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
    
	// Capture the input fields
	
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty

	if (username && password) {
		//when login is by a visitor
		console.log(username.includes('.com'))
		if(username.includes('.com')) {
			// Execute SQL query that'll select the account from the database based on the specified username and password
			connection.query('SELECT * FROM visitor WHERE EMAIL = ? && VISIT_ID=?', [username, password], function(error, results, fields) {
				// If there is an issue with the query, output the error
			
				if (error) throw error;
				console.log(error);
				// If the account exists
				if (results.length > 0) {
					
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;
					request.session.id = password;

					var d = new Date();
					var dat = (d.getMonth() + 1) + "-" + d.getDate() + "-" + (d.getFullYear());

					request.session.dat = dat;
					
					// Redirect to visitor front page
					console.log('new visitor login est at:' + Date.now());
					console.log(request.session.dat);

					
					var vals = "";
					// load the 'Museum Update' messages from the 'visitor_newaddition_messages' table 
					connection.query('SELECT * FROM visitor_newaddition_messages ORDER BY ADDITION_DATE DESC' , function(error, results, fields) {
						if (error) throw error;
						console.log(error);
						if(results.length > 0) {	// there are update messages
							for (let i = 0; i < results.length; i++) {                                                                                   
								vals+= "<tr><td>" + results.at(i)['ADDITION_DATE'] + "</td><td>" + results.at(i)['ADDITION_MESSAGE'] +  "</td></tr>";
							}
						}
						else {    // there are no update messages
							vals+= "<tr><td> There are currently no Museum Update Messages!</td></tr>";
						}
						response.render('visitor_login_frontpage', {values: vals});
						response.end();
					});
					
				} 
				else {
					//alert('Incorrect Username and/or Password!');
					console.log('new login FAIL est at:' + Date.now());
					const val = 'Incorrect Username and/or Password!';
					response.render('loginerror', {values: val});
					response.end();
				}			
				
			});
		}
		//when login is by an employee, manager
		else {
			connection.query('SELECT * FROM employee WHERE EMPLOYEE_ID = ? AND LNAME = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			console.log(error);
			// If the account exists
			if (results.length > 0) {
				//checks the 'role' attribute of the employee table 
				if(results.at(0)['ROLL'] === 'Manager') {
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;
					// Redirect to manager front page
					console.log('new manager login at:' + Date.now());
					response.redirect('/manager_reports.html');
					
				}
				else if(results.at(0)['ROLL'] === 'Curator') {
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;


					
					console.log("new employee 'curator' login at:" + Date.now());	
					// Redirect to curator front page
					response.redirect('/employee_artwork_alt.html');
					response.end();

				}
				else if(results.at(0)['ROLL'] === 'Gift Shop') {
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;

					const notResolved = 'no';
					var vals = "";
					var msg = "";
					
					// load the Gift Shop employee front page

					console.log("new employee 'gift shop' login at:" + Date.now());
					response.redirect('/load_giftshop_login_frontpage.html');
					response.end();
			
				}
				else if(results.at(0)['ROLL'] === 'Theater'){
					// Authenticate the user
					request.session.loggedin = true;
					request.session.username = username;

					

					// load the Theater employee front page

					console.log("new employee 'theater' login at:" + Date.now());
					response.redirect('/employee_filmalt.html');
					response.end();
						
				}
				
			}
			else {
					//alert('Incorrect Username and/or Password!');

					const val = 'Incorrect Username and/or Password!';
					console.log('new login FAIL est at:' + Date.now());
					response.render('loginerror', {values: val});
					response.end();
				}			
				
			});			
		}
		
	} 
	else {
		//alert('Please enter Username and Password!');
		const val = 'Please enter Username and Password!';
		response.render('loginerror', {values: val});
		response.end();
		
	}
	
});



app.post('/visitorartworksearch', function(request, response) {
    
	var vals = "";
	if(typeof request.body.searchbutton === "undefined"){ //when searchall is clicked and not search
		connection.query('SELECT * FROM books_and_manuscripts UNION SELECT * FROM ceramics UNION SELECT * FROM costumes_and_accessories UNION SELECT * FROM jewelry UNION SELECT * FROM metalworks UNION SELECT * FROM painting UNION SELECT * FROM photography UNION SELECT * FROM sculptures UNION SELECT * FROM timepieces', function(error, results, fields) {
			if (error) console.log(error);
			if(results.length > 0) {
				for(let i = 0; i < results.length; i++) {
					if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
					}
				}
				response.render("visitor_artwork_viewdata", {values: vals});
				response.end();
			}
			// when zero rows returned
			else {
				vals = "<tr><td> NO RESULTS </td></tr>";
				response.render("visitor_artwork_viewdata", {values: vals});
				response.end();
			} 
		});
		
	}
	else {
		if(request.body.searchbutton.includes('Title')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE TITLE LIKE ? UNION SELECT * FROM ceramics WHERE TITLE LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE TITLE LIKE ? UNION SELECT * FROM jewelry WHERE TITLE LIKE ? UNION SELECT * FROM metalworks WHERE TITLE LIKE ? UNION SELECT * FROM painting WHERE TITLE LIKE ? UNION SELECT * FROM photography WHERE TITLE LIKE ? UNION SELECT * FROM sculptures WHERE TITLE LIKE ? UNION SELECT * FROM timepieces WHERE TITLE LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
							vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
						}
					}
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Creator')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE CREATOR LIKE ? UNION SELECT * FROM ceramics WHERE CREATOR LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE CREATOR LIKE ? UNION SELECT * FROM jewelry WHERE CREATOR LIKE ? UNION SELECT * FROM metalworks WHERE CREATOR LIKE ? UNION SELECT * FROM painting WHERE CREATOR LIKE ? UNION SELECT * FROM photography WHERE CREATOR LIKE ? UNION SELECT * FROM sculptures WHERE CREATOR LIKE ? UNION SELECT * FROM timepieces WHERE CREATOR LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
							vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
						}
					}
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Date of Creation')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM ceramics WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM jewelry WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM metalworks WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM painting WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM photography WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM sculptures WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM timepieces WHERE DATE_OF_CREATION LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
							vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
						}
					}
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Country of Origin')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM ceramics WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM jewelry WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM metalworks WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM painting WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM photography WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM sculptures WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM timepieces WHERE COUNTRY_OF_ORIGIN LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
							vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
						}
					}
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Culture')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE CULTURE LIKE ? UNION SELECT * FROM ceramics WHERE CULTURE LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE CULTURE LIKE ? UNION SELECT * FROM jewelry WHERE CULTURE LIKE ? UNION SELECT * FROM metalworks WHERE CULTURE LIKE ? UNION SELECT * FROM painting WHERE CULTURE LIKE ? UNION SELECT * FROM photography WHERE CULTURE LIKE ? UNION SELECT * FROM sculptures WHERE CULTURE LIKE ? UNION SELECT * FROM timepieces WHERE CULTURE LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
							vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
						}
					}
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}	
		else if(request.body.searchbutton.includes('Medium')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE M_EDIUM LIKE ? UNION SELECT * FROM ceramics WHERE M_EDIUM LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE M_EDIUM LIKE ? UNION SELECT * FROM jewelry WHERE M_EDIUM LIKE ? UNION SELECT * FROM metalworks WHERE M_EDIUM LIKE ? UNION SELECT * FROM painting WHERE M_EDIUM LIKE ? UNION SELECT * FROM photography WHERE M_EDIUM LIKE ? UNION SELECT * FROM sculptures WHERE M_EDIUM LIKE ? UNION SELECT * FROM timepieces WHERE M_EDIUM LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						if(results.at(i)['DELETED'] === 0) { //only display entries not marked as deleted
							vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED'] + "</td><td>" + results.at(i)['DEPT_NUM']+ "</td></tr>";
						}
					}
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("visitor_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
	}
    
});	

app.post('/employeeartworksearch', function(request, response) { // employee is allowed to see all entries, even if flagged for deletion

	var vals = "";
	if(typeof request.body.searchbutton === "undefined" &&  typeof request.body.searchnullbutton === "undefined"){ //when searchall is clicked and not search or searchnull
		connection.query('SELECT * FROM books_and_manuscripts UNION SELECT * FROM ceramics UNION SELECT * FROM costumes_and_accessories UNION SELECT * FROM jewelry UNION SELECT * FROM metalworks UNION SELECT * FROM painting UNION SELECT * FROM photography UNION SELECT * FROM sculptures UNION SELECT * FROM timepieces', function(error, results, fields) {
			if (error) console.log(error);
			if(results.length > 0) {
				for(let i = 0; i < results.length; i++) {
					// employee is allowed to see all entires, even if flagged for deletion
					vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
				}
				response.render("employee_artwork_viewdata", {values: vals});
				response.end();
			}
			// when zero rows returned
			else {
				vals = "<tr><td> NO RESULTS </td></tr>";
				response.render("employee_artwork_viewdata", {values: vals});
				response.end();
			} 
		});
		
	}
	else if(typeof request.body.searchnullbutton === "undefined" && typeof request.body.searchallbutton === "undefined"){  //when search is clicked and not searchnull or searchall
		if(request.body.searchbutton.includes('Title')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE TITLE LIKE ? UNION SELECT * FROM ceramics WHERE TITLE LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE TITLE LIKE ? UNION SELECT * FROM jewelry WHERE TITLE LIKE ? UNION SELECT * FROM metalworks WHERE TITLE LIKE ? UNION SELECT * FROM painting WHERE TITLE LIKE ? UNION SELECT * FROM photography WHERE TITLE LIKE ? UNION SELECT * FROM sculptures WHERE TITLE LIKE ? UNION SELECT * FROM timepieces WHERE TITLE LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Creator')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE CREATOR LIKE ? UNION SELECT * FROM ceramics WHERE CREATOR LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE CREATOR LIKE ? UNION SELECT * FROM jewelry WHERE CREATOR LIKE ? UNION SELECT * FROM metalworks WHERE CREATOR LIKE ? UNION SELECT * FROM painting WHERE CREATOR LIKE ? UNION SELECT * FROM photography WHERE CREATOR LIKE ? UNION SELECT * FROM sculptures WHERE CREATOR LIKE ? UNION SELECT * FROM timepieces WHERE CREATOR LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Date of Creation')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM ceramics WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM jewelry WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM metalworks WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM painting WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM photography WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM sculptures WHERE DATE_OF_CREATION LIKE ? UNION SELECT * FROM timepieces WHERE DATE_OF_CREATION LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Country of Origin')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM ceramics WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM jewelry WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM metalworks WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM painting WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM photography WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM sculptures WHERE COUNTRY_OF_ORIGIN LIKE ? UNION SELECT * FROM timepieces WHERE COUNTRY_OF_ORIGIN LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchbutton.includes('Culture')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE CULTURE LIKE ? UNION SELECT * FROM ceramics WHERE CULTURE LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE CULTURE LIKE ? UNION SELECT * FROM jewelry WHERE CULTURE LIKE ? UNION SELECT * FROM metalworks WHERE CULTURE LIKE ? UNION SELECT * FROM painting WHERE CULTURE LIKE ? UNION SELECT * FROM photography WHERE CULTURE LIKE ? UNION SELECT * FROM sculptures WHERE CULTURE LIKE ? UNION SELECT * FROM timepieces WHERE CULTURE LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}	
		else if(request.body.searchbutton.includes('Medium')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE M_EDIUM LIKE ? UNION SELECT * FROM ceramics WHERE M_EDIUM LIKE ? UNION SELECT * FROM costumes_and_accessories WHERE M_EDIUM LIKE ? UNION SELECT * FROM jewelry WHERE M_EDIUM LIKE ? UNION SELECT * FROM metalworks WHERE M_EDIUM LIKE ? UNION SELECT * FROM painting WHERE M_EDIUM LIKE ? UNION SELECT * FROM photography WHERE M_EDIUM LIKE ? UNION SELECT * FROM sculptures WHERE M_EDIUM LIKE ? UNION SELECT * FROM timepieces WHERE M_EDIUM LIKE ?', ['%' + request.body.inputfield + '%','%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%', '%' + request.body.inputfield + '%' ], function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
	}
	else if(typeof request.body.searchbutton === "undefined" && typeof request.body.searchallbutton === "undefined"){  //when searchnull is clicked and not search or searchall
		if(request.body.searchnullbutton.includes('Title')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE TITLE IS NULL UNION SELECT * FROM ceramics WHERE TITLE IS NULL UNION SELECT * FROM costumes_and_accessories WHERE TITLE IS NULL UNION SELECT * FROM jewelry WHERE TITLE IS NULL UNION SELECT * FROM metalworks WHERE TITLE IS NULL UNION SELECT * FROM painting WHERE TITLE IS NULL UNION SELECT * FROM photography WHERE TITLE IS NULL UNION SELECT * FROM sculptures WHERE TITLE IS NULL UNION SELECT * FROM timepieces WHERE TITLE IS NULL', function(error, results, fields) {
				if (error) console.log(error);
				console.log(results); 

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchnullbutton.includes('Creator')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE CREATOR IS NULL UNION SELECT * FROM ceramics WHERE CREATOR IS NULL UNION SELECT * FROM costumes_and_accessories WHERE CREATOR IS NULL UNION SELECT * FROM jewelry WHERE CREATOR IS NULL UNION SELECT * FROM metalworks WHERE CREATOR IS NULL UNION SELECT * FROM painting WHERE CREATOR IS NULL UNION SELECT * FROM photography WHERE CREATOR IS NULL UNION SELECT * FROM sculptures WHERE CREATOR IS NULL UNION SELECT * FROM timepieces WHERE CREATOR IS NULL',  function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchnullbutton.includes('Date of Creation')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM ceramics WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM costumes_and_accessories WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM jewelry WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM metalworks WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM painting WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM photography WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM sculptures WHERE DATE_OF_CREATION IS NULL UNION SELECT * FROM timepieces WHERE DATE_OF_CREATION IS NULL', function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchnullbutton.includes('Country of Origin')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM ceramics WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM costumes_and_accessories WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM jewelry WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM metalworks WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM painting WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM photography WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM sculptures WHERE COUNTRY_OF_ORIGIN IS NULL UNION SELECT * FROM timepieces WHERE COUNTRY_OF_ORIGIN IS NULL',  function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
		else if(request.body.searchnullbutton.includes('Culture')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE CULTURE IS NULL UNION SELECT * FROM ceramics WHERE CULTURE IS NULL UNION SELECT * FROM costumes_and_accessories WHERE CULTURE IS NULL UNION SELECT * FROM jewelry WHERE CULTURE IS NULL UNION SELECT * FROM metalworks WHERE CULTURE IS NULL UNION SELECT * FROM painting WHERE CULTURE IS NULL UNION SELECT * FROM photography WHERE CULTURE IS NULL UNION SELECT * FROM sculptures WHERE CULTURE IS NULL UNION SELECT * FROM timepieces WHERE CULTURE IS NULL', function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}	
		else if(request.body.searchnullbutton.includes('Medium')) {
			connection.query('SELECT * FROM books_and_manuscripts WHERE M_EDIUM IS NULL UNION SELECT * FROM ceramics WHERE M_EDIUM IS NULL UNION SELECT * FROM costumes_and_accessories WHERE M_EDIUM IS NULL UNION SELECT * FROM jewelry WHERE M_EDIUM IS NULL UNION SELECT * FROM metalworks WHERE M_EDIUM IS NULL UNION SELECT * FROM painting WHERE M_EDIUM IS NULL UNION SELECT * FROM photography WHERE M_EDIUM IS NULL UNION SELECT * FROM sculptures WHERE M_EDIUM IS NULL UNION SELECT * FROM timepieces WHERE M_EDIUM IS NULL', function(error, results, fields) {
				if (error) console.log(error);
				console.log(results);

				if(results.length > 0) {
					for(let i = 0; i < results.length; i++) {
						// employee is allowed to see all entires, even if flagged for deletion
						vals += "<tr><td>" + results.at(i)['TITLE'] + "</td><td>" + results.at(i)['CREATOR'] + "</td><td>" + results.at(i)['DATE_OF_CREATION'] + "</td><td>" + results.at(i)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(i)['CULTURE'] + "</td><td>" + results.at(i)['M_EDIUM'] + "</td><td>" + results.at(i)['DIMENSIONS'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['ART_ID']+ "</td><td>" + results.at(i)['EXHIB_NUM'] + "</td><td>" + results.at(i)['BORROWED']+ "</td><td>" + results.at(i)['DEPT_NUM'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>"; // DELETED now visible 
					}
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				}
				// when zero rows returned
				else {
					vals = "<tr><td> NO RESULTS </td></tr>";
					response.render("employee_artwork_viewdata", {values: vals});
					response.end();
				} 
			});
		}
	}
	


});	
app.post('/employeeartworkalteration', function(request, response) {
	
	var vals="";
	connection.query('SELECT * FROM books_and_manuscripts WHERE ART_ID=? UNION SELECT * FROM ceramics WHERE ART_ID=? UNION SELECT * FROM costumes_and_accessories WHERE ART_ID=? UNION SELECT * FROM jewelry WHERE ART_ID=? UNION SELECT * FROM metalworks WHERE ART_ID=? UNION SELECT * FROM painting WHERE ART_ID=? UNION SELECT * FROM photography WHERE ART_ID=? UNION SELECT * FROM sculptures WHERE ART_ID=? UNION SELECT * FROM timepieces WHERE ART_ID=?',[ request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield , request.body.artworkidfield ] ,function(error, results, fields) {
		if (error) console.log(error);
		if(results.length > 0) { // if the entered artwork ID is valid
			vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>"; // DELETED now visible 
			response.render("employee_artwork_altfromsearch", {values: vals});
			response.end();
		}
		else{ // when its not
			response.send("INVALID ARTWORK ID. PLEASE RETURN TO THE PREVIOUS PAGE.");
			response.end();

		}
	});
});
app.post('/employeeartworkalt', function(request, response){
	var vals ="";
	if(typeof request.body.addbutton === "undefined") {// when the Update button is clicked and not the Add button
		// check if update data is validated 
		if(request.body.updatebutton === "1") {

			// validate if art ID exists 
			connection.query('SELECT * FROM books_and_manuscripts WHERE ART_ID=? UNION SELECT * FROM ceramics WHERE ART_ID=? UNION SELECT * FROM costumes_and_accessories WHERE ART_ID=? UNION SELECT * FROM jewelry WHERE ART_ID=? UNION SELECT * FROM metalworks WHERE ART_ID=? UNION SELECT * FROM painting WHERE ART_ID=? UNION SELECT * FROM photography WHERE ART_ID=? UNION SELECT * FROM sculptures WHERE ART_ID=? UNION SELECT * FROM timepieces WHERE ART_ID=?',[request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput ] ,function(error, results, fields) {
				if(error) console.log(error);
				if(results.length > 0){ // art ID exists.. continue to update
						var querystring = {};
						var endquery = {};
						var title = request.body.titleInput;
						var creator = request.body.creatorNameInput;
						var date = request.body.creationDateInput;
						var country = request.body.countryInput;
						var culture = request.body.cultureInput;
						var medium = request.body.mediumInput;
						var dimensions = request.body.dimensionsInput;
						var description = request.body.descriptionInput;
						var exhib = request.body.exhibInput;
						var external = request.body.externalCollectionIDInput;
						var dept = request.body.deptInput;
						var deleted = request.body.deletedInput;

						if(!(request.body.titleInput == "")){
							querystring['TITLE'] = title;
	
						}
						if(!(request.body.creatorInput == "")){
							querystring['CREATOR'] = creator;
	
						}
						if(!(request.body.creationDateInput == "")){
							querystring['DATE_OF_CREATION'] = date;
	
						}
						if(!(request.body.countryInput == "")){
							querystring['COUNTRY_OF_ORIGIN'] = country;
	
						}
						if(!(request.body.cultureInput == "")){
							querystring['CULTURE'] = culture;
	
						}
						if(!(request.body.mediumInput == "")){
							querystring['M_EDIUM'] = medium;
	
						}
						if(!(request.body.dimensionsInput == "")){
							querystring['DIMENSIONS'] = dimensions;
	
						}
						if(!(request.body.descriptionInput == "")){
							querystring['DESCRIPT'] = description;
	
						}
						if(!(request.body.exhibInput == "")){
							querystring['EXHIB_NUM'] = exhib;
	
						}
						if(!(request.body.externalCollectionIDInput == "")){
							querystring['BORROWED'] = external;
	
						}
						if(!(request.body.deptInput == "")){
							querystring['DEPT_NUM'] = dept;
	
						}
						if(!(request.body.deletedInput == "")){
							querystring['DELETED'] = deleted;
	
						}
	
							
						endquery['ART_ID'] = request.body.artIDInput;
						if(results.at(0)['ART_ID'].includes('B')) {	// when artwork is in "books_and_manuscripts" table
		
							connection.query('UPDATE books_and_manuscripts SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('C')) {	// when artwork is in "ceramics" table
		
							connection.query('UPDATE ceramics SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.itemIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('A')) {	// when artwork is in "costumes_and_accessories" table
		
							connection.query('UPDATE costumes_and_accessories SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('J')) {	// when artwork is in "jewelry" table
		
							connection.query('UPDATE jewelry SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('M')) {	// when artwork is in "metalworks" table
		
							connection.query('UPDATE metalworks SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('P')) {	// when artwork is in "painting" table
		
							connection.query('UPDATE painting SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('G')) {	// when artwork is in "photography" table
		
							connection.query('UPDATE photography SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('S')) {	// when artwork is in "sculptures" table
		
							connection.query('UPDATE sculptures SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}
						if(results.at(0)['ART_ID'].includes('T')) {	// when artwork is in "timepieces" table
		
							connection.query('UPDATE timepieces SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
								if(error) console.log(error);
								vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Artwork " + request.body.artIDInput +  "</td></tr>";
								response.render("employee_artwork_altvalid", {values: vals});
								response.end();
	
							});					
						}


				}
				else {    //Artwork does not exist
					vals+= "<tr><td> Artwork ID does not exist. Please enter an existing ID. </td></tr>";
					
					response.render("employee_artwork_altvalid", {values: vals});
					response.end()					
				}
			});
		}
		else { // when update data not validated first
			response.send("MUST VALIDATE UPDATE. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE UPDATE.");
			response.end();
		}
	}
	else if(typeof request.body.updatebutton === "undefined") { // when the Add button is clicked and not the Update button
		// check if validated first
		if(request.body.addbutton.includes("1")){
			// validate if art ID exists 
			connection.query('SELECT * FROM books_and_manuscripts WHERE ART_ID=? UNION SELECT * FROM ceramics WHERE ART_ID=? UNION SELECT * FROM costumes_and_accessories WHERE ART_ID=? UNION SELECT * FROM jewelry WHERE ART_ID=? UNION SELECT * FROM metalworks WHERE ART_ID=? UNION SELECT * FROM painting WHERE ART_ID=? UNION SELECT * FROM photography WHERE ART_ID=? UNION SELECT * FROM sculptures WHERE ART_ID=? UNION SELECT * FROM timepieces WHERE ART_ID=?',[request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput , request.body.artIDInput ] ,function(error, results, fields) {
				if(error) console.log(error);
				if(results.length > 0){ // art ID exists.. error
					response.send("ART ID ALREADY EXISTS. PLEASE RETURN TO THE PREVIOUS PAGE AND VALIDATE UPDATE");
					response.end();

				}
				else {	// art ID doesn't exist....proceed with Add
	
					if(results.at(0)['ART_ID'].includes('P')){	// when the artwork goes in 'painting' table
						connection.query('INSERT INTO painting VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM painting WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('B')) { // when the artwork goes in 'books_and_manuscripts' table
						connection.query('INSERT INTO books_and_manuscripts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM books_and_manuscripts WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('C')) { // when the artwork goes in 'ceramics' table
						connection.query('INSERT INTO ceramics VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM ceramics WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('A')) { // when the artwork goes in 'costumes_and_accessories' table
						connection.query('INSERT INTO costumes_and_accessories VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM costumes_and_accessories WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('J')) { // when the artwork goes in 'jewelry' table
						connection.query('INSERT INTO jewelry VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM jewelry WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('M')) { // when the artwork goes in 'metalworks' table
						connection.query('INSERT INTO metalworks VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM metalworks WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('G')) { // when the artwork goes in 'photography' table
						connection.query('INSERT INTO photography VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM photography WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('S')) { // when the artwork goes in 'sculptures' table
						connection.query('INSERT INTO sculptures VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM sculptures WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
					else if(results.at(0)['ART_ID'].includes('T')) { // when the artwork is in 'timepieces' table
						connection.query('INSERT INTO timepieces VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ request.body.titleInput, request.body.creatorNameInput, request.body.creationDateInput, request.body.countryInput, request.body.cultureInput, request.body.mediumInput, request.body.dimensionsInput, request.body.descriptionInput, request.body.artIDInput, request.body.exhibInput,  request.body.externalCollectionIDInput, request.body.deptInput, request.body.deletedInput], function(error, results, fields) {
                            if (error){
                                console.log(error);
                                vals+="<tr><td>ADD FAILED - Invalid Art ID</td></tr>";
                                response.render("employee_artwork_altvalid", {values: vals});
                                response.end();
                            }
                            else {
                                connection.query('SELECT * FROM costumes_and_accessories WHERE ART_ID=?', [request.body.artIDInput], function(error, results, fields) {
                                    if (error) console.log(results);
                                    vals += "<tr><td>ADD SUCCESSFUL - Artwork " + request.body.artIDInput +"</td></tr>";
                                    vals += "<tr><td>" + results.at(0)['TITLE'] + "</td><td>" + results.at(0)['CREATOR'] + "</td><td>" + results.at(0)['DATE_OF_CREATION'] + "</td><td>" + results.at(0)['COUNTRY_OF_ORIGIN'] + "</td><td>" + results.at(0)['CULTURE'] + "</td><td>" + results.at(0)['M_EDIUM'] + "</td><td>" + results.at(0)['DIMENSIONS'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['ART_ID']+ "</td><td>" + results.at(0)['EXHIB_NUM'] + "</td><td>" + results.at(0)['BORROWED']+ "</td><td>" + results.at(0)['DEPT_NUM'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";

                                    response.render("employee_artwork_altvalid", {values: vals});
                                    response.end();
                                });
                            }
                   	    });
                    }
                    else {  // when Art ID is not valid
                        vals+="<tr><td>ADD FAILED - Invalid Art ID, valid starting letters are P, B, C, A, J, M, G, S, T.</td></tr>";
                        response.render("employee_artwork_altvalid", {values: vals});
                        response.end();
                    }


				}

			});
		}
		else { // when add data is not validated first
			response.send("MUST VALIDATE ADD. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE ADD.");
			response.end();
		}
	}

	
});

app.post('/employee_giftshop_altpull', function(request, response){
	var vals = "";
	connection.query('SELECT * FROM gift_shop', function(error, results, fields) {
		if(error) console.log(error);

		for(i = 0; i < results.length; i++){
			vals += "<tr><td>" + results.at(i)['ITEM_NAME'] + "</td><td>" + results.at(i)['ITEM_ID'] + "</td><td>" + results.at(i)['ITEM_COST'] + "</td><td>" + results.at(i)['DISCOUNT'] + "</td><td>" + results.at(i)['GIFT_STOCK'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['DELETED'] + "</td></tr>";
		}
		response.render("employee_giftshop_altpull", {values: vals});
		response.end()
	});

});

app.post('/employeegiftshopadd', function(request, response) {
	var vals ="";
	if(typeof request.body.addbutton === "undefined") { // when Update is clicked and not Add
		if(request.body.updatebutton.includes("1")) {	// when Update has been validated

			// checking if Item exists in "gift_shop" table
			connection.query('SELECT * FROM gift_shop WHERE ITEM_ID=?', [request.body.itemIDInput], function(error, results, fields) {
					if (error) console.log(error);
					
					if(results.length > 0) { // Item exists 
						var querystring = {};
						var endquery = {};
						var itemName = request.body.itemNameInput;
						var itemCost = request.body.itemCostInput;
						var discount = request.body.discountInput;
						var stock = request.body.stockInput;
						var description = request.body.descriptionInput;
						var deleted = request.body.deletedInput;

						if(!(request.body.itemNameInput == "")){
							querystring['ITEM_NAME'] = itemName;

						}
						if(!(request.body.itemIDInput == "")) {
							
						}
						if(!(request.body.itemCostInput == "")){
							querystring['ITEM_COST']=itemCost;

						}
						if(!(request.body.discountInput == "")){
							querystring['DISCOUNT']=discount;

						}
						if(!(request.body.stockInput == "")){
							querystring['GIFT_STOCK']=stock;

						}
						if(!(request.body.descriptionInput == "")){
							querystring['DESCRIPT']=description;
						}
						if(!(request.body.deletedInput == "")){
							querystring['DELETED']=deleted;
						}

						
						endquery['ITEM_ID'] = request.body.itemIDInput;

						connection.query('UPDATE gift_shop SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
							if(error) console.log(error);
							vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Gift " + request.body.itemIDInput +  "</td></tr>";
							response.render("employee_giftshop_altpull", {values: vals});
							response.end();

						});

					}
					
					else {    //Item does not exist
						vals+= "<tr><td> Item ID does not exist. Please enter an existing ID. Try 'Pull Inventory' button for valid Item IDs. </td></tr>";
						
						response.render("employee_giftshop_altpull", {values: vals});
						response.end()					
					}
				

			});

		}
		else {
			response.send("MUST VALIDATE UPDATE. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE UPDATE.");
			response.end();
		}
	}
	else if(typeof request.body.updatebutton === "undefined") { // when Add is clicked and not Update
		if(request.body.addbutton.includes("1")) {	// when Add has been validated
			// check if entry with same ID already exists
			connection.query('SELECT * FROM gift_shop WHERE ITEM_ID=?', [request.body.itemIDInput], function(error, results, fields) {
				if (error) console.log(error);

				if(results.length > 0) {	// entry with same ID exists
					vals+= "<tr><td> Item ID " + request.body.itemIDInput + "already exists. Please try 'Validate Update' button. </td></tr>";

					response.render("employee_giftshop_altpull", {values: vals});
					response.end()					
				}
				else {    // entry with same ID does not exist
					// insert new record into "gift_shop" table 
					connection.query('INSERT INTO gift_shop VALUES(?,?,?,?,?,?,?)',[request.body.itemNameInput, request.body.itemIDInput, request.body.itemCostInput, request.body.discountInput, request.body.stockInput, request.body.descriptionInput, request.body.deletedInput] ,function(error, results, fields) {
						if (error) {
							console.log(error);
							vals+="<tr><td>ADD FAILED - Please try again</td></tr>";
							response.render("employee_giftshop_altpull", {values: vals});
							response.end()	
						} 	
						else {
							connection.query('SELECT * FROM gift_shop WHERE ITEM_ID=?',[request.body.itemIDInput], function(error, results, fields) {
								if(error) console.log(error);
								vals+= "<tr><td> ADD SUCCESSFUL - Item " + request.body.itemIDInput + "</td><tr>";
								vals += "<tr><td>" + results.at(0)['ITEM_NAME'] + "</td><td>" + results.at(0)['ITEM_ID'] + "</td><td>" + results.at(0)['ITEM_COST'] + "</td><td>" + results.at(0)['DISCOUNT'] + "</td><td>" + results.at(0)['GIFT_STOCK'] + "</td><td>" + results.at(0)['DESCRIPT'] + "</td><td>" + results.at(0)['DELETED'] + "</td></tr>";
								
								response.render("employee_giftshop_altpull", {values: vals});
								response.end()
							});
						}
					});
				}
			});
		}
		else {
			response.send("MUST VALIDATE ADD. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE ADD.");
			response.end();
		}		
	}
});

app.post('/employee_film_altpull', function(request, response){
	var vals = "";
	connection.query('SELECT * FROM theatre', function(error, results, fields) {
		if(error) console.log(error);

		for(i = 0; i < results.length; i++){
			vals += "<tr><td>" + results.at(i)['FILM_NAME'] + "</td><td>" + results.at(i)['DIRECTOR'] + "</td><td>" + results.at(i)['RUNTIME'] + "</td><td>" + results.at(i)['FILM_ID'] + "</td><td>" +results.at(i)['START_DATE'] + "</td><td>" + results.at(i)['END_DATE'] + "</td><td>" + results.at(i)['DESCRIPT'] +  "</td></tr>";
		}
		response.render("employee_film_altpull", {values: vals});
		response.end()
	});

});

app.post('/employeefilmadd', function(request, response) {
	var vals ="";
	if(typeof request.body.addbutton === "undefined") { // when Update is clicked and not Add
		if(request.body.updatebutton.includes("1")) {	// when Update has been validated
			connection.query('SELECT * FROM theatre WHERE FILM_ID=?', [request.body.filmIDInput], function(error, results, fields) {
				if (error) console.log(error);

				if(results.length > 0) { // film exists 
					var querystring = {};
					var endquery = {};
					var filmName = request.body.filmNameInput;
					var filmDirector = request.body.filmDirectorInput;
					var runtime = request.body.runtimeInput;
       				var startDate = request.body.startDateInput;
        			var endDate = request.body.endDateInput;
        			var description = request.body.descriptionInput;

					if(!(request.body.filmNameInput == "")){
						querystring['FILM_NAME'] = filmName;

					}

					if(!(request.body.filmDirectorInput == "")){
						querystring['DIRECTOR'] = filmDirector;

					}
					if(!(request.body.filmIDInput == "")) {
						
					}
					if(!(request.body.runtimeInput == "")){
						querystring['RUNTIME']=runtime;

					}
					if(!(request.body.startDateInput == "")){
						querystring['START_DATE']=startDate;

					}
					if(!(request.body.endDateInput == "")){
						querystring['END_DATE']=endDate;

					}
					if(!(request.body.descriptionInput == "")){
						querystring['DESCRIPT']=description;
					}

					
					endquery['FILM_ID'] = request.body.filmIDInput;

					connection.query('UPDATE theatre SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
						if(error) console.log(error);
						vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Film " + request.body.filmIDInput +  "</td></tr>";
						response.render("employee_film_altpull", {values: vals});
						response.end();

					});
				}
				else {	// Film ID does not exist,
					   
					vals+= "<tr><td> Film ID does not exist. Please enter an existing ID. Try 'Pull Films' button for valid Film IDs. </td></tr>";
						
					response.render("employee_film_altpull", {values: vals});
					response.end()						  
						
				}

			});
		}
		else {
			response.send("MUST VALIDATE UPDATE. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE UPDATE.");
			response.end();
		}
	}
	else if(typeof request.body.updatebutton === "undefined") { // when Add is clicked and not Update
		if(request.body.addbutton.includes("1")) {	// when Add has been validated
			connection.query('SELECT * FROM theatre WHERE FILM_ID=?',[request.body.filmIDInput], function(error, results, fields) {
				if(error) console.log(error);
			
				if(results.length > 0) {	// entry with same ID exists
					vals+= "<tr><td> Film ID " + request.body.filmIDInput + "already exists. Please try 'Validate Update' button. </td></tr>";

					response.render("employee_film_altpull", {values: vals});
					response.end()					
				}
				else {
				connection.query('INSERT INTO theatre VALUES (?, ?, ?, ?, ?, ?, ?)', [request.body.filmNameInput, request.body.filmDirectorInput, request.body.runtimeInput, request.body.filmIDInput, request.body.startDateInput, request.body.endDateInput, request.body.descriptionInput] ,function(error, results, fields) {
					if (error){ 
						console.log(error);
						vals+="<tr><td>ADD FAILED - Please try again.</td></tr>";
						response.render("employee_film_altpull", {values: vals});
						response.end();
					}
					

					
					else {		

				
					connection.query('SELECT * FROM theatre WHERE FILM_ID=?',[request.body.filmIDInput], function(error, results, fields) {
						if(error) console.log(error);

						vals+= "<tr><td> ADD SUCCESSFUL - Film " + request.body.filmIDInput + "</td><tr>";
						vals += "<tr><td>" + results.at(0)['FILM_NAME'] + "</td><td>" + results.at(0)['DIRECTOR'] + "</td><td>" + results.at(0)['RUNTIME'] + "</td><td>" + results.at(0)['FILM_ID'] + "</td><td>" +results.at(0)['START_DATE'] + "</td><td>" + results.at(0)['END_DATE'] + "</td><td>" + results.at(0)['DESCRIPT'] +  "</td></tr>";
						
						response.render("employee_film_altpull", {values: vals});
						response.end()
					});
		
				}
			});


			}
		});
			

		}
		else {
			response.send("MUST VALIDATE ADD. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE ADD.");
			response.end();
		}	
	}	
	
});
app.post('/employee_filmticket_altpull', function(request, response){
	var vals = "";
	connection.query('SELECT * FROM theater_ticket', function(error, results, fields) {
		if(error) console.log(error);

		for(i = 0; i < results.length; i++){
			vals += "<tr><td>" + results.at(i)['FILM_NAME'] + "</td><td>" + results.at(i)['THEATER_TICKET_ID'] + "</td><td>" + results.at(i)['FILM_ID'] + "</td><td>" + results.at(i)['COST_U_12'] + "</td><td>" +results.at(i)['COST_12_TO_65'] + "</td><td>" + results.at(i)['COST_65_PLUS'] + "</td><td>" + results.at(i)['SEAT_COUNT'] + "</td><td>" + results.at(i)['DATE_OF_EVENT'] + "</td><td>" + results.at(i)['EVENT_START_TIME'] + "</td><td>" + + results.at(i)['EVENT_END_TIME'] + "</td></tr>";
		}
		response.render("employee_filmticket_altpull", {values: vals});
		response.end()
	});

});

app.post('/employeefilmticketadd', function(request, response) {
	var vals ="";
	if(typeof request.body.addbutton === "undefined") { // when Update is clicked and not Add
		if(request.body.updatebutton.includes("1")) {	// when Update has been validated
			connection.query('SELECT * FROM theater_ticket WHERE THEATER_TICKET_ID=?', [request.body.filmTicketID], function(error, results, fields) {
				if (error) console.log(error);

				if(results.length > 0) { // film showtime exists 
					var querystring = {};
					var endquery = {};
					var filmName = request.body.filmNameInput;
					var filmID = request.body.filmIDInput;
					var twelve = request.body.undertwelve;
       				var between = request.body.between;
        			var over = request.body.oversixfive;
        			var seat = request.body.seatCount;
					var date = request.body.dateInput;
					var startTime = request.body.startTime;
					var endTime = request.body.endTime;

					if(!(request.body.filmNameInput == "")){
						querystring['FILM_NAME'] = filmName;

					}
					if(!(request.body.filmTicketID == "")) {
						
					}

					if(!(request.body.filmIDInput == "")){
						querystring['FILM_ID'] = filmID;

					}

					if(!(request.body.undertwelve == "")){
						querystring['COST_U_12']=twelve;

					}
					if(!(request.body.between == "")){
						querystring['COST_12_TO_65']=between;

					}
					if(!(request.body.oversixfive == "")){
						querystring['COST_65_PLUS']=over;

					}
					if(!(request.body.seatCount == "")){
						querystring['SEAT_COUNT']=seat;
					}
					if(!(request.body.dateInput == "")){
						querystring['DATE_OF_EVENT']=date;
					}
					if(!(request.body.startTime == "")){
						querystring['EVENT_START_TIME']=startTime;
					}
					if(!(request.body.endTime == "")){
						querystring['EVENT_END_TIME']=endTime;
					}

					
					endquery['THEATER_TICKET_ID'] = request.body.filmTicketID;

					connection.query('UPDATE theater_ticket SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
						if(error) console.log(error);
						vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Film Showtime " + request.body.filmTicketID +  "</td></tr>";
						response.render("employee_filmticket_altpull", {values: vals});
						response.end();

					});
				}
				else {	// Theater Ticket ID does not exist,
					   
					vals+= "<tr><td> Theater Ticket ID does not exist. Please enter an existing ID. Try 'Pull Film Showtimes' button for valid Theater Ticket IDs. </td></tr>";
						
					response.render("employee_filmticket_altpull", {values: vals});
					response.end()						  
						
				}

			});
		}
		else {
			response.send("MUST VALIDATE UPDATE. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE UPDATE.");
			response.end();
		}
	}



	else if(typeof request.body.updatebutton === "undefined") { // when Add is clicked and not Update
		if(request.body.addbutton.includes("1")) {	// when Add has been validated
			connection.query('SELECT * FROM theater_ticket WHERE THEATER_TICKET_ID=?',[request.body.filmTicketID], function(error, results, fields) {
				if(error) console.log(error);
			
				if(results.length > 0) {	// entry with same ID exists
				vals+= "<tr><td> Theater Ticket ID " + request.body.filmTicketID + "already exists. Please try 'Validate Update' button. </td></tr>";

				response.render("employee_filmticket_altpull", {values: vals});
				response.end()					
				}
			else {
				connection.query('INSERT INTO theater_ticket VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [request.body.filmNameInput, request.body.filmTicketID, request.body.filmIDInput, request.body.undertwelve, request.body.between, request.body.oversixfive, request.body.seatCount, request.body.eventDate, request.body.startTime, request.body.endTime] ,function(error, results, fields) {
					if (error){ 
						console.log(error);
						vals+="<tr><td>ADD FAILED - Please try again.</td></tr>";
						response.render("employee_filmticket_altvalid", {values: vals});
						response.end();
					}
					

					
					else {		

				
					connection.query('SELECT * FROM theater_ticket WHERE THEATER_TICKET_ID=?',[request.body.filmTicketID], function(error, results, fields) {
						if(error) console.log(error);

						vals+= "<tr><td> ADD SUCCESSFUL - Film Showtime " + request.body.filmIDInput + "</td><tr>";
						vals += "<tr><td>" + results.at(0)['FILM_NAME'] + "</td><td>" + results.at(0)['THEATER_TICKET_ID'] + "</td><td>" + results.at(0)['FILM_ID'] + "</td><td>" + results.at(0)['COST_U_12'] + "</td><td>" +results.at(0)['COST_12_TO_65'] + "</td><td>" + results.at(0)['COST_65_PLUS'] + "</td><td>" + results.at(0)['SEAT_COUNT'] + "</td><td>" + results.at(0)['DATE_OF_EVENT'] + "</td><td>" + results.at(0)['EVENT_START_TIME'] + "</td><td>" + results.at(0)['EVENT_END_TIME'] +  "</td></tr>";
						
						response.render("employee_filmticket_altpull", {values: vals});
						response.end()
					});
		
				}
			});


			}
		});
			

		}
		else {
			response.send("MUST VALIDATE ADD. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE ADD.");
			response.end();
		}	
	}	
	
});

app.post('/employee_exhibition_altpull', function(request, response){
	var vals = "";
	connection.query('SELECT * FROM exhibition', function(error, results, fields) {
		if(error) console.log(error);
		for(i = 0; i < results.length; i++){
			vals += "<tr><td>" + results.at(i)['EXHIBITION_NAME'] + "</td><td>" + results.at(i)['EXHIBITION_NUM'] + "</td><td>"+results.at(i)['START_DATE'] + "</td><td>" + results.at(i)['END_DATE'] + "</td><td>"  + results.at(i)['BUILD_NUM'] + "</td><td>" + results.at(i)['DESCRIPT'] +  "</td></tr>";
		}
		response.render("employee_exhibition_altpull", {values: vals});
		response.end()
	});

});

app.post('/employeeexhibitionadd', function(request, response) {
	var vals ="";
	if(typeof request.body.addbutton === "undefined") { // when Update is clicked and not Add
		if(request.body.updatebutton.includes("1")) {	// when Update has been validated
			connection.query('SELECT * FROM exhibition WHERE EXHIBITION_NUM=?',[request.body.exhibIDInput] ,function(error, results, fields) {
				if (error)	console.log(error);	

					if(results.length > 0) { 	// if exhibition ID exists 
						var querystring = {};
						var endquery = {};
						var name = request.body.exhibNameInput;
						var build = request.body.buildNumInput;
						var startDate = request.body.startDateInput;
						var endDate = request.body.endDateInput;
						var description = request.body.descriptionInput;

	
						if(!(request.body.exhibNameInput == "")){
							querystring['EXHIBITION_NAME'] = name;
	
						}
						if(!(request.body.exhibIDInput == "")) {
							
						}
						if(!(request.body.buildNumInput == "")){
							querystring['BUILD_NUM']=build;
						}
	
						if(!(request.body.startDateInput == "")){
							querystring['START_DATE'] = startDate;
	
						}
	
						if(!(request.body.endDateInput == "")){
							querystring['END_DATE']=endDate;
	
						}
						if(!(request.body.descriptionInput == "")){
							querystring['DESCRIPT']=description;
	
						}


						
						endquery['EXHIBITION_NUM'] = request.body.exhibIDInput;
	
						connection.query('UPDATE exhibition SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
							if(error) console.log(error);
							vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Exhibition " + request.body.exhibIDInput +  "</td></tr>";
							response.render("employee_exhibition_altpull", {values: vals});
							response.end();
	
						});
					}
					else {	//  Exhibition ID does not exist,
						   
						vals+= "<tr><td> Exhibition ID does not exist. Please enter an existing ID. Try 'Pull Exhibitions' button for valid Exhibition IDs. </td></tr>";
							
						response.render("employee_exhibition_altpull", {values: vals});
						response.end()						  
							
					}
			});

		}
		else {
			response.send("MUST VALIDATE UPDATE. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE UPDATE.");
			response.end();
		}
	}
	else if(typeof request.body.updatebutton === "undefined") { // when Add is clicked and not Update
		if(request.body.addbutton.includes("1")) {	// when Add has been validated
			connection.query('SELECT * FROM exhibition WHERE EXHIBITION_NUM=?',[request.body.exhibIDInput], function(error, results, fields) {
				if(error) console.log(error);
			
				if(results.length > 0) {	// entry with same ID exists
				vals+= "<tr><td> Exhibition ID " + request.body.exhibIDInput + "already exists. Please try 'Validate Update' button. </td></tr>";

				response.render("employee_exhibition_altpull", {values: vals});
				response.end()					
				}
				else {
				connection.query('INSERT INTO exhibition VALUES (?, ?, ?, ?,?,?)',[request.body.exhibNameInput, request.body.exhibIDInput, request.body.startDateInput, request.body.endDateInput,  request.body.buildNumInput,request.body.descriptionInput] ,function(error, results, fields) {
					if (error) {  // When exhibition ID exists 
						console.log(error)
						vals+="<tr><td>ADD FAILED - Please try again</td></tr>";
						response.render("employee_exhibition_altpull", {values: vals});
						response.end();
					}
					else {
						connection.query('SELECT * FROM exhibition WHERE EXHIBITION_NUM=?',[request.body.exhibIDInput], function(error, results, fields) {
							if(error) console.log(error);
	
							vals+= "<tr><td> ADD SUCCESSFUL - Exhibition " + request.body.exhibIDInput + "</td><tr>";
							vals += "<tr><td>" + results.at(0)['EXHIBITION_NAME'] + "</td><td>" + results.at(0)['EXHIBITION_NUM'] + "</td><td>"+results.at(0)['START_DATE'] + "</td><td>" + results.at(0)['END_DATE'] + "</td><td>"  + results.at(0)['BUILD_NUM'] + "</td><td>" + results.at(0)['DESCRIPT'] +  "</td></tr>";
							
							response.render("employee_exhibition_altpull", {values: vals});
							response.end()
						});
					}
				});


			}
		});


		}
		else {
			response.send("MUST VALIDATE ADD. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE ADD.");
			response.end();
		}		
	}
});

app.post('/employee_exhibitionticket_altpull', function(request, response){
	var vals = "";
	connection.query('SELECT * FROM exhibition_ticket', function(error, results, fields) {
		if(error) console.log(error);
		for(i = 0; i < results.length; i++){
			vals += "<tr><td>" + results.at(i)['EVENT_NAME'] + "</td><td>" + results.at(i)['EXHIBIT_NUM'] + "</td><td>"+results.at(i)['TICKET_ID'] + "</td><td>" + results.at(i)['COST_U_12'] + "</td><td>"  + results.at(i)['COST_12_TO_65'] + "</td><td>" + results.at(i)['COST_65_PLUS'] + "</td><td>" + results.at(i)['DATE_OF_EVENT'] + "</td><td>" + results.at(i)['EVENT_START_TIME'] + "</td><td>" + results.at(i)['EVENT_END_TIME']+  "</td></tr>";
		}
		response.render("employee_exhibitionticket_altpull", {values: vals});
		response.end()
	});

});

app.post('/employeeexhibitionticketadd', function(request, response) {
	var vals ="";
	if(typeof request.body.addbutton === "undefined") { // when Update is clicked and not Add
		if(request.body.updatebutton.includes("1")) {	// when Update has been validated
			connection.query('SELECT * FROM exhibition_ticket WHERE TICKET_ID=?',[request.body.exhibTicketID], function(error, results, fields){
				if(error) console.log(error);

				if(results.length > 0) {	// if Exhibition Ticket ID exists
					var querystring = {};
					var endquery = {};
					var name = request.body.exhibNameInput;
					var exhib = request.body.exhibIDInput;
					var twelve = request.body.undertwelve;
					var between = request.body.between;
					var over = request.body.oversixfive;
					var date = request.body.dateInput;
					var startTime = request.body.startTime;
					var endTime = request.body.endTime;


					if(!(request.body.exhibNameInput == "")){
						querystring['EVENT_NAME'] = name;

					}
					if(!(request.body.exhibIDInput == "")) {
						querystring['EXHIBIT_NUM'] = exhib;
					}
					if(!(request.body.exhibTicketID == "")) {
						
					}

					if(!(request.body.undertwelve == "")){
						querystring['COST_U_12']=twelve;
					}

					if(!(request.body.between == "")){
						querystring['COST_12_TO_65'] = between;

					}

					if(!(request.body.oversixfive == "")){
						querystring['COST_65_PLUS']=over;

					}
					if(!(request.body.dateInput == "")){
						querystring['DATE_OF_EVENT']=date;

					}
					if(!(request.body.startTime == "")){
						querystring['EVENT_START_TIME']=startTime;

					}
					if(!(request.body.endTime == "")){
						querystring['EVENT_END_TIME']=endTime;

					}


					
					endquery['TICKET_ID'] = request.body.exhibTicketID;

					connection.query('UPDATE exhibition_ticket SET ? WHERE ?', [querystring, endquery],function(error, results, fields) {
						if(error) console.log(error);
						vals += "<tr><td> UPDATE SUCCESSFUL - Changes made to Exhibition Timeslot " + request.body.exhibTicketID +  "</td></tr>";
						response.render("employee_exhibitionticket_altpull", {values: vals});
						response.end();

					});
				}	
				else {	// if Exhibition Ticket ID does not exist

					vals+= "<tr><td> Exhibition Ticket ID does not exist. Please enter an existing ID. Try 'Pull Exhibition Timeslots' button for valid Exhibition Ticket IDs. </td></tr>";
					response.render("employee_exhibitionticket_altpull", {values: vals});
					response.end();
				}

			});

		}
		else {
			response.send("MUST VALIDATE UPDATE. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE UPDATE.");
			response.end();
		}
	}
	else if(typeof request.body.updatebutton === "undefined") { // when Add is clicked and not Update
		if(request.body.addbutton.includes("1")) {	// when Add has been validated
			connection.query('SELECT * FROM exhibition_ticket WHERE TICKET_ID=?',[request.body.exhibTicketID], function(error, results, fields) {
				if(error) console.log(error);
			
				if(results.length > 0) {	// entry with same ID exists
				vals+= "<tr><td> Exhibition Ticket ID " + request.body.exhibTicketID + "already exists. Please try 'Validate Update' button. </td></tr>";

				response.render("employee_exhibitionticket_altpull", {values: vals});
				response.end()					
				}
				else {

					connection.query('INSERT INTO exhibition_ticket VALUES (?, ?, ?, ?,?,?, ?, ? ,?)',[request.body.exhibNameInput, request.body.exhibIDInput, request.body.exhibTicketID,request.body.undertwelve, request.body.between,  request.body.oversixfive,request.body.dateInput, request.body.startTime, request.body.endTime] ,function(error, results, fields) {
						if (error) console.log(error);	
					});
					connection.query('SELECT * FROM exhibition_ticket WHERE TICKET_ID=?',[request.body.exhibtTicketID], function(error, results, fields) {
						if(error) console.log(error);
		
						vals+= "<tr><td> ADD SUCCESSFUL - Exhibition Ticket" + request.body.exhibTicketID + "</td><tr>";
						vals += "<tr><td>" + results.at(0)['EVENT_NAME'] + "</td><td>" + results.at(0)['EXHIBIT_NUM'] + "</td><td>"+results.at(0)['TICKET_ID'] + "</td><td>" + results.at(0)['COST_U_12'] + "</td><td>"  + results.at(0)['COST_12_TO_65'] + "</td><td>" + results.at(0)['COST_65_PLUS'] + "</td><td>" + results.at(0)['DATE_OF_EVENT'] + "</td><td>" + results.at(0)['EVENT_START_TIME'] + "</td><td>" + results.at(0)['EVENT_END_TIME']    +  "</td></tr>";
						
						response.render("employee_exhibitionticket_altpull", {values: vals});
						response.end()
					});


			}
		});


		}
		else {
			response.send("MUST VALIDATE ADD. PLEASE RETURN TO PREVIOUS PAGE AND VALIDATE ADD.");
			response.end();
		}		
	}
});

// loading the Exhibitions page
app.post('/visitor_exhibition', function(request, response) {
	var vals="";
	var msg=" ";

	// to handle showing only upcoming exhibition viewing timeslots and not past 
	var todaysDate = request.session.dat;
	

	connection.query('SELECT exhibition_ticket.TICKET_ID, exhibition_ticket.EVENT_NAME, exhibition_ticket.COST_U_12, exhibition_ticket.COST_12_TO_65, exhibition_ticket.COST_65_PLUS, exhibition_ticket.DATE_OF_EVENT, exhibition_ticket.EVENT_START_TIME, exhibition_ticket.EVENT_END_TIME, exhibition.DESCRIPT  FROM exhibition_ticket, exhibition WHERE exhibition_ticket.EXHIBIT_NUM=exhibition.EXHIBITION_NUM AND ? <= exhibition_ticket.DATE_OF_EVENT  ORDER BY DATE_OF_EVENT, EVENT_START_TIME', [todaysDate],function(error, results, fields) {
		if(error) console.log(error);
		
		for(let i = 0; i < results.length; i++) {
			vals+= "<tr><td>" + results.at(i)['TICKET_ID'] + "</td><td>" + results.at(i)['EVENT_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>$" + results.at(i)['COST_U_12'] + "</td><td>$" + results.at(i)['COST_12_TO_65'] + "</td><td>$" + results.at(i)['COST_65_PLUS'] + "</td><td>" + results.at(i)['DATE_OF_EVENT'] + "</td><td>"+ results.at(i)['EVENT_START_TIME'] + "</td><td>"+ results.at(i)['EVENT_END_TIME'] + "</td><tr>";
		}
		response.render('buy_exhibition_ticket', {values: vals, message: msg});
		response.end();

	});

});

// loading the Theater page
app.post('/visitor_theater', function(request, response) {
	var vals="";
	var msg=" ";

	// to handle showing only upcoming theater showtimes and not past 
	var todaysDate = request.session.dat;

	connection.query('SELECT theater_ticket.THEATER_TICKET_ID, theater_ticket.FILM_NAME, theater_ticket.COST_U_12, theater_ticket.COST_12_TO_65, theater_ticket.COST_65_PLUS, theater_ticket.SEAT_COUNT, theater_ticket.DATE_OF_EVENT, theater_ticket.EVENT_START_TIME, theater_ticket.EVENT_END_TIME, theatre.DESCRIPT  FROM theater_ticket, theatre WHERE theater_ticket.FILM_ID=theatre.FILM_ID AND ? <= theater_ticket.DATE_OF_EVENT  ORDER BY DATE_OF_EVENT, EVENT_START_TIME', [todaysDate], function(error, results, fields) {
		if(error) console.log(error);
		for(let i = 0; i < results.length; i++) {
			vals+= "<tr><td>" + results.at(i)['THEATER_TICKET_ID'] + "</td><td>" + results.at(i)['FILM_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['SEAT_COUNT'] + "</td><td>$" + results.at(i)['COST_U_12'] + "</td><td>$" + results.at(i)['COST_12_TO_65'] + "</td><td>$" + results.at(i)['COST_65_PLUS'] + "</td><td>" + results.at(i)['DATE_OF_EVENT'] + "</td><td>"+ results.at(i)['EVENT_START_TIME'] + "</td><td>"+ results.at(i)['EVENT_END_TIME'] + "</td><tr>";	
		}
		response.render('buy_theater_ticket', {values: vals, message: msg});
	});
});

// loading the Shop page
app.post('/visitor_gift', function(request, response) {
	var vals="";
	var msg=" ";
	connection.query('SELECT * FROM gift_shop WHERE GIFT_STOCK > 0 ORDER BY ITEM_NAME', function(error, results, fields) {
		if(error) console.log(error);
		for(let i = 0; i < results.length; i++) {
			vals+= "<tr><td>" + results.at(i)['ITEM_ID'] + "</td><td>" + results.at(i)['ITEM_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>$" + results.at(i)['ITEM_COST'] + "</td><td>" + results.at(i)['GIFT_STOCK']+ "</td><tr>";	
		}
		response.render('buy_giftshop', {values: vals, message: msg});
	});
});

// when a Exhibition Ticket purchase is attempted
app.post('/visitor_exhibition_purchase', function(request, response) {
	var vals = "";
	var msg = "";
	var loc = 0;

	connection.query('SELECT exhibition_ticket.TICKET_ID, exhibition_ticket.EVENT_NAME, exhibition_ticket.COST_U_12, exhibition_ticket.COST_12_TO_65, exhibition_ticket.COST_65_PLUS, exhibition_ticket.DATE_OF_EVENT, exhibition_ticket.EVENT_START_TIME, exhibition_ticket.EVENT_END_TIME, exhibition.DESCRIPT  FROM exhibition_ticket, exhibition WHERE exhibition_ticket.EXHIBIT_NUM=exhibition.EXHIBITION_NUM ORDER BY DATE_OF_EVENT, EVENT_START_TIME', function(error, results, fields) {
		if(error) console.log(error);	
		for(let i = 0; i < results.length; i++) {

			vals+= "<tr><td>" + results.at(i)['TICKET_ID'] + "</td><td>" + results.at(i)['EVENT_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>$" + results.at(i)['COST_U_12'] + "</td><td>$" + results.at(i)['COST_12_TO_65'] + "</td><td>$" + results.at(i)['COST_65_PLUS'] + "</td><td>" + results.at(i)['DATE_OF_EVENT'] + "</td><td>"+ results.at(i)['EVENT_START_TIME'] + "</td><td>"+ results.at(i)['EVENT_END_TIME'] + "</td><tr>";	
			if(results.at(i)['TICKET_ID'] == request.body.ticketid){
				loc = i;
			}
		}

		// doing data sanitization for Ticket ID
		if(request.body.ticketid == "") {
			msg+="<p>Please enter a Ticket ID to purchase.</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(!/^ET\d{7}$/.test(request.body.ticketid)) {
			msg+="<p>Please enter a valid Ticket ID.</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}
		// doing data sanitization for ticket purchase numbers
		else if(request.body.undertwelve == ""){
			msg+="<p>Please enter a value for '# of Under 12 tickets'</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.undertwelve) < 0){
			msg+="<p>Please enter a value for '# of Under 12 tickets' that is 0 or greater</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}	
		else if(request.body.between == ""){
			msg+="<p>Please enter a value for '# of Age 12 to 65 tickets' tickets</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.between) < 0){
			msg+="<p>Please enter a value for '# of Age 12 to 65 tickets' that is 0 or greater</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}	
		else if(request.body.oversixfive == ""){
			msg+="<p>Please enter a value for '# of Age 65 plus tickets' tickets</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.oversixfive) < 0){
			msg+="<p>Please enter a value for '# of Age 65 plus tickets' that is 0 or greater</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}	
		else if((parseInt(request.body.undertwelve) + parseInt(request.body.between) + parseInt(request.body.oversixfive)) == 0) {
			msg+="<p> Must purchase at least 1 ticket</p>";
			response.render('buy_exhibition_ticket', {values:vals, message: msg});
			response.end()
		}
		else {	// when data entered is valid

			// calculate transaction total 
			var total = (results.at(loc)['COST_U_12'] * request.body.undertwelve +  results.at(loc)['COST_12_TO_65'] * request.body.between + results.at(loc)['COST_65_PLUS'] * request.body.oversixfive); 
 			// insert transaction into 'exhibition_transaction' table
			connection.query('INSERT INTO exhibition_transaction(DATE_OF_SALE, TICKET_ID, VISIT_ID, NUM_PURCHASED_U_12, NUM_PURCHASED_12_TO_65, NUM_PURCHASED_65_PLUS, DISCOUNT, TRANSACTION_TOTAL)  VALUES (?,?,?,?,?,?,?,?)',[request.session.dat, request.body.ticketid, request.session.id, request.body.undertwelve, request.body.between, request.body.oversixfive, 0, total], function(error, results, field) {
				if(error) throw error;
				console.log(error);

				msg+="<p>Exhibition Ticket Purchase Successful! Purchase total: $" + total + "</p>";
				
				response.render('buy_exhibition_ticket', {values:vals, message: msg});
				response.end()
			});
		}

	});
});

// when a Theater Ticket purchase is attempted
app.post('/visitor_theater_purchase', function(request, response) {
	var vals = "";
	var msg = "";
	var loc = 0;

	connection.query('SELECT theater_ticket.THEATER_TICKET_ID, theater_ticket.FILM_NAME, theater_ticket.COST_U_12, theater_ticket.COST_12_TO_65, theater_ticket.COST_65_PLUS, theater_ticket.SEAT_COUNT, theater_ticket.DATE_OF_EVENT, theater_ticket.EVENT_START_TIME, theater_ticket.EVENT_END_TIME, theatre.DESCRIPT  FROM theater_ticket, theatre WHERE theater_ticket.FILM_ID=theatre.FILM_ID ORDER BY DATE_OF_EVENT, EVENT_START_TIME', function(error, results, fields) {
		if(error) console.log(error);
		for(let i = 0; i < results.length; i++) {
			vals+= "<tr><td>" + results.at(i)['THEATER_TICKET_ID'] + "</td><td>" + results.at(i)['FILM_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>" + results.at(i)['SEAT_COUNT'] + "</td><td>$" + results.at(i)['COST_U_12'] + "</td><td>$" + results.at(i)['COST_12_TO_65'] + "</td><td>$" + results.at(i)['COST_65_PLUS'] + "</td><td>" + results.at(i)['DATE_OF_EVENT'] + "</td><td>"+ results.at(i)['EVENT_START_TIME'] + "</td><td>"+ results.at(i)['EVENT_END_TIME'] + "</td><tr>";	
			if(results.at(i)['THEATER_TICKET_ID'] == request.body.ticketid){
				loc = i;
			}
		}

		// doing data sanitization for Ticket ID
		if(request.body.ticketid == "") {
			msg+="<p>Please enter a Ticket ID to purchase.</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(!/^FT\d{7}$/.test(request.body.ticketid)) {
			msg+="<p>Please enter a valid Ticket ID.</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}
		// doing data sanitization for ticket purchase numbers
		else if(request.body.undertwelve == ""){
			msg+="<p>Please enter a value for '# of Under 12 tickets'</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.undertwelve) < 0){
			msg+="<p>Please enter a value for '# of Under 12 tickets' that is 0 or greater</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}	
		else if(request.body.between == ""){
			msg+="<p>Please enter a value for '# of Age 12 to 65 tickets' tickets</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.between) < 0){
			msg+="<p>Please enter a value for '# of Age 12 to 65 tickets' that is 0 or greater</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}	
		else if(request.body.oversixfive == ""){
			msg+="<p>Please enter a value for '# of Age 65 plus tickets' tickets</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.oversixfive) < 0){
			msg+="<p>Please enter a value for '# of Age 65 plus tickets' that is 0 or greater</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}	
		else if((parseInt(request.body.undertwelve) + parseInt(request.body.between) + parseInt(request.body.oversixfive)) == 0) {
			msg+="<p> Must purchase at least 1 ticket</p>";
			response.render('buy_theater_ticket', {values:vals, message: msg});
			response.end()
		}
		else {	// when data entered is valid

			// calculate new seat count
			var newseatcount = results.at(loc)['SEAT_COUNT'] - parseInt(request.body.undertwelve) - parseInt(request.body.between) - parseInt(request.body.oversixfive);

			// calculate transaction total 
			var total = (results.at(loc)['COST_U_12'] * request.body.undertwelve +  results.at(loc)['COST_12_TO_65'] * request.body.between + results.at(loc)['COST_65_PLUS'] * request.body.oversixfive); 
 			
			// insert transaction into 'exhibition_transaction' table
			connection.query('INSERT INTO theater_transaction(DATE_OF_SALE, THEATER_TICKET_ID, VISIT_ID, NUM_PURCHASED_U_12, NUM_PURCHASED_12_TO_65, NUM_PURCHASED_65_PLUS, DISCOUNT, TRANSACTION_TOTAL)  VALUES (?,?,?,?,?,?,?,?)',[request.session.dat, request.body.ticketid, request.session.id, request.body.undertwelve, request.body.between, request.body.oversixfive, 0, total], function(error, results, field) {
				if(error){		// update unsuccessful because ID does not exist
					console.log(error);
					msg+="<p>Ticket ID is invalid. Please select a Ticket ID from the list below!</p>";

				} 
				else {	// update successful because ID exists
					msg+="<p>Theater Ticket Purchase Successful! Purchase total: $" + total + "</p>";
					// update seat count
					connection.query('UPDATE theater_ticket SET SEAT_COUNT=? WHERE THEATER_TICKET_ID=?', [newseatcount, request.body.ticketid], function(error, results, field) {
						if(error) console.log(error);
					});
					
				}
			
				// need to pull data again to display new seat count
				var newvals ="";
				connection.query('SELECT theater_ticket.THEATER_TICKET_ID, theater_ticket.FILM_NAME, theater_ticket.COST_U_12, theater_ticket.COST_12_TO_65, theater_ticket.COST_65_PLUS, theater_ticket.SEAT_COUNT, theater_ticket.DATE_OF_EVENT, theater_ticket.EVENT_START_TIME, theater_ticket.EVENT_END_TIME, theatre.DESCRIPT  FROM theater_ticket, theatre WHERE theater_ticket.FILM_ID=theatre.FILM_ID ORDER BY DATE_OF_EVENT, EVENT_START_TIME', function(error, result, fields) {
					if(error) console.log(error);
					for(let i = 0; i < result.length; i++) {
						newvals+= "<tr><td>" + result.at(i)['THEATER_TICKET_ID'] + "</td><td>" + result.at(i)['FILM_NAME'] + "</td><td>" + result.at(i)['DESCRIPT'] + "</td><td>" + result.at(i)['SEAT_COUNT'] + "</td><td>$" + result.at(i)['COST_U_12'] + "</td><td>$" + result.at(i)['COST_12_TO_65'] + "</td><td>$" + result.at(i)['COST_65_PLUS'] + "</td><td>" + result.at(i)['DATE_OF_EVENT'] + "</td><td>"+ result.at(i)['EVENT_START_TIME'] + "</td><td>"+ result.at(i)['EVENT_END_TIME'] + "</td><tr>";	
					}
					response.render('buy_theater_ticket', {values: newvals, message: msg});
					response.end()
				});
			});
		}
	});
});

// when a Gift Shop purchase is attempted
app.post('/visitor_gift_purchase', function(request, response) {
	var vals = "";
	var msg = "";
	var loc = 0;

	connection.query('SELECT * FROM gift_shop ORDER BY ITEM_NAME', function(error, results, fields) {
		if(error) console.log(error);
		for(let i = 0; i < results.length; i++) {
			vals+= "<tr><td>" + results.at(i)['ITEM_ID'] + "</td><td>" + results.at(i)['ITEM_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>$" + results.at(i)['ITEM_COST'] + "</td><td>" + results.at(i)['GIFT_STOCK']+ "</td><tr>";	
			if(results.at(i)['ITEM_ID'] == request.body.itemid){
				loc = i;
			}
		}
	
		// doing data sanitization for Item ID
		if(request.body.itemid == "") {
			msg+="<p>Please enter a Item ID to purchase</p>";
			response.render('buy_giftshop', {values:vals, message: msg});
			response.end()
		}
		else if(!/^G\d{9}$/.test(request.body.itemid)) {
			msg+="<p>Please enter a valid Item ID</p>";
			response.render('buy_giftshop', {values:vals, message: msg});
			response.end()
		}
		// doing data sanitization for purchase number
		else if(request.body.amount == ""){
			msg+="<p>Please enter a value for '# to purchase'</p>";
			response.render('buy_giftshop', {values:vals, message: msg});
			response.end()
		}
		else if(parseInt(request.body.amount) <= 0){
			msg+="<p>Please enter a value for '# to purchase' that is greater than 0</p>";
			response.render('buy_giftshop', {values:vals, message: msg});
			response.end()
		}	
		else {	// when data entered is valid

			// calculate new stock count
			var newstockcount = results.at(loc)['GIFT_STOCK'] - parseInt(request.body.amount);

			// calculate transaction total 
			var total = (results.at(loc)['ITEM_COST'] * request.body.amount); 
 			// insert transaction into 'gift_shop_transaction' table
			connection.query('INSERT INTO gift_shop_transaction(DATE_OF_SALE, ITEM_ID, VISIT_ID, NUM_ITEMS_PURCHASED, DISCOUNT, TRANSACTION_TOTAL) VALUES (?,?,?,?,?,?)',[request.session.dat, request.body.itemid, request.session.id, request.body.amount, 0, total], function(error, results, field) {
				if(error){		// update unsuccessful because ID does not exist
					console.log(error);
					msg+="<p>Item ID is invalid. Please select a Item ID from the list below!</p>";

				} 
				else {	// update successful because ID exists
					msg+="<p>Item Purchase Successful! Purchase total: $" + total + "</p>";

					// update stock count
					connection.query('UPDATE gift_shop SET GIFT_STOCK=? WHERE ITEM_ID=?', [newstockcount, request.body.itemid], function(error, results, field) {
						if(error) console.log(error);
					});
					
				}

				
				// need to pull data again to display new stock count
				var newvals ="";
				connection.query('SELECT * FROM gift_shop WHERE GIFT_STOCK > 0 ORDER BY ITEM_NAME', function(error, results, fields) {
					if(error) console.log(error);
					for(let i = 0; i < results.length; i++) {
						vals+= "<tr><td>" + results.at(i)['ITEM_ID'] + "</td><td>" + results.at(i)['ITEM_NAME'] + "</td><td>" + results.at(i)['DESCRIPT'] + "</td><td>$" + results.at(i)['ITEM_COST'] + "</td><td>" + results.at(i)['GIFT_STOCK']+ "</td><tr>";	
					}

					response.render('buy_giftshop', {values: vals, message: msg});
				});
			});
		}
	});
});




app.post('/reports', function(request, response) {


	
	if(typeof request.body.report2 === "undefined" && typeof request.body.report3 === "undefined" && typeof request.body.report4 === "undefined") { // for THEATER TICKET REVENUE
		var vals="";
		var total= 0;
		var start = request.body.startdate1;
		var end = request.body.enddate1;
		var spl = request.body.startdate1.split('-');
		// start date and end date sanitization
		if(!start) {
			response.send("Start Date is required.");
		  }
		  else if(!/^\d{2}-\d{2}-\d{4}$/.test(start)) {
			response.send("Start Date must be formatted like 'MM-DD-YYYY'.");
		  }
		  else if(parseInt(start.substring(0,2)) > 12 || parseInt(start.substring(0,2) < 1)){
			response.send("Start Date month must be between 1 and 12.");
		  }
		  else if(parseInt(start.substring(3,5)) > 31 || parseInt(start.substring(3,5) < 1)){
			response.send("Start Date day must be between 1 and 31.");
		  }
		  if(!end) {
			response.send("End Date is required.");
		  } else if(!/^\d{2}-\d{2}-\d{4}$/.test(end)) {
			response.send("End Date must be formatted like 'MM-DD-YYYY'.");
		  } else if(parseInt(end.substring(0,2)) > 12 || parseInt(end.substring(0,2) < 1)){
			response.send("End Date month must be between 1 and 12.");

		  }
		  else if(parseInt(end.substring(3,5)) > 31 || parseInt(end.substring(3,5) < 1)){
			response.send("End Date day must be between 1 and 31.");

		  }else if(parseInt(end.substring(6,10)) < parseInt(start.substring(6,10))){
			response.send("End Date must be after Start Date.");

		  } else if((parseInt(end.substring(0,2)) < parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10)))){
			response.send("End Date must be after Start Date.");

			} else if((parseInt(end.substring(3,5)) < parseInt(start.substring(3,5))) && (parseInt(end.substring(0,2)) == parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10))) ){
			  response.send("End Date must be after Start Date.");

		  } 
		else {	// start date and end date are valid
			connection.query('SELECT * FROM theater_transaction, theater_ticket WHERE theater_transaction.DATE_OF_SALE LIKE ? AND theater_transaction.DATE_OF_SALE LIKE ? AND theater_transaction.THEATER_TICKET_ID=theater_ticket.THEATER_TICKET_ID',['%' + spl[0]+ '%', '%' + spl[2] + '%'], function(error, results, fields) {

				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					vals+="<tr><td>" + results.at(i)['TICKET_TRANSACTION_ID'] + "</td><td>" + results.at(i)['DATE_OF_SALE']+ "</td><td>" + results.at(i)['FILM_ID'] + "</td><td>" + results.at(i)['THEATER_TICKET_ID'] + "</td><td>" + results.at(i)['VISIT_ID'] + "</td><td>" + results.at(i)['NUM_PURCHASED_U_12'] + "</td><td>" + results.at(i)['NUM_PURCHASED_12_TO_65'] + "</td><td>" + results.at(i)['NUM_PURCHASED_65_PLUS']+ "</td><td>" + results.at(i)['DISCOUNT'] + "</td><td>" + results.at(i)['TRANSACTION_TOTAL']+"</td><tr>";
					total+=parseInt(results.at(i)['TRANSACTION_TOTAL']);
					
				}
				response.render("Theater_report", {entries: vals, total: total, start: start, end: end});
				response.end();
			});
		}

	}
	else if(typeof request.body.report1 === "undefined" && typeof request.body.report3 === "undefined" && typeof request.body.report4 === "undefined") { // for EXHIBITION TICKET EVENUE
		var gen="";
		const genID="E15844646";
		var spec="";
		var gentotal=0;
		var spectotal=0;
		var total= 0;
		var start = request.body.startdate1;
		var end = request.body.enddate1;
		var spl = request.body.startdate1.split('-');
				// start date and end date sanitization
		if(!start) {
			response.send("Start Date is required.");
		  }
		  else if(!/^\d{2}-\d{2}-\d{4}$/.test(start)) {
			response.send("Start Date must be formatted like 'MM-DD-YYYY'.");
		  }
		  else if(parseInt(start.substring(0,2)) > 12 || parseInt(start.substring(0,2) < 1)){
			response.send("Start Date month must be between 1 and 12.");
		  }
		  else if(parseInt(start.substring(3,5)) > 31 || parseInt(start.substring(3,5) < 1)){
			response.send("Start Date day must be between 1 and 31.");
		  }
		  if(!end) {
			response.send("End Date is required.");
		  } else if(!/^\d{2}-\d{2}-\d{4}$/.test(end)) {
			response.send("End Date must be formatted like 'MM-DD-YYYY'.");
		  } else if(parseInt(end.substring(0,2)) > 12 || parseInt(end.substring(0,2) < 1)){
			response.send("End Date month must be between 1 and 12.");

		  }
		  else if(parseInt(end.substring(3,5)) > 31 || parseInt(end.substring(3,5) < 1)){
			response.send("End Date day must be between 1 and 31.");

		  }else if(parseInt(end.substring(6,10)) < parseInt(start.substring(6,10))){
			response.send("End Date must be after Start Date.");

		  } else if((parseInt(end.substring(0,2)) < parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10)))){
			response.send("End Date must be after Start Date.");

			} else if((parseInt(end.substring(3,5)) < parseInt(start.substring(3,5))) && (parseInt(end.substring(0,2)) == parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10))) ){
			  response.send("End Date must be after Start Date.");

		  } 
		 else {	// start date and end date are valid

			connection.query('SELECT exhibition_transaction.TICKET_TRANSACTION_ID, exhibition_transaction.DATE_OF_SALE,exhibition_transaction.TICKET_ID, exhibition_transaction.VISIT_ID, exhibition_transaction.NUM_PURCHASED_U_12, exhibition_transaction.NUM_PURCHASED_12_TO_65, exhibition_transaction.NUM_PURCHASED_65_PLUS,exhibition_transaction.DISCOUNT, exhibition_transaction.TRANSACTION_TOTAL, exhibition_ticket.EXHIBIT_NUM  FROM exhibition_ticket, exhibition_transaction WHERE exhibition_transaction.DATE_OF_SALE LIKE ? AND exhibition_transaction.DATE_OF_SALE LIKE ? AND exhibition_ticket.EXHIBIT_NUM=? AND exhibition_ticket.TICKET_ID=exhibition_transaction.TICKET_ID',['%' + spl[0]+ '%', '%' + spl[2] + '%', genID], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					gen+="<tr><td>" + results.at(i)['TICKET_TRANSACTION_ID'] + "</td><td>" + results.at(i)['DATE_OF_SALE'] + "</td><td>" + results.at(i)['EXHIBIT_NUM'] + "</td><td>" + results.at(i)['TICKET_ID'] + "</td><td>" + results.at(i)['VISIT_ID'] + "</td><td>" + results.at(i)['NUM_PURCHASED_U_12'] + "</td><td>" + results.at(i)['NUM_PURCHASED_12_TO_65'] + "</td><td>" + results.at(i)['NUM_PURCHASED_65_PLUS']+ "</td><td>" + results.at(i)['DISCOUNT'] + "</td><td>" + results.at(i)['TRANSACTION_TOTAL']+"</td></tr>";
					gentotal+=parseInt(results.at(i)['TRANSACTION_TOTAL']);
					
				}

			});
			connection.query('SELECT exhibition_transaction.TICKET_TRANSACTION_ID, exhibition_transaction.DATE_OF_SALE,exhibition_transaction.TICKET_ID, exhibition_transaction.VISIT_ID, exhibition_transaction.NUM_PURCHASED_U_12, exhibition_transaction.NUM_PURCHASED_12_TO_65, exhibition_transaction.NUM_PURCHASED_65_PLUS,exhibition_transaction.DISCOUNT, exhibition_transaction.TRANSACTION_TOTAL, exhibition_ticket.EXHIBIT_NUM  FROM exhibition_ticket, exhibition_transaction WHERE exhibition_transaction.DATE_OF_SALE LIKE ? AND exhibition_transaction.DATE_OF_SALE LIKE ? AND exhibition_ticket.EXHIBIT_NUM NOT LIKE ? AND exhibition_ticket.TICKET_ID=exhibition_transaction.TICKET_ID',['%' + spl[0]+ '%', '%' + spl[2] + '%', '%'+genID+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					spec+="<tr><td>" + results.at(i)['TICKET_TRANSACTION_ID'] + "</td><td>" + results.at(i)['DATE_OF_SALE'] + "</td><td>" + results.at(i)['EXHIBIT_NUM']+ "</td><td>" + results.at(i)['TICKET_ID'] + "</td><td>" + results.at(i)['VISIT_ID'] + "</td><td>" + results.at(i)['NUM_PURCHASED_U_12'] + "</td><td>" + results.at(i)['NUM_PURCHASED_12_TO_65'] + "</td><td>" + results.at(i)['NUM_PURCHASED_65_PLUS']+ "</td><td>" + results.at(i)['DISCOUNT'] + "</td><td>" + results.at(i)['TRANSACTION_TOTAL']+"</td></tr>";
					spectotal+=parseInt(results.at(i)['TRANSACTION_TOTAL']);
					
				}
				total = gentotal+spectotal;
				response.render("Exhibition_Report", {genentries: gen, specentries: spec, gentotal: gentotal, spectotal: spectotal,  total: total, start: start, end: end});
				response.end();
			});
		}
	}
	else if(typeof request.body.report2 === "undefined" && typeof request.body.report2 === "undefined" && typeof request.body.report4 === "undefined") { // for GIFT SHOP REVENUE
		var vals="";
		var total= 0;
		var start = request.body.startdate1;
		var end = request.body.enddate1;
		var spl = request.body.startdate1.split('-');
		// start date and end date sanitization
		if(!start) {
			response.send("Start Date is required.");
		  }
		  else if(!/^\d{2}-\d{2}-\d{4}$/.test(start)) {
			response.send("Start Date must be formatted like 'MM-DD-YYYY'.");
		  }
		  else if(parseInt(start.substring(0,2)) > 12 || parseInt(start.substring(0,2) < 1)){
			response.send("Start Date month must be between 1 and 12.");
		  }
		  else if(parseInt(start.substring(3,5)) > 31 || parseInt(start.substring(3,5) < 1)){
			response.send("Start Date day must be between 1 and 31.");
		  }
		  if(!end) {
			response.send("End Date is required.");
		  } else if(!/^\d{2}-\d{2}-\d{4}$/.test(end)) {
			response.send("End Date must be formatted like 'MM-DD-YYYY'.");
		  } else if(parseInt(end.substring(0,2)) > 12 || parseInt(end.substring(0,2) < 1)){
			response.send("End Date month must be between 1 and 12.");

		  }
		  else if(parseInt(end.substring(3,5)) > 31 || parseInt(end.substring(3,5) < 1)){
			response.send("End Date day must be between 1 and 31.");

		  }else if(parseInt(end.substring(6,10)) < parseInt(start.substring(6,10))){
			response.send("End Date must be after Start Date.");

		  } else if((parseInt(end.substring(0,2)) < parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10)))){
			response.send("End Date must be after Start Date.");

			} else if((parseInt(end.substring(3,5)) < parseInt(start.substring(3,5))) && (parseInt(end.substring(0,2)) == parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10))) ){
			  response.send("End Date must be after Start Date.");

		  }
		else {	// start date and end date are valid
			connection.query('SELECT * FROM gift_shop_transaction WHERE DATE_OF_SALE LIKE ? AND DATE_OF_SALE LIKE ?',['%' + spl[0]+ '%', '%' + spl[2] + '%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					vals+="<tr><td>" + results.at(i)['GIFT_SHOP_TRANSACTION_ID'] + "</td><td>" + results.at(i)['DATE_OF_SALE'] + "</td><td>" + results.at(i)['ITEM_ID'] + "</td><td>" + results.at(i)['VISIT_ID'] + "</td><td>" + results.at(i)['NUM_ITEMS_PURCHASED'] + "</td><td>" + results.at(i)['DISCOUNT'] + "</td><td>" + results.at(i)['TRANSACTION_TOTAL'] +"</td><tr>";
					total+=parseInt(results.at(i)['TRANSACTION_TOTAL']);

				}
				response.render("Gift_report", {entries: vals, total: total, start: start, end: end});
				response.end();
			});	
		}
	}
	else {// for hours worked
		var d1 ="";
		var d2 ="";
		var d3 ="";
		var d4 ="";
		var d5 ="";
		var d6 ="";
		var d7 ="";
		var d8 ="";
		var d9 ="";
		var d10 ="";
		var d11="";		
		var d1total=0;
		var d2total=0;
		var d3total=0;
		var d4total=0;
		var d5total=0;
		var d6total=0;
		var d7total=0;
		var d8total=0;
		var d9total=0;
		var d10total=0;
		var d11total=0;		
		var total=0;
		var start = request.body.startdate2;
		var end = request.body.enddate2;
		var spl = request.body.startdate2.split('-');

		// start date and end date sanitization
		if(!start) {
			response.send("Start Date is required.");
		  }
		  else if(!/^\d{2}-\d{2}-\d{4}$/.test(start)) {
			response.send("Start Date must be formatted like 'MM-DD-YYYY'.");
		  }
		  else if(parseInt(start.substring(0,2)) > 12 || parseInt(start.substring(0,2) < 1)){
			response.send("Start Date month must be between 1 and 12.");
		  }
		  else if(parseInt(start.substring(3,5)) > 31 || parseInt(start.substring(3,5) < 1)){
			response.send("Start Date day must be between 1 and 31.");
		  }
		  if(!end) {
			response.send("End Date is required.");
		  } else if(!/^\d{2}-\d{2}-\d{4}$/.test(end)) {
			response.send("End Date must be formatted like 'MM-DD-YYYY'.");
		  } else if(parseInt(end.substring(0,2)) > 12 || parseInt(end.substring(0,2) < 1)){
			response.send("End Date month must be between 1 and 12.");

		  }
		  else if(parseInt(end.substring(3,5)) > 31 || parseInt(end.substring(3,5) < 1)){
			response.send("End Date day must be between 1 and 31.");

		  }else if(parseInt(end.substring(6,10)) < parseInt(start.substring(6,10))){
			response.send("End Date must be after Start Date.");

		  } else if((parseInt(end.substring(0,2)) < parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10)))){
			response.send("End Date must be after Start Date.");

			} else if((parseInt(end.substring(3,5)) < parseInt(start.substring(3,5))) && (parseInt(end.substring(0,2)) == parseInt(start.substring(0,2))) && (parseInt(end.substring(6,10)) == parseInt(start.substring(6,10))) ){
			  response.send("End Date must be after Start Date.");

		  } 
		  else {	// when start date and end date are valid
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[1, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d1+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d1total+=parseInt(results.at(i)['HOURSWORKED']);

				}
			});	
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[2, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d2+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d2total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});		
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[3, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d3+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d3total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});		
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[4, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d4+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d4total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});	
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[5, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d5+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d5total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});	
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[6, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d6+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d6total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});	
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[7, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d7+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d7total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});	
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[8, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d8+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d8total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});	
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[9, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d9+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d9total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[10, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d10+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d10total+=parseInt(results.at(i)['HOURSWORKED']);
				}
			});				
			connection.query('SELECT employee.FNAME, employee.MNAME, employee.LNAME, works_on.EMPNUMBER, works_on.HOURSWORKED, works_on.DEPNUM FROM works_on, employee WHERE EMPNUMBER=EMPLOYEE_ID AND works_on.DEPNUM=? AND works_on.MONTHOF LIKE ?',[11, spl[0]+'%'], function(error, results, fields) {
				if(error) console.log(error);
				for(i = 0; i < results.length; i++) {
					d11+="<tr><td>" + results.at(i)['FNAME'] + "</td><td>" + results.at(i)['MNAME'] + "</td><td>" + results.at(i)['LNAME'] + "</td><td>" + results.at(i)['EMPNUMBER'] + "</td><td>" + results.at(i)['HOURSWORKED'] + "</td><td>" + results.at(i)['DEPNUM'] +"</td><tr>";
					d11total+=parseInt(results.at(i)['HOURSWORKED']);
				}
				total = d1total + d2total + d3total + d4total + d5total + d6total+ d7total + d8total + d9total + d10total + d11total;

				response.render("Hours_Report", {d1entries: d1,d1total: d1total, d2entries: d2,d2total: d2total, d3entries: d3,d3total: d3total, d4entries: d4,d4total: d4total, d5entries: d5,d5total: d5total, d6entries: d6,d6total: d6total, d7entries: d7,d7total: d7total, d8entries: d8,d8total: d8total, d9entries: d9,d9total: d9total, d10entries: d10,d10total: d10total, d11entries: d11,d11total: d11total,  total: total, start: start, end: end});
				response.end();		
			});	
											
														
		}
	}
});	

// this exists to handle display of the "Gift Shop Messages" page from the menu bar 
app.post('/giftshop_error_afterlogin', function(request, response) {
	const notResolved = 'no';
	var vals = "";
	// load the unresolved 'Gift Shop Error' messages from the 'gift_shop_error' table 
	connection.query('SELECT * FROM gift_shop_error WHERE RESOLVED=?',[notResolved] , function(error, results, fields) {
		if (error) throw error;
		console.log(error);
		if(results.length > 0) {	// there are unresolved errors
			for (let i = 0; i < results.length; i++) {                                                                                   
				vals+= "<tr><td>" + results.at(i)['ERROR_ID'] + "</td><td>" + results.at(i)['ERROR_DATE'] + "</td><td>" + results.at(i)['MESSAGE'] +  "</td></tr>";
			}
		}
		else {    // there are no unresolved errors
			vals+= "<tr><td> There are currently no unresolved Errors!</td></tr>";
		}
		response.render('giftshop_login_frontpage', {values: vals});
		response.end();
	});

}); 

app.post('/giftshop_error_resolve', function(request, response) {

	const isResolved = "yes";
	const notResolved = "no";
	var vals = "";

	// checking if Error ID exists
	connection.query('SELECT * FROM gift_shop_error WHERE ERROR_ID=? && RESOLVED=?', [request.body.inputfield, notResolved], function(error, results, fields) {
		if(error) throw error;
		console.log(error);
		
		if(results.length > 0) { // the error exists 
			// update the entry by changing "Mark as Resolved" to "yes" 
			connection.query('UPDATE gift_shop_error SET RESOLVED=? WHERE ERROR_ID=?',[isResolved, request.body.inputfield], function(error, results, fields) {
				if (error) throw error;
				console.log(error);
			});

			// load the unresolved 'Gift Shop Error' messages from the 'gift_shop_error' table, which will return one less entry 
			connection.query('SELECT * FROM gift_shop_error WHERE RESOLVED=?',[notResolved] , function(error, results, fields) {
				if (error) throw error;
				console.log(error);
				if(results.length > 0) {	// when there are unresolved errors
					for (let i = 0; i < results.length; i++) {                                                                                   
						vals+= "<tr><td>" + results.at(i)['ERROR_ID'] + "</td><td>" + results.at(i)['ERROR_DATE'] + "</td><td>" + results.at(i)['MESSAGE'] +  "</td></tr>";
					}
					var resolveMessage = "<tr><td> Issue \"Marked as Resolved\" for ID " + request.body.inputfield + "</td></tr>";
					response.render('giftshop_error_resolved', {values: vals, message: resolveMessage});
					response.end();
				}
				else {	// when there are no unresolved errors 
					var resolveMessage = "<tr><td> Issue \"Marked as Resolved\" for ID " + request.body.inputfield + "</td></tr>" + "<tr><td> There are currently no unresolved Errors!</td></tr>";
					response.render('giftshop_error_resolved', {values: vals, message: resolveMessage});
					response.end();
				}	


			});
					
		}
		else { // the error does not exist 
			// load the unresolved 'Gift Shop Error' messages from the 'gift_shop_error' table, which will return one less entry 
			connection.query('SELECT * FROM gift_shop_error WHERE RESOLVED=?',[notResolved] , function(error, results, fields) {
				if (error) throw error;
				console.log(error);

				if(results.length > 0) {	// when there are unresolved notifications
					for (let i = 0; i < results.length; i++) {                                                                                   
						vals+= "<tr><td>" + results.at(i)['ERROR_ID'] + "</td><td>" + results.at(i)['ERROR_DATE'] + "</td><td>" + results.at(i)['MESSAGE'] +  "</td></tr>";
					}
				}
				else {    // when there are no unresolved notifications
					vals+="<tr><td> There are currently no unresolved Error!</td></tr>";
				}

				const msg = "<tr><td> ID " + request.body.inputfield + " does not exist or is already resolved. Please enter an existing unresolved Error ID. </td></tr>";
				response.render('giftshop_error_resolved', {values: vals, message: msg});
				response.end();
			});		
		}
	});


	

});


app.post('/employee_filmticket_altpull', function(request, response) {
	var vals = "";
	// load the entries from the 'theater_ticket' table 
	connection.query('SELECT * FROM theater_ticket' , function(error, results, fields) {
		if (error) throw error;
		console.log(error);

		for (let i = 0; i < results.length; i++) {                                                                                   
			vals+= "<tr><td>" + result.at(i)['FILM_NAME'] + "</td><td>"+  result.at(i)['THEATER_TICKET_ID']+ "</td><td>" + result.at(i)['FILM_ID']  + "</td><td>" + result.at(i)['COST_U_12'] + "</td><td>" + result.at(i)['COST_12_TO_65'] + "</td><td>" + result.at(i)['COST_65_PLUS'] +  "</td><td>" + result.at(i)['SEAT_COUNT'] + "</td><td>" + result.at(i)['DATE_OF_EVENT'] + "</td><td>"+ result.at(i)['EVENT_START_TIME'] + "</td><td>"+ result.at(i)['EVENT_END_TIME'] + "</td><tr>";	
		}
	
		response.render('visitor_login_frontpage', {values: vals});
		response.end();
	});

}); 

// this exists to handle display of the "Musuem Update Messages" page from the menu bar 
app.post('/visitor_museumupdatemessages_afterlogin', function(request, response) {
	var vals = "";
	// load the 'Museum Update' messages from the 'visitor_newaddition_messages' table 
	connection.query('SELECT * FROM visitor_newaddition_messages ORDER BY ADDITION_DATE DESC'  , function(error, results, fields) {
		if (error) throw error;
		console.log(error);
		if(results.length > 0) {	// there are update messages
			for (let i = 0; i < results.length; i++) {                                                                                   
				vals+= "<tr><td>" + results.at(i)['ADDITION_DATE'] + "</td><td>" + results.at(i)['ADDITION_MESSAGE'] +  "</td></tr>";
			}
		}
		else {    // there are no update messages
			vals+= "<tr><td> There are currently no Museum Update Messages!</td></tr>";
		}
		response.render('visitor_login_frontpage', {values: vals});
		response.end();
	});

}); 




app.listen(3000, '0.0.0.0');

