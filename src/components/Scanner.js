import { Component } from "inferno";
import { Html5Qrcode } from "html5-qrcode";

export class Scanner extends Component {

  componentDidMount(){
    const self = this;
    const scanner = new Html5Qrcode("reader");
    scanner.start(
      {facingMode: "environment"},
      {
        fps: 2,
        qrbox: {width: 250, height: 250}
      },
      (text, result) => {

        // Is the uuid valid
        if (text.search(/[a-zA-Z0-9]{64}/) === 0) {
          scanner.stop()
          self.props.callback(text);
        };

      }
    )
    .catch((err) => {
      console.error("Complete failure", err);
    })
  }

  render() {
    return (
      <div class="ui fluid container" style={{height: "100%", position: "relative"}}>
        <div style={{position: "absolute", top: "50%", transform: "translateY(-50%)", width: "100%"}}>
          <div id="reader" width="100%">
          </div>
        </div>
      </div>
    )
  }

}