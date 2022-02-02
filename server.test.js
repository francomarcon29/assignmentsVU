const { TestWatcher } = require('jest');
const { myDatabase, getItemsController, postItemsController, getItemsIdController, putItemsIdController, deleteItemsIdController } = require('./server');
const sqlite = require('sqlite3').verbose();
const db = myDatabase('./phones.db');

test('gets items from db', () => {
    
});