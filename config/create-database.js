/**
 * Created by barrett on 8/28/14.
 */
var mysql = require('mysql');
var dbconfig = require('./database');

var connection = mysql.createConnection(dbconfig.connection);

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
     `name` varchar(200) , \
    `address` text , \
    `email` varchar(200) NOT NULL, \
    `phone` varchar(20) , \
    `country_code` varchar(5) , \
    `time_zone` varchar(10) , \
    `user_type` varchar(20) , \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
)');




console.log('Success: Database Created!')

connection.end();
