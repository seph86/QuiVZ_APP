import { Component } from "inferno";
import { findDOMNode } from "inferno-extras";
import { ItemContainer } from "./ItemContainer";
import { Scanner } from "./Scanner";
import { qrcode, svg2url } from "pure-svg-code";
import { Html5Qrcode } from "html5-qrcode";
import { Listener } from "../common/EventListener";

export class Friends extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      showScanner: false,
    }

    this.revealCode = false;
    this.qrCode = null;

    this.onClick = this.onClick.bind(this);
    this.onClickX = this.onClickX.bind(this);
    this.showQRCode = this.showQRCode.bind(this);
    this.onFriendRequest = this.onFriendRequest.bind(this);
    this.onScanSuccess = this.onScanSuccess.bind(this);

  }

  onClick(){
    this.setState({isOpen: true});
  }

  onClickX() {
    let self = this;
    window.$(findDOMNode(this)).next().transition("fade out", 500, () => {self.setState({isOpen: false});})
    this.revealCode = false;
  }

  showQRCode(event) {
    if (!this.revealCode) {
      window.$("div.qrcode-text").slideUp(100);
      window.$("div.qrcode").slideDown();
      this.revealCode = true;
    } else {
      this.setState({showScanner: true});
      const self = this;
      window.$("#scanner-modal").modal({
        onHidden: () => {self.setState({showScanner:false})}
      }).modal("show");
    }
  }

  onScanSuccess(text) {

    let uuid = text.match(/[a-zA-Z0-9]{64}/)[0];
    let name = text.slice(64);

    window.$("body").api({
      on: "now",
      action: "add friend",
      urlData: {
        uuid: uuid,
        from: window.localStorage.getItem("name")
      }
    })

    this.setState({showScanner: false})

    this.props.addFriend(uuid, {name: name})
  }

  componentDidMount() {

    if (window.localStorage.getItem("qrCode") === null || this.qrCode === null) {
      let code = qrcode({
        content: window.localStorage.getItem("uuid") + window.localStorage.getItem("name"),
        padding: 2,
        width: 256,
        height: 256
      })
      this.qrCode = svg2url(code);
      window.localStorage.setItem("qrCode", this.qrCode);
    } 
  }

  onFriendRequest(event) {
    //debugger
    let json = JSON.parse(event.data);

    // Only accept friend requests while the qrCode is visible
    if (this.revealCode) {
      // Add friend to local storage db and update the frinds list
      this.props.addFriend(json.uuid, {name: json.username})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isOpen !== nextState.isOpen) return true;
    if (nextState.isOpen) return true;
  }

  componentDidUpdate() {
    // console.log(this.state);
    if (this.state.isOpen) {

      // Regerate code if it changed
      if (window.localStorage.getItem("qrCode") === null || this.qrCode === null) {
        let code = qrcode({
          content: window.localStorage.getItem("uuid") + window.localStorage.getItem("name"),
          padding: 2,
          width: 256,
          height: 256
        })
        this.qrCode = svg2url(code);
        window.localStorage.setItem("qrCode", this.qrCode);
      } 

      // request camera permission
      Html5Qrcode.getCameras().catch((err) => {window.$("body").toast({class: "error", message: err})});

      // Listen for friend requests
      Listener.src.addEventListener("friendRequest", this.onFriendRequest);
    } else {
      // Remove listener
      Listener.src.removeEventListener("friendRequest", this.onFriendRequest);
    }

  }

  render() {
    return(
      <>
        <div class="ui segment inverted orange" onClick={this.onClick}>
          <div class="ui grid">
            <div class="right aligned six wide column">
              <i class="massive users icon"></i>
            </div>
            <div class="right aligned ten wide column">
              <h2>Friends List</h2>
              <p>Who do you know?</p>
            </div>
          </div>
        </div>
        { this.state.isOpen && 
          <ItemContainer color="orange">
            <div id="scanner-modal" class="ui basic modal">
              <div class="content">
                { this.state.showScanner && <Scanner callback={this.onScanSuccess} /> }
              </div>
            </div>
            <div class="ui grid container">
              <div class="ten wide column">
                <div class="ui basic segment">
                  <h2>Friends</h2>
                </div>
              </div>
              <div class="right aligned six wide column">
                <div class="ui basic segment">
                  <i class="times big icon" onClick={this.onClickX}></i>
                </div>
              </div>
              <div class="center aligned row">
                <div class="column">
                  <div class="ui button white huge centered" onClick={this.showQRCode}>
                    <div class="qrcode-text">
                      <i class="qrcode icon"></i>
                      Reveal scan code
                    </div>
                    <div class="qrcode" style={{display: "none"}}>
                      People can scan this code and add you as a friend
                      <div class="ui hidden divider"></div>
                      <img class="ui rounded centered image" src={this.qrCode} alt="code"></img>
                      <div class="ui hidden divider"></div>
                      Press scan a friend's code
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="column">
                  <div class="ui horizontal divider">
                  </div>
                  <div class="ui basic section">
                    <div class="ui big celled list">
                    {this.props.friends && Object.keys(this.props.friends).length > 0 && 
                      Object.entries(this.props.friends).map((friend) => 
                        <div class="item">
                          <div class="right floated content">
                            <div class="ui negative button" onClick={() => this.props.onDeleteFriend(friend[0])}>Delete</div>
                          </div>
                          <div class="middle aligned content">{friend[1].name}</div>
                        </div>
                      )
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </ItemContainer>
        }
      </>
    )
  }

} 