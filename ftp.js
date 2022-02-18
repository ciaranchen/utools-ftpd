const ftpd = require('ftpd');
const path = require('path');

// options.host 应为本机的ip地址，这会传递给ftp client。
let options = {
  host: '0.0.0.0',
  port: 21,
};

let server = new ftpd.FtpServer(options.host, {
  getInitialCwd: function () {
    return '/';
  },
  getRoot: function () {
    return 'D:\\Desktop\\Projects\\ut_ftpd';
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  useWriteFile: true,
  useReadFile: true
});


// server.on('error', function (error) {
//   window.utools.showNotification('FTP Server Error:', error);
//   console.log('FTP Server error:', error);
// });
// server.on('close', function () {
//   window.utools.showNotification('FTP服务器已停止');
// });
// server.server.on('listening', function () {
//   window.utools.showNotification('FTP服务器已启动: ' + server.getRoot());
// });
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

server.listen(options.port);
