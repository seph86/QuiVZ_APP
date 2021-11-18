import { Component } from 'inferno';
import { findDOMNode } from 'inferno-extras';
import purify from 'dompurify';
import { Challenge } from './Challenge';
import { Test } from './Test';
import { Form, Field, Button, Nag } from '../fomantic/Fomantic';
import { createHash } from 'crypto';
import './style.css';
import { ListUsers } from './ListUsers';
import { Listener } from '../common/EventListener';
import { Friends } from './Friends';
import { Quiz } from './Quiz';
import { TestPanel } from './TestPanel';

export class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: window.localStorage.getItem("name"),
      isAdmin: process.env.NODE_ENV === 'development', // Dev mode testing
      inGame: false,
      opponent: null,
      singlePlayer: false,
      friends: window.quivzStats,
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updateAdmin = this.updateAdmin.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.onRecieveChallenge = this.onRecieveChallenge.bind(this);
    this.onBackFromQuiz = this.onBackFromQuiz.bind(this);
    this.updateFriendData = this.updateFriendData.bind(this);

    // Connect to Event Server
    Listener.connect();

  }

  updateUsername(username) {
    this.setState({username: username});
    window.localStorage.setItem("name", username);
    window.localStorage.setItem("qrCode", null);
  }

  updateAdmin(newState) {
    this.setState({isAdmin: newState});
  }

  updateFriendData(uuid, data) {
    const self = this;
    window.quivzStatsInstance.setItem(uuid, {name: data.name, games: data.games, wins: data.wins}).then(() => {
      self.setState( prevState => ( {friends: {...prevState.friends, [uuid]: {name: data.name, games: data.games, wins: data.wins}}} ) )
    });
  }

  startQuiz(uuid, name) {

    const self = this;
    window.$(findDOMNode(this)).transition({
      animation: "fade out",
      onComplete: () => {
        self.setState({inGame: true})
      }
    })
    window.$("body").api({
      on: "now",
      action: "get quiz"
    })

  }

  onRecieveChallenge(event) {

    let friend = null;
    for (let i in this.state.friends) {
      if (this.state.friends[i][0] === event.data) {
        friend = this.state.friends[i];
        break;
      }
    }

    if (friend) {

      if (this.state.inGame) {
        window.$("body").api({
          on: "now",
          action: "reject challenge",
          urlData: {
            uuid: friend[0]
          }
        });
        return;
      }

      const self = this;
      window.$("body").toast({
        title: purify.sanitize(friend[1].name) + " has requested a challenge, do you accept?",
        displayTime: 3000,
        position: "top attached",
        class: "blue",
        classActions: "bottom attached",
        showProgress: "top",
        classProgress: "yellow",
        actions: [
          {
            text: "Yes",
            class: "green",
            click: () => {
              //console.log("accepted");
              window.$("body").api({
                action: "accept challenge",
                on: "now",
                urlData: {
                  uuid: friend[0],
                  gameID: event.data
                },
                onSuccess: () => {
                  window.$(findDOMNode(this)).transition({
                    animation: "fade out",
                    onComplete: () => {
                      self.setState({inGame: true, singlePlayer: false, opponent: friend[1].name})
                    }
                  })
                }
              })
            }
          },
          {
            text: "No",
            class: "red",
            click: () => {
              //console.log("rejected");
              window.$("body").api({
                action: "reject challenge",
                on: "now",
                urlData: {
                  uuid: friend[0]
                }
              })
            }
          }
        ]
      })
    } else {
      // We dont know who this is so we'll ignore the request
      return;
    }
 
  }

  componentDidMount(){

    // Listen to incoming challenges
    Listener.src.addEventListener("challenge", this.onRecieveChallenge);

    window.$('#dashboard-group .segment')
    .transition({
      animation : 'pulse',
      reverse   : 'auto', // default setting
      interval  : 100
    });

    window.$("#username-nag").nag({key: "username"});

    // Make progress bars look nice
    window.$(".ui.progress").progress({className: {active: "none", success: "none"}})

  }

  componentWillUnmount() {
    // Clean up event handler
    Listener.src.removeEventListener("challenge", this.onRecieveChallenge);
  }

  componentDidUpdate() {
    window.$(".ui.progress").progress({className: {active: "none", success: "none"}})
  }

  onBackFromQuiz() {
    this.setState({inGame:false});
    window.$(findDOMNode(this)).transition("fade in");
  }

  render() {
    return(
      <>
      {!this.state.inGame
        ? 
        <div class="ui container">
          <Settings username={this.state.username} updateUsername={this.updateUsername} updateAdmin={this.updateAdmin} onLogout={this.props.setLoggedIn}/>
          <div id="dashboard-group">
            <Nag id="nointernet" color="red">No internet connection</Nag>
            <DashboardHeader username={this.state.username}/>
            <Nag id="username-nag" close>You can change your name in settings (<i class="cog icon"></i>)</Nag>
            <Challenge callback={this.startQuiz}/>
            <Friends />
            <DrawWins friends={this.state.friends}/>
            { this.state.isAdmin && <>
              <div class="ui basic segment hidden">
                <h2>Admin options</h2>
              </div>
              <ListUsers />
              <Test />
              <TestPanel onClick={() => {
                //self.setState( prevState => ( {friends: {...prevState.friends, [uuid]: {name: data.name, games: data.games, wins: data.wins}}} ) )
                let test = this.state.friends.Testuuid;
                this.setState(prevState => ({friends: {...prevState.friends,  ["Testuuid"]: { name:  test.name, games: ++test.games, wins: test.wins + (Math.random() > 0.5 ? 1 : 0)}}}));
              }}/>
            </> }
          </div>
        </div>
        :
        <Quiz 
          singlePlayer={this.state.singlePlayer} 
          opponent={this.state.opponent}
          uuid={this.state.uuid}
          callback={this.onBackFromQuiz}
          />
      }
      </>
    );
  }

}

function DrawWins(props) {

  let games = 0, wins = 0

  console.log(props);

  for (const [uuid, data] of Object.entries(props.friends) ) {
    console.log(uuid,data)
    if (data.games !== undefined) {
      games += parseInt(data.games)
      wins += parseInt(data.wins)
    }
  }

  let percent = Math.floor((wins / games) * 100);

  return(
    <div id="stats" class="ui segment inverted grey hidden">
      <h2>Stats</h2>
      <div class={ games > 0 && "ui small centered image"} >
        {games > 0 ?
          <>  
            <svg viewBox="0 0 36 36">
              <path
                className="ring-circle"
                d="m 18,2.0845 a -15.9155,15.9155 0 0 0 0,31.831 -15.9155,15.9155 0 0 0 0,-31.831"
                strokeDasharray={percent + ", 100"}
              />
            </svg>
            <span class="ui header huge" style={{position: "absolute", top: "23%", width: "100%","text-align":"center" }}>{percent}%</span>
          </>
          :
          <h3>No Data</h3>
        }
      </div>
      <div class="ui divider"></div>
      {props.friends && 
        Object.entries(props.friends).map((friend, index) =>
          <>
          {friend[1].name}
          <div key={index.toString()} class="ui slow indicating progress" data-percent={Math.floor((friend[1].wins/friend[1].games)*100)} style={{margin: "0 0 1rem 0"}}>
            <div class="bar">
              <div class="progress centered"></div>
            </div>
          </div>
          </>
        )
      }
    </div>
  )
}

class DashboardHeader extends Component {

  onClickSettings() {
    window.$("#settings").toggleClass("open");
  }

  render() {
    return(
      <div class="ui basic segment horizontally fitted">
        <div class="ui grid compact">
          <div class="ten wide column">
            <h2>Dashboard - Hello, {this.props.username}!</h2>
          </div>
          <div class="right aligned six wide column">
            <i class="cog big icon" onClick={this.onClickSettings}></i>
          </div>
        </div>
      </div>
    );
  }

}

class Settings extends Component {

  constructor(props) {
    super(props);

    // Hopefully will compile to be obfuscated enough
    this.isAdmin = window.localStorage.getItem("conditional") === createHash('sha256').update( window.localStorage.getItem("uuid") + [0xb1, 0x4f, 0x6c, 0x79, 0xf8, 0xac].reduce((a,b)=>a.toString(16)+b.toString(16))).digest("hex")

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.confirmLogout = this.confirmLogout.bind(this);
    this.onChangeAdmin = this.onChangeAdmin.bind(this);
  }

  onChangeUsername(event) {
    window.$(findDOMNode(this)).find("#change-name").form("validate form");
    if (window.$(findDOMNode(this)).find("#change-name").form("is valid")) {
      this.props.updateUsername(event.target.value);
      window.$("body").toast({
        message: "Name updated!",
        position: "top attached",
        class: "success"
      })
    }
  }

  onClickX() {
    window.$("#settings").removeClass("open");
  }

  onChangeAdmin() {
    this.props.updateAdmin( window.$("#admin-mode").prop("checked") )
  }

  componentDidMount() {
    window.$.fn.form.settings.rules.validName = function(value) {
      return value.match(/^[A-Za-z\d ]{1,20}$/) != null;
    }
    window.$(findDOMNode(this)).find("#change-name").form({
      fields: {
        username: ["validName","empty"]
      },
      onSuccess: function(event) {
        if (event !== undefined) event.preventDefault();
      }
    });

    if (window.localStorage.getItem("theme") !== undefined)
      window.$("#light-theme").prop("checked", window.localStorage.getItem("theme") === "light" ? true : false);

    window.$.fn.form.settings.rules.validPassword = function(value) {
      return value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{15,}$/) != null;
      //return true;
    }
    window.$("#update-password").form({
      fields: {
        oldpassword: ["empty"],
        newpassword: {
          rules: [
            {
              type: "validPassword",
              prompt: "Password must be 15 characters containg at least 1 uppercase, 1 lowercase, and 1 digit"
            }
          ]
        },
        confirm_password: ["match[newpassword]", "empty"]
      }
    }).api({
      action: "new password",
      serializeForm: true,
      onSuccess: function(response) {
        window.$(this).form("clear");
        window.$("body").toast({
          message: "Password updated",
          class: "success",
          position: "top attached"
        })
      },
      onFailure: function(response) {
        window.$(this).form('add errors', [response.message]);
      }
    })
    window.$("#update-password").keypress(function(event) {
      if (event.which ===  13) {
        event.preventDefault();
      }
    })
  }

  changeTheme(){
    window.localStorage.setItem("theme",window.$("#light-theme").prop("checked") ? "light" : "dark");
    if (window.$("#light-theme").prop("checked")) {
      document.querySelector("#stylesheet-theme").href = "semantic-light.min.css";
    } else { 
      document.querySelector("#stylesheet-theme").href = "semantic.min.css";
    }
  }

  confirmLogout(){

    const self = this;
    window.$("#settings .ui.basic.modal").modal({
      onApprove: function() {
        self.props.onLogout(false);
        window.$("body").api({
          action: "logout",
          method: "post",
          on: "now"
        })
      }
    }).modal('show');

  }

  render() {
    return(
      <div class="ui grid" id="settings">
        <div class="ten wide column">
          <h2>Settings</h2>
        </div>
        <div class="right aligned six wide column">
          <i class="times big icon" onClick={this.onClickX}></i>
        </div>
        <div class="sixteen wide column">
          <Form id="change-name">
            <Field>
              <label>
                Public Username
              </label>
              <input name="username" defaultValue={this.props.username} onChange={this.onChangeUsername}></input>
            </Field>
            <div class="ui error message"></div>
          </Form>
        </div>
        <div class="six wide column">
          <div class="ui toggle checkbox">
            <input id="light-theme" type="checkbox" onClick={this.changeTheme}/>
            <label></label>
          </div>
        </div>
        <div class="right aligned ten wide column"><h3>Use light theme</h3></div>
        <div class="row">
          <div class="sixteen wide column">
            <Form id="update-password">
              <Field>
                <label>
                  Change Password
                </label>
                <input name="oldpassword" placeholder="old password" type="password" autoComplete="new-password"></input>
                <label></label>
                <input name="newpassword" placeholder="new password" type="password" autoComplete="new-password"></input>
                <label></label>
                <input data-validate="confirm_password" placeholder="confirm password" type="password" autoComplete="new-password"></input>
              </Field>
              <div class="ui error message"></div>
              <Button fluid>Submit</Button>
            </Form>
          </div>
        </div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row">
          <div class="center aligned column">
            <div class="ui basic red button" onClick={this.confirmLogout}>Logout</div>
            <div class="ui basic modal">
              <div class="content">
                <p>Are you sure?</p>
              </div>
              <div class="actions">
                <div class="ui red cancel inverted button">
                  <i class="remove icon"></i>
                  No
                </div>
                <div class="ui green ok inverted button">
                  <i class="checkmark icon"></i>
                  Yes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}