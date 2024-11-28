const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configuración para el uso de peticiones POST
app.use(bodyParser.urlencoded({ extended: false }));

// Motor de plantillas EJS
app.set('view engine', 'ejs');

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345', // Aquí coloca tu contraseña de MySQL
    database: 'registro', // El nombre de tu base de datos
    port: 3306,
    charset: 'utf8mb4'  // Configura la codificación adecuada para manejar caracteres especiales
});

// Comprobación de la conexión de la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});


const port = 3009;
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor en funcionamiento desde http://192.168.1.214:${port}`);
});

// Ruta principal: mostrar la lista de usuarios
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.send('Error');
        } else {
            // Verificar si hay un mensaje en la URL (por ejemplo, después de agregar un usuario)
            const message = req.query.message || ''; // Si no hay mensaje, se pasa un string vacío
            res.render('index', { users: results, message: message });
        }
    });
});

// Mostrar formulario para agregar un nuevo usuario
app.get('/add', (req, res) => {
    res.render('add');
});

// Agregar un nuevo usuario
app.post('/add', (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, escuela, carrera, telefono, correo } = req.body;
    const query = 'INSERT INTO users (nombre, apellido_paterno, apellido_materno, escuela, carrera, telefono, correo) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [nombre, apellido_paterno, apellido_materno, escuela, carrera, telefono, correo], (err) => {
        if (err) {
            console.error('Error al agregar usuario:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

// Mostrar formulario de edición de usuario
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            res.send('Error');
        } else {
            res.render('edit', { user: results[0] });
        }
    });
});

// Actualizar usuario
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, escuela, carrera, telefono, correo } = req.body;

    const query = `
        UPDATE users 
        SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, escuela = ?, carrera = ?, telefono = ?, correo = ?
        WHERE id = ?
    `;

    db.query(query, [nombre, apellido_paterno, apellido_materno, escuela, carrera, telefono, correo, id], (err) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

// Eliminar usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});
