const mysql = require('mysql2');

const connection = mysql.createConnection({

    host: 'localhost',
    port: 3311,
    user: 'root',
    password: '1234',
    database: 'ProyectoExpress'

});

connection.connect((error) =>{

    if(error){
        console.log('Error conectando con la base de datos', error);
        return
    }else{
        console.log('Conectado a la base de Datos');
    }
});

module.exports = connection;