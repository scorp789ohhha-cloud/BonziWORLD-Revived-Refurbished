// ========================================================================
// Server init
// ========================================================================

// Filesystem reading functions
const fs = require('fs-extra');

// Load settings
try {
        stats = fs.lstatSync('settings.json');
} catch (e) {
        // If settings do not yet exist
        if (e.code == "ENOENT") {
                try {
                        fs.copySync(
                                'settings.example.json',
                                'settings.json'
                        );
                        console.log("Created new settings file.");
                } catch(e) {
                        console.log(e);
                        throw "Could not create new settings file.";
                }
        // Else, there was a misc error (permissions?)
        } else {
                console.log(e);
                throw "Could not read 'settings.json'.";
        }
}


// Load settings into memory
const settings = require("./settings.json");

// Setup basic express server
var express = require('express');
var app = express();

const https = require("https");
const http = require("http");

// Root route - serve the main index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/build/www/index.html');
});

app.get('/ivona-eric', function(req, res) {
        if (req.query.text) {
                                        const body = new URLSearchParams({
                                                but1: req.query.text,
                                                butS: "0",
                                                butP: "0",
                                                butPauses: "0",
                                                butt0: "Submit",
                                        }).toString();
                                        const rq = https.request(
                                                {
                                                        hostname: "readloud.net",
                                                        path: "/english/american/3-male-voice-eric.html",
                                                        method: "POST",
                                                        headers: {
                                                                "Content-Type": "application/x-www-form-urlencoded"
                                                        }
                                                },
                                                (r) => {
                                                        let buffers = [];
                                                        r.on("error", (e) => console.error(e));
                                                        r.on("data", (b) => buffers.push(b));
                                                        r.on("end", () => {
                                                                const html = Buffer.concat(buffers);
                                                                const beg = html.indexOf("/tmp/");
                                                                const end = html.indexOf("mp3", beg) + 3;
                                                                const sub = html.subarray(beg, end).toString();

                                                                https.get(`https://readloud.net${sub}`, async (r2) => {
                                                                        r2.pipe(res);
                                                                        return res.writeHead(200, {
                                                                        'Content-Type': 'audio/mp3'
                                                                        });
                                                                });
                                                        });
                                                }
                                        ).on("error", (e) => console.error(e));
                                        rq.end(body);
        } else {
          res.send("Hello World")
        }
  })
app.get('/oddcast-paul', function(req, res) {
        if (req.query.text) {
                                        const q = new URLSearchParams({
                                                EID: "3",
                                                LID: "1",
                                                VID: "2",
                                                TXT: req.query.text,
                                                EXT: "mp3",
                                                FNAME: "",
                                                ACC: "15679",
                                                SceneID: "2703396",
                                                HTTP_ERR: "",
                                        }).toString();
                                        https
                                                .get(
                                                        {
                                                                hostname: "cache-a.oddcast.com",
                                                                path: `/tts/genB.php?${q}`,
                                                                headers: {
                                                                        "Host": "cache-a.oddcast.com",
                                                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
                                                                        "Accept": "*/*",
                                                                        "Accept-Language": "en-US,en;q=0.5",
                                                                        "Accept-Encoding": "gzip, deflate, br",
                                                                        "Origin": "https://www.oddcast.com",
                                                                        "DNT": 1,
                                                                        "Connection": "keep-alive",
                                                                        "Referer": "https://www.oddcast.com/",
                                                                        "Sec-Fetch-Dest": "empty",
                                                                        "Sec-Fetch-Mode": "cors",
                                                                        "Sec-Fetch-Site": "same-site"
                                                                }
                                                        }, async (r) => {
                                                                r.pipe(res);
                                                        }
                                                );
        } else {
          res.send("Hello World")
        }
  })
app.get('/oddcast-mike', function(req, res) {
        if (req.query.text) {
                                        const q = new URLSearchParams({
                                                EID: "1",
                                                LID: "1",
                                                VID: "2",
                                                TXT: req.query.text,
                                                EXT: "mp3",
                                                FNAME: "",
                                                ACC: "15679",
                                                SceneID: "2703396",
                                                HTTP_ERR: "",
                                        }).toString();
                                        https
                                                .get(
                                                        {
                                                                hostname: "cache-a.oddcast.com",
                                                                path: `/tts/genB.php?${q}`,
                                                                headers: {
                                                                        "Host": "cache-a.oddcast.com",
                                                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
                                                                        "Accept": "*/*",
                                                                        "Accept-Language": "en-US,en;q=0.5",
                                                                        "Accept-Encoding": "gzip, deflate, br",
                                                                        "Origin": "https://www.oddcast.com",
                                                                        "DNT": 1,
                                                                        "Connection": "keep-alive",
                                                                        "Referer": "https://www.oddcast.com/",
                                                                        "Sec-Fetch-Dest": "empty",
                                                                        "Sec-Fetch-Mode": "cors",
                                                                        "Sec-Fetch-Site": "same-site"
                                                                }
                                                        }, async (r) => {
                                                                r.pipe(res);
                                                        }
                                                );
        } else {
          res.send("Hello World")
        }
  })
app.get('/oddcast-julie', function(req, res) {
        if (req.query.text) {
                                        const q = new URLSearchParams({
                                                EID: "3",
                                                LID: "1",
                                                VID: "3",
                                                TXT: req.query.text,
                                                EXT: "mp3",
                                                FNAME: "",
                                                ACC: "15679",
                                                SceneID: "2703396",
                                                HTTP_ERR: "",
                                        }).toString();
                                        https
                                                .get(
                                                        {
                                                                hostname: "cache-a.oddcast.com",
                                                                path: `/tts/genB.php?${q}`,
                                                                headers: {
                                                                        "Host": "cache-a.oddcast.com",
                                                                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
                                                                        "Accept": "*/*",
                                                                        "Accept-Language": "en-US,en;q=0.5",
                                                                        "Accept-Encoding": "gzip, deflate, br",
                                                                        "Origin": "https://www.oddcast.com",
                                                                        "DNT": 1,
                                                                        "Connection": "keep-alive",
                                                                        "Referer": "https://www.oddcast.com/",
                                                                        "Sec-Fetch-Dest": "empty",
                                                                        "Sec-Fetch-Mode": "cors",
                                                                        "Sec-Fetch-Site": "same-site"
                                                                }
                                                        }, async (r) => {
                                                                r.pipe(res);
                                                        }
                                                );
        } else {
          res.send("Hello World")
        }
  })

if (settings.express.serveStatic)
        app.use(express.static('./build/www'));

// Add settings endpoint
app.get('/api/settings', (req, res) => {
    res.json({
        rooms: settings.rooms || { limit: 100, default: "bonziworld" },
        maxUsers: settings.maxUsers || 50,
        godword: settings.godword || "bonzibuddy"
    });
});

var server = require('http').createServer(app);

// Init socket.io
var io = require('socket.io')(server,{
  allowEIO3: true,
  connectTimeout: 9999999,
  pingTimeout: 9999999
});
var port = process.env.PORT || settings.port;

exports.io = io;

// Init sanitize-html
var sanitize = require('sanitize-html');

// Init winston loggers (hi there)
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();

// Start actually listening
server.listen(port, '0.0.0.0', function () {
        console.log(
                "Welcome to BonziWORLD Revived! Time to meme!\nServer listening at 0.0.0.0:" + port
        );
});
app.use(express.static(__dirname + '/build/www'));

// ========================================================================
// Banning functions
// ========================================================================

// ========================================================================
// Helper functions
// ========================================================================

const Utils = require("./utils.js")

// ========================================================================
// The Beef(TM)
// ========================================================================

const Meat = require("./meat.js");
Meat.beat();

// Console commands
const Console = require('./console.js');
Console.listen();