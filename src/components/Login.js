import { Component } from 'inferno';
import './style.css';
import { Button } from '../fomantic/Fomantic';

export class Login extends Component {

  componentDidMount() {
    window.$("#login-button").api({
      action: "login",
      method: "post",
      beforeSend: function(settings) {
        settings.data.uuid = "65a6fc4a8551e48fd5a9fcafe9cfb5a35df0782551d870951ec6457e7dee0924";
        settings.data.password = "StrongPassword01";
        return settings;
      }
    });
  }

  render(){
    return(
      <>
        <div id="login-pass" class="ui input fluid">
          <input placeholder="password" type="password"></input>
        </div>
        <div>
          <Button id="login-button" fluid>Login</Button>
        </div>
      </>
    );
  }

}