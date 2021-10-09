import { Component } from 'inferno'

class Button extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return(
      <button id={this.props.id} class={"ui button " + (this.props.fluid ? "fluid" : "")} onclick={this.props.onclick}>{this.props.children}</button>
    );
  }
}

class Form extends Component {

  render() {
    return (
      <form id={this.props.id} class="ui form" >
        {this.props.children}
      </form>
    )
  }
  
}

class Field extends Component {
  render() {
    return (
      <div class="field">
        {this.props.children}
      </div>
    )
  }
}

export { Button, Form, Field }