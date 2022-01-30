const sqlite = require('sqlite3').verbose();
const db = myDatabase('./phones.db');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/items', (req, res) => {
    db.all('SELECT * FROM phones', (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.json(rows);
        }
    });
});

app.get('/items/:id', (req, res) => {
    const id = req.params.id;
    
    db.all('SELECT * FROM phones WHERE id=?', id, (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.json(rows);
        }
    });
});

app.post('/items', (req, res) => {
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
});

app.delete('/items/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM phones WHERE id=?', id, (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send();
        }
    });
});

app.put('/items/:id', (req, res) => {
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
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

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