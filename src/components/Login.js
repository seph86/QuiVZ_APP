import { Component } from 'inferno';
import './style.css';
import { Button, Form, Field } from '../fomantic/Fomantic';

export class Login extends Component {

  componentDidMount() {

    const self = this;
    window.$(".ui.form").form({
      fields: {
        password: ["empty"]
      }
    }).api({
      action: "login",
      method: "POST",
      data: {
        uuid: window.localStorage.getItem("uuid")
      },
      onSuccess: function(response) {
        window.localStorage.setItem("token", response[0].data.token);
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
      },
      onError: function(error) {
        window.$('.ui.form').form('add errors', [error]);
      },
      onAbort: function(error, element, xhr) {
        if (xhr.statusText === "error")
          window.$('.ui.form').form('add errors', ["There was an issue connecting to servers =("]);
      },
      beforeSend: function(settings) {
        settings.data.password = window.$(".ui.form input").val()
        return settings;
      }
    });

    window.$(".ui.form").keypress(function(event) {
      if (event.which ===  13) {
        event.preventDefault();
      }
    })

  }

  render(){
    return(
      <Form>
        <Field>
          <div class="ui input">
            <input placeholder="Password" type="password" name="password" autoComplete="new-password" />
          </div>
        </Field>
        <div class="ui error message"></div>
        <Button id="login-button" fluid>Login</Button>
      </Form>
    );
  }

}