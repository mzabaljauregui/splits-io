import {buildSegmentGraph} from "graphs/segment-duration.js"
import {Spinner} from 'spin.js'

$(function() {
  const graphHolders = document.getElementsByClassName('segment-graph-holder')
  if(graphHolders.length === 0) {
    return
  }

  let spinners = []

  for(const graphHolder of graphHolders) {
    const spinner = new Spinner({
      lines: 3,
      length: 15,
      width: 1,
      radius: 0,
      corners: 1,
      rotate: 90,
      direction: 1,
      color: '#FFFFFF',
      speed: 0.5,
      trail: 30,
      shadow: false,
      hwaccel: true,
      position: 'relative'
    })
    spinner.spin(graphHolder)
    spinners.push(spinner)
  }

  fetch(`/api/v4/runs/${gon.run.id}?historic=1`, {
    headers: {
      accept: 'application/json'
    }
  }).then(function(response) {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Request for run from api failed')
  }).then(function(json) {
    spinners.forEach(function(spinner) {
      spinner.stop()
    })
    if (json.run.program === 'livesplit') {
      json.run.segments.forEach(function(segment) {
        buildSegmentGraph(segment, 'segment-graph-' + segment.id)
      });
    }
  }).catch(function(error) {
    spinners.forEach(function(spinner) {
      spinner.stop()
    })
    for(const graphHolder of document.getElementsByClassName('graph-holder')) {
      graphHolder.find('.panel-title').find('h1').text('Error retrieving data for graphs')
    }
  })
})

const panel_builder = function($panel, id) {
  const $panel_clone = $panel.clone()
  $panel_clone.find('.panel-body').append($('<div />').prop('id', id_string))
  return $panel_clone
}
