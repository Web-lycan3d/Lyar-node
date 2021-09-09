require("./db/db")
const express = require('express');
const mongoose = require("mongoose");
const User = mongoose.model('user');
const bodyparser = require('body-parser');
var app= express();

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

//static files
app.use(express.static('public'));
app.use('/bootstrap4', express.static(__dirname + 'public/bootstrap4'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/image', express.static(__dirname + 'public/image'));

//set views
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/' ,(req,res) =>{
    res.render('index' , {
        title: 'Home'
    })
});

app.get('/lysr-1' ,(req,res) =>{
    res.render('lysr-1' , {
        title: 'Lysr-1'
    })
});
app.get('/lyron' ,(req,res) =>{
    res.render('lyron' , {
        title: 'Lyron'
    })
});
app.get('/contact' ,(req,res) =>{
    res.render('contact' , {
        title: 'Contact' , user: ''
    })
});
app.get('*' ,(req,res) =>{
    res.render('404' , {
        title: '404'
    })
});


app.post('/submit', function (req, res) {
    console.log(req.body);
    insertRecord(req, res);
});

function insertRecord(req, res) {
    var user = new User();
    user.fullname = req.body.fullname;
    user.email = req.body.email;
    user.mobile = req.body.mobile;
    user.message = req.body.message;
    user.save((err, docs) => {
        if (!err)
            res.render("contact-success", {
                title: 'Contact'
            });
        else {
            console.log('error in recording ' + err);
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("contact", {
                    user: req.body,
                    title: 'Contact',
                });
            }
            else
                console.log('Error during record insertion:' + err);
        }
    })
}
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullname':
                body['fullNameError'] = "too short";
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'mobile':
                body['mobileError'] = "Invalid Phone No.";
            default:
                break;
        }
    }
}



var port = process.env.port || 4000;

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})