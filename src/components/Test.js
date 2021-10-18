import { Component } from 'inferno';
import { noInternetNag } from '../static/global_functions';

export class Test extends Component {

  componentDidMount() {
    window.$("#test-teapot").api({
      action: "teapot",
      onError: function(error,element, xhr) {
        if (xhr.status === 418) {
          window.$("#test-teapot .icon").removeClass().addClass("massive hot mug icon");
          window.$("#test-teapot .ten.wide.column>h2").text("TEAPOT!");
          noInternetNag(true);
        }
      },
      onAbort: function(error, element, xhr) {
        if (xhr.statusText === "error") { 
          window.$("#test-teapot .ten.wide.column>h2").text("No teapot =(");
          window.$("#test-teapot .icon").removeClass().addClass("massive heart broken icon");
          noInternetNag()
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