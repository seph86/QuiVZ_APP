import { Component } from 'inferno';

export class Test extends Component {

  componentDidMount() {
    window.$("#test-teapot").api({
      action: "teapot",
      onError: function(error,element, xhr) {
        if (xhr.status === 418) {
          window.$("#test-teapot .icon").addClass("hot mug").removeClass("coffee");
          window.$("#test-teapot .ten.wide.column>h2").text("TEAPOT!");
        }
      }
    });
  }

  render() {
    return(
      <div id="test-teapot" class="ui segment inverted purple">
        <div class="ui grid">
          <div class="ten wide column">
            <h2>Teapot?</h2>
          </div>
          <div class="six wide column">
            <i class="massive coffee icon"></i>
          </div>
        </div>
      </div>
    );
  }

}