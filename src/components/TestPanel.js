import { Component } from 'inferno';

export class TestPanel extends Component {

  render() {
    return(
      <div class="ui segment inverted green" onClick={this.props.onClick}>
        <div class="ui grid">
          <div class="ten wide column">
            <h2>hi</h2>
          </div>
          <div class="six wide column">
            <i class="massive users icon"></i>
          </div>
        </div>
      </div>
    );
  }

}