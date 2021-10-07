import { render } from 'inferno';
import App from './App';
import * as serviceWorker from './serviceWorker';

window.$.fn.api.settings.api = {
  "test":"http://localhost:8080/teapot/",
  "login":"http://localhost:8080/user/login/",
  "register" : "http://localhost:8080/user/register/"
}


render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
