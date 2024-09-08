
// scrollbar function for adding the scrollbar in table dynamically 
function scrollbar() {
    let dataTable = document.querySelector("#dataTable");
    let checkingForScroll = dataTable.scrollWidth > dataTable.clientWidth || dataTable.scrollHeight > dataTable.clientHeight;
    if (checkingForScroll) {
        dataTable.style.overflow = "auto";
    } else {
        dataTable.style.overflow = "hidden";
    }
}

window.onload = function () {
    scrollbar();
    localStorageRetrieve(); // Retrieve and display existing data on page load
};

window.onresize = function () {
    scrollbar();
};



// listening the event on button click
let addBtn = document.getElementById('addBtn');
addBtn.addEventListener("click", function (event) {
    event.preventDefault();

    // Extracting the values
    let name = document.getElementById("name").value;
    let className = document.getElementById("class").value;
    let id = parseInt(document.getElementById("idNum").value); // Parse as integer
    let mobileNumber = document.getElementById("mobileNum").value;
    let email = document.getElementById("emailId").value;

    // Validation
    if (name === '' || containsNumber(name) || isNaN(id) || className === '' || mobileNumber === '' || !isValidMobile(mobileNumber) || !isValidEmail(email)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Check for unique ID within the same class
    let allRows = document.querySelectorAll("#tBody tr");
    if (allRows.length > 0) {
        for (let i = 0; i < allRows.length; i++) {
            let rowId = parseInt(allRows[i].querySelector("td:nth-child(3)").textContent);
            let rowClass = allRows[i].querySelector("td:nth-child(2)").textContent;

            if (rowId === id && rowClass === className) {
                alert("ID must be unique within the same Class.");
                return;
            }
        }
    }

    // Creating the tr and tds
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");
    let tdDiv = document.createElement("div");
    tdDiv.style.display = "flex";
    tdDiv.innerHTML = `<i class="fa-solid fa-trash trashbtn"></i> <i class="fa-solid fa-pen-to-square editbtn"></i>`;

    // Adding values to td
    td1.textContent = name;
    td2.textContent = className;
    td3.textContent = id;
    td4.textContent = mobileNumber;
    td5.textContent = email;
    td6.appendChild(tdDiv);

    // Name & Class Name first letter capitalize
    td1.style.textTransform = "capitalize";
    td2.style.textTransform = "capitalize";

    // Appending the td children to the tr
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    // Appending the new row to tbody
    let tBody = document.getElementById("tBody");
    tBody.appendChild(tr);

    // Clearing input fields
    document.getElementById("name").value = "";
    document.getElementById("class").value = "";
    document.getElementById("idNum").value = "";
    document.getElementById("mobileNum").value = "";
    document.getElementById("emailId").value = "";

    // Update scrollbar
    scrollbar();

    // Trash item
    tdDiv.querySelector('.trashbtn').addEventListener("click", function () {
        tr.remove();
        updateLocalStorage(); // Update local storage after removal
        scrollbar(); // Update scrollbar after removal
    });

    // Edit item
    tdDiv.querySelector('.editbtn').addEventListener("click", function () {
        if (confirm("Do you want to edit your Details?")) {
            // Prefill form with existing data for editing
            document.getElementById("name").value = name;
            document.getElementById("class").value = className;
            document.getElementById("idNum").value = id;
            document.getElementById("mobileNum").value = mobileNumber;
            document.getElementById("emailId").value = email;

            tr.remove();
            updateLocalStorage();
            scrollbar();
        } else {
            return; // Cancel editing if user cancels the confirmation
        }
    });

    // Update local storage after adding a new student record
    updateLocalStorage();
});

// Helper functions for validation

function isValidMobile(number) {
    // Basic check for 10-digit number
    return /^\d{10}$/.test(number);
}

function isValidEmail(email) {
    // Simple check for email format
    return /\S+@\S+\.\S+/.test(email);
}

function containsNumber(str) {
    // Check if string contains any digit
    return /\d/.test(str);
}


// updateLocalStorage function Creating to take data from table
function updateLocalStorage() {
    let studentsData = [];
    let allRows = document.querySelectorAll("#tBody tr");

    allRows.forEach(row => {
        let student = {
            name: row.children[0].textContent,
            class: row.children[1].textContent,
            id: parseInt(row.children[2].textContent),
            mobile: row.children[3].textContent,
            email: row.children[4].textContent
        };
        studentsData.push(student);
    });

    localStorage.setItem("students", JSON.stringify(studentsData));
}


// local storage data retriving
function localStorageRetrieve() {
    let students = localStorage.getItem("students");
    students = JSON.parse(students);
    if (students !== null) {
        let tBody = document.getElementById('tBody');

        students.forEach(student => {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");
            let td5 = document.createElement("td");
            let td6 = document.createElement("td");
            let tdDiv = document.createElement("div");
            tdDiv.style.display = "flex";
            tdDiv.innerHTML = `<i class="fa-solid fa-trash trashbtn"></i> <i class="fa-solid fa-pen-to-square editbtn"></i>`;

            // Creating tds for tr
            td1.textContent = student.name;
            td2.textContent = student.class;
            td3.textContent = student.id;
            td4.textContent = student.mobile;
            td5.textContent = student.email;
            td6.appendChild(tdDiv);

            // Name & Class Name first letter capitalize
            td1.style.textTransform = "capitalize";
            td2.style.textTransform = "capitalize";

            // Appending the td children to the tr
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);

            // Appending the new row to tbody
            tBody.appendChild(tr);

            // Update scrollbar
            scrollbar();

            // Trash item
            tdDiv.querySelector('.trashbtn').addEventListener("click", function () {
                tr.remove();
                updateLocalStorage(); // Update local storage after removal
                scrollbar(); // Update scrollbar after removal
            });

            // Edit item
            tdDiv.querySelector('.editbtn').addEventListener("click", function () {
                if (confirm("Do you want to edit your Details?")) {
                    // Prefill form with existing data for editing
                    document.getElementById("name").value = student.name;
                    document.getElementById("class").value = student.class;
                    document.getElementById("idNum").value = student.id;
                    document.getElementById("mobileNum").value = student.mobile;
                    document.getElementById("emailId").value = student.email;

                    tr.remove();
                    updateLocalStorage();
                    scrollbar();
                } else {
                    return; // Cancel editing if user cancels the confirmation
                }
            });
        });
    }
}
