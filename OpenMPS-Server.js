"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// @ts-ignore
var config = require("./config.json");
var https = require("https");
var express = require("express");
var MysqlConnector = require("./MySQLConnector");
var MySQLConnectorForManastone = require("./MySQLConnectorForManastone");
var mysqlConnectionManager = new MysqlConnector.sql.MySQLConnector;
var mysqlConnectionManagerManastone = new MySQLConnectorForManastone.sql.MySQLConnectorForManastone;
var app = express();
var options = {
    key: fs.readFileSync(config.CertPath.key),
    cert: fs.readFileSync(config.CertPath.cert)
};
var server = https.createServer(options, app);
var io = require('socket.io')(server);
var Version = "1.000.0001.0000";
/**
 * Socket.io Server Handler
 * Reacts on incoming Connections
 */
io.on('connection', function (socket) {
    //   socket.emit('info', Version);
    mysqlConnectionManager.insertServerLog(socket.id.toString(), " Connection Opened");
    /**
     * Handles incoming OidRequest
     * Sends the latest Oid Table, if the token is in the Database
     */
    socket.on('OidRequest', function (token) {
        var tokenData = JSON.parse(token);
        try {
            mysqlConnectionManagerManastone.checkIfTokenExists(tokenData.Token).then(function (tokenRow) {
                var a = tokenRow;
                if (tokenRow[0].TokenCheck == 1) {
                    mysqlConnectionManager.insertServerLog(socket.id.toString(), "New OidRequest");
                    mysqlConnectionManager.retrieveOidTable().then(function (row) {
                        socket.emit("OidOffer", JSON.stringify(row));
                    });
                }
                else {
                    socket.emit("OidOffer", "[]");
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    });
    /**
     * Handles incoming SendData
     * Inserts a OidDataSet into the Database
     */
    socket.on('SendData', function (data) {
        try {
            mysqlConnectionManager.insertServerLog(socket.id.toString(), "New Data");
            mysqlConnectionManager.insertOidSet(JSON.parse(data));
            sendSimpleResult(socket, true);
        }
        catch (e) {
            sendSimpleResult(socket, false);
        }
    });
    /**
     * Handles incoming OidVersionRequest
     * Sends the latest Oid Version
     */
    socket.on('OidVersionRequest', function () {
        mysqlConnectionManager.retrieveOidVersion().then(function (row) {
            mysqlConnectionManager.insertServerLog(socket.id.toString(), "New OidVersionRequest");
            socket.emit("OidVersionOffer", JSON.stringify(row[0]));
        });
    });
    /**
     * Handles incoming MPSVersionRequest
     * Sends the latest MPS Version
     */
    socket.on('MPSVersionRequest', function () {
        mysqlConnectionManager.retrieveMPSVersion().then(function (row) {
            mysqlConnectionManager.insertServerLog(socket.id.toString(), "New MPSVersionRequest");
            socket.emit("MPSVersion", JSON.stringify(row[0]));
        });
    });
    /**
     * Handles incoming MPSMinClientVersionRequest
     * Sends the latest MPS Version
     */
    socket.on('MPSMinClientVersionRequest', function () {
        mysqlConnectionManager.retrieveMPSMinClientVersion().then(function (row) {
            mysqlConnectionManager.insertServerLog(socket.id.toString(), "New MPSMinClientVersionRequest");
            socket.emit("MPSMinClientVersionOffer", JSON.stringify(row[0]));
        });
    });
    /**
     * Disconnect event
     * Inserts Connection closed message into the Serverlog Table
     */
    socket.on('disconnect', function () {
        mysqlConnectionManager.insertServerLog(socket.id.toString(), "Connection Closed");
    });
});
/**
 * Sends a SimpleResult
 * @param socket
 * @param res
 * @constructor
 */
function sendSimpleResult(socket, res) {
    if (res === void 0) { res = false; }
    socket.emit('closer', JSON.stringify({ Result: res }));
    socket.disconnect();
}
/**
 * Entry Point of the Socket.io server
 * Starts the server and outputs Version and Port
 */
server.listen(config.ServerPort, function () {
    mysqlConnectionManager.insertServerLog("", "openMPS Server: "
        + Version + " Listening on: " + config.ServerPort);
    console.log('openMPS Server V %s, Listening on %s', Version, config.ServerPort);
});
//# sourceMappingURL=OpenMPS-Server.js.map