var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var app = express();
app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
	host: 'localhost',
	user: 'node3',
	password: 'node3',
	database: 'node3',
	port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'));

app.get('/', function(req, res){

	res.render('start');
});

app.get('/list', function(req, res){

	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM cars',function(err,rows){
			var carsList=rows;
			res.render('list',{
				carsList:carsList
			});

		});
	});
});

app.get('/add', function(req, res){
	res.render('add');
});

app.post('/add', function(req, res){
	var car={
		mark: req.body.mark,
		name: req.body.name,
		year: req.body.year
	}
	console.log(car);
	req.getConnection(function(error, conn){
		conn.query('INSERT INTO cars SET ?',car,function(err,rows){
			if(err){
				var message='Błąd!';
			}else{
				var message='Dane zostały dodane';
			}
			res.render('add',{message:message});
		});
	});
});

app.get('/edit/(:id)', function(req, res){
	var idcar=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM cars WHERE id='+idcar,function(err,rows){
			res.render('edit',{
				id: idcar,
				mark: rows[0].mark,
				name: rows[0].name,
				year: rows[0].year
			});
		});
	});
});
app.post('/edit/(:id)', function(req, res){
	var car={
		mark: req.body.mark,
		name: req.body.name,
		year: req.body.year
	};
	req.getConnection(function(error, conn){
		conn.query('UPDATE cars SET ? WHERE id='+req.params.id,car,function(err,rows){
			if(err){
				var message='Błąd!';
			}else{
				var message='Dane zostały zmienione';
			}
			res.render('edit',{
				id: req.params.id,
				mark: req.body.mark,
				name: req.body.name,
				year: req.body.year,
				message:message
			});
		});
	});
});

app.get('/delete/(:id)', function(req, res){
	var idcar=req.params.id;
	res.render('delete',{idcar:idcar});
});

app.post('/delete/(:id)', function(req, res){

	var idcar=req.params.id;
	req.getConnection(function(error, conn){
		conn.query('DELETE FROM cars WHERE id='+idcar,function(err,rows){
			if(err){
				var message='Błąd!';
			}else{
				var message='Usunięto';
			}
			res.render('delete',{idcar:idcar,message:message});
		});
	});
});

app.listen(3000);