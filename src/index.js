import { render } from 'inferno';
// eslint-disable-next-line
import { App, pointer } from './App';
// eslint-disable-next-line
import { Quiz } from './components/Quiz';
import { Friends } from './components/Friends';
import * as serviceWorker from './serviceWorker';

const api_loc = "http://" + window.location.hostname + ":8080";

// end point actions
window.$.fn.api.settings.api = {
  "teapot": api_loc + "/teapot/something/",
  "login": api_loc + "/user/login/",
  "is logged in": api_loc + "/user/loggedin/",
  "logout": api_loc + "/user/logout/",
  "register" : api_loc + "/user/register/",
  "search category" : api_loc + "/category/search/",
  "all categories" : api_loc + "/category/getall/",
  "new password" : api_loc + "/user/newpassword/",
  "all users" : api_loc + "/admin/users/list/",
  "make admin" : api_loc + "/admin/users/makeadmin/{uuid}",
  "solo play": api_loc + "/quiz/start_solo/"
}

// set default method to post
window.$.fn.api.settings.method = "post"

// Set default beforeSend behavior
// window.$.fn.api.settings.beforeSend = function(settings) {
//   settings.data.token = window.localStorage.getItem("token");
//   return settings;
// }
window.$.fn.api.settings.data.token = window.localStorage.getItem("token");

// Set default failure error handling for API
window.$.fn.api.settings.onFailure = function(response, element, xhr) {
  // auto logout if response is 408 (session timeout)
  if (xhr.status === 408) {
    pointer(false);
    window.$("body").toast({
      message: "Session Timed Out",
      class: "error",
      position: "top attached"
    })
  }
}

// Disable enter on forms
window.$.fn.form.settings.keyboardShortcuts = false;

{
  let store = window.localStorage;
  if (store.getItem("uuid") === null) store.setItem("uuid", "");
  if (store.getItem("token") === null) store.setItem("token", "");
}


render(<Friends />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
