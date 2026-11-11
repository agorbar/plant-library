const express = require('express');
const { db, initDatabase } = require('./database.js');

const app = express();
const PORT = 3000;


try {
    initDatabase();
} catch (error) {
    console.error("Virhe tietokannan alustuksessa:", error);
}


app.use(express.json());
app.use(express.static('.'));


app.get('/plants', (req, res) => {
    try {
        const plants = db.prepare('SELECT * FROM plants').all();
        res.json(plants);
    } catch (error) {
        console.error("Virhe haettaessa kasveja:", error);
        res.status(500).json({ error: "Sisäinen palvelinvirhe" });
    }
});


app.get('/plants/:id', (req, res) => {
    try {
        const id = req.params.id;
        const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(id);
        
        if (plant) {
            res.json(plant);
        } else {
            res.status(404).json({ error: "Kasvia ei löytynyt" });
        }
    } catch (error) {
        console.error(`Virhe haettaessa kasvia ID:llä ${req.params.id}:`, error);
        res.status(500).json({ error: "Sisäinen palvelinvirhe" });
    }
});


app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});