import { Component } from "inferno";

export class Scanner extends Component {

  click() {
    
  }

  render() {
    return (
      <>
        <h1 id="test" onclick={this.click}>hi</h1>
      </>
    )
  }

}