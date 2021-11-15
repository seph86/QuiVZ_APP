import { Component } from "inferno";
import { Html5Qrcode } from "html5-qrcode";

export class Scanner extends Component {

  constructor(props) {
    super(props);

    this.scanner = null;
  }

  componentDidMount(){
    this.scanner = new Html5Qrcode("reader");
    const self = this;
    this.scanner.start(
      {facingMode: "environment"},
      {
        fps: 2,
        qrbox: {width: 250, height: 250},
        aspectRatio: 1.0,
        //disableFlip: true
      },
      (text, result) => {

        // Is the uuid valid
        if (text.search(/[a-zA-Z0-9]{64}/) === 0) {
          window.$("#scanner-modal").modal("hide")
          //console.log("found code")
          self.props.callback(text);
        };
      },
      () => {
        //console.log("didnt find code");
      }
    )
    .catch((err) => {
      window.$("body").toast({class: "error", message: err})
      console.error("Complete failure", err);
    })
  }

  componentWillUnmount() {
    this.scanner.stop();
    this.scanner = null;
  }

  render() {
    return (
      <div id="reader" width="100%"></div>
    )
  }

}