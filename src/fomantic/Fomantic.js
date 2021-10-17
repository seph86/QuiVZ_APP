import { Component } from 'inferno'

export class Button extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return(
      <button id={this.props.id} class={"ui button " + (this.props.fluid ? "fluid" : "")} onclick={this.props.onclick}>{this.props.children}</button>
    );
  }
}

export class Form extends Component {

  render() {
    return (
      <form id={this.props.id} class="ui form" >
        {this.props.children}
      </form>
    )
  }
  
}

export class Field extends Component {
  render() {
    return (
      <div class="field">
        {this.props.children}
      </div>
    )
  }
}

export class Nag extends Component {
  render() {
    return ( 
      <div id={this.props.id} class={"ui " + this.props.color + " nag"} style={{display: "none!important"}}><div class="title">{this.props.children}</div></div>
    )
  }
}

//export { Button, Form, Field }