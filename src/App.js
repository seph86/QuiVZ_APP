import { Component } from 'inferno';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import './style.css';
import logo from './images/Logo.png';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loggedIn:window.localStorage.getItem("uuid") !== "" && window.localStorage.getItem("token") !== "" ? true : false,
      UUID:window.localStorage.getItem("uuid")
    }
    this.updateLoggedIn = this.updateLoggedIn.bind(this);
  }

  updateLoggedIn(newState){
    this.setState({loggedIn:newState})
    if (!newState) window.localStorage.setItem("token", "");
  }

  render() {
    if (this.state.loggedIn)
      return (
        <Dashboard setLoggedIn={this.updateLoggedIn} />
      );
    else
      return (
        <div id="account-container" class="ui grid middle aligned">
          <div class="centered row">
            <div class="ten wide center aligned column">
              <img class="ui centered small image" src={logo} alt=""></img>
              { this.state.UUID !== "" ?  <Login update={this.updateLoggedIn}/> : <Signup update={this.updateLoggedIn}/> }
            </div>
          </div>
        </div>
      );

  }
}

export default App;
