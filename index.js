var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET;

var app = express();

var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect('mongodb://localhost/<database>');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan')('dev'));

app.use('/api/users', expressJWT({ secret: secret }).unless({
    path: [{ url: '/api/users', methods: ['POST'] }]
}), require('./controllers/users'));

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'You need an authorization token to view this information.' });
    }
});

app.post('/api/auth', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err || !user) return res.status(401).send({ message: 'User not found' });

        var isAuthenticated = user.authenticated(req.body.password);

        if (err || !isAuthenticated) return res.status(401).send({ message: 'User not authenticated' });

        var token = jwt.sign(user.toJSON(), secret);

        return res.send({ user: user, token: token });
    });
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
