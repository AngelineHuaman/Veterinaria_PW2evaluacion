
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conectar con la base de datos
const db = new sqlite3.Database('veterinaria.db');

// Crear tabla de mascotas
db.run(`CREATE TABLE IF NOT EXISTS mascotas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    tipo TEXT,
    raza TEXT,
    edad INTEGER,
    dueno TEXT
)`);

// Crear tabla de atenciones
db.run(`CREATE TABLE IF NOT EXISTS atenciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dueno TEXT,
    mascota TEXT,
    fecha TEXT,
    motivo TEXT,
    telefono TEXT
)`);

// Mostrar la pagina principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Guardar mascota
app.post('/guardar-mascota', (req, res) => {
    const { nombre, tipo, raza, edad, dueno } = req.body;

    db.run(
        'INSERT INTO mascotas (nombre, tipo, raza, edad, dueno) VALUES (?, ?, ?, ?, ?)',
        [nombre, tipo, raza, edad, dueno],
        function(error) {
            if (error) {
                res.status(500).send('Error al guardar la mascota');
            } else {
                res.redirect('/index2.html');
            }
        }
    );
});

// Guardar atencion
app.post('/guardar-atencion', (req, res) => {
    const { dueno, mascota, fecha, motivo, telefono } = req.body;

    db.run(
        'INSERT INTO atenciones (dueno, mascota, fecha, motivo, telefono) VALUES (?, ?, ?, ?, ?)',
        [dueno, mascota, fecha, motivo, telefono],
        function(error) {
            if (error) {
                res.status(500).send('Error al guardar la atencion');
            } else {
                res.redirect('/index2.html');
            }
        }
    );
});

// Mostrar mascotas registradas
app.get('/mascotas', (req, res) => {
    db.all('SELECT * FROM mascotas', [], (error, filas) => {
        if (error) {
            res.status(500).send('Error al consultar mascotas');
        } else {
            res.json(filas);
        }
    });
});

// Mostrar atenciones registradas
app.get('/atenciones', (req, res) => {
    db.all('SELECT * FROM atenciones', [], (error, filas) => {
        if (error) {
            res.status(500).send('Error al consultar atenciones');
        } else {
            res.json(filas);
        }
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});