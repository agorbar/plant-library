const Database = require('better-sqlite3');
const db = new Database('plants.db');

function initDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS plants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            location TEXT,
            watering_frequency TEXT,
            notes TEXT
        )
    `;
    

    db.exec(createTableQuery);


    const rowCount = db.prepare('SELECT COUNT(*) as count FROM plants').get();

    
    if (rowCount.count === 0) {
        const testPlants = [
            { name: 'Peikonlehti', species: 'Monstera deliciosa', location: 'Olohuone', watering_frequency: '1x viikossa', notes: 'Pitää hajavalosta' },
            { name: 'Kultaköynnös', species: 'Epipremnum aureum', location: 'Makuuhuone', watering_frequency: '2 viikon välein', notes: 'Helppohoitoinen' },
            { name: 'Rahapuu', species: 'Crassula ovata', location: 'Ikkunalauta', watering_frequency: '1x kuukaudessa', notes: 'Kestää kuivuutta' },
            { name: 'Palmuvehka', species: 'Zamioculcas zamiifolia', location: 'Eteinen', watering_frequency: '1x kuukaudessa', notes: 'Pärjää vähässä valossa' },
            { name: 'Lyyraviikuna', species: 'Ficus lyrata', location: 'Olohuone', watering_frequency: '1x viikossa', notes: 'Sumuta lehtiä säännöllisesti' }
        ];

        const insert = db.prepare(`
            INSERT INTO plants (name, species, location, watering_frequency, notes) 
            VALUES (@name, @species, @location, @watering_frequency, @notes)
        `);

        const insertMany = db.transaction((plants) => {
            for (const plant of plants) {
                insert.run(plant);
            }
        });

        insertMany(testPlants);
        console.log('Tietokanta alustettu ja 5 testikasvia lisätty.');
    } else {
        console.log('Tietokannassa on jo dataa, ohitetaan testidatan lisäys.');
    }
}


module.exports = {
    db,
    initDatabase
};