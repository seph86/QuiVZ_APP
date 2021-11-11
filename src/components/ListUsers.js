import { Component } from "inferno";
import { findDOMNode } from "inferno-extras";
import { ItemContainer } from "./ItemContainer";

export class ListUsers extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      results: null
    }

    this.onClick = this.onClick.bind(this);
    this.onClickX = this.onClickX.bind(this);
  }

  onClick(){
    this.setState({isOpen: true})
    const self = this;
    window.$(findDOMNode(this)).nextAll(".ItemContainer").find(".segment:first").api({
      action: "all users",
      method: "post",
      className: {
        loading: "inverted loading"
      },
      on: "now",
      onSuccess: function(response) {
        self.setState({results: response.data})
      }
    })
  }

  onClickX() {
    let self = this;
    window.$(findDOMNode(this)).next().transition("fade out", 500, () => {self.setState({isOpen: false});})
  }

  componentDidMount() {

  }

  updateUser(event) {

    let isAdmin = event.target.attributes.isadmin.value

    window.$("#admin-modal").modal({
      content: isAdmin === "0" ? "Set user to admin?" : "Remove admin privilages?",
      onApprove: function() {
        window.$("body").api({
          action: isAdmin === "0" ? "make admin" : "remove admin",
          urlData: {
            uuid: event.target.attributes.uuid.value
          },
          on: "now",
          onSuccess: function() {
            if (isAdmin === "1") {
              window.$("span[uuid="+event.target.attributes.uuid.value+"]").parent().parent().find("i").addClass("disabled")
              event.target.attributes.isadmin.value = "0"
            } else {
              window.$("span[uuid="+event.target.attributes.uuid.value+"]").parent().parent().find("i").removeClass("disabled")
              event.target.attributes.isadmin.value = "1"
            }
          },
          onFailure: function(response) {
            window.$("body").toast({
              message: response.message,
              class: "error",
              position: "top attached"
            })
          }
        })
      }
    }).modal('show');
  }

  render() {
    return(
      <>
        <div class="ui segment inverted teal" onClick={this.onClick}>
          <div class="ui grid">
            <div class="ten wide column">
              <h2>List all users</h2>
              <p>Edit users</p>
            </div>
            <div class="six wide column">
              <i class="massive users icon"></i>
            </div>
          </div>
        </div>
        {this.state.isOpen && 
          <ItemContainer color="teal">
            <div class="ui segment basic" style={{height:"100vh"}}>
              <div class="ui grid container">
                <div class="ten wide column">
                  <div class="ui basic segment">
                    <h2>All User</h2>
                  </div>
                </div>
                <div class="right aligned six wide column">
                  <div class="ui basic segment">
                    <i class="times big icon" onClick={this.onClickX}></i>
                  </div>
                </div>
              </div>
              <div id="search-results" class="ui segment basic">
                <div id="admin-modal" class="ui basic modal">
                  <div class="content"></div>
                  <div class="actions">
                    <div class="ui red cancel inverted button">
                      <i class="remove icon"></i>
                      No
                    </div>
                    <div class="ui green ok inverted button">
                      <i class="checkmark icon"></i>
                      Yes
                    </div>
                  </div>
                </div>
                {this.state.results && 
                  <div class="ui relaxed divided list">
                    <div class="item">
                      <div class="content"><h3>UUID</h3></div>
                    </div>
                    {this.state.results.map(data => (
                      <div class="item" style={{overflow: "scroll hidden"}}>
                        <i class={(data[1] === "1" ? "" : "disabled" ) + " user cog big icon"}></i>
                        <div class="content">
                          <span class="ui big text" isadmin={data[1]} uuid={data[0]} onClick={this.updateUser}>{data[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </ItemContainer>
        }
      </>
    )
  }

}