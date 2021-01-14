/* jshint esversion: 9 */

const express = require('express'),
  router = express.Router(),
  path = require('path'),
  fs = require('fs'),

  errors = require('../errors.json'),
  conf = require('../conf.json'),
  options = require('../functions/options'),

  extensions = ['png', 'jpg', 'jpeg', 'mp4', 'gif'];


/** Default / */
router.get('/', async (req, res) => {
  return res.status(200).send('ha this is working');
});

/** Route for returning images */
router.get('/:name', async (req, res) => {
  try {
    if(!req.params.name) return res.status(401).send(errors.unauthorised); // This user aint authorised to do anything.

    let e = '', status = 200; // Extension of file (to be decided)

    extensions.forEach(ext => {
      if(fs.existsSync(__dirname + `/../images/${req.params.name}.${ext}`)) return e = ext; // Loop through each possible extension to see if the file exists
    });

    if(!e) { // File doesn't exist. So rather than saying 404, we'll send a gif :-)
      req.params.name = 'error404';
      e = 'gif';
    }

    //if(req.query) {
      /**
       * Check if the user is a crawler from discord.
       * If not, just return the image. Otherwise we do something else.
      */
      if(!req.useragent.source.toLowerCase().includes('discord') || !conf.embeds.enabled) return res.status(status).sendFile(`${req.params.name}.${e}`, { root: path.resolve(__dirname + `/../images`)});
      else return res.status(status).send(await options.decide(req.params.name, e));
    //}
  }
  catch(err) {
    console.log(err);
    res.status(500).send(errors.internal);
  }
});

router.post('/save/:name', async (req, res) => {
  try {
    if(req.headers.token != conf.token) return res.status(401).send(errors.unauthorised); // This user aint authorised to do anything.
    console.log(`Save request -> ${req.params.name}`);

    if(!req.body || !req.files) return res.status(200).send(errors.noattachment); // Check if the request has anything attached. If not, stop.

    // Change the param name extension from uppercase to lowercase.
    let rName = await options.fixExtension(req.params.name, extensions); // rName = request name
    console.log(`Updated save request -> ${rName}`); // Log the updated name
    if(fs.existsSync(__dirname + `/../images/${rName}`)) return res.status(500).send(errors.exists); // File exists

    for(let ext in extensions) {
      if(rName.includes(`.${extensions[ext]}`)) {
        req.files['files[]'].mv(__dirname + `/../images/${rName}`); // Move files into images dir
        req._isValidType = true;
      }
    }

    if(!req._isValidType) return res.status(401).send(errors.unsupported);

    for(let ext in extensions) {
      if(rName.includes(extensions[ext])) return res.status(200).json({ name: rName.replace(`.${extensions[ext]}`, '')}); // Replace file extension with nothing
    }

    
    return res.status(200).send('Unexpected item in bagging area'); // Image didn't include extensions we want. So just do the Tesco self-serve message.
  }
  catch(err) {
    console.log(err);
    res.status(500).send(errors.internal);
  }
});

module.exports = router;