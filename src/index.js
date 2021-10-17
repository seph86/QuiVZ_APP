import { render } from 'inferno';
import App from './App';
import * as serviceWorker from './serviceWorker';

const api_loc = "http://" + window.location.hostname + ":8080";

window.$.fn.api.settings.api = {
  "teapot": api_loc + "/teapot/",
  "login": api_loc + "/user/login/",
  "is logged in": api_loc + "/user/loggedin/",
  "logout": api_loc + "/user/logout/",
  "register" : api_loc + "/user/register/",
  "search category" : api_loc + "/category/search/",
  "all categories" : api_loc + "/category/getall/",
  "new password" : api_loc + "/user/newpassword/"
}

window.$.fn.form.settings.keyboardShortcuts = false;

{
  let store = window.localStorage;
  if (store.getItem("uuid") === null) store.setItem("uuid", "");
  if (store.getItem("token") === null) store.setItem("token", "");
}


render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
