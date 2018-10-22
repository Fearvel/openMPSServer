var http = require('http')
var https = require('https');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var serverTools = require('./fnServerTools');
var typeTools = require('./fnTypeTools');

const Version = "0.0.0.1";
const HttpPort = 9050;
const HttpsPort = 9051;

const options = {
    key: fs.readFileSync("testKey.pem"),
    cert: fs.readFileSync("testCert.pem")
};

const app = express();
const http_server = require('http').createServer(app);
const https_server = require('https').createServer(options,app);

const MySqlConnection = ConnectToMysql();

http_server.listen(HttpPort, () => console.log(GetStartInfo("[HTTP]", HttpPort)));
https_server.listen(HttpsPort,() => console.log(GetStartInfo("[HTTPS]", HttpsPort)));

app.post('/RetrieveOID', function (req, res) {
    var j = {json: { key: 'value' }};
   serverTools.post("http://localhost:9040/CheckActivation",j,function(returnValue) {
       if (returnValue.Result !== 'False'){
           MySqlConnection.connect(function(err) {
               if (err) throw err;
               //Select all customers and return the result object:
               MySqlConnection.query("SELECT * FROM fnLog.Log", function (err, result, fields) {
                   if (err) throw err;
                   console.log(result);
               });
           });

       } else{
           res.end(serverTools.CreateSimpleAnswer(false));
       }
   });
});

app.post('/SendMPSData', function (req, res) {

});


function GetStartInfo(s, port) {
    return "[" + typeTools.GetDateTimeNow() + "] [fnLog Version: " + Version + "] Server Started. on Port: " + port + "\t" + s;
}

function ConnectToMysql() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "testuser",
        password: "password"
    });
    return con;
}
function getDriver(callback) {
    MySqlConnection.query("SELECT * FROM fnLog.Log",
        function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        }
    );
}



