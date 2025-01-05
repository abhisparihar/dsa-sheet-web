const { cleanEnv, port, str } = require("envalid");

const validateEnv = () => {
    cleanEnv(process.env, {
        PORT: port(),
        DB: str(),
    })
};

module.exports = validateEnv;
