/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */

// @flow
import React, { Component } from 'react';
import EasyTimer from 'easytimer';
import { ipcRenderer } from 'electron';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import styles from './Home.css';
import lukadoncic from '../images/lukadoncic.png';
import gorandragic from '../images/gorandragic.png';
import nbalogo from '../images/nba-logo.png';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  state = {
    name: '',
    email: '',

    lastLukaDoncicVote: '',
    lastGoranDragicVote: '',

    lastNbaVote: '',
    nbaVoteTimerDisplay: '',
    canNbaVote: false,

    lukaVoteTimerDisplay: '',
    canLukaVote: false,

    goranVoteTimerDisplay: '',
    canGoranVote: false,

    showEmailErr: false
  };

  nbaVoteTimer;

  lukaDoncicTimer;

  goranDragicTimer;

  async componentDidMount() {
    await this.checkForData();
    await this.setState(this.getData());
    await this.startNbaVoteTimer();
    await this.startLukaVoteTimer();
    await this.startGoranVoteTimer();
    ipcRenderer.on('vote-on-nba-return', this.voteOnNbaReturn);
    ipcRenderer.on(
      'vote-on-google-for-luka-return',
      this.voteOnGoogleForLukaReturn
    );
    ipcRenderer.on(
      'vote-on-google-for-goran-return',
      this.voteOnGoogleForGoranReturn
    );
  }

  componentWllUnmount() {
    ipcRenderer.removeListener('vote-on-nba-return', this.voteOnNbaReturn);
    ipcRenderer.removeListener(
      'vote-on-google-for-luka-return',
      this.voteOnGoogleForLukaReturn
    );
    ipcRenderer.removeListener(
      'vote-on-google-for-goran-return',
      this.voteOnGoogleForGoranReturn
    );
  }

  checkForData = () => {
    if (!localStorage.getItem('db')) {
      localStorage.setItem('db', JSON.stringify(this.state));
    }
  };

  startNbaVoteTimer = () => {
    const a = new Date();
    const b = new Date(this.state.lastNbaVote);
    b.setDate(b.getDate() + 1);

    if (this.checkIfDate2IsBigger(a, b)) {
      this.nbaVoteTimer = new EasyTimer();
      this.nbaVoteTimer.start({
        countdown: true,
        startValues: { seconds: this.getSeconds(a, b) }
      });
      this.nbaVoteTimer.addEventListener('secondsUpdated', async () => {
        await this.setState({
          nbaVoteTimerDisplay: this.nbaVoteTimer.getTimeValues().toString()
        });
        await this.setData(this.state);
      });
      this.nbaVoteTimer.addEventListener('targetAchieved', async () => {
        await this.setState({ canNbaVote: true });
        await this.setData(this.state);
      });

      setTimeout(async () => {
        await this.setState({ canNbaVote: false });
        await this.setData(this.state);
      }, 1000);
    } else {
      this.setState({ canNbaVote: true });
      this.update('canNbaVote', true);
    }
  };

  startLukaVoteTimer = () => {
    const a = new Date();
    const b = new Date(this.state.lastLukaDoncicVote);
    b.setDate(b.getDate() + 1);

    if (this.checkIfDate2IsBigger(a, b)) {
      this.lukaDoncicTimer = new EasyTimer();
      this.lukaDoncicTimer.start({
        countdown: true,
        startValues: { seconds: this.getSeconds(a, b) }
      });
      this.lukaDoncicTimer.addEventListener('secondsUpdated', async () => {
        await this.setState({
          lukaVoteTimerDisplay: this.lukaDoncicTimer.getTimeValues().toString()
        });
        await this.setData(this.state);
      });
      this.lukaDoncicTimer.addEventListener('targetAchieved', async () => {
        await this.setState({ canLukaVote: true });
        await this.setData(this.state);
      });

      setTimeout(async () => {
        await this.setState({ canLukaVote: false });
        await this.setData(this.state);
      }, 1000);
    } else {
      this.setState({ canLukaVote: true });
      this.update('canLukaVote', true);
    }
  };

  startGoranVoteTimer = () => {
    const a = new Date();
    const b = new Date(this.state.lastGoranDragicVote);
    b.setDate(b.getDate() + 1);

    if (this.checkIfDate2IsBigger(a, b)) {
      this.goranDragicTimer = new EasyTimer();
      this.goranDragicTimer.start({
        countdown: true,
        startValues: { seconds: this.getSeconds(a, b) }
      });
      this.goranDragicTimer.addEventListener('secondsUpdated', async () => {
        await this.setState({
          goranVoteTimerDisplay: this.goranDragicTimer
            .getTimeValues()
            .toString()
        });
        await this.setData(this.state);
      });
      this.goranDragicTimer.addEventListener('targetAchieved', async () => {
        await this.setState({ canGoranVote: true });
        await this.setData(this.state);
      });

      setTimeout(async () => {
        await this.setState({ canGoranVote: false });
        await this.setData(this.state);
      }, 1000);
    } else {
      this.setState({ canGoranVote: true });
      this.update('canGoranVote', true);
    }
  };

  getSeconds = (date1, date2) => {
    const dateObject1 = new Date(date1);
    const dateObject2 = new Date(date2);
    const timeDiff = Math.abs(dateObject2.getTime() - dateObject1.getTime());

    let seconds = 0;

    seconds = Math.round(timeDiff / 1000);

    return seconds;
  };

  checkIfDate2IsBigger = (date1, date2) => {
    const dateObject1 = new Date(date1);
    const dateObject2 = new Date(date2);
    return dateObject1.getTime() < dateObject2.getTime();
  };

  getData = () => JSON.parse(localStorage.getItem('db'));

  setData = data => {
    localStorage.setItem('db', JSON.stringify(data));
  };

  update = (entity, item) => {
    const data = this.getData();
    data[entity] = item;
    this.setData(data);
  };

  handleChange = name => async event => {
    await this.setState({
      [name]: event.target.value
    });
    if (name === 'email') {
      if (!this.isValidEmail(this.state.email)) {
        await this.setState({ showEmailErr: true });
      } else {
        await this.setState({ showEmailErr: false });
      }
    }
    await this.setData(this.state);
  };

  voteOnNba = () => {
    ipcRenderer.send('vote-on-nba', this.state);
  };

  voteOnGoogleForLuka = () => {
    ipcRenderer.send('vote-on-google-for-luka', this.state);
  };

  voteOnGoogleForGoran = () => {
    ipcRenderer.send('vote-on-google-for-goran', this.state);
  };

  voteOnNbaReturn = async () => {
    await this.setState({ lastNbaVote: new Date() });
    await this.setData(this.state);
    await setTimeout(() => {
      this.startNbaVoteTimer();
    }, 20000);
    await window.location.reload();
  };

  voteOnGoogleForLukaReturn = async () => {
    await this.setState({ lastLukaDoncicVote: new Date() });
    await this.setData(this.state);
    await this.startLukaVoteTimer();
    await window.location.reload();
  };

  voteOnGoogleForGoranReturn = async () => {
    await this.setState({ lastGoranDragicVote: new Date() });
    await this.setData(this.state);
    await this.startGoranVoteTimer();
    await window.location.reload();
  };

  isValidEmail = email => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = regexp.test(email);
    return isValid;
  };

  render() {
    return (
      <div
        className={styles.container}
        data-tid="container"
        style={{ padding: 35 }}
      >
        {/* <pre style={{color: 'black'}}>{JSON.stringify(this.state, null, 2) }</pre> */}
        <div style={{ textAlign: 'center' }}>
          <img src={nbalogo} alt="nbalogo" />
          <br />
          <br />
          <Typography variant="h6" className={styles.heading}>
            You can vote every 24 hours.
          </Typography>
        </div>

        <br />
        <br />

        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Players</Typography>
            <div>
              <List>
                <ListItem>
                  <div className="list-image-avatar">
                    <div
                      style={{ backgroundImage: `url(${lukadoncic})` }}
                      className="list-image"
                    />
                  </div>
                  <ListItemText primary="Luka Dončić" secondary="Frontcourt" />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.voteOnGoogleForLuka}
                      disabled={!this.state.canLukaVote}
                    >
                      Vote on Google for Luka
                    </Button>
                    <br />
                    {!this.state.canLukaVote ? (
                      <span style={{ color: 'red' }}>
                        {this.state.lukaVoteTimerDisplay} &nbsp;
                      </span>
                    ) : (
                      ''
                    )}
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <div className="list-image-avatar">
                    <div
                      style={{ backgroundImage: `url(${gorandragic})` }}
                      className="list-image"
                    />
                  </div>
                  <ListItemText primary="Goran Dragić" secondary="Guard" />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.voteOnGoogleForGoran}
                      disabled={!this.state.canGoranVote}
                    >
                      Vote on Google for Goran
                    </Button>
                    <br />
                    {!this.state.canGoranVote ? (
                      <span style={{ color: 'red' }}>
                        {this.state.goranVoteTimerDisplay} &nbsp;
                      </span>
                    ) : (
                      ''
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <form
              className={styles.container}
              noValidate
              autoComplete="off"
              style={{ paddingRight: 15 }}
            >
              <Typography variant="h6" className={styles.heading}>
                Enter your name and email to vote on nba.com
              </Typography>
              <TextField
                fullWidth
                style={{ margin: 8 }}
                id="name"
                label="Name"
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
              />
              <br />
              <TextField
                fullWidth
                style={{ margin: 8 }}
                id="email"
                label="Email"
                value={this.state.email}
                onChange={this.handleChange('email')}
                margin="normal"
              />
              {this.state.showEmailErr ? (
                <small style={{ color: 'red' }}>
                  Please enter valid email.
                </small>
              ) : (
                ''
              )}
            </form>
          </Grid>
        </Grid>
        <br />
        <br />
        <div style={{ textAlign: 'center' }}>
          {!this.state.canNbaVote ? (
            <span style={{ color: 'red' }}>
              {this.state.nbaVoteTimerDisplay} &nbsp;
            </span>
          ) : (
            ''
          )}

          {!this.isValidEmail(this.state.email) || !this.state.name ? (
            <div style={{ textAlign: 'center' }} className="black">
              You have to enter your name and valid email to be able to vote on
              nba.com
              <br />
              <br />
            </div>
          ) : (
            ''
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={this.voteOnNba}
            disabled={
              !this.isValidEmail(this.state.email) ||
              !this.state.name ||
              !this.state.canNbaVote
            }
          >
            Vote on NBA.com
          </Button>
          <br />
          <br />
          {this.isValidEmail(this.state.email) &&
          this.state.name &&
          this.state.canNbaVote ? (
            <div style={{ textAlign: 'center' }} className="black">
              (solve captcha and submit)
              <br />
              <br />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
