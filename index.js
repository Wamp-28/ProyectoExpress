const express = require('express');
const connection = require('./db');
const path = require('path');
const cors = require('cors');  // Importa el paquete cors



const app = express();

// Habilita CORS para todas las solicitudes - SE DEBE INTALAR EL CORS
app.use(cors());  // Esto permite todas las solicitudes CORS desde cualquier origen

// Encargado de parsear a los json
app.use(express.json());

app.use(express.urlencoded({extended:true}));

// Archivos html
//app.use(express.static(path.join(__dirname, 'templates')));




// Ruta prueba 
app.get('/api/prueba', (req, res)=>{

    res.send('Api funcionando de manera correcta');

});


app.get('/api/prueba1', (req, res)=>{

    res.status(200).json({
        message: 'LA API RESPONDE CORRECTAMENTE',
        port: PORT,
        status: 'success'

    });

});


// Crear registro
app.post('/api/guardar', (req,res) =>{

    const {cedula, nombre, edad, profesion} = req.body;

    const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES (?, ?, ?, ?)'; 
   
    connection.query(query, [cedula, nombre, edad, profesion], (error, result)=>{

        if(error){
            res.status(500).json({error});

        }else{
           // res.status(201).json({cedula: result.insertId, cedula, nombre, edad, profesion});
           res.status(201).json({cedula, nombre, edad, profesion});

        }

    });

});


// Obtener registros de la base de datos
app.get('/api/obtener', (req,res) => {

    const query = 'select * from persona'; 
    connection.query(query, (error, result)=>{

        if(error){
            res.status(500).json({

                success: false,
                message: "Error al recuperar los datos",
                details: error.message
               
            });
        }else{
            res.status(200).json({

                success: true,
                message: "Datos de la tabla",
                data: result 

            });
        }

    });

});

// Obtener un registro por CEDULA
app.get('/api/obtener/:cedula', (req, res) => {
    // Obtener la cedula del parámetro de la URL
    const cedula = req.params.cedula;

    // Definir la consulta SQL para obtener un registro con la cedula especificada
    const query = 'SELECT * FROM persona WHERE cedula = ?';

    // Ejecutar la consulta SQL
    connection.query(query, [cedula], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al recuperar los datos",
                details: error.message
            });
        } else {
            // Si no hay resultados, devolvemos un mensaje indicando que no se encontró el registro
            if (result.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No se encontró la persona con la cedula proporcionada"
                });
            } else {
                // Si se encuentra el registro, devolver los datos
                res.status(200).json({
                    success: true,
                    message: "Datos de la persona",
                    data: result[0] // Solo devolvemos el primer registro (ya que debe ser único)
                });
            }
        }
    });
});



// API para eliminar registro
app.delete('/api/eliminar/:cedula', (req,res)=>{

    const {cedula}= req.params;
    const query = 'DELETE FROM persona WHERE cedula = ?';
    connection.query(query, [cedula], (error, result)=>{

        if(error){
            res.status(500).json({

                success: false,
                message: "Error al Eliminar el registro",
                details: error.message
               
            });
        }
        else if(result.affectedRows === 0){
            res.status(404).json({

                success: false,
                message: `No existe el registro ${cedula}`,
              
            });
        
        }else{
            res.status(200).json({

                success: true,
                message: "Dato eliminado de la tabla",
                data: result 

            });
        }


    });


});


// API ACTUALIZAR
app.put('/api/actualizar/:cedula', (req, res) =>{
    
    const {cedula}= req.params;

    const {nombre, edad, profesion} = req.body;

    const query = 'UPDATE persona SET nombre = ?, edad = ?, profesion = ? WHERE cedula = ?';

    connection.query(query, [nombre, edad, profesion, cedula], (error, result)=>{

        if(error){
            res.status(500).json({

                success: false,
                message: "Error al actualizar",
                details: error.message
               
            });
        }else{
            res.status(200).json({

                success: true,
                message: "Persona Actualizada",
                data: result
              
            });
        }

    });


});



// Puerto de Conexion del servidor
const PORT = 3000;

app.listen(PORT, ()=>{

    console.log('Servidor Corriendo');

});





