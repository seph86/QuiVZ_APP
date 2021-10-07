import { Component } from 'inferno';
import './style.css';
import { Button, Form, Field} from '../fomantic/Fomantic';

export class Signup extends Component {

  componentDidMount() {

    // set reference to self so that jquery can use it later
    var self = this;

    window.$.fn.form.settings.rules.validPassword = function(value) {
      return value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{15,}$/) != null;
      //return true;
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
      onSuccess: function(response) {
        console.log(response);return;
        window.localStorage.setItem("uuid",response.data[0].data.UUID)
        window.$('#account-container').transition({
          animation  : 'fade out',
          duration   : '1s',
          onComplete : function() {
            self.props.update(true);
          }
        });
      },
      onFailure: function(response) {
        window.$('.ui.form').form('add errors', [response.message]);
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