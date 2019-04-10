var fs = require('fs');
var config = require('./config.json');
var https = require('https');
var express = require('express');
var mysql = require('mysql');
var app = express();
var options = {
    key: fs.readFileSync(config.CertPath.key),
    cert: fs.readFileSync(config.CertPath.cert)
};
var server = https.createServer(options, app);
var io = require('socket.io')(server);

const MySqlConnection = ConnectToMysql();
const Version = "0.9.0.0";


function ConnectToMysql() {
    var con = mysql.createConnection({
        host: config.MysqlConnectionInformation.host,
        user: config.MysqlConnectionInformation.user,
        password: config.MysqlConnectionInformation.password,
        database: config.MysqlConnectionInformation.database
    });
    return con;
}


io.on('connection', (socket) => {
    //   socket.emit('info', Version);
    console.log(socket.id.toString() + " Connection Opened");

    socket.on('SendData', (token) => {
        console.log(socket.id.toString() + " [DATA] ActivationKey Received: ");
        try {
            var obj = JSON.parse(token);
            if (obj.Val != null && obj.Val.length > 0) {
                CheckForToken(obj, (checkErr, res) => {
                    if (!checkErr & res) {

                    }
                });
            }
        }catch (e) {
            
        }
        
    });

    socket.on('Oid', (token) => {
        console.log(socket.id.toString() + " [OID] ActivationKey Received: ");

        try {
            var obj = JSON.parse(token);
            if (obj.Val != null && obj.Val.length > 0) {
                CheckForToken(obj, (checkErr, res) => {
                    if (!checkErr & res) {
                        MySqlConnection.query('Select * from oid', (err, results) => {
                            if (!err) {
                                socket.emit('oidTable', JSON.stringify(results));
                                socket.disconnect();
                            } else {
                                console.log(err);
                                socket.emit('closingAnswer', SimpleAnswer(false));
                                socket.disconnect();
                            }
                        });
                    }
                    else {
                        socket.emit('closingAnswer', SimpleAnswer(false));
                        socket.disconnect();
                    }
                });
            }
                else {
                    socket.emit('closingAnswer', SimpleAnswer(false));
                    socket.disconnect();
                }
            

        } catch (e) {
            console.log(socket.id.toString() + " JSON ERROR Connection CLOSED");
            socket.disconnect();
        }
    });
    socket.on('disconnect', () => {
        console.log(socket.id.toString() + " Connection Closed");
    });
});

server.listen(config.ServerPort, () => {
    console.log('openMPS Server V %s, Listening on %s', Version, config.ServerPort);
});

function SimpleAnswer(b) {
    var s = "{\"Result\": ";
    if (b) {
        s += "\"True\"";
    } else {
        s += "\"False\"";
    }
    s += "}";
    return s;
}

function CheckForToken(data, callback){

    var sql = "SELECT * from Manastone.OpenMpsToken where ActivationToken = data";

    connection.query(sql, function(err, results){
        if (err){
            throw err;
        }

        console.log(results);
        return callback(results.count() >0);
    });
}






