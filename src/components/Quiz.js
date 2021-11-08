import { Component } from 'inferno';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import purify from 'dompurify';

export class Quiz extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playerscore: 0,
      opponescore: 0,
      question: "",
      answers: [],
      correct: 0, // this could probably be moved to non state ¯\_(ツ)_/¯
      correctly_answered: 0,
      total_questions: 0,
    }
    
    this.onAnswer = this.onAnswer.bind(this);
    this.populateAnswers = this.populateAnswers.bind(this);

    // non state variables
    this.points = 1000;
    this.timer = null;
    this.questions = [
      //Test questions for debugging
      // {
      //   question: "question 1 &amp; some other text",
      //   incorrect_answers: ["1","2","3"],
      //   correct_answer: "0"
      // },
      // {
      //   question: "Omicron (&Omicron;)",
      //   incorrect_answers: ["8","7","6"],
      //   correct_answer: "9"
      // },
      // {
      //   question: "3",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "4",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "5",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "6",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "7",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "8",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "9",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
      // ,
      // {
      //   question: "10",
      //   incorrect_answers: ["wrong","wrong","wrong"],
      //   correct_answer: "right"
      // }
    ];
    this.currentQuestion = 0;
    this.clickable = true;
  }

  populateAnswers() {
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



    // start timer
    this.timer = setInterval(function(self) {
      self.points -= 10;
      window.$(".scorebar > .progress").progress("update progress", self.points);
      window.$("#player-score span").text(self.points);
      if (self.points <= 0) {
        window.$(".scorebar > .progress").progress("set percent", 0);
        clearInterval(self.timer);
        self.clickable = false;
      }
    }, 100, this)
  }

  onAnswer(event) {
    //debugger
    // Only allow picking a answer when we allow it
    if (!this.clickable) return;

    clearInterval(this.timer);

    let s = this.state.playerscore;

    if (parseInt(event.target.attributes.index.value) === this.state.correct) {
      window.$(event.target).addClass("green");
      s += window.$("#player-score .ui.progress").progress("get value");
      this.setState({correctly_answered: this.state.correctly_answered+1});
    } else {
      window.$(event.target).addClass("red");
    }

    this.setState({total_questions: this.state.total_questions + 1});

    // Add score to graph
    const c = window.matchChart;
    c.data.datasets[0].data.push(s);
    c.update()
    this.setState({playerscore: s})

    // Disable clicking for now
    this.clickable = false;

    if (this.currentQuestion < 9) {
      // Load next question
      setTimeout(function(self) {
        self.currentQuestion++;
        self.clickable = true;
        self.points = 1000;
        self.populateAnswers();
        window.$(".ui .button").removeClass("red green");
      }, 2000, this);
    } else {
      // show endscreen here
    }

  }

  componentDidMount() {

    window.$(".scorebar > .progress").progress({
      text: {
        percent: '{value}'
      }
    })

    const chartContext = window.document.querySelector("#graph").getContext("2d");

    const gradient = chartContext.createLinearGradient(0,0,0,500);
    gradient.addColorStop(0, "#0000FF00")
    gradient.addColorStop(1, "#0000FFFF")

    window.matchChart = new Chart(chartContext,{
      type: "line",
      plugins: [ChartDataLabels], //Enable label plugin
      data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11],
        datasets: [{
          backgroundColor: gradient,
          label: "# of votes",
          fill: true,
          data: [0],
          borderColor: "#0000FFFF",
          cubicInterpolationMode: 'monotone',
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 50, // adding padding to the right of the chart
            bottom: 0,
          }
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


    const self = this;
    window.$("body").api({
      on: "now",
      action: "solo play",
      onSuccess: function(result) {
        self.questions = result.data;
        self.populateAnswers();
      }
    })

    // testing
    //this.populateAnswers();

  }

  render() {
    return (
      <div id="quiz-container" class="ui fluid container">
        <ScoreBar id="player-score" />
        <div class="centercontainer">
          <div class="totalscore">
            <canvas id="graph"></canvas>
          </div>
          <div id="question" class="ui segment" style={{height: "20vh", "margin-top": "-1.7%"}}>
            <div class="ui middle aligned one column centered grid" style={{height: "100%"}}>
              <div class="row">
                <div class="column">
                  <h2 class="ui secondary centered header" dangerouslySetInnerHTML={{__html: this.state.question}}></h2>
                </div>
              </div>
            </div>
          </div>
          <div class="ui hidden divider"></div>
          <div>
            {this.state.answers.length > 0 &&
              this.state.answers.map((answer, i) => 
                <div style={{height: "10vh", margin: "0 0 1.5em"}}>
                  <button class="ui fluid big button" index={i} onClick={this.onAnswer} style={{height: "10vh"}} dangerouslySetInnerHTML={{__html: answer}}></button>
                </div>
              )
            }
          </div>
          <div class="ui divider"></div>
          <div class="ui huge centered header" style={{"margin-top":"0"}}>{this.state.correctly_answered} / {this.state.total_questions}</div>
        </div>
        <ScoreBar id="opponent-score" />
      </div>
    )
  }

} 

class ScoreBar extends Component {
  render() {
    return (
      <div id={this.props.id} class="scorebar">
        <div class="ui small indicating progress" data-value="1000" data-total="1000">
          <div class="bar">
            <div class="progress"></div>
          </div>
        </div>
      </div>
    )
  }
}