const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")
const Joi = require("@hapi/joi")
const hbs = require("nodemailer-express-handlebars")

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

// 3 - Asignar motor de plantilla y Conectar con handlebars
const render = {
	viewEngine: {
		layoutDir: "templates/",
		partialDir: "templates/",
		defaultLayout: false,
		extName: ".hbs"
	},
	viewPath: "templates/",
	extName: ".hbs"
}
miniOutlook.use('compile', hbs(render));

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

	const schema = Joi.object({
		nombre: Joi.string().min(3).max(30).required(),
		correo: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
		asunto: Joi.string().alphanum().valid('ax45','ax38','ax67','ax14').required(),
		mensaje: Joi.string().min(50).max(200).required(),
		fecha: Joi.date().timestamp('unix')
	});

	let validacion = schema.validate(datos.consulta)

	if( validacion.error ){
		response.json( validacion.error )
	}else{
		// Envio de mail
		miniOutlook.sendMail({
			from: datos.consulta.correo,
			to: "harvey.mante@ethereal.email",
			subject: datos.consulta.asunto,
			//html: "<strong>" + datos.consulta.mensaje + "</strong>"
			template: "prueba",
			context: datos.consulta
		}, function(error, info){

			let msg = error ? 'Su consulta no pudo ser enviada' : 'Gracias por su consulta'

			response.json({ msg })
		})

	}


	// implementar el sistema de plantillas handlebars + envío de email
	//url: nodemailer-express-handlebar








		// const { err, value } = schema.validate(datos.consulta)
		// response.send(value)
		// if (err) {
        //     // send a 422 error response if validation fails
        //     response.status(422).json({
        //         status: 'error',
        //         msg: 'Invalid request data',
        //         datos: value
        //     });
        // } else {
        //     // send a success response if validation passes
		// 	// attach the random ID to the data response
        //     response.json({
		// 		status: 'success',
        //         msg: 'User created successfully',
        //         datos: value
        //     });
        // }



	// try {
	// 	const value = await schema.validateAsync(request.body);
	// 	console.log(value)
	// 	response.json({message: datos
		
	// 	})
	// }
	// catch (err) {
	// 	console.log(err)
	//  }

	// const result = schema.validate(request.body)
	// if (result.error) {
	//   return res.status(400).json({ error: result.error });
	// }

	// 	schema.validate(request.body, (err, value) => {


    //     if (err) {
	// 		console.log(err)
    //         // send a 422 error response if validation fails
    //         response.status(422).json({
    //             status: 'error',
    //             message: 'Invalid request data',
    //             data: data
    //         });
    //     } else {
	// 		console.log(value)
    //         // send a success response if validation passes
    //         // attach the random ID to the data response
    //         response.json({
    //             status: 'success',
    //             message: 'User created successfully',
    //             data: Object.assign(datos)
    //         });
    //     }

    // });

	// try {
	// 	const value = await schema.validateAsync({ datos });
	// }
	// catch (err) { "error" }

	// Joi.validate(request.body, schema,(err, result) => {	
	// 	if(err){
	// 		console.log(err)
	// 		response.send("error")
	// 	}
	// 	console.log(result)
	// 	response.send('recibido')
	// });

	// const result = Joi.validate(datos, schema); 
	// const { value, error } = result; 
	// const valid = error == null;
	// if (!valid) { 
	//   res.status(422).json({
	// 	message: 'Invalid request', 
	// 	data: error 
	//   }) 
	// } else { 
	// 	res.json({ msg: 'ssss' });
	// } 


	// Joi.validate(request.body, schema, (err,result) => {
	// 	if(err){
	// 		console.log(err)
	// 		response.json({ msg: 'ocurrio un error' })
	// 	}
	// 	console.log(result)
	// 	res.json(datos)
	// })






	// if( datos.consulta.nombre == "" || datos.consulta.nombre == null ){
	// 	response.json({
	// 		rta: "Error",
	// 		msg: "El nombre no puede quedar vacio"
	// 	})
	// }else{
	// 	response.json(datos)
	// }





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

});