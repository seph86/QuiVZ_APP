import { Component } from 'inferno';
import Chart from 'chart.js/auto';
import purify from 'dompurify';
import { Listener } from '../common/EventListener';

export class Quiz extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scores: [0,0],
      question: "Ready?",
      answers: ["","","",""],
      correct: 0, // this could probably be moved to non state ¯\_(ツ)_/¯
      correctly_answered: 0,
      total_questions: 0,
      singlePlayer: props.singlePlayer === true ? true : false,
      syncing: true,
    }
    
    this.onAnswer = this.onAnswer.bind(this);
    this.populateAnswers = this.populateAnswers.bind(this);
    this.addScore = this.addScore.bind(this);
    this.onOpponentAnswered = this.onOpponentAnswered.bind(this);
    this.onTrigger = this.onTrigger.bind(this);
    this.endGame = this.endGame.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);

    // non state variables
    this.points = 1000;
    this.timer = null;
    this.questions = [
      //Test questions for debugging
      {
        question: "question 1 &amp; some other text",
        incorrect_answers: ["1","2","3"],
        correct_answer: "0"
      },
      {
        question: "Omicron (&Omicron;)",
        incorrect_answers: ["8","7","6"],
        correct_answer: "9"
      },
      {
        question: "3",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "4",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "5",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "6",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "7",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "8",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "9",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
      ,
      {
        question: "10",
        incorrect_answers: ["wrong","wrong","wrong"],
        correct_answer: "right"
      }
    ];
    this.currentQuestion = 0;
    this.clickable = true;
    this.playeranswered = false;
    this.opponeanswered = false;
  }

  populateAnswers() {

    //clear timer
    clearInterval(this.timer);

    //debugger
    // Set random index for correct answer
    let index = Math.floor(Math.random() * (4 - 0) + 0);
    let loaded_question = this.questions[this.currentQuestion]
    let answers = loaded_question.incorrect_answers;
    // sanitize everything just in case
    answers.forEach((e,i) => {
      answers[i] = purify.sanitize(e);
    })
    answers.splice(index, 0, purify.sanitize(loaded_question.correct_answer));
    this.setState({answers: answers, correct: index, question: purify.sanitize(loaded_question.question)});

    window.$(".scorebar > .progress").progress({
      label: 'ratio',
      text: {
        ratio: '{value}'
      }
    });

    window.$(".answers .ui.button").removeClass("red green");
    this.clickable = true;
    this.playeranswered = false;
    this.points = 1000;

    // enable progress bars to count down
    window.$(".scorebar > .progress").addClass("countingdown");

    // start timer
    this.timer = setInterval(function(self) {

      // both timers are inactive, time to reset and start next question
      if (window.$(".scorebar > div.countingdown").length === 0) {
        //debugger
        // Disable clicking
        self.clickable = false;

        if (!self.playeranswered && !self.state.singlePlayer) {
          self.addScore(0,false);
          window.$("body").api({
            on: "now",
            action: "send points",
            urlData: {
              points: 0,
              correct: "false"
            }
          });
        }

        if (self.currentQuestion <= 9) {

          // Load next question if singleplayer
          if (self.state.singlePlayer)
            setTimeout(function(self) {
              self.populateAnswers();
            }, 2000, self);
        } else {
          // Game has ended, show results screen
          setTimeout(() => {
            window.$(".quiz").transition("fade out", "1000", () => {
              // Load end screen
              window.$(".endscreen").transition("fade in");
            })
          }, 2000)
        }

        clearInterval(self.timer);
        Listener.src.removeEventListener("opponentDisconnected", this.onDisconnect);

      }

      self.points -= 10;
      window.$(".scorebar > .progress.countingdown").progress("update progress", self.points);
      window.$("#player-score span").text(self.points);
      if (self.points <= 0) {
        window.$(".scorebar > .progress").progress("set percent", 0);
        window.$(".scorebar > div").removeClass("countingdown");
        self.clickable = false;
      }
    }, 1000, this)

    // Increment to next question
    this.currentQuestion++;

  }

  onAnswer(event) {
    //debugger
    // Only allow picking a answer when we allow it
    if (!this.clickable) return;

    // Disable clicking for now
    this.clickable = false;

    this.playeranswered = true;

    if (this.state.singlePlayer) 
      window.$(".scorebar > div").removeClass("countingdown");
    else 
      window.$("#player-score > div").removeClass("countingdown");

    let correct = parseInt(event.target.attributes.index.value) === this.state.correct;

    if (correct) {
      window.$(event.target).addClass("green");
      this.addScore(0,true)
      this.setState({correctly_answered: this.state.correctly_answered+1});
    } else {
      this.addScore(0,false)
      window.$(event.target).addClass("red");
    }

    if (!this.state.singlePlayer) {
      window.$("body").api({
        on: "now",
        action: "send points",
        urlData: {
          points: window.$("#player-score .ui.progress").progress("get value"),
          correct: correct
        },
        onSuccess: () => {
          setTimeout(() => {window.$("body").api({ on: "now", action: "ready"})}, 1500);
        }
      });
    }

    this.setState({total_questions: this.state.total_questions + 1});

  }

  onOpponentAnswered(event) {
    window.$("#opponent-score > div").removeClass("countingdown");
    window.$("#opponent-score .ui.progress").progress("set progress", event.data);
    this.addScore(1,event.type === "opponentRight" ? true : false);
  }

  // Update stats
  endGame() {

    if (!this.state.singlePlayer)
      this.props.updateFriendData(
        this.props.uuid, 
        {
          name: this.props.opponent.name,
          games: this.props.opponent.games + 1,
          wins: this.props.opponent.wins + (this.state.scores[0] > this.state.scores[1])
        }
      )

    const self = this;
    window.$(".endscreen").transition("fade out", "500ms", () => {
      self.props.callback();
    })

  }

  onTrigger() {

    if (this.currentQuestion === 10) {
      // End state
      window.$("body").api({
        on: "now",
        action: "end game"
      });
      return;
    }

    if (this.state.syncing) {
      setTimeout((self) => {
        window.$(".loader").transition({animation: "fade out", displayType: "flex", duration: "1000ms", onComplete: () => {
          window.$(".quiz").transition("fade in", "500ms", () => {
            window.$("#player-score").transition("show-player-bar");
            window.$("#opponent-score").transition("show-opponent-bar");
            window.$(".answers > div").transition({ animation: "fly up", duration: 600, interval: 100})
            self.setState({syncing: false});
            self.populateAnswers();
          })}
        })
      }, 1000, this)
    } else {
      this.populateAnswers();
    }

  }

  onDisconnect() {

    // Halt game
    clearTimeout(this.timer); 

    window.$("body").toast({
      message: "Opponent Disconnected, returning to main menu",
      position: "top attached",
      class: "error"
    })

    const self = this;
    window.$(".endscreen").transition("fade out", "500ms", () => {
      self.props.callback();
    })

  }

  // This function takes the value from the progress bar and adds the score to the score graph
  addScore(player, increase) {
    
    let currentScore = this.state.scores;
    let barScore = 0;

    if (player === 0) {
      barScore = window.$("#player-score .ui.progress").progress("get value");
    } else {
      barScore = window.$("#opponent-score .ui.progress").progress("get value");
    }

    if (increase)
      currentScore[player] += barScore;

    this.setState({scores: currentScore});
    const chart = window.matchChart
    chart.data.datasets[player].data.push(currentScore[player]);
    chart.update();
  }

  componentDidMount() {

    window.$("#quiz-logo").transition("spin-logo", "500ms", () => { 
      window.$("h1:first-child").transition("slide-title", "3000ms");
      window.$("h1:nth-child(2)").transition("slide-title-reverse", "3000ms")
    });

    // Listen for opponent answering
    Listener.src.addEventListener("opponentRight", this.onOpponentAnswered);
    Listener.src.addEventListener("opponentWrong", this.onOpponentAnswered);
    Listener.src.addEventListener("trigger", this.onTrigger);
    Listener.src.addEventListener("opponentDisconnected", this.onDisconnect);

    const self = this;
    if (this.state.singlePlayer)
      window.$("body").api({
        on: "now",
        action: "solo play",
        onSuccess: (result) => {
          self.questions = result.data;
          self.onTrigger();
        }
      })
    else
      window.$("body").api({
        on: "now",
        action: "get quiz",
        onSuccess: (result) => {

          let data = JSON.parse(result.data);
          // Load quiestions
          self.questions = data.results;

          // Signal server we're ready
          window.$("body").api({
            on: "now",
            action: "ready"
          })
        }
      })

    const chartContext = window.document.querySelector("#graph").getContext("2d");

    let datasets = [
      {
        backgroundColor: "#4fc1e880",
        fill: true,
        radius: 0,
        data: [0],
        borderColor: "#4fc1e8",
        borderWidth: 2,
        tension: 0.4,
        order: 1,
      }
    ];
    // Add opponent lines
    if (!this.state.singlePlayer) {
      datasets.push({
        backgroundColor: "#cd74a880",
        fill: true,
        radius: 0,
        data: [0],
        borderColor: "#cd74a8",
        borderWidth: 2,
        tension: 0.4,
        order: 0,
      });
    }

    window.matchChart = new Chart(chartContext,{
      type: "line",
      //plugins: [ChartDataLabels], //Enable label plugin
      data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11],
        datasets: datasets
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          // padding: {
          //   right: 50, // adding padding to the right of the chart
          //   bottom: 0,
          // }
        },
        plugins: {
          legend: {
            display: false // turn off legend at the top of the screen
          },
          datalabels: { // Datalabels plugin
            formatter: function(value, context) { // Format labels, only making the last one appear
              if (context.dataIndex === context.dataset.data.length - 1)
              {
                return value.y;
              }
              return "";
            },
            anchor: "center",
            align: "right",
            padding: 10,
            clamp: true,
          },
        },
        events: [], // Disable all events, no hover
        scales: {
          y: {
            min: 0,
            max: 10000,
            ticks: {
              display: false
            }
          },
          x: {
            grid: {
              display: false // turn off drawing lines
            },
            ticks: {
              display: false // turn off drawing "numbers"
            }
          }
        }
      }
    });


    // window.$("body").api({
    //   on: "now",
    //   action: "solo play",
    //   onSuccess: function(result) {
    //     self.questions = result.data;
    //     self.populateAnswers();
    //   }
    // })

    // testing
    //this.populateAnswers();

  }

  componentWillUnmount(){
    Listener.src.removeEventListener("opponentRight", this.onOpponentAnswered);
    Listener.src.removeEventListener("opponentWrong", this.onOpponentAnswered);
    Listener.src.removeEventListener("trigger", this.onTrigger);
    Listener.src.removeEventListener("opponentDisconnected", this.onDisconnect);
  }

  render() {
    return (
      <div id="quiz-container" class="ui fluid container">
        <div class="loader" style={{height: "100%", display: "flex", "align-items": "center", "justify-content": "center", "flex-flow": "column"}}>
          {this.state.singlePlayer ? 
            <h1 style={{position: "absolute", left: "-50vw", "white-space": "nowrap", top: "30%"}}>Solo play!</h1>
            :
            <>
              <h1 style={{position: "absolute", left: "-50vw", "white-space": "nowrap", top: "30%"}}>You</h1>
              <h1 style={{position: "absolute", left: "-50vw", "white-space": "nowrap", top: "65%"}}>{this.props.opponent.name}</h1>
            </>
          }
          <img id="quiz-logo" src="/Logo.png" alt="logo" style={{display: "none", width: "40%"}}></img>
          <div class="ui basic segment">
          {!this.state.singlePlayer && 
            <>
              <div class="ui active centered inline loader"></div>
              <p>Syncing</p>
            </>
          }
          </div>
        </div>
        <div class="quiz" style={{display: "none"}}>
          <ScoreBar id="player-score" />
          <div class="centercontainer">
            <div class="totalscore">
              <canvas id="graph"></canvas>
            </div>
            <div id="question" class="ui segment" style={{height: "20vh", "margin-top": "-1.7%"}}>
              <div class="ui middle aligned one column centered grid" style={{height: "100%"}}>
                <div class="row">
                  <div class="column">
                    {this.state.question.length < 80 && 
                      <h2 class="ui secondary centered header" dangerouslySetInnerHTML={{__html: this.state.question}}></h2>
                    }
                    {this.state.question.length >= 80 && 
                      <h3 class="ui secondary centered header" dangerouslySetInnerHTML={{__html: this.state.question}}></h3>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div class="ui hidden divider"></div>
            <div class="answers" style={{display: "flex", height: "56vh", "justify-content": "space-between", "flex-flow": "column"}}>
              {this.state.answers.length > 0 &&
                this.state.answers.map((answer, i) => 
                  <div style={{display: "none"}}>
                    <button class="ui fluid big button" index={i} onClick={this.onAnswer} style={{height: "10vh"}} dangerouslySetInnerHTML={{__html: answer}}></button>
                  </div>
                )
              }
              <div class="ui divider" style={{display: "none"}}></div>
              <div style={{display: "none"}}>
                <div class="ui two column very relaxed grid">
                  <div class="column">
                    <div class="ui huge centered header" style={{"margin-top":"0"}}>Score: {this.state.scores[0]} </div>
                  </div>
                  <div class="column">
                    <div class="ui huge centered header" style={{"margin-top":"0"}}>{this.state.correctly_answered} / {this.state.total_questions}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScoreBar id="opponent-score" /> 
        </div>
        <div class="ui container endscreen" style={{display: "none"}}>
          <div class="ui one column centered grid" style={{height: "50vh", "margin-top": "20vh"}}>
            <div class="row">
              <h1>Final results!</h1>
            </div>
            <div class="row">
              <h2>{this.state.scores[0]}</h2>
            </div>
            <div class="row">
              {!this.state.singlePlayer && 
                <h1>
                  {this.state.scores[0] === this.state.scores[1] && "Draw - stats not recorded"}
                  {this.state.scores[0] > this.state.scores[1] && "You Won!"}
                  {this.state.scores[0] < this.state.scores[1] && "Oof, not this time =("}
                </h1>
              }
            </div>
            <div class="row">
              <div>
                <div class="ui button green" onclick={this.endGame}>Return to menu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

} 

class ScoreBar extends Component {
  render() {
    return (
      <div id={this.props.id} class="scorebar" style={{display: "none"}}>
        <div class="ui small indicating progress countingdown" data-value="1000" data-total="1000">
          <div class="bar">
            <div class="progress"></div>
          </div>
        </div>
      </div>
    )
  }
}