const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const { check, validationResult } = require('express-validator');
const multer = require("multer")

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
miniOutlook.verify(function(error,ok){ // callback: hacer tal cosa
	if(error){
		console.log("Error:")
		console.log(error.response)
	}else{
		console.log("Recibido")
	}
})
// Fin Config nodemailer

const server = express()

const port = 8080

const public = express.static("public")

const json = bodyParser.json()

const urlencoded = bodyParser.urlencoded({ extended: false })

const upload = multer()

/* Buscar archivos estáticos en el directorio /public */
server.use( public )
server.use( json )
server.use( urlencoded )
server.use(upload.array())
server.listen( port )

// Ejecutar endpoints customizados
server.get("/", function(req, res){
	res.end("<a type='button' href='/formulario.html'>ir a formulario</a>")
})


server.post("/enviar", (request, response) => {

	let datos = {
		rta: "ok",
		consulta: request.body
	}

	// const errors = validationResult(request);

	// if(!errors.isEmpty()){
	// 	const error = document.querySelector('.error')
	// 	return response.status(422).json({
	// 		errors: errors.array()
	// 	});
	// }

	// response.status(202).json({
	// 	succes: 'ok',
	// 	datos: request.body
	// })

	// tarea 1: validar que no esten vacios los campos antes de enviar el mail
	// tarea 2: definir un mensaje si sale bien o si sale mal.
	// bootstrapu

	// implementar el modulo joi
	// url https://github.com/hapijs/joi

	if( datos.consulta.nombre == "" || datos.consulta.nombre == null ){
		response.json({
			rta: "Error",
			msg: "El nombre no puede quedar vacio"
		})
	}else if(datos.consulta.correo == null || datos.consulta.correo.indexOf("@") == -1 ) {
		response.json({
			rta: "error",
			mgs: "Ingrese un correo valido..."
		})
	}else if( datos.consulta.asunto == null ){
		response.json({
			rta: "error",
			mgs: "Elija un asunto"
		})
	}else if( datos.consulta.mensaje.length < 50 || datos.consulta.mensaje.length > 200 ){
		response.json({
			rta: "error",
			mgs: "Ingrese un mensaje entre 50 y 200 caracteres"
		})
	}else {

	// Envio de mail
	miniOutlook.sendMail({
		from: datos.consulta.correo,
		to: "harvey.mante@ethereal.email",
		subject: datos.consulta.asunto,
		html: "<strong>" + datos.consulta.mensaje + "</strong>"
	})

	response.json(datos)
	}

})