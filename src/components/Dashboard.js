import { Component } from 'inferno';
import { findDOMNode } from 'inferno-extras';
import { Challenge } from './Challenge';
import { Test } from './Test';
import { SearchCategories } from './SearchCategories';
import { AllCategories } from './AllCategories';
import { Form, Field, Button, Nag } from '../fomantic/Fomantic';
import { createHash } from 'crypto';
import './style.css';
import { ListUsers } from './ListUsers';

export class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: window.localStorage.getItem("name"),
      isAdmin: process.env.NODE_ENV === 'development' // Dev mode testing
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updateAdmin = this.updateAdmin.bind(this);
  }

  updateUsername(username) {
    this.setState({username: username});
    window.localStorage.setItem("name", username);
  }

  updateAdmin(newState) {
    this.setState({isAdmin: newState});
  }

  componentDidMount(){
    window.$('#dashboard-group .segment')
    .transition({
      animation : 'pulse',
      reverse   : 'auto', // default setting
      interval  : 100
    });
  }

  render() {
    return(
      <div class="ui container">
        <Settings username={this.state.username} updateUsername={this.updateUsername} updateAdmin={this.updateAdmin} onLogout={this.props.setLoggedIn}/>
        <div id="dashboard-group">
          <Nag id="nointernet" color="red">No internet connection</Nag>
          <DashboardHeader username={this.state.username}/>
          <div class="ui segment inverted grey">
            <h2>Wins</h2>
            <DrawWins></DrawWins>
          </div>
          <Challenge />
          <SearchCategories />
          <AllCategories />
          { this.state.isAdmin && <>
            <h2>Admin options</h2>
            <ListUsers />
            <Test />
          </> }
        </div>

      </div>
    );
  }

}

function DrawWins(props) {
  return(
    <div class="ui small centered image">
      <svg viewBox="0 0 36 36">
        <path
          className="ring-circle"
          d="m 18,2.0845 a -15.9155,15.9155 0 0 0 0,31.831 -15.9155,15.9155 0 0 0 0,-31.831"
          strokeDasharray="74, 100"
        />
      </svg>
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

    if (window.localStorage.getItem("allow-friends") !== undefined)
      window.$("#friend-requests").prop("checked", window.localStorage.getItem("allow-friends") === "true" ? true : false);

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

  toggleFriends() {
    window.localStorage.setItem("allow-friends",window.$("#friend-requests").prop("checked"));
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
            <input id="friend-requests" type="checkbox" onClick={this.toggleFriends}/>
            <label></label>
          </div>
        </div>
        <div class="right aligned ten wide column"><h3>Allow friend requests</h3></div>
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