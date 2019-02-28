    function selectBox(boxId) {
        // Go through all the rows and delete the class "selected_row"
        var table = document.getElementById("box_table");
        for (var i = 0; i < table.rows.length; i++) {
            table.rows[i].classList.remove("selected_row");
        }
        // In our line, add the same class.
        var element = document.getElementById(boxId);
        element.classList.add("selected_row");

        reLoadGraph();
    }

    function findBoxId() {
        var myrows = document.getElementsByClassName("selected_row");
        for (var i = 0; i < myrows.length; i++) {
            var box_id = myrows[i].id;
            break;
        }
        return box_id;
    }

    function setBoxName() {
        var box_id = findBoxId();
        var table002 = document.getElementById(box_id),
            cells = table002.getElementsByTagName('td');
        var box_name = cells[0].innerHTML;
        document.getElementById("box_name_id").innerHTML = box_name;
    }

    function showBoxId() {
        console.log(findBoxId());
    }

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }

    function loadGraph1(p_respose) {
        
        

        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var DAY_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday ', 'Thursday', 'Friday', 'Saturday'];
        var DAY_OF_MONTHS = [0,1,2,3,4,5,6,7,8,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,28,29,30];
        var HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        var QUARTER = [1, 2, 3, 4];
        var YEARS = [2017, 2018, 2019];
        
        sel = document.getElementById("GroupByType");
        var v_GroupByType = sel.options[sel.selectedIndex].value;
        var GRAPH_LABALES = [];
        var GRAPH_SET1 = [];
        var GRAPH_SET2 = [];

        if (v_GroupByType == "w") {
            GRAPH_LABALES = DAY_OF_WEEK;
            for (i = 0; i < 7; i++) {
                GRAPH_SET1[i] = randomInteger(960, 2000);
                GRAPH_SET2[i] = randomInteger(0, 960);
            }
        } else if (v_GroupByType == "H") {
            GRAPH_LABALES = HOURS;
            for (i = 0; i < 24; i++) {
                GRAPH_SET1[i] = randomInteger(10, 20);
                GRAPH_SET2[i] = randomInteger(0, 10);
            }
        } else if (v_GroupByType == "d") {
            GRAPH_LABALES = DAY_OF_MONTHS;
            for (i = 0; i < 30; i++) {
                GRAPH_SET1[i] = randomInteger(240, 480);
                GRAPH_SET2[i] = randomInteger(0, 240);
            }
        } else if (v_GroupByType == "m") {
            GRAPH_LABALES = MONTHS;
            for (i = 0; i < 12; i++) {
                GRAPH_SET1[i] = randomInteger(4000, 8000);
                GRAPH_SET2[i] = randomInteger(0, 4000);
            }
        } else if (v_GroupByType == "quarter") {
            GRAPH_LABALES = QUARTER;
            for (i = 0; i < 4; i++) {
                GRAPH_SET1[i] = randomInteger(12000, 24000);
                GRAPH_SET2[i] = randomInteger(0, 12000);
            }
        } else if (v_GroupByType == "Y") {
            GRAPH_LABALES = YEARS;
            for (i = 0; i < 4; i++) {
                GRAPH_SET1[i] = randomInteger(36000, 75000);
                GRAPH_SET2[i] = randomInteger(0, 36000);
            }
        } else {
            GRAPH_SET1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            GRAPH_SET2 = [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            GRAPH_LABALES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        }


        var config1 = {
            type: 'line',
            data: {
                labels: GRAPH_LABALES,
                datasets: [{
                    label: 'Total',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: GRAPH_SET1,
                    fill: false,
                }, {
                    label: 'Unique',
                    backgroundColor: window.chartColors.blue,
                    borderColor: window.chartColors.blue,
                    data: GRAPH_SET2,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Number of visitors'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Visitors'
                        }
                    }]
                }
            }
        };

        if (window.myLine != null) {
            window.myLine.destroy();
        }

        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config1);
    }

    function loadGraph2(p_respose) {
        var GRAPH2_SET1 = [];
        for (i = 0; i < 5; i++) {
            GRAPH2_SET1[i] = randomInteger(5, 25);
        }

        var config2 = {
            type: 'pie',
            data: {
                datasets: [{
                    data: GRAPH2_SET1,
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.orange,
                        window.chartColors.yellow,
                        window.chartColors.green,
                        window.chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],
                labels: ['<20', '20-30', '30-40', '40-50', '>50']
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Age chart'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        if (window.myDoughnut2 != null) {
            window.myDoughnut2.destroy();
        }

        var ctx2 = document.getElementById('chart-area2').getContext('2d');
        window.myDoughnut2 = new Chart(ctx2, config2);

    }

    function loadGraph3(p_respose) {
        var GRAPH3_SET1 = [];
        for (i = 0; i < 2; i++) {
            GRAPH3_SET1[i] = randomInteger(5, 50);;
        }

        var config3 = {
            type: 'pie',
            data: {
                datasets: [{
                    data: GRAPH3_SET1,
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'Female',
                    'Man'
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart by gender'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        if (window.myDoughnut3 != null) {
            window.myDoughnut3.destroy();
        }

        var ctx3 = document.getElementById('chart-area3').getContext('2d');
        window.myDoughnut3 = new Chart(ctx3, config3);

    }

    function reLoadGraph() {

        setBoxName();

        var v_dateStart = document.getElementById('dateStart').value;   // dont need it now
        var v_dateEnd = document.getElementById('dateEnd').value;       // dont need it now

        var sel = document.getElementById("boxId");
        var v_boxId = findBoxId();

        sel = document.getElementById("GroupByType");
        var v_GroupByType = sel.options[sel.selectedIndex].value;
        
        var response = "";

//        response = [10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33];
        loadGraph1(response);
        
//        response = [22;23;55;12;5];
        loadGraph2(response);
        
//        response = [2;22];
        loadGraph3(response);

    }

    window.onload = function () {
        setBoxName();

        loadGraph1("");
        loadGraph2("");
        loadGraph3("");
    };