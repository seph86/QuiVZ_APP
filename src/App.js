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
      loading: true,
      loggedIn:false
    }
    this.updateLoggedIn = this.updateLoggedIn.bind(this);
  }

  updateLoggedIn(newState){
    this.setState({loggedIn:newState})
    if (!newState) window.localStorage.setItem("token", "");
  }

  componentWillMount() {

    if (window.localStorage.getItem("uuid") && window.localStorage.getItem("token")) {
      const self = this;
      window.$("body").api({
        on: "now",
        action: "is logged in",
        method: "post",
        data: {
          token: window.localStorage.getItem("token")
        },
        onComplete: (response) => {
          self.setState({loading: false, loggedIn: true})
        },
        onFail: (response) => {
          self.setState({loading: false, loggedIn: false})
        }
      });
    } else {
      this.setState({loading: false});
    }
  }

  render() {

    if (this.state.loading) {
      return(
        <div id="loading-container" class="ui loading inverted segment"></div>
      )
    }

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
              { window.localStorage.getItem("uuid") ?  <Login update={this.updateLoggedIn}/> : <Signup update={this.updateLoggedIn}/> }
            </div>
          </div>
        </div>
      );

  }
}

export default App;
