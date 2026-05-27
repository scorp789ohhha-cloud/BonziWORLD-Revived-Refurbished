const log = require('./log.js').log;
const fs = require('fs-extra');
const settings = require("./settings.json");
const io = require('./index.js').io;

function isPrivateIP(ip) {
    return /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|::1$|::ffff:127\.)/.test(ip);
}

function getRealIP(socket) {
    const forwarded = socket.handshake.headers['x-forwarded-for'];
    if (forwarded) {
        const ips = forwarded.split(',').map(ip => ip.trim()).reverse();
        for (const ip of ips) {
            if (!isPrivateIP(ip)) return ip;
        }
    }
    const realIp = socket.handshake.headers['x-real-ip'];
    if (realIp && !isPrivateIP(realIp)) return realIp;
    return socket.request.connection.remoteAddress;
}

let bans;

exports.init = function() {
    fs.writeFile("./bans.json", "{}", { flag: 'wx' }, function(err) {
        if (!err) console.log("Created empty bans list.");
        try {
            bans = require("./bans.json");
        } catch(e) {
            throw "Could not load bans.json. Check syntax and permissions.";
        }
    });
};

exports.saveBans = function() {
        fs.writeFile(
                "./bans.json",
                JSON.stringify(bans),
                { flag: 'w' },
                function(error) {
                        log.info.log('info', 'banSave', {
                                error: error
                        });
                }
        );
};

// Ban length is in minutes
exports.addBan = function(ip, length, reason) {
        length = parseFloat(length) || settings.banLength;
        reason = reason || "N/A";
        bans[ip] = {
                reason: reason,
                end: new Date().getTime() + (length * 60000)
        };

        var sockets = io.sockets.sockets;
        var socketList = Object.keys(sockets);

        for (var i = 0; i < socketList.length; i++) {
                var socket = sockets[socketList[i]];
                if (getRealIP(socket) == ip)
                        exports.handleBan(socket);
        }
        exports.saveBans();
};

exports.removeBan = function(ip) {
        delete bans[ip];
        exports.saveBans();
};

exports.handleBan = function(socket) {
        var ip = getRealIP(socket);
        if (!bans[ip]) return false;
        if (bans[ip].end <= new Date().getTime()) {
                exports.removeBan(ip);
                return false;
        }

        log.access.log('info', 'ban', {
                ip: ip
        });
        socket.emit('ban', {
                reason: bans[ip].reason,
                end: bans[ip].end
        });
        socket.disconnect();
        return true;
};

exports.kick = function(ip, reason) {
        var sockets = io.sockets.sockets;
        var socketList = Object.keys(sockets);

        for (var i = 0; i < socketList.length; i++) {
                var socket = sockets[socketList[i]];
                if (socket.request.connection.remoteAddress == ip) {
                        socket.emit('kick', {
                                reason: reason || "N/A"
                        });
                        socket.disconnect();
                }
        }
};

exports.isBanned = function(ip) {
    return Object.keys(bans).indexOf(ip) != -1;
};
