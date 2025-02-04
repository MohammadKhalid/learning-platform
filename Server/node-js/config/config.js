require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'name';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'root';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'eypZAZy0CY^g9%KreypZAZy0CY^g9%Kr';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '3d';

CONFIG.MANDRILL_API_KEY = process.env.MANDRILL_API_KEY || 'mandrill_api_key';

switch (process.env.DB_LOGGING) {
    case '1':
        CONFIG.db_log = function(log) {
            console.log(log);
        };
        break;
    default:
        CONFIG.db_log = false;
        break;
}

module.exports = CONFIG;