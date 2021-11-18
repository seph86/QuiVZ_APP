export class Listener {

  static instance = null;
  static url = "";

  static src = null;

  static connect() {
    Listener.src = new EventSource(Listener.url + "?token=" + window.localStorage.getItem("token"))
    window.debugListener = Listener;
    Listener.src.onopen = () => { window.$("#nointernet").nag("hide") }
    Listener.src.onerror = () => { window.$("#nointernet").nag("show") };
  }

}