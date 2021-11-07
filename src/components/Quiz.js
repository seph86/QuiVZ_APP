import { Component } from 'inferno';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import textFit from 'textfit';

export class Quiz extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playerscore: 1000,
      opponescore: 1000,
      questions: [],
      questionNumber: 0,
      question: "",
      answers: [],
      correct: 0,
      clickable: true
    }
    
    this.onAnswer = this.onAnswer.bind(this);
  }

  populateAnswers() {
    //debugger
    // Set random index for correct answer
    let index = Math.floor(Math.random() * (3 - 0) + 0);
    let currentQuestion = this.state.questions[this.state.questionNumber]
    let answers = currentQuestion.incorrect_answers;
    answers.splice(index, 0, currentQuestion.correct_answer);
    this.setState({answers: answers, correct: index});
    this.setState({question: currentQuestion.question});
  }

  onAnswer(event) {

    // Only allow picking a answer when we allow it
    if (!this.state.clickable) return;

    if (event.target.attributes.index.value === this.state.correct) {
      window.$(event.target).addClass("green");
    } else {
      window.$(event.target).addClass("red");
    }

    // Disable clicking for now
    this.setState({clickable: false})

    setTimeout(function(self) {
      self.setState({questionNumber: self.state.questionNumber+1, clickable: true});
      self.populateAnswers();
      window.$(".ui .button").removeClass("red green");
    }, 2000, this);

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
        labels: [1,2,3,4,5,6,7,8,9,10],
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
            right: 50 // adding padding to the right of the chart
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
            align: -45,
            padding: 10,
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

    // Countdown timer and score
    const self = this;
    // let timer = setInterval(function() {
    //   self.setState({playerscore:self.state.playerscore - 10})
    //   window.$(".scorebar > .progress").progress("update progress", self.state.playerscore);
    //   window.$("#player-score span").text(self.state.playerscore);
    //   if (self.state.playerscore === 0) {
    //     window.$(".scorebar > .progress").progress("set percent", 0);
    //     clearInterval(timer);
    //   }
    // }, 100)

    window.$("body").api({
      on: "now",
      action: "solo play",
      onSuccess: function(result) {
        self.setState({questions: result.data})
        self.populateAnswers();
      }
    })
  }

  shouldComponentUpdate(nextprops, nextstate) {
    if (this.state.playerscore !== nextstate.playerscore || 
        this.state.opponescore !== nextstate.opponescore )
      return false;
    else 
      return true;
  }

  componentDidUpdate() {
    textFit(document.querySelector("#question"), {minFontSize: 10, alignVert: true, alignHoriz: true, maxFontSize: 20})
  }

  //TODO: Remove this is a test function
  clickbutton() {
    const c = window.matchChart;
    c.data.datasets[0].data.push(Math.floor(Math.random() * 1000))
    c.update()
  }

  render() {
    return (
      <div id="quiz-container" class="ui fluid container">
        <ScoreBar id="player-score" class="orange" />
        <div class="centercontainer">
          <div class="totalscore">
            <canvas id="graph"></canvas>
          </div>
          <div id="question" class="ui segment" style={{height: "10em", color: "black"}}>
            {this.state.question}
          </div>
          <div class="ui hidden divider"></div>
          <div class="ui middle aligned padded grid">
            {/* <div class="row"> ITEM TEMPLATE
              <div class="ui fluid big button">Something</div>
            </div> */}
            {this.state.answers.length > 0 &&
              this.state.answers.map((answer, i) => 
                <div class="row">
                  <button class="ui fluid big button" index={i} onClick={this.onAnswer}>{answer}</button>
                </div>
              )
            }
          </div>
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