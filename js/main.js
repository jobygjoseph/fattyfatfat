var weightGoalPercent = .1; // 10% goal

var wgp = 1 - weightGoalPercent; 
var wgp_gain = 1 + weightGoalPercent;

var abbr_month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

var weightData, weightDrillSeries;
weightData = [];
weightDrillSeries = [];

// Calculate 10% of original goal
var goal_pounds = {
  Stephen:  competitor_data.Stephen[0][1] * wgp,
  Scott:    competitor_data.Scott[0][1] * wgp,
  Saliou:   competitor_data.Saliou[0][1] * wgp_gain,
  Sal:      competitor_data.Sal[0][1] * wgp,
  Jonathan: competitor_data.Jonathan[0][1] * wgp,
  Joby:     competitor_data.Joby[0][1] * wgp,
  Haddon:   competitor_data.Haddon[0][1] * wgp,
  Brian:    competitor_data.Brian[0][1] * wgp,
  Dan:      competitor_data.Dan[0][1] * wgp 
};

Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

var total_percent_off = 0;
var hicharts2_data = [];
var cat_xaxis = [];



$.each(competitor_data, function(fighter, data) {
    var each_fighter_data = [];
    var current_weight = data[data.length-1][1];
    $.each(data, function(fg,dt){
      var catD = new Date(dt[0]);
      if (cat_xaxis.length < data.length) cat_xaxis.push(abbr_month_names[catD.getMonth()] + " " + catD.getDate());
    });
    
    var starting_weight = competitor_data[fighter][0][1];
    var weight_loss = current_weight-starting_weight;
    var percent_off = ((Math.abs(starting_weight - current_weight) / starting_weight) * 100);
    window[fighter] = {
      payout: ((10 - percent_off)*10).formatMoney(2)
    }


    total_percent_off += (10 - percent_off);
    weightData.push(
      {
        drilldown: fighter,
        name: fighter,
        //y:Math.round((Math.abs(starting_weight - current_weight) / starting_weight) * 100)
        y:percent_off.round(2)
        //y:parseFloat((Math.abs(starting_weight - current_weight) / starting_weight) * 100).toFixed(2)
      }
    );

    weightDrillSeries.push(
      {
        data: data,
        id: fighter,
        name: fighter
      }
    );

    $.each(data, function(d1,daData){each_fighter_data.push(daData[1])});
    hicharts2_data.push(
      {
        name: fighter,
        data: each_fighter_data
      }
    );

  } // each competitor data
);

$(function(){
  //fartscroll();

  
  $.each(competitor_data, function(fghtr, dta) {
    //var wgp = 1 - weightGoalPercent; 
    //var wgp_gain = 1 + weightGoalPercent;
    var current_weight = dta[dta.length-1][1];
    var starting_weight = competitor_data[fghtr][0][1];
    var weight_loss = Math.abs(current_weight-starting_weight).round(2);
    if (fghtr == 'Saliou') {
      var goal_weight = dta[0][1] * wgp_gain;
    }else {
      var goal_weight = dta[0][1] * wgp;
    }

    var weight_left_to_lose = Math.abs([goal_weight - current_weight]).round(2);

    var fghtr_img = fghtr.toLowerCase();

    // console.log(fghtr);
    // console.log(goal_weight);
    // console.log(current_weight);

    if (fghtr == 'Saliou' ) {
      if (current_weight >= goal_weight) {
        $('#fighter_listings ul').append('<li><img src="img/'+fghtr_img+'.jpg" alt="" /><span>'+fghtr+' HAS MADE GOAL!</span></li>');      
      }else {
       $('#fighter_listings ul').append('<li><img src="img/'+fghtr_img+'.jpg" alt="" /><span>'+fghtr+' '+ (current_weight > starting_weight ? 'gained ' : 'lost ') +weight_loss+' pounds! He needs to '+(current_weight > starting_weight ? 'gain ' : 'lose ') + weight_left_to_lose+' lbs to make goal! <br /><span class="red">Currently owes $'+window[fghtr].payout+'</span></span></li>'); 
      }
    }else {
      if (current_weight <= goal_weight) {
        $('#fighter_listings ul').append('<li><img src="img/'+fghtr_img+'.jpg" alt="" /><span>'+fghtr+' has HAS MADE GOAL!</span></li>');
      }
      else {
        $('#fighter_listings ul').append('<li><img src="img/'+fghtr_img+'.jpg" alt="" /><span>'+fghtr+' '+ (current_weight > starting_weight ? 'gained ' : 'lost ') +weight_loss+' pounds! He needs to '+(current_weight > starting_weight ? 'gain ' : 'lose ') + weight_left_to_lose+' lbs to make goal! <br /><span class="red">Currently owes $'+window[fghtr].payout+'</span></span></li>'); 
      } 
  }

  });

  var cash_amount = total_percent_off * 10;
  cash_amount = Math.round(cash_amount);
  $('#cashAmount').html('$' + cash_amount + '!!');

  // Create the chart
  $('#highchart-container').highcharts({
      chart: {
          type: 'bar'
      },
      title: {
          text: 'Current Weight Loss / Gain'
      },
      subtitle: {
          text: 'Click the columns to view progression'
      },
      xAxis: {
          type: 'category'
      },
      yAxis: {
          title: {
              text: 'Percent of Weight Loss / Gain'
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
                  format: '{point.y:.1f}%'
              }
          }
      },

      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}%</b><br/>',
          formatter: function(){
            return this.y > 100 ? this.y + "lbs" : this.y + "%";
          }
      }, 

      series: [{
          name: 'Fatty/Skinny',
          colorByPoint: true,
          data: weightData
          //data: seriesData
      }],
      drilldown: {
          //series: drilldownSeries
        series: weightDrillSeries
      }
    }); // $('highchart-container')




    // Create the chart
  $('#highchart-container2').highcharts({
      title: {
          text: 'Weight Loss / Gain by Date'
      },
      xAxis: {
          categories: cat_xaxis
      },
      legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
      yAxis: {
          title: {
              text: 'Weight (lbs)'
          }
      },
      tooltip:{
        valueSuffix: ' lbs'
      },
      
      series: hicharts2_data
    }); // $('highchart-container2')


}); // close on ready function