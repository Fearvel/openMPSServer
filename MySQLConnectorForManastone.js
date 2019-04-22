"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
// @ts-ignore
var config = require("./config.json");
//
var sql;
(function (sql_1) {
    /**
     * Class for Managing The SQL Connection
     */
    var MySQLConnectorForManastone = /** @class */ (function () {
        function MySQLConnectorForManastone() {
            /**
             * Config, read from config.json
             */
            this.MySQLConfig = {
                host: config.MySQLConnectionInformationManastone.host,
                user: config.MySQLConnectionInformationManastone.user,
                password: config.MySQLConnectionInformationManastone.password,
                database: config.MySQLConnectionInformationManastone.database
            };
            this.connection = mysql.createConnection(this.MySQLConfig);
        }
        /**
         * Unused query function
         * Stays here as an example
         * @param sql
         * @param args
         */
        MySQLConnectorForManastone.prototype.query = function (sql, args) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.connection.query(sql, args, function (err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows);
                });
            });
        };
        MySQLConnectorForManastone.prototype.checkIfTokenExists = function (token) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.connection.query("Select EXISTS(Select * FROM `DEV-MANASTONE`.OpenMPSTokens" +
                    " where `Token` = ?) as TokenCheck;", token, function (err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows);
                });
            });
        };
        return MySQLConnectorForManastone;
    }());
    sql_1.MySQLConnectorForManastone = MySQLConnectorForManastone;
})(sql = exports.sql || (exports.sql = {}));
//# sourceMappingURL=MySQLConnectorForManastone.js.map