export class Listener {

  static instance = null;
  static url = "";

  static src = null;

  static connect() {
    Listener.src = new EventSource(Listener.url + "?token=" + window.localStorage.getItem("token"))
    window.debugListener = Listener;

    // Add a delay before adding listeners to prevent message spam
    setTimeout(() => {
      Listener.src.onopen = () => { window.$("#nointernet").nag({persist:true}).nag("hide") }
      Listener.src.onerror = () => { window.$("#nointernet").nag({persist:true}).nag("show") };
      Listener.src.onmessage = () => { window.$("#nointernet").nag({persist:true}).nag("hide") };
    }, 2000)

    // // TODO: remove this
    // for (const key in Listener.src) {
    //   if (/^on/.test(key)) {
    //     const eventType = key.substr(2);
    //     Listener.src.addEventListener(eventType, (e) => {console.log(e)})
    //   }
    // }

  }

}