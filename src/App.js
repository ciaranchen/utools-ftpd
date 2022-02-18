import React from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { ButtonGroup, Button, TextField, Grid, Container } from '@material-ui/core/';

let default_options = {
  host: '127.0.0.1',
  port: 21,
  username: 'ftp',
  password: 'ftp',
  location: 'D:\\'
};

const themeDic = {
  light: createTheme({
    palette: {
      type: 'light'
    },
    props: {
      MuiButtonBase: {
        disableRipple: true
      }
    }
  }),
  dark: createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#90caf9'
      },
      secondary: {
        main: '#f48fb1'
      }
    },
    props: {
      MuiButtonBase: {
        disableRipple: true
      }
    }
  })
};


export default class App extends React.Component {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  constructor (props) {
    super(props);
    this.state = {
      isChanged: false,
      status: window.service.get_server_status(),
      // options
      host: '',
      port: 21,
      username: '',
      password: '',
      location: ''
    };
    // manage server status
    this.clickStartServer = this.clickStartServer.bind(this);
    this.clickStopServer = this.clickStopServer.bind(this);
    this.clickRestartServer = this.clickRestartServer.bind(this);
    // Restore and submit
    this.clickRestoreSettings = this.clickRestoreSettings.bind(this);
    this.clickSaveSettings = this.clickSaveSettings.bind(this);
    // onChange
    this.handleChange = this.handleChange.bind(this);
    // TODO: the password visitable functions.
  };

  clickStartServer () {
    window.service.start_server(this.state);
    this.updateServerStatus();
  }

  clickStopServer () {
    window.service.stop_server();
    this.updateServerStatus();
  }

  clickRestartServer () {
    window.service.start_server(this.state, true);
    this.updateServerStatus();
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  clickRestoreSettings () {
    const options = window.utools.db.get('ftpd_options').data;
    this.setState(options);
  }

  // TODO: fix this with host.
  clickSaveSettings (e, notify=true) {
    if (e) {
      e.preventDefault();
    }
    // TODO: Save to utools db.
    let options = {};
    for (let k in this.state) {
      if (k == 'username' || k == 'password') {
        options[k] = this.state[k];
      }
      if (k == 'host' || k == 'port') {
        options[k] = this.state[k];
      }
      if (k == 'location') {
        options[k] = this.state[k];
      }
    }
    console.log(options);
    let rev = window.utools.db.get('ftpd_options')._rev
    window.utools.db.put({_id: 'ftpd_options', data: options, _rev: rev});
    if (notify) {
      window.utools.showNotification('保存成功, 下次启动生效');
    }
  }

  updateServerStatus () {
    this.setState({status: window.service.get_server_status()});
  }

  componentDidMount () {
    window.utools.onPluginReady(() => {
      let options = null;
      let options_db = window.utools.db.get('ftpd_options');
      if (!options_db) {
        options = default_options;
        window.utools.db.put({_id: 'ftpd_options', data: options});
      } else {
        options = options_db.data;
      }
      this.setState(options);
    });

    // 进入插件
    window.utools.onPluginEnter(({ code, type, payload }) => {
      if (code != 'server-ui') {
        if (code == 'serv-start') {
          this.setState({location: payload[0].path});
          this.clickSaveSettings(null, false);
          window.service.start_server(this.state, true);
          this.updateServerStatus();
        }
        if (code == 'serv-stop') {
          this.clickStopServer();
        }
        window.utools.hideMainWindow();
      }
      this.setState({ code });
    })
    // 退出插件
    window.utools.onPluginOut(() => {
      this.setState({ code: '' })
    })
  }

  render () {
    const theme = this.theme;

    return (
    <ThemeProvider theme={themeDic[theme]}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            服务状态: {this.state.status? 'ON': 'OFF'}
          </Grid>
          <Grid item xs={6}>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button disabled={this.state.status} onClick={this.clickStartServer}>Start</Button>
              <Button disabled={!this.state.status} onClick={this.clickStopServer}>Stop</Button>
              <Button onClick={this.clickRestartServer}>Restart</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>

      <Container>
        <form noValidate autoComplete="off" onSubmit={this.clickSaveSettings}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField required fullWidth id="username_input" name="username" label="Username" value={this.state.username} disabled={this.state.status} onChange={this.handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField required fullWidth id="password_input" name="password" label="Password" value={this.state.password} disabled={this.state.status} onChange={this.handleChange} type="password" />
            </Grid>
            <Grid item xs={8}>
              <TextField required fullWidth id="host_input" name="host" label="Host"  value={this.state.host} disabled={this.state.status} onChange={this.handleChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField required fullWidth id="port_input" name="port" label="Port" type="number" value={this.state.port} disabled={this.state.status} onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth id="location_input" name="location" label="Location" value={this.state.location} disabled={this.state.status} onChange={this.handleChange} />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={this.clickRestoreSettings}>
                恢复
              </Button>
              <Button variant="contained" color="primary" type="submit">
                保存
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
    )
  }
}
