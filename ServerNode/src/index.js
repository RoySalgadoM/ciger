const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const request = require('request');


const app = express();
app.use(cors())
app.set('port', process.env.PORT || 4000);
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/media', express.static(__dirname + '/public'));

app.use(require('./routes/index.js'));
app.use('/person',require('./routes/person.js'));
app.use('/user',require('./routes/user.js'));
app.use('/use',require('./routes/use.js'));
// app.use('/paypal',require('./routes/paypal.js'));
app.use('/movie',require('./routes/movie.js'));
app.use('/movieCast',require('./routes/movieCast.js'));

app.listen(app.get('port'), () =>{
    console.log("Server on port", app.get('port'));
});