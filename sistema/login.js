//use npm run dev caso já tenha o package nodemon instalado e configurado no package.json, para ele atualizar automaticamente a página caso tenha alguma alteração

const express = require('express')
const app = express()
//node login.js no prompt do node.js

//iniciar mongodb
//sudo systemctl start mongod
//sudo systemctl status mongod

//USANDO MONGODB
var ObjectId = require('mongodb').ObjectID; //evitando erros de não reconhecimento de ObjectId
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:numerodaporta"//substituir numerodaporta pelo número da porta ou troque o uri pelo servidor de hospedagem caso não seja no localhost
MongoClient.connect(uri, (err,client) =>{
	if (err) return console.log(err)
	db = client.db('login')
	app.listen(numeroporta,() =>{
		console.log('Server rodando na porta numeroporta!!')	
	})
})
//BODY-PARSER
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
//body-parser é um middleware para lidar com a leitura de dados de form, ele é usado no POST

//TEMPLATE ENGINES
app.set('view engine', 'ejs')
//ejs é uma template engine para a parte visual, para facilitar

//SESSION VARIABLES
var session = require('express-session')

//LIDANDO COM ARQUIVOS ESTÁTICOS
app.use(express.static('public'));
//coloque os arquivos na pasta public para poder usá-los

//ROTAS GET
app.get('/', (req, res)=>{
	res.render('index.ejs')
})
//quando clicar em registre-se vai vir para cá
app.route('/cadastrar').get((req,res) => {
	res.render('cadastrar.ejs')
})
app.route('/homeInicial').get((req,res)=>{
	if(session.logado){
		res.render('homeInicial.ejs',{loginNome: session.login})
	}else{
		res.redirect('/')
	}
})

//ROTAS POST
//quando clicar em registrar na pagina de cadastrar
app.route('/cadastrar').post((req,res) =>{
	login = req.body.login
	db.collection('login').find({login: login}).toArray((err,results) =>{ 
		if(results.length < 1){
			db.collection('login').insertOne(req.body, (err,results)=>{
				if (err) return console.log(err)
				console.log('Salvo!')
				res.redirect('/')
			})
		}
		else{
			console.log('Usuário já cadastrado!')
			res.redirect('/')
		}
	})
})
//quando clicar em logar
app.route('/').post((req,res) =>{
	login = req.body.login
	senha = req.body.senha
	db.collection('login').find({login: login, senha: senha}).toArray((err,results) =>{ 
		if(results.length == 1){
			session.logado = 1
			session.login = login
			console.log(session.logado, session.login)
			res.redirect('/homeInicial')
		}
		else{
			res.redirect('/')
		}
	})
})