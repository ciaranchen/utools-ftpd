const ftpd = require('ftpd');
const path = require('path');

let options = {
  host: '0.0.0.0',
  port: 21,
};

let server = new ftpd.FtpServer(options.host, {
  getInitialCwd: function () {
    return '/';
  },
  getRoot: function () {
    return 'D:\\';
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
    if (user === 'ftp') {
      console.log(user);
      username = user;
      success();
    } else {
      failure();
    }
  });

  connection.on('command:pass', function (pass, success, failure) {
    if (pass === 'ftp') {
      success(username);
    } else {
      failure();
    }
  });
});
server.debugging = 4;


window.exports = {
  'serv-start': {
    mode: 'none',
    args: {
      enter: function (action) {
        window.utools.hideMainWindow();
        // 如果Server正在运行，则关闭并重新在此目录下运行
        if (server.server.listening) server.close();

        if (action.payload.length < 1) return;

        let payload = action.payload[0];
        let objPath = payload.path;
        if (payload.isFile) {
          objPath = path.dirname(objPath);
        }
        server.getRoot = () => objPath;
        server.listen(options.port);
        console.log(server);
        // TODO: 一旦退出则server也会被停止
        // window.utools.outPlugin();
      }
    }
  },
  'serv-stop': {
    mode: 'none',
    args: {
      enter: function (action) {
        window.utools.hideMainWindow();
        server.close();
        window.utools.outPlugin();
      }
    }
  }
}
