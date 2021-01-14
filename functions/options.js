/* jshint esversion: 9 */

const conf = require('../conf.json');

/**
 * Function used to decide what to send
 * @param {Object} req - The incoming request
 * @param {String} e   - The file extension
 */
async function decide(req, e) {
  /**
   * Inbound request is from a discord crawler. So we're gonna send some HTML instead (for image embedding)
   */
  let _toSend;
  
  let color = await genColor();
  switch(e) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      _toSend = `<!DOCTYPE HTML>
        <html>
          <title>${conf.embeds.title}</title>
          <meta property="og:title" content="${conf.embeds.title}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="" />
          <meta name="twitter:creator" content="" />
          <meta name="twitter:title" content="${conf.embeds.title}">
          <meta name="twitter:description" content="${conf.embeds.description}">
          <meta property="og:description" content="${conf.embeds.description}" />
          <meta name="theme-color" content="${color}">
          <!-- IMAGE URL -->
          <meta name="twitter:image" content="${conf.url}/api/content/${req}.${e}">
          <img alt="" src="${conf.url}/api/content/${req}.${e}" />
        </html>`;
        return _toSend;

      case 'mp4':
        _toSend = `<!DOCTYPE HTML>
        <html>
            <meta property="og:title" content="${conf.embeds.title}" />

            <meta name="twitter:card" content="player" />
            <meta name="twitter:site" content="" />
            <meta name="twitter:creator" content="" />
            <meta name="twitter:title" content="${conf.embeds.title}">
            <meta name="twitter:description" content="${conf.embeds.description}">
            <meta name="twitter:image" content="${conf.url}/api/content/${req}.${e}">
            <meta name="twitter:player" content="${conf.url}/api/content/${req}.${e}">

            <meta property="og:description" content="${conf.embeds.description}" />
            <meta name="theme-color" content="#03e3fc">

            <video width="1920" height="1080" controls autoplay>
                <source src="${conf.url}/api/content/${req}.${e}" type="video/mp4">
            </video>
        </html>`;
        return _toSend;

      default:
        _toSend = `Unexpected item in bagging area`;
        return _toSend;
  }

}

/**
 * Function used to change the file extension
 * @param {String} req       - The name of the incoming request
 * @param {Array} extensions - The file extensions to search and replace
 */
async function fixExtension(req, extensions) {
  let name = req, // Assign to a new var
    nameExtensions = name.split('.'); // Split the name and turn it into an array

  nameExtensions.shift(); // Get rid of the file name, so we are left with the file extensions
  for(let split in nameExtensions) { // Each file extension in the file name
    extensions.forEach(ext => { // Loop through each LOWERCASE extension
      if(nameExtensions[split].toLowerCase().includes(ext)) { // We got a match?
        name = name.replace(nameExtensions[split], ext); // In the string, locate the extension and replace it with the lowercase counterpart
        return name; // Return the updated var
      }
    });
  }
  return name;
}

/**
 * Function used to generate a random color for embeds
 */
async function genColor() {
  var letters = "0123456789ABCDEFabcdef",
    color = '#'; 

  for (var i = 0; i < 6; i++) color += letters[(Math.floor(Math.random() * 16))]; 
  return color;
}

module.exports = { decide, fixExtension };