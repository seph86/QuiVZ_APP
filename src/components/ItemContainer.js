import { Component } from "inferno";
import { findDOMNode } from "inferno-extras";

export class ItemContainer extends Component {

  constructor(props) {
    super(props);

    this.class = ["ItemContainer", this.props.color].join(" ")

  }

  componentDidMount() {
    let domNode = findDOMNode(this);
    window.$(domNode).transition("expand-menu", 750, () => {window.$(domNode).find(".menu").transition("fade in", 500)});
  }

  render() {
    return(
      <div className={this.class}>
        <div className="menu">
          {this.props.children}
        </div>
      </div>
    );
  }

}