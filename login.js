const mysql = require("mysql");

const express = require("express");

const app = express();

//create object for database
const connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"Megh*2302",
	database:"chatbot"
});

//create connection to database
connection.connect(function(error){
	if (error) {
		throw error;
	}
	else {
		console.log("connected to database");
	}	
});

app.get("/",function(req,res){
	res.sendFile(__dirname + "/test.html");
})

app.listen(5000);

app.use(express.static(__dirname));
