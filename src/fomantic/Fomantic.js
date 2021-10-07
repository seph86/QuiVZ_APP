import { Component } from 'inferno'

class Button extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {

    let classData = "ui button";

    if (this.props.fluid) {
      classData+=" fluid";
    }

    return(
      <button id={this.props.id} class={classData} onclick={this.props.onclick}>{this.props.children}</button>
    );
  }
}

class Form extends Component {

  render() {
    return (
      <form class="ui form" >
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