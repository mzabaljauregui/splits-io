import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

const buildSegmentGraph = function(segment, divId) {
  const url = new URL(window.location.href)
  const duration_string = `${url.searchParams.get('timing') || 'real'}time_duration_ms`

  let graph_data = []
  const non_zero_values = segment.histories.filter((attempt) => attempt[duration_string] > 0)
  graph_data.push({
    name: segment.name,
    data: non_zero_values.map(function(attempt) { return [attempt.attempt_number, attempt[duration_string]] }),
    visible: false,
    pointStart: 1
  })
  graph_data[0].visible = true

  Highcharts.chart(divId, {
    exporting: {
        chartOptions: {
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        },
        fallbackToExportServer: false
    },
    chart: {
      borderRadius: 0,
      borderWidth: 0,
      plotBorderWidth: 0
    },
    title: {
      text: 'Segment Duration over Time'
    },
    plotOptions: {
      series: {
        connectNulls: true
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      pointFormatter: function() {
        let time = moment.utc(moment.duration(this.y).asMilliseconds()).format('H:mm:ss')
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${time}</b><br/>`
      }
    },
    xAxis: {
      title: {
        text: 'Attempt Number'
      }
    },
    yAxis: {
      title: {
        text: 'Duration of History'
      },
      labels: {
        formatter: function() { return moment.utc(moment.duration(this.value).asMilliseconds()).format('H:mm:ss') }
      }
    },
    series: graph_data
  })
}

export {buildSegmentGraph}
