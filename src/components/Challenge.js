import { Component } from 'inferno';
import { findDOMNode } from "inferno-extras";
import { ItemContainer } from "./ItemContainer";
import { Listener } from '../common/EventListener';
import emojis from "emojis-keywords";

export class Challenge extends Component {

  constructor(props) {
    super(props);

    this.state = {
      svg: null,
      isOpen: false,
      waiting: false,
      uuid: "",
      name: ""
    }

    this.revealCode = false;

    this.onClick = this.onClick.bind(this);
    this.onClickX = this.onClickX.bind(this);
    this.onSelectUser = this.onSelectUser.bind(this);
    this.onRecieveReponse = this.onRecieveReponse.bind(this);

  }


  componentDidMount() {

    Listener.src.addEventListener("response", this.onRecieveReponse);

  }

  componentWillUnmount() {
    Listener.src.removeEventListener("response", this.onRecieveReponse);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isOpen !== nextState.isOpen) return true;
    if (nextState.isOpen) return true;
  }

  onRecieveReponse(event) {
    if (event.data === "false") {
      window.$("body").toast({
        message: "This user is busy =(",
        position: "top attached",
        class: "error"
      })
      window.$(".loader").removeClass("active");
      this.setState({waiting: false});
    } else if (event.data === "true") {
      
      this.props.callback()

    }
  }

  onClick(){
    this.setState({isOpen: true});
  }

  onClickX() {
    let self = this;
    window.$(findDOMNode(this)).next().transition("fade out", 500, () => {self.setState({isOpen: false, waiting: false});})
  }

  onSelectUser(event) {

    // Prevent user for clicking on other users
    if (this.state.waiting) return;

    let uuid = window.$(event.target).attr("uuid");
    window.$(".item[uuid="+uuid+"] .loader").addClass("active")

    window.$("body").api({
      on: "now",
      action: "challenge friend",
      urlData: {
        uuid: window.$(event.target).attr("uuid")
      }
    });

    this.setState({
      waiting: true,
      uuid: uuid,
      name: window.$(".item[uuid="+uuid+"]").attr("name")
    });

  }

  render() {
    return(
      <>
        <div class="ui segment inverted green" onClick={this.onClick}>
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
        { this.state.isOpen && 
          <ItemContainer color="green">
            <div class="ui grid container">
              <div class="ten wide column">
                <div class="ui basic segment">
                  <h2>Challenge</h2>
                </div>
              </div>
              <div class="right aligned six wide column">
                <div class="ui basic segment">
                  <i class="times big icon" onClick={this.onClickX}></i>
                </div>
              </div>
              <div class="row">
                <div class="column">
                  <h1>Select a user to challenge</h1>
                  <div class="ui horizontal divider">
                  </div>
                  <div class="ui basic section">
                    <div class="ui big selection celled list">
                    { Object.keys(this.props.friends).length > 0 ?
                      Object.entries(this.props.friends).map((friend) => 
                        <div class="item" onClick={this.onSelectUser} uuid={friend[0]} name={friend[1].name}>
                          <div class="right floated content">
                            <div class="ui inline loader"></div>
                          </div>
                          <em class="ui massive image" data-emoji={emojis[Math.floor(Math.random() * 1000)]} uuid={friend[0]}></em>
                          <div class="middle aligned content">
                            <h2 uuid={friend[0]}>{friend[1].name}</h2>
                          </div>
                        </div>
                      )
                    :
                      <h2>You have no friends added. Go to Friends List and add them there</h2>
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </ItemContainer>
        }
      </>
    );
  }

}