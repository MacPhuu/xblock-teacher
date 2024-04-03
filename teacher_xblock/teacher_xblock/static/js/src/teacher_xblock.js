function MyXBlock(runtime, element) {
 
}

var totalPages;
var pageNumber = 0;
var studentList;
var suspecionList;

function renderTable() {
  var searchInput = $("#search_input").val().toUpperCase();
  $.ajax({
    url: "https://aiserver.daotao.ai/api/teachers/get_student_list",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
    },
    data: JSON.stringify({
      offset: 0,
      limit: 100,
      class_id: searchInput
    }),
    success: function (result) {
      if ($(result.data) == null) {
        window.alert("Class not found");
        return;
      }
      studentList = result.data;
      console.log(result.data);
      totalPages = studentList.length / 5;
      $("#attendances_student_table__body_tableData").empty();
      $.each(result.data, function (index, item) {
        var timestamp = item.created_at;
        var dateObj = new Date(timestamp);
        var date = dateObj.toLocaleDateString();
        var time = dateObj.toLocaleTimeString();
        var suspecionCount = item.evidences.length;
        var status = "";
        if (item.status == false) {
          status = "pending";
        }
        if (item.status == true) {
          status = "approved";
        }

        $("#attendances_student_table__body_tableData").append(`<tr class="${item.student_id}">
          <td style="disabled:true;">${index + pageNumber * 5 + 1}</td>
          <td>${item.student_id}</td>
          <td>
            <p class="status">${status}</p>
          </td>
          <td>
            ${date} ${time}
          </td>
          <td>
            <img src="${item.portrait}" width="300" height="400" />
          </td>
          <td>
            ${suspecionCount}
          </td>
        </tr>`);
      });

      $("#attendances_student_table__body_tableData").on("click", "tr", function () {
        showInforStudent($(this).attr("class"));
      });
    },
    error: function (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  });
}

function showInforStudent(student_id) {
  var selectedStudent = studentList.find(data => data.student_id == student_id);
  if ($(selectedStudent.evidences) == null) {
    window.alert("Student has no suspicion");
    return;
  }
  suspecionList = selectedStudent.evidences;
  console.log(selectedStudent.evidences[0].photo);
  $(".container_gallery").append(`
    <div class="grab_lecture_view">
      <div class="grab_lecture_view_container">
        <button class="close-detail-btn" onclick="closeDetail()">
          <span class="material-symbols-outlined">
            close
          </span>
        </button>
        <div class="grab_lecture_view_container_part1">
          <div class="main-video-container">
            <div class="student-name">
              <h3>Student ID: ${selectedStudent.student_id}</h3>
            </div>
            <div style="height:100%;">
              <img src="${selectedStudent.evidences[0].photo}" loop controls id="main-video" />
            </div>
          </div>
        </div>
        <div class="warnning-list-container">
          <div class="warnning-list-title">
            <h2>Warning List</h2>
          </div>
          <div class="warnning-list-detail"></div>
        </div>
      </div>
    </div>`);

  var detailList = $(".warnning-list-container .warnning-list-detail");
  $.each(suspecionList, function (index, item) {
    var timestamp = item.created_at;
    var dateObj = new Date(timestamp);
    var date = dateObj.toLocaleDateString();
    var time = dateObj.toLocaleTimeString();
    detailList.append(`
      <div class="list" onclick="handleListClick(${index})">
        <img src="${item.photo}" width="100" height="56" />
        <div class="element">
          <div>
            <h3 class="timestamp">${date} - ${time}</h3>
            <h3 class="list-title">${item.status_name}</h3>
          </div>
          <div>
            <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
      </div>`);
  });

  $(".container_gallery").css("display", "block");
}

function closeDetail() {
  $(".container_gallery").css("display", "none");
}

function handleListClick(index) {
  $("#main-video").attr("src", suspecionList[index].photo);
}
