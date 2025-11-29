const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app: db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const courses = require('./routes/courses');
const home = require('./routes/home');
const { log, authenticate } = require('./middleware/logger')
const express = require('express');
const app  = express();

app.use(express.json());
app.use(express.urlencoded({extend: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

app.set('view engine', 'pug');
app.set('views', './views');

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

dbDebugger('connected to the database...');
startupDebugger("Application Name:" + config.get('name'));
startupDebugger("Mail Server:" + config.get('mail.host'));
//startupDebugger("Mail Password:" + config.get('mail.password'));

app.use(log);
app.use(authenticate);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port} `));