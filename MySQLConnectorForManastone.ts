/**
 * Connection Class for MySql Connections
 * Used to access a the View in the Manastone Database
 * @author Andreas Schreiner
 * @copyright Andreas Schreiner 2019
 */
import * as mysql from 'mysql';
// @ts-ignore
import * as config from './config.json';
//
export namespace sql {

    /**
     * Class for Managing The SQL Connection to the Manastone Server and Database
     */
    export class MySQLConnectorForManastone {

        /**
         * The DB Connection
         */
        private connection: any;

        /**
         * Config, read from config.json
         */
        private MySQLConfig = {
            host: config.MySQLConnectionInformationManastone.host,
            user: config.MySQLConnectionInformationManastone.user,
            password: config.MySQLConnectionInformationManastone.password,
            database: config.MySQLConnectionInformationManastone.database
        };

        /**
         * Constructor
         * Creates the connection
         */
        constructor() {
            this.connection = mysql.createConnection(this.MySQLConfig);
        }

        /**
         * Unused query function
         * Stays here as an example
         * @param sql
         * @param args
         */
        private query(sql, args) {
            return new Promise((resolve, reject) => {
                this.connection.query(sql, args, (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows);
                });
            });
        }

        /**
         * Checks if the Token Table has an entry with the received token
         * @param token
         */
        public checkIfTokenExists(token : string){
            return new Promise((resolve, reject) => {
                this.connection.query("Select EXISTS(Select * FROM `DEV-MANASTONE`.OpenMPSTokens" +
                    " where `Token` = ?) as TokenCheck;"
                    , token, (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows);
                });
            });
        }


    }
}