import { render } from 'inferno';
import App from './App';
import * as serviceWorker from './serviceWorker';

window.$.fn.api.settings.api = {
  "teapot":"http://localhost:8080/teapot/",
  "login":"http://localhost:8080/user/login/",
  "is logged in": "http://localhost:8080/user/loggedin/",
  "logout": "http://localhost:8080/user/logout/",
  "register" : "http://localhost:8080/user/register/",
  "search category" : "http://localhost:8080/category/search/",
  "all categories" : "http://localhost:8080/category/getall/",
  "new password" : "http://localhost:8080/user/newpassword/"
}

{
  let store = window.localStorage;
  if (store.getItem("uuid") === null) store.setItem("uuid", "");
  if (store.getItem("token") === null) store.setItem("token", "");
}


render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
