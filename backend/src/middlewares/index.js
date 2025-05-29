const auth = require('./userMiddleware');
const role = require('./roleMiddleware');

const allow = (roles) => [auth, role(roles)];

module.exports = { auth, role, allow };
