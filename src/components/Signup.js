import { Component } from 'inferno';
import './style.css';
import { Button, Form, Field} from '../fomantic/Fomantic';

export class Signup extends Component {

  componentDidMount() {

    // set reference to self so that jquery can use it later
    const self = this;

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
          ],
          onValid: function(field) {
            console.log("valid?");
          },
          onInvalid: function(field) {
            console.log("invalid?");
          }
        },
        password_confirm: ["match[password]", "empty"]
      }
    }).api({
      action: "register",
      serializeForm: true,
      method: "post",
      onSuccess: function(response) {
        window.localStorage.setItem("uuid",response[0].data.UUID);
        window.localStorage.setItem("token", response[0].data.token);
        window.$('#account-container').transition({
          animation  : 'fade out',
          duration   : '1s',
          onComplete : function() {
            window.localStorage.setItem("name","User");
            self.props.update(true);
          }
        });
      },
      onFailure: function(response) {
        window.$('.ui.form').form('add errors', [response.message]);
      },
      onError: function(error) {
        window.$('.ui.form').form('add errors', [error]);
      },
      onAbort: function(error, element, xhr) {
        if (xhr.statusText === "error")
          window.$('.ui.form').form('add errors', ["There was an issue connecting to servers =("]);
      }
    });
  }

  render(){
    return(
      <Form>
        <Field>
          <div class="ui icon input">
            <input placeholder="Password" type="password" name="password" autoComplete="new-password" />
            <i class="key icon"></i>
          </div>
        </Field>
        <Field>
          <div class="ui icon input">
            <input placeholder="Confirm Password" type="password" name="password_confirm" autoComplete="new-password" />
            <i class="key icon"></i>
          </div>
        </Field>
        <div class="ui error message"></div>
        <Button id="signup-button" fluid>Create Account</Button>
      </Form>
    );
  }

}