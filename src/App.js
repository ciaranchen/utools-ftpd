import React from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { ButtonGroup, Button, Paper, TextField, Typography, Grid, Container } from '@material-ui/core/';

let default_options = {
  port: 21,
  username: 'ftp',
  password: 'ftp',
  location: 'C:\\'
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
      // below is options
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
    this.clickSaveSettings = this.clickRestoreSettings.bind(this);
    // TODO: the onChange functions.
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

  clickRestoreSettings () {
    const options = window.utools.db.get('ftpd_options').data;
    this.setState(options);
  }

  clickSaveSettings (e) {
    e.preventDefault();
    // TODO: Save to utools db.
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
      if (code == 'server-ui') {
        // TODO: show server status.
      } else {
        console.log('HideMainWindow');
        window.utools.hideMainWindow();
      }
      console.log(code);
      console.log(type);
      console.log(payload);
      this.setState({ code });
    })
    // 退出插件
    window.utools.onPluginOut(() => {
      this.setState({ code: '' })
    })
    console.log(this);
  }

  render () {
    const theme = this.theme;

    return (
    <ThemeProvider theme={themeDic[theme]}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              服务状态: {this.state.status? 'ON': 'OFF'}
            </Typography>
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
        <form noValidate autoComplete="off" onSubmit={clickSaveSettings}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField required fullWidth id="username_input" label="Username" value={this.state.username} disabled={this.state.status} />
            </Grid>
            <Grid item xs={6}>
              <TextField required fullWidth id="password_input" label="Password" value={this.state.password} disabled={this.state.status} type="password" />
            </Grid>
            <Grid item xs={8}>
              <TextField required fullWidth id="location_input" label="Location" value={this.state.location} disabled={this.state.status} />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="port_input"
                label="Port"
                type="number"
                value={this.state.port}
                disabled={this.state.status}
              />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={this.clickRestoreSettings}>
                恢复
              </Button>
              <Button variant="contained" color="primary">
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
