/* jshint esversion: 9 */

const express = require('express'),
 app = express(),
 helmet = require('helmet'),
 cors = require('cors'),
 fileUpload = require('express-fileupload'),
 expressUseragent = require('express-useragent'),
 
 router = require('./routes/router'),
 conf = require('./conf.json');

app.use(fileUpload());
app.use(expressUseragent.express());
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/content', express.static('images/'));
app.use('/', router.images);

app.listen(conf.port, () => { console.log(`App is running on port: ${conf.port}`);});