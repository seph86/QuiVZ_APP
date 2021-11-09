import { Component } from "inferno";
import { Scanner } from "./Scanner";
import { qrcode, svg2url } from "pure-svg-code";

export class Friends extends Component {

  constructor(props) {
    super(props);

    this.state = {
      svg: null
    }

  }

  componentDidMount() {

    if (!window.localStorage.getItem("qrCode")) {
      let code = qrcode({
        content: window.localStorage.getItem("uuid"),
        width: 256,
        height: 256
      })
      let svgCode = svg2url(code);
      this.setState({svg: svgCode});
      window.localStorage.setItem("qrCode", svgCode);
    } else {
      this.setState({svg: window.localStorage.getItem("qrCode")});
    }
  }

  render() {
    return(
      <>
        {this.state.svg && 
          <img class="ui centered rounded image" src={this.state.svg}></img>
        }
      </>
    )
  }

} 