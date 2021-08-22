const ftpd = require('ftpd');

let LOG = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
};

// Default settings for FTP Server
let defaultOptions = {
  port: 21,
  location: 'D:\\'
};

let user_pass = {
  username: 'ftp',
  password: 'ftp',
}

let server = new ftpd.FtpServer(defaultOptions.host, {
  getInitialCwd: function () {
    return '/';
  },
  getRoot: function () {
    return defaultOptions.location;
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
    if (user === user_pass.username) {
      username = user;
      success();
    } else {
      failure();
    }
  });

  connection.on('command:pass', function (pass, success, failure) {
    if (pass === user_pass.password) {
      success(username);
    } else {
      failure();
    }
  });
});
server.debugging = 4;

server._logIf = function(verbosity, message, conn) {
  if (verbosity > this.debugging) {
    return;
  }
  // TODO: Move this to FtpConnection.prototype._logIf.
  var peerAddr = (conn && conn.socket && conn.socket.remoteAddress);
  if (peerAddr) {
    message = '<' + peerAddr + '> ' + message;
  }
  if (verbosity === LOG.ERROR) {
    message = 'ERROR: ' + message;
  } else if (verbosity === LOG.WARN) {
    message = 'WARNING: ' + message;
  }
  console.log(message);
  var isError = (verbosity === LOG.ERROR);
  if (isError && this.debugging === LOG.TRACE) {
    console.trace('Trace follows');
    window.utools.showNotification('FTPD ' + message);
  }
};


// service: start or stop service.
window.service = {
  get_server: () => {
    return server;
  },
  start_server: function (options, isRestart=false) {
    console.log("Starting service...")
    if (isRestart && server.server.listening) {
      server.close();
    }
    server.getRoot = () => options.location;
    user_pass.username = options.username;
    user_pass.password = options.password;
    server.listen(options.port);
    window.utools.showNotification('FTP服务器已启动: ' + server.getRoot());
  },
  stop_server: function() {
    server.close();
    window.utools.showNotification('FTP服务器已停止');
  },
  get_server_status: function () {
    return server.server.listening;
  }
}
