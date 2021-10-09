import { Component } from 'inferno';

export class Challenge extends Component {

  fail(){
    window.$("body").toast({
      position: 'top attached',
      message: `Feature not yet implemented`,
      class: "error"
    })
  }

  render() {
    return(
      <div class="ui segment inverted green" onClick={this.fail}>
        <div class="ui grid">
          <div class="ten wide column">
            <h2>Challege Friend</h2>
            <p>Go head to head</p>
          </div>
          <div class="six wide column">
            <i class="massive bolt icon"></i>
          </div>
        </div>
      </div>
    );
  }

}