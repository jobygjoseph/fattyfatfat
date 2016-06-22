$(function(){
  "use strict";

  var playas = [];
  var playaData = [];
  var dateArray = [];

  var convertToBMI = function(pounds, height) {
    // BMI = ( Weight in Pounds / ( Height in inches x Height in inches ) ) x 703
    return ((pounds / (height * height)) * 703).toFixed(2);
  };


  var massageData = function(columns) {
    $.each(columns, function(index, obj) {
      var nm = obj[0].replace(/\W/g, '').toLowerCase();
      playas[nm] = {
        points: obj[1],
        startweight: obj[2],
        lossgoal: obj[3],
        goalweight: obj[4],
        img: nm + '.jpg',
        name: obj[0].replace(/\*/g, ''),
        weightdata:[parseInt(obj[2])],
        currentweight: obj[5],
        height: obj[18],
        startbmi: convertToBMI(obj[2], obj[18]),
        currentbmi: convertToBMI(obj[5], obj[18]),
        goalbmi: convertToBMI(obj[4], obj[18])
      };
    });

    console.log(playas);

    for(var fgt in playas){
      $('#playa_listings ul').append('<li>' +
        '<div class="playa-data"><img src="img/biopics/'+playas[fgt].img+'" alt="player" />' +
        '<span>'+playas[fgt].name+'</span>' +
        '<span> Has '+playas[fgt].points+' points so far</span>' +
        '<span> Started at '+playas[fgt].startbmi+' BMI and is destined to be '+playas[fgt].goalbmi+' BMI</span>' +
        '<span> Currently at <span id="'+fgt+'-currentweight"></span> BMI</span>' +
        '</div>' +
        '<div class="playa-chart" id="'+fgt+'-chart"></div>' +
        '</li>');
    }
  };


  var buildIndividualCharts = function() {

    for (var nm in playaData){
      // update lossed data
      $('#'+nm+'-currentweight').text(playaData[nm].currentbmi);

      $('#'+nm+'-chart').highcharts({
        chart: {
          type:'line',
          borderColor: '#fff',
          shadow: false,
        },
        title: {
            text: 'My Progression'
        },
        xAxis: {
          labels: {
            format: '{value:%b %e}'
          },
          categories: dateArray
        },
        yAxis: {
          title: {
            text: "BMI"
          },
          min:10
        },
        tooltip: {
          headerFormat: '',
          valueSuffix: ''
        },
        series: [{
            name: playaData[nm].name,
            data: playaData[nm].weightdata
        }]
      });
    }
  };


  var parseIndividualData = function(columns) {
    dateArray = columns[0].slice();
    dateArray.splice(0,1);
    //dateArray.unshift(1466035200000); // add Jan 20 - initial weigh in
    var tmpColumns = columns.slice();
    tmpColumns.splice(0,1);
    var nm = "";

    $.each(tmpColumns, function(ind, obj) {
      var nm = obj[0].replace(/\W/g, '').toLowerCase();
      playaData[nm] = {
        weightdata:[parseInt(playas[nm].startbmi)],
        name: obj[0],
        currentweight: parseInt(playas[nm].startweight),
        currentbmi: parseInt(playas[nm].startbmi)
      };
      //$('#playa-charts').append('<div id="'+nm+'-chart"></div>');
      $.each(obj, function(inx,oj){
        if (0 === inx) return;
        if ("undefined" === typeof oj) return false;
        if ("0" == oj) return false;
        playaData[nm].currentweight = oj;
        playaData[nm].currentbmi = oj;
        playaData[nm].weightdata.push(oj);
      });
    });

  };

  var generateMainChart = function() {
    // Create the chart
    $('#highchart-container').highcharts({
      chart: {
        events: {
          load: buildIndividualCharts
        }
      },
      data: {
          googleSpreadsheetKey: '1p2lqoPv9O3zoJPQ1T3zc9TktsDGyF8JQzUi7aldfKjI',
          googleSpreadsheetWorksheet: 3,
          //startColumn: 1,
          parsed: parseIndividualData,
          //parseDate:function(dt){console.log(dt);},
          dateFormat: 'mm/dd/YY'
      },
      yAxis: {
        title: {
          text: "BMI"
        },
        min:10
      },
      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value:%b %e}'
        },
      },
      title: {
        text: 'FATTIES OF 2016'
      },
      subtitle: {
        text: 'Click and drag to zoom in. Hold down shift key to pan. Click a name in the legend below to remove the person'
      }
    }); // $('highchart-container')
  };



  //fartscroll();

  // var highchartsOptions = Highcharts.setOptions(Highcharts.theme = {
  //    colors: ['#058DC7', '#eaab1d']
  // });

  Highcharts.setOptions({
    chart: {
      type: 'column',
      backgroundColor: '#fff',
      shadow: true,
      zoomType: 'x',
      panning: true,
      panKey: 'shift'
    }
  });

  // Get Player data
  $('#highchart-data-layer').highcharts({
    chart: {
      events: {
        load: generateMainChart
      }
    },
    data: {
        googleSpreadsheetKey: '1p2lqoPv9O3zoJPQ1T3zc9TktsDGyF8JQzUi7aldfKjI',
        googleSpreadsheetWorksheet: 1,
        startColumn: 2,
        parsed: massageData
    }
  });

}); // close on ready function
