const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const { check, validationResult } = require('express-validator');

// Inicio Config nodemailer
// 1 - Configurar los datos del servidor de email
const miniOutlook = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'harvey.mante@ethereal.email',
        pass: 'r57ND7BZV9NxmgFnem'
    }
})
// 2 - Verificar conexión con el servidor de email
// miniOutlook.verify(function(error,ok){ // callback: hacer tal cosa
// 	if(error){
// 		console.log("Error:")
// 		console.log(error.response)
// 	}else{
// 		console.log("Recibido")
// 	}
// })
// Fin Config nodemailer

const server = express()

const port = 8080

const public = express.static("public")

const json = bodyParser.json()

const urlencoded = bodyParser.urlencoded({ extended: false })

/* Buscar archivos estáticos en el directorio /public */
server.use( public )
server.use( json )
server.use( urlencoded )

server.listen( port )

// Ejecutar endpoints customizados
server.get("/", function(req, res){
	res.end("<a type='button' href='/formulario.html'>ir a formulario</a>")
})


server.post("/enviar", [
	check('nombre')
	.not().isEmpty()
	.isLength({ min: 5 })
	.withMessage('el nombre debe contener 5 caracteres como minimo'),
	check('correo')
	.not().isEmpty()
	.isEmail()
	.isLength({ min: 5 }),
], (request, response) => {

	let datos = {
		rta: "ok",
		consulta: request.body
	}

	const errors = validationResult(request);

	if(!errors.isEmpty()){
		const error = document.querySelector('.error')
		return response.status(422).json({
			errors: errors.array()
		});
	}

	response.status(202).json({
		succes: 'ok',
		datos: request.body
	})

	// tarea 1: validar que no esten vacios los campos antes de enviar el mail
	// tarea 2: definir un mensaje si sale bien o si sale mal.
	// bootstrap
	
	// Envio de mail
	// miniOutlook.sendMail({
	// 	from: datos.consulta.correo,
	// 	to: "harvey.mante@ethereal.email",
	// 	subject: datos.consulta.asunto,
	// 	html: "<strong>" + datos.consulta.mensaje + "</strong>"
	// })

	response.json(datos)
})