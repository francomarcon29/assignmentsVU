const sqlite = require('sqlite3').verbose();
const db = myDatabase('./phones.db');

const express = require('express');
const methodOverride = require('method-override');
const app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.use(methodOverride('_method'));

//Routes test

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

const path = require('path');

app.get('/', function getItemsController(req, res) {
    db.all('SELECT * FROM phones', (err, phones) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            res.render(path.resolve("./index.ejs"), {phones});
        }
    })
});

app.put('/items/:id', function putItemsIdController(req, res) {
    const id = req.params.id;
    const item = {
        brand: req.body.brand,
        model: req.body.model,
        os: req.body.os,
        image: req.body.image,
        screensize: req.body.screensize
    };

    if (typeof item.screensize != 'number') {
        return res.status(400).send('Screensize has to be a number'); // TODO: number?
    }

    db.run('UPDATE phones SET brand=?, model=?, os=?, image=?, screensize=? WHERE id=?', [item.brand, item.model, item.os, item.image, item.screensize, id], (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send();
        }
    });
})

app.get('/items/delete/:id', function deleteItemsIdController(req, res) {
    const id = req.params.id;

    db.run('DELETE FROM phones WHERE id=?', id, (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            res.redirect('/#main_table');
        }
    });
})



// TODO: split controllers into controller and service
// TODO: add tests for every route and make them runnable via `npm test`
// TODO: make index.html work with this server and modify it to support all CRUD operations
// TODO: change JSON response body fields in docs to h3> Response body p> JSON blabla MIME
/*
app.get('/items', getItemsController(req, res));

app.get('/items/:id', getItemsIdController(req, res));

app.post('/items', postItemsController(req, res));

app.delete('/items/:id', deleteItemsIdController(req, res));

app.put('/items/:id', putItemsIdController(req, res));
*/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
/*
function getItemsController(req, res) {
    db.all('SELECT * FROM phones', (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.json(rows);
        }
    }).then(phones => {

        res.render("./index.ejs", {phones});

    }).catch(error => res.send(error))
}
*/

/*
function getItemsIdController(req, res) {
    const id = req.params.id;

    db.all('SELECT * FROM phones WHERE id=?', id, (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.json(rows);
        }
    });
}
*/
function postItemsController(req, res) {
    const item = {
        brand: req.body.brand,
        model: req.body.model,
        os: req.body.os,
        image: req.body.image,
        screensize: req.body.screensize
    };

    if (typeof item.screensize != 'number') {
        return res.status(400).send('Screensize has to be a number'); // TODO: number?
    }

    db.run('INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)',
    [item.brand, item.model, item.os, item.image, item.screensize], (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send();
        }
    });
}

function deleteItemsIdController(req, res) {
    const id = req.params.id;

    db.run('DELETE FROM phones WHERE id=?', id, (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send();
        }
    });
}
/*
function putItemsIdController(req, res) {
    const id = req.params.id;
    const item = {
        brand: req.body.brand,
        model: req.body.model,
        os: req.body.os,
        image: req.body.image,
        screensize: req.body.screensize
    };

    if (typeof item.screensize != 'number') {
        return res.status(400).send('Screensize has to be a number'); // TODO: number?
    }

    db.run('UPDATE phones SET brand=?, model=?, os=?, image=?, screensize=? WHERE id=?', [item.brand, item.model, item.os, item.image, item.screensize, id], (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send();
        }
    });
}*/

function myDatabase(filename) {
	const db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database');
	});
    
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones (
            id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	);
        `);
		db.all('SELECT COUNT(*) AS count FROM phones', (err, result) => {
			if (result[0].count === 0) {
				db.run('INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)',
				['Fairphone', 'FP3', 'Android', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg', '5.65']);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log('Database already contains', result[0].count, 'item(s) at startup');
			}
		});
	});

	return db;
}

/*
exports.myDatabase = myDatabase;
exports.getItemsController = getItemsController;
exports.postItemsController = postItemsController;
exports.getItemsIdController = getItemsIdController;
exports.putItemsIdController = putItemsIdController;
exports.deleteItemsIdController = deleteItemsIdController;*/