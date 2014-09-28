module.exports = {
  create: function (options) {
    var errorString = 'jFlux error: ';
    var keys = Object.keys(options);
    if (keys.indexOf('source') >= 0) {
      errorString += (typeof options.source === 'object' && options.source !== null ? JSON.stringify(options.source) : options.source) + '. ';
    }
    if (keys.indexOf('message') >= 0) {
      errorString += options.message + '. ';
    }
    if (keys.indexOf('support') >= 0) {
      errorString += options.support + '. ';
    }
    if (keys.indexOf('url') >= 0) {
      errorString += 'More documentation at: ' + options.url + '.';
    }
    throw new Error(errorString);
  }
};