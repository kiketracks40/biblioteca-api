const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const passwordUtils = {
    async hash(password) {
        return await bcrypt.hash(password, SALT_ROUNDS);
    },

    async compare(password, hash) {
        return await bcrypt.compare(password, hash);
    }
};

module.exports = passwordUtils;