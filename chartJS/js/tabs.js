function selectBox(boxId) {
    // Пройдем по всем строкам и удалим сласс "selected_row"
    var table = document.getElementById("box_table");
    for (var i = 0; i < table.rows.length; i++) {
        table.rows[i].classList.remove("selected_row");
    }
    // У нашей строки добавим этот же класс.
    var element = document.getElementById(boxId);
    element.classList.add("selected_row");
}

function findBoxId() {
    var myrows = document.getElementsByClassName("selected_row");
    for (var i = 0; i < myrows.length; i++) {
        var box_id = myrows[i].id;
        break;
    }
    return box_id;
}

function showBoxId() {
    console.log(findBoxId());
}