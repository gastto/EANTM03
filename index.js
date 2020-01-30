const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")
const Joi = require("@hapi/joi")
const hbs = require("nodemailer-express-handlebars")

// #region Inicio Config nodemailer 

	// 1 - Configurar los datos del servidor de email
	const miniOutlook = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: 'jeremy.reichel66@ethereal.email',
			pass: 'ANnS1g6881tEh5AYkJ'
		}
	})
	// 2 - Verificar conexión con el servidor de email
	miniOutlook.verify(function(error,ok){ // callback: hacer tal cosa
		if(error){
			console.log("Error en el envio de correo:")
			console.log(error.response)
		}else{
			console.log("Funciona el envio de correo")
		}
	})

	// 3 - Asignar motor de plantilla y Conectar con handlebars
	const render = {
		viewEngine: {
			layoutsDir: "templates/",
			partialsDir: "templates/",
			defaultLayout: false,
			extName: ".hbs"
		},
		viewPath: "templates/",
		extName: ".hbs"
	}
	miniOutlook.use('compile', hbs(render));

// #endregion Fin Config nodemailer

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

	const schema = Joi.object({
		nombre: Joi.string().min(3).max(30).required(),
		correo: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
		asunto: Joi.string().alphanum().valid('ax45','ax38','ax67','ax14').required(),
		mensaje: Joi.string().min(10).max(200).required(),
		fecha: Joi.date().timestamp('unix')
	});

	let validacion = schema.validate(datos.consulta)

	if( validacion.error ){
		response.json( validacion.error )
	}else{
		// Envio de mail
		miniOutlook.sendMail({
			from: datos.consulta.correo,
			to: "jeremy.reichel66@ethereal.email",
			subject: datos.consulta.asunto,
			// html: "<strong>" + datos.consulta.mensaje + "</strong>"
			template: "prueba",
			context: datos.consulta
		}, 	function(error, info){
				let msg = error ? 'Su consulta no pudo ser enviada' : 'Gracias por su consulta'
				response.json({ msg })
			})
	}

});

	// implementar el sistema de plantillas handlebars + envío de email
	// url: nodemailer-express-handlebar








	// #region EXAMPLE "validacion manual" 
	// if( datos.consulta.nombre == "" || datos.consulta.nombre == null ){
	// 	response.json({
	// 		rta: "Error",
	// 		msg: "El nombre no puede quedar vacio"
	// 	})
	// }else if(datos.consulta.correo == null || datos.consulta.correo.indexOf("@") == -1 ) {
	// 	response.json({
	// 		rta: "error",
	// 		mgs: "Ingrese un correo valido..."
	// 	})
	// }else if( datos.consulta.asunto == null ){
	// 	response.json({
	// 		rta: "error",
	// 		mgs: "Elija un asunto"
	// 	})
	// }else if( datos.consulta.mensaje.length < 50 || datos.consulta.mensaje.length > 200 ){
	// 	response.json({
	// 		rta: "error",
	// 		mgs: "Ingrese un mensaje entre 50 y 200 caracteres"
	// 	})
	// }else {

	// // Envio de mail
	// miniOutlook.sendMail({
	// 	from: datos.consulta.correo,
	// 	to: "harvey.mante@ethereal.email",
	// 	subject: datos.consulta.asunto,
	// 	html: "<strong>" + datos.consulta.mensaje + "</strong>"
	// })

	// response.json(datos)
	// }
	// #endregion
