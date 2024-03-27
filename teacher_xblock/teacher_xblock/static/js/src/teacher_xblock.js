var totalPages;
var pageNumber = 0;
var studentList;
var suspecionList
const tableData = document.getElementById(
  "attendances_student_table__body_tableData"
);

// const searchImg = document.getElementById("search_img");
const popup = document.querySelector(".container_gallery");
// const table_headings = document.querySelectorAll("thead th");
// const table_rows = document.querySelectorAll("tbody tr");



function renderTable() {
  const searchInput = document.getElementById("search_input");
  fetch(
    "https://aiserver.daotao.ai/api/teachers/get_student_list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify({
      offset: 0,
      limit: 100,
      class_id: searchInput.value.toUpperCase(),
    }),
  }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      if(result.data.length==0){
        window.alert("Class not found");
        return;
      }
      studentList = result.data
      console.log(result.data)
      totalPages = result.length / 5;
      tableData.innerHTML = "";
      result.data.forEach((item, index) => {
        var timestamp = item.created_at;
        var dateObj = new Date(timestamp);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString();
        const suspecionCount = item.evidences.length;
        var status = "";
        if (item.status == false) {
          status = "pending"
        }
        if (item.status == true) {
          status = "approved"
        }

        tableData.innerHTML += `<tr class="${item.student_id}">
          <td style="disabled:true;">${index + pageNumber * 5 + 1}</td>
          <td> ${item.student_id} </td>
          <td>
              <p class="status 
              )}">${(status)}</p>
          </td>
          <td>
            ${(date)} ${(time)}
          </td>
          <td>
          <img src="${item.portrait}" width="300" height="400"></img>
          <td>
            ${suspecionCount}
          </td>
        </td>

        </tr> 
        `;
      });

      const rows = document.querySelectorAll(
        "#attendances_student_table__body_tableData tr"
      );
      // Add function for each row in Main Table
      rows.forEach(function (row) {
        row.addEventListener("click", function () {
          showInforStudent(row.getAttribute("class"));

        });
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

//function to Show infor Student each row
function showInforStudent(student_id) {
  const selectedStudent = studentList.find(data => data.student_id == student_id);
  if(selectedStudent.evidences.length==0) {
    window.alert("Student has no suspecion");
    return
  };
  suspecionList = selectedStudent.evidences;
  console.log(selectedStudent.evidences[0].photo);
  document.querySelector(
    "#control_attendance_table .container_gallery"
  ).innerHTML = ` <div class="grab_lecture_view">
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
              <img src="${selectedStudent.evidences[0].photo}" loop controls id="main-video" ></img>            
              </div>
          </div>
          
       </div>
       <div class="warnning-list-container">
          <div class="warnning-list-title" > 
             <h2>Warnning List</h2>
          </div>
          <div class="warnning-list-detail">    
              
          </div>
          
       </div>
    </div>
 </div>`;
  let detailList = document.querySelector(
    ".warnning-list-container .warnning-list-detail "
  );
  suspecionList.forEach((item, index) => {
    var timestamp = item.created_at;
    var dateObj = new Date(timestamp);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    detailList.innerHTML += `<div class="list" onclick="handleListClick(${index})"> 
      <img src="${item.photo}" width="100" height="56"></img> 
      <div class="element">
         <div>
            <h3 class="timestamp">${date} - ${time}</h3>
            <h3 class="list-title">${item.status_name}</h3>
         </div>
         <div>
            <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
         </div>
         
      </div>
      
   </div>`;

  });
  popup.style.display = "block";
}

function closeDetail() {
  popup.style.display = "none";
}

function handleListClick(index) {
  const photo=document.getElementById('main-video')
  photo.setAttribute('src',suspecionList[index].photo)
}

