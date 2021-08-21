const ftpd = require('ftpd');
const path = require('path');

// Default settings for FTP Server
let options = {
  port: 21,
  username: 'ftp',
  password: 'ftp',
  location: 'C:\\'
};

let server = new ftpd.FtpServer(options.host, {
  getInitialCwd: function () {
    return '/';
  },
  getRoot: function () {
    return options.location;
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  useWriteFile: true,
  useReadFile: true
});

server.on('error', function (error) {
  window.utools.showNotification('FTP Server Error:', error);
  console.log('FTP Server error:', error);
});
server.on('close', function () {
  window.utools.showNotification('FTP服务器已停止');
});
server.server.on('listening', function () {
  window.utools.showNotification('FTP服务器已启动: ' + server.getRoot());
});
server.on('client:connected', function (connection) {
  // 设置用户名密码
  var username = null;
  console.log('client connected: ' + connection.remoteAddress);
  connection.on('command:user', function (user, success, failure) {
    if (user === options.username) {
      username = user;
      success();
    } else {
      failure();
    }
  });

  connection.on('command:pass', function (pass, success, failure) {
    if (pass === options.password) {
      success(username);
    } else {
      failure();
    }
  });
});
server.debugging = 4;


// service: start or stop service.
window.service = {
  get_server: () => {
    return server;
  },
  start_server: function (options, isRestart=false) {
    if (isRestart && server.server.listening) {
      server.close();
    }
    server.getRoot = () => options.location;
    server.on('client:connected', function (connection) {
      // 设置用户名密码
      var username = null;
      console.log('client connected: ' + connection.remoteAddress);
      connection.on('command:user', function (user, success, failure) {
        if (user === options.username) {
          username = user;
          success();
        } else {
          failure();
        }
      });

      connection.on('command:pass', function (pass, success, failure) {
        if (pass === options.password) {
          success(username);
        } else {
          failure();
        }
      });
    });
    server.listen(options.port);
    window.utools.showNotification('FTP服务器已启动: ' + server.getRoot());
  },
  stop_server: function() {
    server.close();
  },
  get_server_status: function () {
    return server.server.listening;
  }
}
