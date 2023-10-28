# cosc3380fall23-team4
This repo holds source files for our COSC 3380 - Database Systems project. 

## Project Description
Our team was tasked to develop a SQL database and accompanying web application (HTML/CSS/Node.js) for the Musuem of Fine Arts Houston (MFAH). Our MySQL database stores information about art works owned by the museum, special exhibitions hosted by the museum, visitor login information, and employee login information. The intention is for any user, be it a visitor or employee, to access the database contents through the web application. 

Based on the type of user, only relevant content will be served. For example, a visitor can only search art works and purchase exhibition tickets. An employee will be able to alter the art work descriptions.

## How it Works
The web application leverages the 'express' and 'mysql2' Node.js modules to convert HTML form data entered on the web application into SQL queries that will be sent to the MySQL database. The output of these queries will be sent to the web application and accordingly displayed to the end user.

## What this Repository Holds
All the relevant web application files will be here (HTML, CSS, JS, Node.js modules). A SQL dump file containing all metadata of the SQL database will also be here.