import { Component } from 'inferno';
import './style.css';
import { Button, Form, Field} from '../fomantic/Fomantic';

export class Signup extends Component {

  constructor(props) {
    super(props)
    
    this.update = this.update.bind(this);

  }

  update() {
    console.log(this.props.update);
  }

  componentDidMount() {

    window.$.fn.form.settings.rules.validPassword = function(value) {
      //return value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{15,}$/) != null
      return true;
    }
    window.$(".ui.form").form({
      fields: {
        password: {
          rules: [
            {
              type: 'validPassword',
              prompt: "Password must be 15 characters containg at least 1 uppercase, 1 lowercase, and 1 digit"
            }
          ]
        },
        password_confirm: ["match[password]", "empty"]
      }
    }).api({
      action: "register",
      serializeForm: true,
      method: "post",
      onComplete: function(response) {
        console.log(response);
        return;
      }
      // beforeSubmit: function() {
      //   return false;
      // }
    });

    console.log(this.props);
  }

  render(){
    return(
      <Form>
        <Field>
          <div class="ui input">
            <input placeholder="Password" type="password" name="password" autoComplete="new-password" />
          </div>
        </Field>
        <Field>
          <div class="ui input">
            <input placeholder="Confirm Password" type="password" name="password_confirm" autoComplete="new-password" />
          </div>
        </Field>
        <div class="ui error message"></div>
        <Button id="signup-button" fluid>Create Account</Button>
      </Form>
    );
  }

}