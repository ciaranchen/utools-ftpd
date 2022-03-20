const ftpd = require('ftpd');
const os = require('os');

function create_server(options) {
  let server = new ftpd.FtpServer(options.host, {
    getInitialCwd: () => '/',
    getRoot: () => options.location,
    pasvPortRangeStart: 10025,
    pasvPortRangeEnd: 10050,
    useWriteFile: true,
    useReadFile: true
  });

  // 常规设置
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

  // 用户登录信息
  server.on('client:connected', function (connection) {
    // 设置用户名密码
    var username = null;
    console.log('client connected: ' + connection.remoteAddress);
    connection.on('command:user', function (user, success, failure) {
      if (!options.need_authentication) {
        success();
        return;
      }
      if (user === options.username) {
        username = user;
        success();
      } else {
        failure();
      }
    });

    connection.on('command:pass', function (pass, success, failure) {
      if (!options.need_authentication) {
        success('anonymous');
        return;
      }
      if (pass === options.password) {
        success(username);
      } else {
        failure();
      }
    });
  });
  return server;
}

function getIPAddress() {
  let IPAddress = [];
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        IPAddress.push(alias.address);
      }
    }
  }
  return IPAddress;
};


let server;


// service: start or stop service.
window.service = {
  getIPAddress: () => {
    let IPAddress = [];
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          IPAddress.push(alias.address);
        }
      }
    }
    return IPAddress;
  },
  get_server: (default_options) => {
    if (server) {
      return server;
    } else {
      return create_server(default_options);
    }
  },
  start_server: function (options, isRestart = false) {
    if (isRestart && server.server.listening) {
      server.close();
    }

    server = create_server(options);

    console.log("Starting service...")
    server.listen(options.port);
    // window.utools.showNotification('FTP服务器已启动: ' + server.getRoot());
  },
  stop_server: function () {
    server.close();
    // window.utools.showNotification('FTP服务器已停止');
  },
  get_server_status: function (default_options) {
    return window.service.get_server(default_options).server.listening;
  }
}
