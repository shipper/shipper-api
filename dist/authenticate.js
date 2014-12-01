var authentication;

authentication = require('./authentication');

authentication.authenticate.Bearer = authentication.Bearer.authenticate;

authentication.authenticate.Local = authentication.Local.authenticate;

module.exports = authentication.authenticate;
