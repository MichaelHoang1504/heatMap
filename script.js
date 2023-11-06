let width = 800;
let height = 600;
let padding = 80;

let svgChart = d3.select('.chart')
                   .append('svg')
                   .attr('width',width)
                   .attr('height',height)
let tooltip = d3.select('.chart')
                .append('div')
                .attr('id','tooltip')
                .style('opacity',0);
;
fetch( 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response=> response.json())
.then(data => {
  svgChart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -250)
      .attr('y', 40)
      .style('font-size', 18)
      .text('Month');
  svgChart.append('text')
      .attr('x', (width-padding)/2)
      .attr('y', height - 40)
      .style('font-size', 18)
      .text('Year');
    let color = ['#f6eff7',
               '#bdc9e1',
               '#67a9cf',
               '#1c9099',
               '#016c59',
               '#ffffb2',
               '#fecc5c',
               '#fd8d3c',
               '#f03b20',
               '#bd0026'];
  let baseTemp = data['baseTemperature'];
  let values = data['monthlyVariance'];
  let yearMin = d3.min(values, d=> {
    return d['year'];
  });
   let yearMax = d3.max(values, d=> {
    return d['year'];
  });
  console.log(d3.min(data.monthlyVariance, d=> d.variance));
   console.log(d3.max(data.monthlyVariance, d=> d.variance));
  let xScale = d3.scaleLinear()
                  .domain([yearMin,yearMax + 1])
                 .range([padding, width-padding]);
  let yScale = d3.scaleTime()
                 .domain([new Date(0,0,0,0,0,0,0), new Date(0,12,0,0,0,0,0)])
                .range([padding, height-padding])
  let xAxis= d3.axisBottom(xScale)
                .tickFormat(d3.format('d'));
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%B'));
  svgChart.append('g')
          .call(xAxis)
          .attr('id','x-axis')
          .attr('transform', 'translate(0, '+(height-padding)+')');
  svgChart.append('g')
          .call(yAxis)
          .attr('id', 'y-axis')
          .attr('transform','translate(' + padding + ',0)');
  svgChart.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('class','cell')
          .attr('data-year',d=> {
     return d['year'];
  })      
          .attr('data-month', d =>{
    return d['month'] - 1;
  })
          .attr('data-temp', d => {
    return baseTemp + d['variance'];
  })
          .attr('height', (height -(2*padding)) / 12)
          .attr('y', d =>{
    return yScale(new Date(0,d['month']-1,0,0,0,0,0))
  })
          .attr('width', d => {
          let numYear= yearMax - yearMin;
          return (width - (2*padding)) / numYear;
  })
          .attr('x', d=> {
          return xScale(d['year']);
  })
          .attr('fill', d => {
            let variance = d['variance']
            if(variance <= -6){
                return color[0];
            }else if(variance <= -4){
                return color[1];
            }else if(variance <= -2){
                return color[2];
            }else if(variance <= -1){
                return color[3];
            }else if(variance <=  0){
                return color[4];
            }else if(variance <= 1){
                return color[5];
            }else if(variance <= 2){
                return color[6];
            }else if(variance <= 3){
                return color[7];
            }else if(variance <=  4){
                return color[8];
            }else{
                return color[9];
            }
        })
        .on('mouseover', (event,d)=> {
        tooltip.style('opacity', 0.9);
        tooltip.attr('data-year', d['year']);
        let month = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
        tooltip
          .html(
            'Year: ' +
             d['year'] +
              '<br/>' +
              'Month: ' +
              month[d['month']-1] +
              '<br/>' +
              'Temperature: ' +
              Math.round((baseTemp + d['variance'])*1e2) / 1e2 +
              '&#8451'+
              '<br/>' +
              'variance: ' +
              d['variance'] + '&#8451'   
          )
          .style('left', event.pageX + 250 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });
  let legendContainer = svgChart.append('g')
                            .attr('id', 'legend');

  let legend = legendContainer
      .selectAll('#legend')
      .data(color)
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (height /2 - i * 20) + ')';
      });
  legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d=> d);
  legend
      .append('text')
      .attr('x', width - 20)
      .attr('y', 9)
      .attr('dy', '.15em')
      .style('text-anchor', 'end')
      .text(function (d,i) {
        if (i==0) {
          return 'Freezing';
        } else if(i==1){
          return 'Too Cold';
        }else if(i==2){
          return '6+ Cold';
        }else if(i==3){
          return 'Cold';
        }else if(i==4){
          return 'Avarage';
        } else if(i==5){
          return 'Base';
        }else if(i==6){
          return 'Hot';
        }else if(i==7){
          return '9+ Hot';
        }else if(i==8){
          return '10+ Hot';
        }else {
          return '11+ Hot';
        }
      });
});