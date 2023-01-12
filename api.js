var express = require('express');
const session = require('express-session');
var app = express();
const port = 8080;
const con = require('./services/db');
var bodyParser = require('body-parser');
const multer = require('multer');

//Configuration for Multer
const upload = multer({ dest: "images" });
// app.use(express.json());

// app.use(express.urlencoded({extended:true}));

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }))

//To parse json data
app.use(bodyParser.json())

app.get('/', function(req,res){
    con.query('SELECT * from todolist', function(err, data, fields){
        if(err) throw err;
        //res.writeHead(200, {'Content-Type':'text/html'});
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data
        })
        console.log(data);
    })
});

app.post('/post', function(req,res){
    console.log(req.body.name);
    var sql = "INSERT INTO todolist (name, status) VALUES ?";
    var values = [
        [req.body.name, req.body.content]
    ];
    con.query(sql, [values], function(err, result){
        if(err){
            res.send(err);
        }else{
            res.send('Data is inserted!!:)');
        }
    });
    //res.send('yes post is running');
    console.log('yes post');
});

app.get('/file', function(req, res){
    res.sendFile(__dirname + '/news.html');
});

// For Single image upload
app.post('/uploadImage', upload.array('file'), (req, res) => {
    res.send(req.files)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


app.post('/login', function(req, res){
    var sql = "SELECT * from users WHERE username = ?";
    var user = req.body.username;
    var pass = req.body.password;
    var values = ['admins'];
    con.query(sql, [user], function(err, data){
        if(data.length > 0)
        {
            for(var count = 0; count < data.length; count++ )
            {
                if(data[count].password == pass)
                {
                    res.send('user is successfully login');
                }else{
                    res.send('Password is wrong!!');
                }
                
            }
        }else{
           
            res.send('user is not exist!!');
        }

    })
});

app.put('/post', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var status = req.body.status;

    var sql = "UPDATE todolist SET name = ? where id = ?";
    var value = [name, id];
    console.log(value);
    con.query(sql, [name, id], function(err, data){
        if(err){
            res.send(err);
        }else{
            res.send('data is successfully updated');
        }
    });

});

app.delete('/post', function(req, res){
    var id = req.body.id;
    console.log(req.body.id);
    var sql = 'DELETE from todolist WHERE id = ?';
    var value = '2';
    con.query(sql, [id], function(err, data, fields){
        if(err){

        }else{
            res.send('Record is Deleted!!')
        }
    });
});

app.listen(port, (req,res) => {
    console.log(`Server is running on http://localhost:${port}`);
});
