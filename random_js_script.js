/**
 * tabs.js
 */
var tab1 = new Object();
var tab2 = new Object();
var tab3 = new Object(); 
var tab4 = new Object(); 
var tab5 = new Object(); 
var tab6 = new Object();
var tab7 = new Object();
var tab8 = new Object();

var pawlinChart = null;

tab1.enabled  = true;
tab1.modelId  = null;

tab2.enabled = false;
tab3.enabled = false;
tab4.enabled = false;
tab5.enabled = false;
tab6.enabled = false;
tab7.enabled = false;
tab8.enabled = true;

tab5.year  = null;
tab5.month = null;
tab6.year  = null;

var model_start = null;
var model_end   = null;
var model_name  = null;

function openTab(evt, tabName)
{
	if (!isEnabled(tabName))
		return;
    // Declare all variables
    var i, tabcontent, tablinks;
	
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
	
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
	
    // Show the current tab, and add an "active" class to the button that opened the tab
    selectTab(evt, tabName);
}

/**
 * Access check function Tab
 */
function isEnabled(tabName)
{
	if ('ModelChooser' == tabName) 
		return tab1.enabled;
	else if ('ModelCreate' == tabName)
		return tab2.enabled;
	else if ('Params' == tabName)
		return tab3.enabled;
	else if ('Graph' == tabName)
		return tab4.enabled;
	else if ('ReportRisk' == tabName)
		return tab5.enabled;
	else if ('ReportUBP' == tabName)
		return tab6.enabled;
   else if ('PmaResult' == tabName)
      return tab7.enabled;
   else if ('Trends' == tabName)
      return tab8.enabled;
}
/**
 * Tab transition method
 * @param evt
 * @param tabName
 */
function selectTab(evt, tabName)
{
	if ((('ModelChooser' == tabName) && tab1.enabled) || 
	    (('ModelCreate'  == tabName) && tab2.enabled) ||
	    (('Params'       == tabName) && tab3.enabled) ||
	    (('Graph'        == tabName) && tab4.enabled) ||
	    (('ReportRisk'   == tabName) && tab5.enabled) ||
	    (('ReportUBP'    == tabName) && tab6.enabled) ||
       (('PmaResult'    == tabName) && tab7.enabled) ||
       (('Trends'       == tabName) && tab8.enabled))  {
		if ('ReportRisk' == tabName) {
			if (tab5.year == null)
				openTabReportRisk();
		} else if ('ReportUBP' == tabName) {
			if (tab6.year == null)
				openTabReportUBP();
		} else if ('PmaResult' == tabName) {
         openTabPmaResult();
      } else if ('Trends' == tabName) {
         showTrendResult('no', 'short_dubp_code');
      }
	    document.getElementById(tabName).style.display = "block";
	    evt.currentTarget.className += " active";
	}
}
/**
 * Method of processing a button click (tab selection)
 * @param tab вкладка/кнопка
 */
function onTabClick(tab)
{
	var button = document.getElementById(tab);
	button.click();
}
/**
 * Метод открытия вкладки 'Выбор модели'
 */
function openModel()
{
   reStartTimer();
	onTabClick("btn1");
}
/**
 * Method of obtaining Id selected model
 */
function getModelId()
{
	 var id = null;
    var inp = document.getElementsByName('modelId');
    var rw = -1;
    var r = -1;
    var sign = 1;
    for (var i = 0; i < inp.length; i++) {
    	r++;
        if (inp[i].type == "radio" && inp[i].checked) {
        	rw = r + 1;
        	break;
        }
    }
    if (rw >= 0) {
    	var table = document.getElementById("models");
    	var row = table.rows[rw];
    	if (row.style.color === 'lightgray') {
         sign = - 1;
		}
      var cell = row.cells[1];
      id = cell.innerHTML * sign;
    }
    return id;
}
/**
 * The method of obtaining the description of the selected model
 */
function getModel()
{
	var model = new Object();
	var model_name = "";
    var inp = document.getElementsByName('modelId');
    var rw = -1;
    var r = -1;
    for (var i = 0; i < inp.length; i++) {
    	r++;
        if (inp[i].type == "radio" && inp[i].checked) {
        	rw = r + 1;
        	break;
        }
    }
    if (rw >= 0) {
    	var table = document.getElementById("models");
    	var row = table.rows[rw];
    	var cell_name = row.cells[2];
    	var cell_from = row.cells[3];
    	var cell_to   = row.cells[4];
    	
    	model_name = '<p></p>' +
    		         '<table><tr><td><b>Модель</b></td><td>' + cell_name.innerHTML + 
                            ' (<i>период с ' + cell_from.innerHTML + 
                                          ' по ' + cell_to.innerHTML + '</i>)</td></tr>' +
                     '</table>';
    }
    return model_name;
}

function resetCheckedId()
{
    var inp = document.getElementsByName('modelId');
    for (var i = 0; i < inp.length; i++) {
        if (inp[i].type == "radio" && inp[i].checked) {
        	inp[i].checked = false;
        }
    }
}
/**
 * The method of opening the tab 'New Model'
 */
function clickNewModel()
{
//	tab1.isNew = true;
	tab1.modelId = null;
	tab2.enabled = true;
	tab3.enabled = false;
	tab4.enabled = false;
	tab5.enabled = false;
	tab6.enabled = false;
   tab7.enabled = false;
   tab8.enabled = false;
   changeStartTime();
	resetCheckedId();
	onTabClick("btn2");
}
/**
 * Sending new model parameters to server
 */
function createNewModel(start, end, name) {
   //console.log("|" + start + "|" + end + "|" + name);
   	$.ajax({
   		url : 'server',
		data : {
			dt_start : start,
			dt_end : end,
			modelName : name },
		success : function(response) {
				if (response == "OK") {
               var elem = document.getElementsByName("newModelCalc");
               for (var i = 0; i < elem.length; i++) {
                  if (elem[i].name == "newModelCalc") {
                     elem[i].disabled = true;
                     break;
                  }
               }
               startCalcNewModel();
            }
				else
					alert(response);
			}
		});
}
/**
 * Finishing method of calculating a new model
 */ 
function stopProgress()
{
	tab1.enabled = true;
	tab3.enabled = true;
	onTabClick("btn3");
	
	var elem = document.getElementsByName("modelCalc");
	for (var i = 0; i < elem.length; i++) {
        if (elem[i].type == "submit") {
        	elem [i].disabled = false;
        	break;
        }
    };
    loadNewModel();
}
/**
 * Progress
 */ 
function startProgress(timeProgressStr, start)
{
   var timeProgress = parseInt(timeProgressStr);
   if (timeProgress < 0) {
      //console.log('##287 timeProgress < 0');
      var start = Date.now();  // var countDownDate = new Date("Jan 5, 2019 15:37:25").getTime();
      timeProgress = 0;
   }
   timeProgress = (Date.now() - start) / 1000 / 3 | 0; //
   //console.log('##245 startProgress1 Старт. timeProgress = ' + timeProgress + ', start = ' + start + ', Date.now() = ' + Date.now());
   //console.log('##246 timeProgress = ' + (Date.now() - start) / 1000 | 0);

    $.ajax({
       url : 'server',
       data: {
          timeProgress: timeProgress,
          start: start
       },
       success : function(responseText) {
       	 var response = responseText.split(';', 2);
            // обработка ответа
          if (timeProgress <= 20) {
             $('#progress').text(timeProgress + "%");
          } else {
             if (response.lingth == 1)
                $('#progress').text(response[0] + "%");
             else
                $('#progress').text(response[0] + "% - " + response[1]);
          }
          var progress = parseInt(responseText);
          // with a value less than 100, repeat the request after 2 seconds
          if (progress < 100) {
              setTimeout(startProgress(timeProgress, start), 2000);
          } else {
             var elem = document.getElementsByName("newModelCalc");
             for (var i = 0; i < elem.length; i++) {
                if (elem[i].name == "newModelCalc") {
                   elem[i].disabled = false;
                   break;
                }
             }

          	$('#progress').text("Calculation done");
          	stopProgress();
          }
       }
    });
}


/**
 * Method to start calculating a new model
 */
function startCalcNewModel()
{
	tab1.enabled = false;
	// Блокировка кнопки
	var elem = document.getElementsByName("modelCalc");
	for (var i = 0; i < elem.length; i++) {
        if (elem[i].type == "submit") {
        	elem [i].disabled = true;
        	break;
        }
    }
   clearReportUBP('');
   clearReportRisk('');
	startProgress(-1, Date.now());
}

/**
 * Method of determining the parameters of the new model
 */
function setNewModelParams()
{
	model_start = null;
	model_end   = null;
	model_name  = null;
	setTimeout(function(){
	   // flush changes
	}, 1000);

	var elem = document.getElementsByName("dt_start");
	for (var i = 0; i < elem.length; i++) {
        if (elem[i].type == "date") {
        	model_start = elem [i].value;
        	break;
       }
   }
	elem = document.getElementsByName("dt_end");
	for (var i = 0; i < elem.length; i++) {
        if (elem[i].type == "date") {
        	model_end = elem [i].value;
        	break;
       }
   }
	elem = document.getElementsByName("modelName");
	for (var i = 0; i < elem.length; i++) {
        if (elem[i].type == "text") {
        	model_name = elem [i].value;
        	break;
       }
   }

   elem = document.getElementById("trend_response");
   if (elem != null)
      elem.innerHTML = "";

}
/**
 * The method of performing the calculation of the new model
 */
function clickModelCalc() {
   changeStartTime();

   /*var elem = document.getElementsByName("newModelCalc");
   for (var i = 0; i < elem.length; i++) {
      if (elem[i].name == "newModelCalc") {
         elem[i].disabled = true;
         break;
      }
   }*/

	setNewModelParams();
	if ((model_start != null) && (model_end != null) && (model_name != null)) {
		createNewModel (model_start, model_end, model_name);
	} 
}

function loadNewModel()
{
    $.ajax({
        url : 'server',
        data : {
        	model_id : '-1'
        },
        success : function(response) {
        	$('#table_models').html(response);
        	tab1.modelId = getModelId();
        	loadModelParams('false');
        }
    });
}

/**
 * The method of opening the tab 'Graph Options' for choosing a model
 */
function clickParams()
{
	var model_id = getModelId();
   //changeStartTime();

	if ((model_id == null) || (model_id < 0))
		return;
	if ((tab1.modelId == null) || (tab1.modelId != model_id))  {
	    tab1.modelId = model_id;
	    tab1.enabled = false;
	    tab2.enabled = false;
		 tab3.enabled = true;
	    tab4.enabled = false;
	    tab5.enabled = false;
	    tab6.enabled = false;
       tab7.enabled = false;
       tab8.enabled = false;
		
		onTabClick("btn3");

		showModelName();
		clearModelParams();
		loadModelParams('false');
	} else {
		tab2.enabled = false;
		tab3.enabled = true;
		onTabClick("btn3");
	}
}

function clearModelParams()
{
	var elem = document.getElementById("model_params");
	elem.innerHTML = "";

	elem = document.getElementById("report_risk");
	if (elem != null)
		elem.innerHTML = "";

   elem = document.getElementById("trend_response");
   if (elem != null)
      elem.innerHTML = "";

	clearReportUBP('');
}

function showModelName()
{
	var model_name = getModel();
	if (model_name != null) {
		var elem = document.getElementById("model");
		elem.innerHTML = model_name;
		elem = document.getElementById("model_risk");
		elem.innerHTML = model_name;
		elem = document.getElementById("model_ubp");
		elem.innerHTML = model_name;
	}
}

function loadModelParams(setMode)
{
   changeStartTime();

    $.ajax({
        url : 'server',
        data : {
        	model_id : tab1.modelId,
        	set_mode : setMode
        },
        async: false,
        success : function(response) {
        	$('#model_params').html(response);
        	
        	 tab1.enabled = true;
    	    tab5.enabled = true;
    	    tab6.enabled = true;
          tab7.enabled = true;
          tab8.enabled = true;
    	    showModelName();
    	    if(setMode != 'false') {
    	    	var set_el = document.getElementById(setMode);
    	    	if(set_el != null) {
    	    		set_el.checked = true;
    	    	}
    	    }
        }
    });
}

/*graph: year + ';' + aircraft + ';' +           // Добавил graph
         code + ';' + incident + ';' + event + ';',*/

function loadModelParams2(setMode, year, aircraft, code, incident, event) {
   $.ajax({
      url : 'server',
      data : {
         model_id : tab1.modelId,
         set_mode : setMode,
         graph: year + ';' + aircraft + ';' +           // Добавил graph
         code + ';' + incident + ';' + event + ';',
			relod_params : 'true'
      },
      async: false,
      success : function(response) {
         $('#model_params').html(response);

         tab1.enabled = true;
         tab5.enabled = true;
         tab6.enabled = true;
         tab7.enabled = true;
         tab8.enabled = true;
         showModelName();
         if(setMode != 'false') {
            var set_el = document.getElementById(setMode);
            if(set_el != null) {
               set_el.checked = true;
            }
         }
      }
   });
}


function openGraphTab()
{
    changeStartTime();

    var years     = document.getElementsByName('year'    );
    var aircrafts = document.getElementsByName('aircraft');
    var codes     = document.getElementsByName('code'    );
    var events    = document.getElementsByName('event'   );
    var incidents = document.getElementsByName('incident');
    
    var useSetChekboxes = document.getElementsByName('setCheckbox');
    var isSetMode = false;
    var setModeVal = '';
    for(var i = 0; i < useSetChekboxes.length; ++i) {
    	if(useSetChekboxes[i].checked == true) {
    		setChekboxes = true;
    		setModeVal = useSetChekboxes[i].id;
    	}
    }
    var setGroupElements = document.getElementsByName(setModeVal);
    var setVals = '';
    for(var i = 0; i < setGroupElements.length; ++i) {
    	if(setGroupElements[i].checked) {
    		setVals += setGroupElements[i].value + '=1;';
    	}
    	else {
    		setVals += setGroupElements[i].value + '=0;';
    	}
    }
    
    var year     = "";
    var aircraft = "";
    var code     = "";
    var event    = "";
    var incident = "";

    for (var i = 0; i < years.length; i++) {
        if ((years[i].type == "radio") && years[i].checked) {
        	year = years[i].value;
        	break;
        }
    }
    for (var i = 0; i < aircrafts.length; i++) {
        if ((aircrafts[i].type == "radio") && aircrafts[i].checked) {
        	aircraft = aircrafts[i].value;
        	break;
        }
    }
    for (var i = 0; i < codes.length; i++) {
        if ((codes[i].type == "radio") && codes[i].checked) {
        	code = codes[i].value;
        	break;
        }
    }
    for (var i = 0; i < events.length; i++) {
        if ((events[i].type == "radio") && events[i].checked) {
        	event = events[i].value;
        	break;
        }
    }
    for (var i = 0; i < incidents.length; i++) {
        if ((incidents[i].type == "radio") && incidents[i].checked) {
        	incident = incidents[i].value;
        	break;
        }
    }
	tab4.enabled = true;
	onTabClick("btn4");
	
	var diagram    = document.getElementById('diagram');
	diagram.innerHTML = '';
	drawGraph(year, aircraft, code, incident, event, setVals);
}

function drawGraph(year, aircraft, code, incident, event, setVals)
{
    $.ajax({
        url : 'server',
        data : {
        	graph : year + ';' + aircraft + ';' +
        	        code + ';' + incident + ';' + event + ';',
        	setGroup : setVals
        },
        success : function(response) {
        	$('#diagram').html(response);
        	drawTitle();
        	drawChart();
        }
    });
}

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 75)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};


function drawChart()
{
	debugger;
	var chartEl = document.getElementById("chart");
	
	if (pawlinChart != null)
		   pawlinChart.destroy();
	
	pawlinChart = new Chart(chartEl, 
			{ 
				type: 'scatter', 
				data: lineChartData,
				options : 
				{ 
					responsive: true, 
					title: 
					{ 
						display:true, 
						text:'  ' 
					}, 
					annotation: 
					{ 
						drawTime: "afterDraw", 
						annotations: timeLine 
					}, 
					tooltips: 
					{ 
						enabled: true, 
						position: 'average', 
						intersect: false 
					}, 
					scales: 
					{ 
						xAxes: [ 
						{ 
							stacked : false, 
							id : 'x-axis-label', 
							position:'bottom', 
							type: 'linear', 
							ticks: 
							{ 
								min : 0, 
								max: 365, 
								stepSize: 30.41, 
								callback(index)
								{ 
									if(index == 0) { 
										return ''; 
									} 
									//console.log('index = ' + index);
									var res_index  = Math.floor(index / 30.41);
									// console.log('res_index = ' + res_index);
									// console.log(' month = ' + monthLabels[res_index]);
									return monthLabels[Math.floor(index / 30.41)]; 
								} 
							}
						}], 
						yAxes: [ 
						{ 
							stacked : true, 
							id : 'y-axis-label', 
						}] 
					} 
				} 
			}); 
}


function drawTitle()
{
    $.ajax({
        url : 'server',
        data : {
        	drawTitle : 'drawTitle'
        },
        success : function(response) {
        	$('#Describe').html(response);
			//alert("drawTitle : params = '" + response + "'");
        }
    });
}


function clearReportRisk(txt)
{
	var el = document.getElementById("report_risk");
	if (el != null)
		el.innerHTML = txt;
}

function createReportRisk()
{
   changeStartTime();

	clearReportRisk('Формирование отчета ...');
    var years = document.getElementById('year_risk');
    var months = document.getElementById('month_risk');
    year  = years.options[years.selectedIndex].text;
    month = months.options[months.selectedIndex].text;
    getReportRisk(year, month);
    tab1.enabled = false;
    tab3.enabled = false;
    tab6.enabled = false;
    tab7.enabled = false;
    tab8.enabled = false;
}

function getReportRisk(ye, mn)
{
    $.ajax({
        url : 'server',
        data : {
        	report : 'risk',
        	year : ye,
        	month : mn
        },
        success : function(response) {
        	$('#report_risk').html(response);
    	    tab1.enabled = true;
    	    tab3.enabled = true;
    	    tab6.enabled = true;
          tab7.enabled = true;
          tab8.enabled = true;
        }
    });
}

function openTabReportRisk()
{
    $.ajax({
        url : 'server',
        data : {
        	report_params : 'risk'
        },
        success : function(response) {
        	$('#model_params_risk').html(response);
        }
    });
}

function openTabPmaResult()   // Open the bookmark with codes
{
   $.ajax({
      url : 'server',
      data : {
         pma_param : 'open'
      },
      success : function(response) {
         $('#model_pma_result').html(response);
      }
   });
}

function showTrendResult(trendReCalculate, trendOrderBy)   // Open page with code. reCalculate='yes' - re-calculat / 'no' - no
{
   changeStartTime();
   //if (trendReCalculate == 'yes') {

      var img = document.getElementById('loadingTrend');
      img.style.display = '';

      tab1.enabled = false;
      tab2.enabled = false;
      tab3.enabled = false;
      tab4.enabled = false;
      tab5.enabled = false;
      tab6.enabled = false;
      tab7.enabled = false;

      var elem = document.getElementsByName("showTrend");
      for (var i = 0; i < elem.length; i++) {
         if (elem[i].name == "showTrend") {
            elem[i].disabled = true;
         }
      }

   console.log("сработал showTrendResult()");
   $.ajax({
      url : 'server',
      data : {
          trendParam : 'open'
         ,trendReCalculate : trendReCalculate
         ,trendOrderBy : trendOrderBy
      },
      success : function(response) {
         $('#trend_response').html(response);

         console.log("Show with recalculation - Enable");
         var img = document.getElementById('loadingTrend');
         img.style.display = 'none';

         tab1.enabled = true;
         tab2.enabled = true;
         tab3.enabled = true;
         //tab4.enabled = true;
         tab5.enabled = true;
         tab6.enabled = true;
         tab7.enabled = true;

         var elem = document.getElementsByName("showTrend");
         for (var i = 0; i < elem.length; i++) {
            if (elem[i].name == "showTrend") {
               elem[i].disabled = false;
            }
         }
      }
   });

}

function openTabPmaResultPlus(group_or_not, code_Id, shortDubpCode, count_period_from, count_period_to)   // Открыываем закладку с кодамми + разбор полетов
{
   /*console.log('group_or_not = ' + group_or_not +
               ', code_Id = ' + code_Id +
               ', shortDubpCode = ' + shortDubpCode +
               ', count_period_from = ' + count_period_from +
               ', count_period_to = ' + count_period_to);*/
   $.ajax({
      url : 'server',
      data : {
         pma_param : 'open',
         pma_razbor: 'yes',
         groupedOrNot: group_or_not,
         pmaCodeId: code_Id,
         pmaShortDubpCode: shortDubpCode,
         pmaCountPeriodFrom: count_period_from,
         pmaCountPeriodTo: count_period_to
      },
      success : function(response) {
         $('#model_pma_result').html(response);
      }
   });
}

function loadAndOpenTabPmaResult()   // Open the bookmark with kodamm
{
   var elem = document.getElementsByName("runPmaUtils");
   for (var i = 0; i < elem.length; i++) {
      if (elem[i].type == "submit") {
         elem [i].disabled = true;
      }
   };

   var img = document.getElementById('loadingIcon');
   img.style.display = '';
   //console.log("Show");

   $.ajax({
      url : 'server',
      data : {
         pma_param : 'open',
         pma_run_pack : 'yes'
      },
      success : function(response) {
         $('#model_pma_result').html(response);
      }
   });
}

function savePmaTuningArray()
{
   var elem = document.getElementsByClassName("tuningParamClass");
   var vTuningParamArray = "";
   for (var i = 0; i < elem.length; i++) {
      if (elem[i].value == "undefined") {
      	// ничего не делаем
		}
   	else if (elem[i].checked) {
         if (i == 0 || vTuningParamArray == "") {
            vTuningParamArray = elem[i].value;
         }
         else {
            vTuningParamArray = vTuningParamArray + ';' + elem[i].value;
         }
      }
   }
   //console.log(vTuningParamArray);

   elem = document.getElementsByName("pmaCodeId");
   var vpmaCodeIdArray;
   for (var i = 0; i < elem.length; i++) {
      if (i == 0 || vpmaCodeIdArray == "undefined") {
         vpmaCodeIdArray = elem[i].value;
      } else {
         vpmaCodeIdArray = vpmaCodeIdArray + ';' + elem[i].value;
      }
   }
   //console.log(vpmaCodeIdArray);

   $.ajax({
      url : 'server',
      data : {
         pma_param : 'open',
         tuningParamArray : vTuningParamArray,
         pmaCodeIdArray : vpmaCodeIdArray
      },
      success : function(response) {
         $('#model_pma_result').html(response);
      }
   });
}

function resetPmaTuningArray()   // All radio bars in pos. 2 (unchanged)
{
   var elem = document.getElementsByClassName("tuningParamClass");
   var vTuningParamArray = "";
   for (var i = 0; i < elem.length; i++) {
      if (elem[i].value == "undefined") {
         // ничего не делаем
      }
      else if (elem[i].checked) {
         if (i == 0 || vTuningParamArray == "") {
            vTuningParamArray = elem[i].value;
         }
         else {
            vTuningParamArray = vTuningParamArray + ';' + elem[i].value;
         }
      }
   }
   //console.log(vTuningParamArray);

   elem = document.getElementsByName("pmaCodeId");
   var vpmaCodeIdArray;
   for (var i = 0; i < elem.length; i++) {
      if (i == 0 || vpmaCodeIdArray == "undefined") {
         vpmaCodeIdArray = elem[i].value;
      } else {
         vpmaCodeIdArray = vpmaCodeIdArray + ';' + elem[i].value;
      }
   }
   //console.log(vpmaCodeIdArray);

   $.ajax({
      url : 'server',
      data : {
         pma_param : 'openReset',
         tuningParamArray : vTuningParamArray,
         pmaCodeIdArray : vpmaCodeIdArray
      },
      success : function(response) {
         $('#model_pma_result').html(response);
      }
   });
}

function savePmaTuningOne(tunParamGroupName, pmaCodeId)
{
   var elem = document.getElementsByName(tunParamGroupName);
   var vTuningParamArray = "";
   for (var i = 0; i < elem.length; i++) {
      if (elem[i].value == "undefined") {
         // ничего не делаем
      }
      else if (elem[i].checked) {
         vTuningParamArray = elem[i].value;
         /*if (i == 0 || vTuningParamArray == "") {
            vTuningParamArray = elem[i].value;
         }
         else {
            vTuningParamArray = vTuningParamArray + ';' + elem[i].value;
         }*/
      }
   }
   //console.log(vTuningParamArray + '-' + pmaCodeId);

   $.ajax({
      url : 'server',
      data : {
         pma_param : 'open',
         tuningParamArray : vTuningParamArray,
         pmaCodeIdArray : pmaCodeId
      },
      success : function(response) {
         $('#model_pma_result').html(response);
      }
   });
}


function openTabReportUBP()
{
    $.ajax({
        url : 'server',
        data : {
        	report_params : 'ubp'
        },
        success : function(response) {
        	$('#model_params_ubp').html(response);
        }
    });
}

function clearReportUBP(txt)
{
	var el = document.getElementById("report_ubp");
	if (el != null)
		el.innerHTML = txt;
}

function createReportUBP(yearParam) {
   changeStartTime();

   clearReportUBP('Report generation ...');
   var years = document.getElementById('select_ubp');
   getReportUBP(years.options[years.selectedIndex].text, yearParam);
   tab1.enabled = false;
   tab3.enabled = false;
   tab5.enabled = false;
}

// If we click first "calculate all"
function createReportUBP2(yearParam, fillAllParam, reporType) {
   console.log('##759 yearParam = ' + yearParam + ', fillAllParam = ' + fillAllParam + ', reporType = ' + reporType);
   if (fillAllParam === "") {
      createReportUBP(yearParam);
   } else {
      clearReportUBP('Report generation ...');
      var years = document.getElementById('select_ubp');
      //getReportUBP(years.options[years.selectedIndex].text, yearParam);
      tab1.enabled = false;
      tab3.enabled = false;
      tab5.enabled = false;
      // before receiving the report - check that it is formed, i.e. fillAllParam = null
      if (fillAllParam !== "") {

         // disable the button after the "Calculate All" command.
         if (yearParam == 'all' && fillAllParam == 'all' && reporType == 'ubp') {
            var elem = document.getElementsByName("clickCrRepUBP2");
            for (var i = 0; i < elem.length; i++) {
               if (elem[i].name == "clickCrRepUBP2") {
                  elem[i].disabled = true;
                  break;
               }
            }
         } else {
            console.log("The comparison did not work to disable the button.");
         }

         startFillRepProgress(years.options[years.selectedIndex].text, yearParam, reporType);
      } else {
         createReportUBP(yearParam);
      }
   }
}


function getReportUBP(prm)
{
    $.ajax({
        url : 'server',
        data : {
        	report : 'ubp',
        	year : prm
        },
        success : function(response) {
        	$('#report_ubp').html(response);
    	    tab1.enabled = true;
    	    tab3.enabled = true;
    	    tab5.enabled = true;
        }
    });
}

/*yearParam - one: in one year, all - in all years */
function getReportUBP(prm, yearParam) {
   $.ajax({
      url: 'server',
      data: {
         report: 'ubp',
         year: prm,
         yearParam: yearParam
      },
      success: function (response) {
         $('#report_ubp').html(response);
         tab1.enabled = true;
         tab3.enabled = true;
         tab5.enabled = true;
      }
   });
}


/**
 * Sending new parameters to the server tab1.enabled = true;
 */
function startFillRepProgress(yearDoc, yearParam, reporType) {
   tab1.enabled = false;
   tab2.enabled = false;
   tab3.enabled = false;
   tab4.enabled = false;
   tab5.enabled = false;
   console.log('##1153 yearDoc = ' + yearDoc + ', yearParam = ' + yearParam + ', reporType = ' + reporType);
   fillRepProgress(yearDoc, yearParam, reporType);
}

function fillRepProgress(yearDoc, yearParam, reporType) {
   changeStartTime();

   console.log('##1160 yearDoc = ' + yearDoc + ', yearParam = ' + yearParam + ', reporType = ' + reporType);
   $.ajax({
      url: 'server',
      data: {
         fillReport: 'yes',
         year: yearDoc,
         yearParam: yearParam,
         report: reporType
      },
      success: function(responseText) {
         //console.log("##1065");
         var response = responseText.split(';', 2);
         if (response.length == 1)
            $('#progress1').text(response[0] + "%");
         else
            $('#progress1').text(response[0] + "% - " + response[1]);
         var progress1 = parseInt(responseText);
         // console.log('##847 progress1 = ' + progress1 + ', responseText = ' + responseText);
         if (progress1 == 100 || progress1 > 100) {
            console.log('##1181');
            $('#progress1').text("");
            stopFillRepProgress(yearParam);
         } else {
            console.log('##1185');
            setTimeout(fillRepProgress(yearDoc, yearParam, reporType), 2000);
         }
      }
   });
}

function stopFillRepProgress(yearParam) {
   if (yearParam == 'all') {
      a = unhideUBP();
   }

   tab1.enabled = true;
   //tab2.enabled = false;
   tab3.enabled = true;
   tab4.enabled = true;
   tab5.enabled = true;
   createReportUBP(yearParam);
}

/**
 * Sending new parameters to the server tab1.enabled = true;
 */
function onAircraftClick(cb)
{
    var aircrafts = document.getElementsByName('aircraft');
	    
    for (var i = 0; i < aircrafts.length; i++) {
    	if (aircrafts[i].type == "checkbox") {
    		aircrafts[i].checked = cb.checked;
    	}
    }
}

function modelNext()
{
    $.ajax({
        url : 'server',
        data : {
        	models : 'next',
        },
        success : function(response) {
        	if (response.length > 0) {
        		$('#table_models').html(response);
        	    tab3.enabled = false;
        	    tab4.enabled = false;
        	    tab5.enabled = false;
        	    tab6.enabled = false;
             tab7.enabled = false;
             tab8.enabled = false;
         	}
        }
    });
}

function modelPrev()
{
    $.ajax({
        url : 'server',
        data : {
        	models : 'prev',
        },
        success : function(response) {
        	if (response.length > 0) {
        		$('#table_models').html(response);
        	    tab3.enabled = false;
        	    tab4.enabled = false;
        	    tab5.enabled = false;
        	    tab6.enabled = false;
             tab7.enabled = false;
             tab8.enabled = false;
         	}
        }
    });
}

function removeModel()
{
	var model_id = getModelId();
   changeStartTime();

	if (model_id == null)
		return;
	if (model_id < 0 )
      model_id = model_id * -1;
	
	result = confirm("Delete model с id = " + model_id + "?");
	if (!result)
		return;
	
    $.ajax({
        url : 'server',
        data : {
        	remove_model : model_id
        },
        success : function(response) {
        	if ((response.length > 0) && (response.indexOf("ERROR") == -1)) {
        		$('#table_models').html(response);
         	} else
         		alert (response);
        }
    });
	
}


function clickOnSet(val) {

   var years = document.getElementsByName('year');
   var aircrafts = document.getElementsByName('aircraft');
   var codes = document.getElementsByName('code');
   var events = document.getElementsByName('event');
   var incidents = document.getElementsByName('incident');
   var useSetChekboxes = document.getElementsByName('setCheckbox');
   var isSetMode = false;
   var setModeVal = '';
   for (var i = 0; i < useSetChekboxes.length; ++i) {
      if (useSetChekboxes[i].checked == true) {
         setChekboxes = true;
         setModeVal = useSetChekboxes[i].id;
      }
   }
   var setGroupElements = document.getElementsByName(setModeVal);
   var setVals = '';
   for (var i = 0; i < setGroupElements.length; ++i) {
      if (setGroupElements[i].checked) {
         setVals += setGroupElements[i].value + '=1;';
      }
      else {
         setVals += setGroupElements[i].value + '=0;';
      }
   }

   var year = "";
   var aircraft = "";
   var code = "";
   var event = "";
   var incident = "";

   for (var i = 0; i < years.length; i++) {
      if ((years[i].type == "radio") && years[i].checked) {
         year = years[i].value;
         break;
      }
   }
   for (var i = 0; i < aircrafts.length; i++) {
      if ((aircrafts[i].type == "radio") && aircrafts[i].checked) {
         aircraft = aircrafts[i].value;
         break;
      }
   }
   for (var i = 0; i < codes.length; i++) {
      if ((codes[i].type == "radio") && codes[i].checked) {
         code = codes[i].value;
         break;
      }
   }
   for (var i = 0; i < events.length; i++) {
      if ((events[i].type == "radio") && events[i].checked) {
         event = events[i].value;
         break;
      }
   }
   for (var i = 0; i < incidents.length; i++) {
      if ((incidents[i].type == "radio") && incidents[i].checked) {
         incident = incidents[i].value;
         break;
      }
   } // */


   //alert('clickOnSet val = ' + val);
	debugger;
	var checkboxes = document.getElementsByName('setCheckbox');

	var do_deactivate = false;
	for(var i = 0; i < checkboxes.length; ++i) {
		//alert('clickOnSet cur.id = ' + checkboxes[i].id + ' cur.checked = ' + checkboxes[i].checked);
		if(checkboxes[i].id != val) {
			checkboxes[i].checked = false;
		}
		else {
			//alert('clickOnSet ' + val + ' checked = ' + checkboxes[i].checked);
			if(checkboxes[i].checked == false) {
				do_deactivate = true;
			}
		}
	}
	if(!do_deactivate) {
		//loadModelParams(val);
      loadModelParams2(val, year, aircraft, code, incident, event);
	}
	else {
		//loadModelParams('false');
      loadModelParams2('false', year, aircraft, code, incident, event)
	}
}


/// For modal window:

// Opening, closing modal windows.
var myWindow;

function setLocation(curLoc) {
   try {
      myWindow.history.pushState(null, null, curLoc);
      return;
   } catch (e) {
      // console.log("###974 Error: " + e);
   }
   myWindow.location.hash = '#' + curLoc;
}

function openNewWind(addr) {
   var sel = document.getElementById("p_id1");
   var val1 = sel.options[sel.selectedIndex].value;
   sel = document.getElementById("p_id2");
   var val2 = sel.options[sel.selectedIndex].value;
   //alert(val1 + '-' + val2);
   myWindow = window.open('http://10.120.51.1:8180/reports/ClearRpt','myWindow', 'menubar=yes');
   setTimeout(function() {myWindow.location.href = addr + '&p_id1=' + val1 + '&p_id2=' + val2;
      //setLocation('http://10.120.51.1:8180/reports/?param=0');
   }, 2 * 1000);
   //setTimeout(function() {myWindow.location.href = addr + '&p_id1=' + val1 + '&p_id2=' + val2;}, 8 * 1000);
   //myWindow = window.open(addr + '&p_id1=' + val1 + '&p_id2=' + val2, 'myWindow', 'menubar=yes');
   return false;
}

function openNewWindUBP(addrClearRprt, addrRprt) {
   var sel = document.getElementById("p_id1");
   var val1 = sel.options[sel.selectedIndex].value;
   /*sel = document.getElementById("p_id2");
   var val2 = sel.options[sel.selectedIndex].value;*/
   //alert(val1 + '-' + val2);
   myWindow = window.open(addrClearRprt,'myWindow', 'menubar=yes');
   setTimeout(function() {myWindow.location.href = addrRprt + '&p_id2=' + val1;
      //setLocation('http://10.120.51.1:8180/reports/?param=0');
   }, 2 * 1000);
   //setTimeout(function() {myWindow.location.href = addr + '&p_id1=' + val1 + '&p_id2=' + val2;}, 8 * 1000);
   //myWindow = window.open(addr + '&p_id1=' + val1 + '&p_id2=' + val2, 'myWindow', 'menubar=yes');
   return false;
}

function myWindowClose() {
   if (myWindow) {
      myWindow.location.href = 'http://10.120.51.1:8180/reports/ClearRpt';  //
      setTimeout(function() {myWindow.close();}, 2 * 1000);
      setTimeout(function() {myWindow = null;}, 3 * 1000);
      //setLocation('http://10.120.51.1:8084/aviasoft-pawlin/?param=1');
      //setLocation('http://10.120.51.1:8180/reports/?param=1');
      //myWindow.close();
      //myWindow = null;
   }
}

addEventListener('click', function (e) {
   if (e.target.parentNode.tagName === 'DIV') {
      //var div = document.getElementById('modal_form');
      //console.log('Это мой блок');
      var str = e.target;
      var g = $(str).parents('div[id]').attr('id');
      var value = e.target.innerHTML;
      if (g !== 'myModal' || value == '✖') {
         //console.log('5: ' + g);
         myWindowClose();
      }
   } else {
      myWindowClose();
      //var str = e.target;
      //var g = $(str).parents('div[id]').attr('id');
      //console.log('1: ' + e.target.parentNode.tagName + ', 2: ' +  event.target.id + ', 3:' + e.target.parentNode.id + ', 4: ' + g + ', str: ' + str);
   }
});

// Hide / Unhide elements

function hideItem(idName) {
   document.getElementById(idName).style.display = 'none';
   //console.log('hideItem' + idName);
   return false;
}

function unhideItem(idName) {
   document.getElementById(idName).style.display = '';
   //console.log('unhideItem' + idName);
   return false;
}

function unhideUBP() {
   hideItem('ubpCalcAll');
   hideItem('ubpCalcAll2');
   unhideItem('ubpCrystalRep');
}

function hideUnhideDiv(divId) {
   if (document.getElementById(divId).style.display == 'none') {
      document.getElementById(divId).style.display = '';
   } else {
      document.getElementById(divId).style.display = 'none';
   }
}

// Now all that relates to the fact that to nullify the session.

var startTime = Date.now();

function getStartTime() {
   return startTime;
}


function startTimer(duration, display) {
   //var start = Date.now(),
   startTime = Date.now();
   var diff,
      minutes,
      seconds;
   function timer() {
      // get the number of seconds that have elapsed since
      // startTimer() was called
      diff = duration - (((Date.now() - getStartTime()) / 1000) | 0);

      // does the same job as parseInt truncates the float
      minutes = (diff / 60) | 0;
      seconds = (diff % 60) | 0;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;
      //просто варианты: display.textContent = diff;    //addEventListener("click", function() {            start = Date.now()        });

      if (diff <= 0) {
         // add one second so that the count down starts at the full duration
         // example 05:00 not 04:59
         //start = Date.now() + 1000;
         startTime = Date.now();
         //console.log('1');

         $.ajax({
            url : 'server',
            data : {
               reload : 'yes'
            },
            success : function(response) {
               if (response.length > 0) {
                  tab2.enabled = false;
                  tab3.enabled = false;
                  tab4.enabled = false;
                  tab5.enabled = false;
                  tab6.enabled = false;
                  tab7.enabled = false;
                  tab8.enabled = false;
                  tab1.enabled = true;

                  tab1.modelId = null;
                  resetCheckedId();
                  onTabClick("btn1");
                  alert("Your session has expired");
               }
            }
         });
         //console.log('2');
      }
   };
   // we don't want to wait a full second before the timer starts
   timer();
   setInterval(timer, 1000);
}


function changeStartTime() {
   startTime = Date.now();
}


function reStartTimer() {
   var SessionTimeOut = 60 * 29,
       display = document.querySelector('#displayInfo');
   startTimer(SessionTimeOut, display);
};

