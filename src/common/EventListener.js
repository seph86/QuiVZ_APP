export class Listener {

  static instance = null;
  static url = "";

  static src = null;

  static connect() {
    Listener.src = new EventSource(Listener.url + "?token=" + window.localStorage.getItem("token"))
    window.debugListener = Listener;
  }

  static onError() {
    
    Listener.src.close();
  }

}