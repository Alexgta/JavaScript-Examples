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

    function loadGraph1(p_respose) {

        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var DAY_OF_WEEK = ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Суб'];
        sel = document.getElementById("GroupByType");
        var v_GroupByType = sel.options[sel.selectedIndex].value;
        var GRAPH_LABALES = [];
        var GRAPH_SET1 = [];
        var GRAPH_SET2 = [];

        if (p_respose == "") {
            GRAPH_SET1 = {{ v_graph1_set1 }};
            GRAPH_SET2 = {{ v_graph1_set2 }};

            if (v_GroupByType == "w") {
                var GRAPH_LABALES_INDX = {{ v_graph1_labels }};
                var v_length = GRAPH_LABALES_INDX.length;
                for (i = 0; i < v_length; i++) {
                    GRAPH_LABALES[i] = DAY_OF_WEEK[GRAPH_LABALES_INDX[i]];
                }
            } else {
                GRAPH_LABALES = {{ v_graph1_labels }};
            }
        } else {
            var RESPONSE = p_respose.split(';');
            var v_length = RESPONSE.length / 3;
            if (v_GroupByType == "w") {
                var GRAPH_LABALES_INDX = GRAPH_LABALES = RESPONSE.slice(0, v_length);
                var v_length = GRAPH_LABALES_INDX.length;
                for (i = 0; i < v_length; i++) {
                    GRAPH_LABALES[i] = DAY_OF_WEEK[GRAPH_LABALES_INDX[i]];
                }
            } else {
                GRAPH_LABALES = RESPONSE.slice(0, v_length);
            }
            GRAPH_SET1 = RESPONSE.slice(v_length * 1, v_length * 2);
            GRAPH_SET2 = RESPONSE.slice(v_length * 2, v_length * 3);
        }


        var config1 = {
            type: 'line',
            data: {
                labels: GRAPH_LABALES,
                datasets: [{
                    label: 'Всего',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: GRAPH_SET1,
                    fill: false,
                }, {
                    label: 'Уникальных',
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
                    text: 'Колличество посетителей'
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
                            labelString: 'Время'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Посетителей'
                        }
                    }]
                }
            }
        };

        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config1);
    }

    function loadGraph2(p_respose) {
        GRAPH2_SET1 = [];

        if (p_respose == "") {
            console.log("Graph2, First IF");
            GRAPH2_SET1 = {{ v_graph2_set1 }};
        } else {
            var RESPONSE = p_respose.split(';');
            GRAPH2_SET1 = RESPONSE;
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
                    text: 'Диаграмма по возрасту (%)'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        var ctx2 = document.getElementById('chart-area2').getContext('2d');
        window.myDoughnut2 = new Chart(ctx2, config2);
    }

    function loadGraph3(p_respose) {
        GRAPH3_SET1 = [];

        if (p_respose == "") {
            console.log("Graph3, First IF");
            GRAPH3_SET1 = {{ v_graph3_set1 }};
        } else {
            var RESPONSE = p_respose.split(';');
            GRAPH3_SET1 = RESPONSE;
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
                    'Женщин',
                    'Мужчин'
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Диаграмма по полу (%)'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        var ctx3 = document.getElementById('chart-area3').getContext('2d');
        window.myDoughnut3 = new Chart(ctx3, config3);

    }

    function reLoadGraph() {
        setBoxName();
        var v_dateStart = document.getElementById('dateStart').value;
        var v_dateEnd = document.getElementById('dateEnd').value;
        var sel = document.getElementById("boxId");
        var v_boxId = findBoxId();
        sel = document.getElementById("GroupByType");
        var v_GroupByType = sel.options[sel.selectedIndex].value;

        $.ajax({
            url: 'graph1',
            data: {
                boxId: v_boxId,
                dateStart: v_dateStart,
                dateEnd: v_dateEnd,
                GroupByType: v_GroupByType
            },
            success: function (response) {
                if (response.length > 2) {
                    if (window.myLine != null) {
                        window.myLine.destroy();
                    }
                    loadGraph1(response);
                } else {
                    if (window.myLine != null) {
                        window.myLine.destroy();
                    }
                    loadGraph1("0;0;0");
                }
            }
        });

        $.ajax({
            url: 'graph2',
            data: {
                boxId: v_boxId,
                dateStart: v_dateStart,
                dateEnd: v_dateEnd,
                GroupByType: v_GroupByType
            },
            success: function (response) {
                if (response.length < 3) {
                    response = "0;0;0;0;0";
                }
                if (window.myDoughnut2 != null) {
                    window.myDoughnut2.destroy();
                }
                loadGraph2(response);
            }
        });


        $.ajax({
            url: 'graph3',
            data: {
                boxId: v_boxId,
                dateStart: v_dateStart,
                dateEnd: v_dateEnd,
                GroupByType: v_GroupByType
            },
            success: function (response) {
                if (response.length < 3) {
                    response = "0;0";
                }
                if (window.myDoughnut3 != null) {
                    window.myDoughnut3.destroy();
                }
                loadGraph3(response);
            }
        });

        window.myDoughnut = new Chart(ctx2, config2);
        var ctx3 = document.getElementById('chart-area3').getContext('2d');
        window.myDoughnut = new Chart(ctx3, config3);
    }

    window.onload = function () {
        setBoxName();

        loadGraph1("");
        loadGraph2("");
        loadGraph3("");
    };