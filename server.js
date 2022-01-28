const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');


const express = require('express');
const app = express();


// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// TODO: set the appropriate HTTP response headers and HTTP response codes here.

app.get('/items', function(req, res) {
    db.all('SELECT * FROM phones', function(err, rows) {
        if (err) {
            return res.status(500).send(error);
        } else {
            return res.json(rows);
        }
    });
});

app.post('/items', function(req, res) {
    
    
    const _body = req.body
    _body.brand = req.body.brand,
    _body.model = req.body.model,
    _body.os = req.body.os,
    _body.image = req.body.image,
    _body.screensize = req.body.screensize
      

    db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
    [_body], function(err) {
      if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send();
        }
    });
  
    
     //db.close();
  
});

app.put('/items/:id', function(req, res){

    const item = {
        brand: req.body.topic,
        model: req.body.date,
        os: req.body.body,
        image: req.body.images,
        screensize: req.body.files
    };

    db.run(`UPDATE phones SET brand = ?, model = ?, os = ?, image = ?, screensize, ? WHERE id = ${req.params.id}`, [item.brand, item.model, item.os, item.image, item.screensize], function(err){
        if(err){

            return console.error(err.message);

        }

        console.log(`Row updated`);
    })



})

app.get('/db-example', function(req, res) {
    db.all(`SELECT * FROM phones WHERE id=?`, ['Fairphone'], function(err, rows) {

    	// # Return db response as JSON
    	return res.json(rows)
    });
});

app.post('/post-example', function(req, res) {
	// This is just to check if there is any data posted in the body of the HTTP request:
	console.log(req.body);
	return res.json(req.body);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}