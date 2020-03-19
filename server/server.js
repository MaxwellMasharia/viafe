const searchInput = document.querySelector(".search_bar_input");
const btnAddFiles = document.querySelector(".add_files_button");
const fileList = document.querySelector(".file_list");
const hiddenFileInput = document.querySelector("#file_input");
const fileDropZone = document.querySelector(".file_drop_zone");
const alertSection = document.querySelector(".section_alert");
const sectionSelect = document.querySelector(".section_select");
const fileArray = [];

btnAddFiles.addEventListener("click", function() {
  hiddenFileInput.click();

  hiddenFileInput.onchange = function(e) {
    uploadFiles(hiddenFileInput.files);
  };
});
fileDropZone.addEventListener("dragover", e => {
  e.preventDefault();
});
fileDropZone.addEventListener("drop", e => {
  e.preventDefault();
  uploadFiles(e.dataTransfer.files);
});

function uploadFiles(chosenFileList) {
  // Send data to Server
  sendFileDataToSever(chosenFileList);

  showAlert(`You have added ${chosenFileList.length} file(s)`);
  const start = fileArray.length;
  for (let number = 0; number < chosenFileList.length; number++) {
    addFileToDom(chosenFileList[number], start + number + 1);
  }
}

function showAlert(message) {
  alertSection.classList.remove("hidden");
  alertSection.querySelector("div span").innerText = message;
  setTimeout(() => {
    alertSection.classList.add("hidden");
  }, 1800);
}

function addFileToDom(file, number) {
  fileArray.push(file);

  const newFDR = document.createElement("li");
  const newFDR_File_Number = document.createElement("div");
  const newFDR_File_Name = document.createElement("div");
  const newFDR_File_Length = document.createElement("div");
  const newFDR_File_Type = document.createElement("div");

  newFDR.setAttribute("class", "fdr");
  newFDR_File_Number.setAttribute("class", "fdr_file_number");
  newFDR_File_Name.setAttribute("class", "fdr_file_name");
  newFDR_File_Name.classList.add("fdr_file_name_body");
  newFDR_File_Length.setAttribute("class", "fdr_file_length");
  newFDR_File_Type.setAttribute("class", "fdr_file_type");

  const fileName = file.name;
  const fileSize = `${file.size.toFixed(2)} KB`;
  const fileType = getFileType(fileName);

  newFDR_File_Number.innerText = number;
  newFDR_File_Name.innerText = fileName;
  newFDR_File_Length.innerText = fileSize;
  newFDR_File_Type.innerText = fileType;

  newFDR.appendChild(newFDR_File_Number);
  newFDR.appendChild(newFDR_File_Name);
  newFDR.appendChild(newFDR_File_Length);
  newFDR.appendChild(newFDR_File_Type);

  fileList.appendChild(newFDR);

  newFDR_File_Name.addEventListener("click", selectFile);
}

function getFileType(fileName) {
  if (
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".png") ||
    fileName.endsWith(".webp")
  ) {
    return "image";
  } else if (fileName.endsWith(".mp4") || fileName.endsWith(".mkv")) {
    return "video";
  } else if (fileName.endsWith(".pdf")) {
    return "pdf";
  } else return "unknown";
}
searchInput.addEventListener("keyup", filterFiles);

function filterFiles() {
  const fdrFileNames = document.querySelectorAll(".fdr_file_name");
  for (let i = 0; i < fdrFileNames.length; i++) {
    if (i == 0) {
      continue;
    }
    const innerText = fdrFileNames[i].innerText.toUpperCase();
    const searchText = this.value.toUpperCase();
    if (innerText.indexOf(searchText) == -1) {
      fdrFileNames[i].parentElement.style.display = "none";
      fdrFileNames[i].parentElement.classList.add("removed");
    } else {
      if (fdrFileNames[i].parentElement.className.indexOf("deleted") == -1) {
        fdrFileNames[i].parentElement.style.display = "";
        fdrFileNames[i].parentElement.classList.remove("removed");
      }
    }
  }
}

const selectAllButton = document.getElementById("btn_select_all");
const selectNoneButton = document.getElementById("btn_select_none");
const removeSelected = document.getElementById("btn_remove_selected");

function selectFile() {
  this.parentElement.classList.toggle("selected");
  // check the number of elements that are selected
  if (document.querySelectorAll(".selected").length > 0) {
    sectionSelect.classList.remove("hidden");
  } else {
    sectionSelect.classList.add("hidden");
  }

  selectAllButton.addEventListener("click", function() {
    for (let i = 0; i < fileList.querySelectorAll("li").length; i++) {
      if (i == 0) {
        continue;
      }
      fileList.querySelectorAll("li")[i].classList.add("selected");
    }
  });
  selectNoneButton.addEventListener("click", function() {
    for (let i = 0; i < fileList.querySelectorAll("li").length; i++) {
      if (i == 0) {
        continue;
      }
      fileList.querySelectorAll("li")[i].classList.remove("selected");
    }
  });
  removeSelected.addEventListener("click", function() {
    const fdrList = fileList.querySelectorAll("li");
    let count = 0;
    for (let i = 0; i < fdrList.length; i++) {
      if (i == 0) {
        continue;
      }
      if (fdrList[i].className.indexOf("selected") == -1) {
        continue;
      } else {
        fdrList[i].style.display = "none";
        fdrList[i].classList.add("deleted");
        fdrList[i].classList.remove("selected");
        count = count + 1;
      }
    }
    showAlert(`You have removed ${count} file(s)`);
  });
}

// const eventSource = new EventSource("http://127.0.0.1:4040/events");

function sendFileDataToSever(fileList) {
  const xhr = new XMLHttpRequest();
  let message = "";
  for (file of fileList) {
    message += `FileName : ${file.name}\nFileSize : ${file.size}\nFileType : ${getFileType(file.name)}\n\n`;
  }
  xhr.open("POST", "/file_data");
  xhr.setRequestHeader("FileData", "Add");
  xhr.send(message);
}

function sendSendUpdateToServer(fileNames) {
  const xhr = new XMLHttpRequest();
  const message = "";
  for (msg of fileNames) {
    message += `${msg}\n`;
  }
  message += "\n";
  xhr.open("POST", "/file_data");
  xhr.setRequestHeader("FileData", "Remove");
}

let array = [];
