// Visitor data
var visitors = [];


/* NAVIGATION */

function showSection(sectionName, button) {

    var sections = document.getElementsByClassName("section");

    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove("active");
    }

    document.getElementById(sectionName).classList.add("active");


    var buttons = document.getElementsByClassName("menu-btn");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    if (button != null) {
        button.classList.add("active");
    }
    else {

        for (var i = 0; i < buttons.length; i++) {

            if (buttons[i].getAttribute("onclick").includes(sectionName)) {
                buttons[i].classList.add("active");
            }

        }

    }


    // Change heading according to selected section

    if (sectionName == "home") {
        document.getElementById("page-title").innerHTML = "Home";
        document.getElementById("page-description").innerHTML =
            "Welcome to your visitor management portal";
    }

    else if (sectionName == "dashboard") {
        document.getElementById("page-title").innerHTML = "Dashboard";
        document.getElementById("page-description").innerHTML =
            "Overview of hostel visitor activity";
    }

    else if (sectionName == "register") {
        document.getElementById("page-title").innerHTML = "Register Visitor";
        document.getElementById("page-description").innerHTML =
            "Add a new visitor to the system";
    }

    else if (sectionName == "records") {
        document.getElementById("page-title").innerHTML = "Visitor Records";
        document.getElementById("page-description").innerHTML =
            "Search and manage visitor information";
    }

}



/* REGISTER VISITOR */

function registerVisitor(event) {

    event.preventDefault();


    var name = document.getElementById("visitorName").value;
    var contact = document.getElementById("visitorContact").value;
    var email = document.getElementById("visitorEmail").value;
    var purpose = document.getElementById("visitorPurpose").value;
    var person = document.getElementById("personToMeet").value;
    var room = document.getElementById("roomNumber").value;
    var notes = document.getElementById("visitorNotes").value;


    // Check contact number

    if (contact.length != 10 || isNaN(contact)) {
        alert("Please enter a valid 10-digit contact number.");
        return;
    }


    // Get current date and time

    var currentDate = new Date();

    var date = currentDate.toLocaleDateString();

    var time = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });


    // Create visitor object

    var visitor = {

        name: name,
        contact: contact,
        email: email,
        purpose: purpose,
        person: person,
        room: room,
        notes: notes,

        date: date,
        timeIn: time,
        timeOut: "-",

        day: currentDate.toDateString(),

        status: "Inside"

    };


    // Add visitor to array

    visitors.push(visitor);


    alert("Visitor registered successfully!");


    // Clear form

    document.getElementById("visitorForm").reset();


    // Update website

    updateDashboard();
    displayVisitors();


    // Open visitor records

    showSection("records", null);

}



/* DISPLAY VISITORS */

function displayVisitors() {

    var table = document.getElementById("visitorTable");

    var search = document.getElementById("searchVisitor").value.toLowerCase();

    var purposeFilter = document.getElementById("purposeFilter").value;

    var statusFilter = document.getElementById("statusFilter").value;


    table.innerHTML = "";


    var count = 0;


    for (var i = visitors.length - 1; i >= 0; i--) {

        var visitor = visitors[i];


        // Search by name or contact

        var searchMatch =
            visitor.name.toLowerCase().includes(search) ||
            visitor.contact.includes(search);


        // Check filters

        var purposeMatch = true;
        var statusMatch = true;


        if (purposeFilter != "") {
            purposeMatch = visitor.purpose == purposeFilter;
        }

        if (statusFilter != "") {
            statusMatch = visitor.status == statusFilter;
        }


        // Display matching visitors

        if (searchMatch && purposeMatch && statusMatch) {

            var statusClass = "inside";

            if (visitor.status == "Exited") {
                statusClass = "exited";
            }


            var actionButton = "-";

            if (visitor.status == "Inside") {

                actionButton =
                    '<button class="checkout-btn" onclick="checkoutVisitor(' +
                    i + ')">Check Out</button>';

            }


            var row =

                "<tr>" +

                "<td>" + visitor.name + "</td>" +

                "<td>" + visitor.contact + "</td>" +

                "<td>" + visitor.purpose + "</td>" +

                "<td>" + visitor.person + "</td>" +

                "<td>" + visitor.room + "</td>" +

                "<td>" + visitor.date + "</td>" +

                "<td>" + visitor.timeIn + "</td>" +

                "<td>" + visitor.timeOut + "</td>" +

                '<td><span class="status ' + statusClass + '">' +
                visitor.status + "</span></td>" +

                "<td>" + actionButton + "</td>" +

                "</tr>";


            table.innerHTML += row;

            count++;

        }

    }


    // Show message if no records

    if (count == 0) {
        document.getElementById("noRecords").style.display = "block";
    }

    else {
        document.getElementById("noRecords").style.display = "none";
    }

}



/* CHECK OUT VISITOR */

function checkoutVisitor(index) {

    if (visitors[index].status == "Inside") {

        var currentDate = new Date();

        var time = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


        visitors[index].timeOut = time;

        visitors[index].status = "Exited";


        alert("Visitor checked out successfully!");


        updateDashboard();

        displayVisitors();

    }

}



/* UPDATE DASHBOARD */

function updateDashboard() {

    var total = visitors.length;

    var today = 0;

    var inside = 0;

    var exited = 0;


    var currentDay = new Date().toDateString();


    for (var i = 0; i < visitors.length; i++) {

        if (visitors[i].day == currentDay) {
            today++;
        }

        if (visitors[i].status == "Inside") {
            inside++;
        }

        if (visitors[i].status == "Exited") {
            exited++;
        }

    }


    // Update statistics

    document.getElementById("totalVisitors").innerHTML = total;

    document.getElementById("todayVisitors").innerHTML = today;

    document.getElementById("insideVisitors").innerHTML = inside;

    document.getElementById("checkedOutVisitors").innerHTML = exited;


    // Update visitor overview

    document.getElementById("activityInside").innerHTML = inside;

    document.getElementById("activityExited").innerHTML = exited;

    document.getElementById("activityToday").innerHTML = today;


    // Display recent visitors

    displayRecentVisitors();

}



/* RECENT VISITORS */

function displayRecentVisitors() {

    var table = document.getElementById("recentVisitors");

    table.innerHTML = "";


    var count = 0;


    for (var i = visitors.length - 1; i >= 0; i--) {

        if (count < 5) {

            var visitor = visitors[i];

            var statusClass = "inside";

            if (visitor.status == "Exited") {
                statusClass = "exited";
            }


            var row =

                "<tr>" +

                "<td>" + visitor.name + "</td>" +

                "<td>" + visitor.purpose + "</td>" +

                "<td>" + visitor.date + "</td>" +

                '<td><span class="status ' + statusClass + '">' +
                visitor.status + "</span></td>" +

                "</tr>";


            table.innerHTML += row;

            count++;

        }

    }


    if (count == 0) {

        table.innerHTML =
            "<tr><td colspan='4' style='text-align:center;padding:25px;color:#94a3b8;'>No visitors registered yet.</td></tr>";

    }

}



/* INITIAL WEBSITE SETUP */

updateDashboard();

displayVisitors();