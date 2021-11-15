import { render } from 'inferno';
// eslint-disable-next-line
import { App, pointer } from './App';
import * as serviceWorker from './serviceWorker';
import localforage from 'localforage';
import { Listener } from './common/EventListener';

// const api_loc = "http://" + window.location.hostname + ":8080";
const api_loc = "http://" + window.location.hostname + "/api";

// Prep event listener
Listener.url = "http://" + window.location.hostname + "/sse";

// end point actions
window.$.fn.api.settings.api = {
  "teapot": api_loc + "/teapot/",
  "login": api_loc + "/user/login/",
  "is logged in": api_loc + "/user/loggedin/",
  "logout": api_loc + "/user/logout/",
  "register" : api_loc + "/user/register/",
  "new password" : api_loc + "/user/newpassword/",
  "all users" : api_loc + "/admin/users/list/",
  "make admin" : api_loc + "/admin/users/makeadmin/{uuid}/",
  "remove admin": api_loc + "/admin/users/removeadmin/{uuid}/",
  "solo play": api_loc + "/quiz/start_solo/",
  "get quiz": api_loc + "/quiz/get/",
  "challenge friend": api_loc + "/quiz/challenge/{uuid}/",
  "accept challenge": api_loc + "/quiz/accept/{uuid}/",
  "reject challenge": api_loc + "/quiz/reject/{uuid}/",
  "ready": api_loc + "/quiz/ready/",
  "end game": api_loc + "/quiz/end_game/",
  "send points": api_loc + "/quiz/answer_points/{points}/{correct}",
  "add friend": api_loc + "/user/addfriend/{uuid}/{from}/",
  "test": api_loc + "/test/" //Testing 
}

// set default method to post
window.$.fn.api.settings.method = "post"

// Set token to be sent
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

// Create stats data store
window.quivzStats = localforage.createInstance({ name: "QuiVZ_stats" });

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
