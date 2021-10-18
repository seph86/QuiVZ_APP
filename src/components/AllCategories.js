import { Component } from "inferno";
import { findDOMNode } from "inferno-extras";
import { ItemContainer } from "./ItemContainer";

export class AllCategories extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      results: null
    }

    this.onClick = this.onClick.bind(this);
    this.onClickX = this.onClickX.bind(this);

  }

  onClick() {
    let self = this
    this.setState({isOpen: true})
    window.$(findDOMNode(this)).nextAll(".ItemContainer").find(".segment:first").api({
      action: "all categories",
      method: "post",
      data: {
        token: window.localStorage.getItem("token")
      },
      className: {
        loading: "inverted loading"
      },
      on: "now",
      onSuccess: function(response) {
        self.setState({results: response[0].data})
      },
      beforeSend: function(settings) {
        settings.data.token = window.localStorage.getItem("token");
        return settings;
      }
    })
  }

  onClickX() {
    let self = this;
    window.$(findDOMNode(this)).next().transition("fade out", 500, () => {self.setState({isOpen: false});})
  }

  render() {
    return(
      <>
        <div class="ui segment inverted orange" onClick={this.onClick}>
          <div class="ui grid">
            <div class="ten wide column">
              <h2>Show All Categories</h2>
              <p>It's a big list (it's really not)</p>
            </div>
            <div class="six wide column">
              <i class="massive binoculars icon"></i>
            </div>
          </div>
        </div>
        {this.state.isOpen && 
          <ItemContainer color="orange">
            <div class="ui segment basic" style={{height:"100vh"}}>
              <div class="ui grid container">
                <div class="ten wide column">
                  <div class="ui basic segment">
                    <h2>All Categories</h2>
                  </div>
                </div>
                <div class="right aligned six wide column">
                  <div class="ui basic segment">
                    <i class="times big icon" onClick={this.onClickX}></i>
                  </div>
                </div>
              </div>
              <div id="search-results" class="ui segment basic">
                {this.state.results && 
                  <div class="ui relaxed divided list">
                    {this.state.results.map(data => (
                      <div class="item">
                        <div class="content">{data}</div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </ItemContainer>
        }
      </>
    );
  }

}