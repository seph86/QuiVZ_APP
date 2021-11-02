import { Component } from 'inferno';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class Quiz extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playerscore: 1000,
      opponescore: 1000,
    }
  }

  componentDidMount() {

    window.$(".scorebar > .progress").progress({
      text: {
        percent: '{value}'
      }
    })

    const chart = new Chart(window.document.querySelector(".totalscore>canvas"),{
      type: "line",
      plugins: [ChartDataLabels], //Enable plugin
      data: {
        labels: [1],
        backgroundColor: "#000000",
        datasets: [{
          label: "# of votes",
          data: [0],
          borderColor: "#0000FF",
          cubicInterpolationMode: 'monotone',
          borderWidth: 2
        }]
      },
      options: {
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
            max: 100,
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


    const c = chart;
    c.data.labels.push(1);
    c.data.datasets[0].data.push(100 + Math.random() * 10)
    c.update()

    // Countdown timer and score
    // const self = this;
    // let timer = setInterval(function() {
    //   self.setState({playerscore:self.state.playerscore - 10})
    //   window.$(".scorebar > .progress").progress("set progress", self.state.playerscore);
    //   window.$("#player-score span").text(self.state.playerscore);
    //   if (self.state.playerscore === 0) {
    //     window.$(".scorebar > .progress").progress("set percent", 0);
    //     clearInterval(timer);
    //   }
    // }, 100)
  }

  shouldComponentUpdate(nextprops, nextstate) {
    if (this.state.playerscore !== nextstate.playerscore || 
        this.state.opponescore !== nextstate.opponescore )
      return false;
    else 
      return true;
  }

  render() {
    return (
      <div id="quiz-container" class="ui fluid container">
        <ScoreBar id="player-score" class="orange" />
        <div class="totalscore">
          <canvas height="20vh" width="100%"></canvas>
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