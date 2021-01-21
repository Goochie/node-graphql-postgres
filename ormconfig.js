const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

let config = dotenv.parse(fs.readFileSync(`${path.join(__dirname, './env/')}${process.env.NODE_ENV || 'dev'}.env`));

const ormconfig = {
  "type": "postgres",
  "port": 5432,
  "host"   : config['DB_HOST'] || "localhost",
  "username": config['DB_USER'] || "postgres",
  "password": config['DB_PASS'] || "smartLifePath",
  "database":  config['DB_NAME'] || "smart-path-life",
  "entities": ["src/**/**.entity{.ts,.js}"],
  // "migrations": [
  //   "src/migration/*.ts"
  // ],
  "seeds": [
    "seeds/**/*.seed.ts"
  ],
  "cli": {
    "migrationsDir": "src/migration"
  },
  "synchronize": false
}

if (process.env.NODE_ENV == 'prod' && process.env.START) {
  ormconfig.entities = ["dist/src/**/**.entity.js"];
  ormconfig.migrations = [
    "dist/src/migration/*.js"
  ];
  ormconfig.seeds = [
    "dist/seeds/**/*.seed.js"
  ];
}


module.exports = ormconfig;
