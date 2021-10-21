import { Component } from 'inferno';
import { findDOMNode } from 'inferno-extras';
import { ItemContainer } from './ItemContainer';

export class SearchCategories extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      results: null
    }

    this.onClick = this.onClick.bind(this);
    this.onClickX = this.onClickX.bind(this);
  }

  onClick(){
    this.setState({isOpen: true});
  }

  onClickX() {
    let self = this;
    window.$(findDOMNode(this)).next().transition("fade out", 500, () => {self.setState({isOpen: false});})
  }

  onClickReport(param) {
    console.log(param);
  }

  componentDidUpdate() {
    if (this.state.isOpen) {
      let self = this;
      window.$("#category-search").api({
        action: "search category",
        method: "post",
        data: {
          token: window.localStorage.getItem("token")
        },
        beforeSend: function(settings) {
          if (window.$(".ItemContainer.blue input").val() === "") {
            window.$("body").toast({
              message: "Input cannot be empty",
              position: "attached top",
              class: "error"
            })
            return false;
          }
          settings.data.query = window.$(".ItemContainer.blue input").val() //Dont know why I cant just use this in data: {}
          return settings;
        },
        onSuccess: function(response) {
          if (response !== undefined) {
            self.setState({results: response.data})
          }
        }
      })
    }
  }



  render() {
    return(
      <>
        <div class="ui segment inverted blue" onClick={this.onClick}>
          <div class="ui grid">
            <div class="right aligned six wide column">
              <i class="massive search icon" style={{float:"right"}}></i>
            </div>
            <div class="right aligned ten wide column">
              <h2>Search for categories</h2>
              <p>Find something you know to give you that edge....or dont.</p>
            </div>
          </div>
        </div>
        {this.state.isOpen && 
          <ItemContainer color="blue">
            <div class="ui grid container">
              <div class="ten wide column">
                <div class="ui basic segment">
                  <h2>Search Categories</h2>
                </div>
              </div>
              <div class="right aligned six wide column">
                <div class="ui basic segment">
                  <i class="times big icon" onClick={this.onClickX}></i>
                </div>
              </div>
              <div class="row">
                <div class="column">
                  <div class="ui fluid action input">
                    <input type="text" placeholder="Search...(try 'test')" />
                    <button id="category-search" class="ui button">Search</button>
                  </div>
                </div>
              </div>
            </div>
            <div id="search-results" class="ui segment basic">
              {this.state.results && 
                <div class="ui relaxed divided list">
                  {this.state.results.map(data => (
                    <div class="item">
                      <div class="right floated content">
                        <div class="ui button report" onClick={() => this.onClickReport(2)}>Report</div>
                      </div>
                      <div class="content">{data}</div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </ItemContainer>
        }
      </>
    );
  }

}