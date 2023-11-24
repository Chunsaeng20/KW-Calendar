// Today's date
let today = new Date();   

let year = today.getFullYear();     // Year (eg. 2023)
let month = today.getMonth();       // Month (0 ~ 11)
let date = today.getDate();         // Date (eg. 24)
let day = today.getDay();           // Day (0 ~ 6) 

// Month tag
let monthTag = {
    0 : "January",
    1 : "February",
    2 : "March",
    3 : "April",
    4 : "May",
    5 : "June",
    6 : "July",
    7 : "August",
    8 : "September",
    9 : "October",
    10 : "November",
    11 : "December" 
};
// Calendar table
let days = document.getElementsByTagName('td');
// Selected day
let selectedDay;
let setDate;
let daysLen = days.length;

window.addEventListener('load', () =>{
    drawHeader();
    drawDays();
});

// date click logic
//let clickDay = querySelector(".selected");
//clickDay.addEventListener("click", () => {
//
//});

// Draw today 
// Only calls when page is loaded
function drawHeader() {
    // get query
    let infoMonth = document.querySelector(".info-month");
    let infoDay = document.querySelector(".info-day");

    // calculate month
    let monthString = '';
    for (let i = 0; i < Object.keys(monthTag).length; i++){
        if(i === month){
            monthString = monthTag[i];
        }
    }

    // push date
    infoDay.innerHTML = today.getDate();
    infoMonth.innerHTML = monthString;
}

// Draw calendar
// Calls when need to draw calendar
function drawDays() {
    // corresponding month's first day
    let startDay = new Date(year, month, 1).getDay();
    // corresponding month's last date
    let nDays = new Date(year, month + 1, 0).getDate();
    let n = startDay;
    
    // reset calendar
    for(let i = 0; i < 42; i++) {
        days[i].innerHTML = '';
        days[i].id = '';
        days[i].className = '';
    }

    // draw calendar
    for(let i = 1; i <= nDays ; i++) {
        days[n].innerHTML = i; 
        n++;
    }
    
    // check disabled date, today, selected date
    for(let i = 0; i < 42; i++) {
        // if empty
        if(days[i].innerHTML === ""){
            days[i].id = "disabled";
        }
        // else if today
        else if(i === day + startDay - 1){
            if(month === today.getMonth() && year === today.getFullYear()) {
                days[i].id = "today";
            }
        }
        // if selected date
        //if(selectedDay){
        //    if((i === selectedDay.getDate() + startDay - 1)&&(month === selectedDay.getMonth())&&(year === selectedDay.getFullYear())){
        //    days[i].className = "selected";
        //    this.drawHeader(selectedDay.getDate());
        //    }
        //}
    }

    // calculate month
    let monthString = '';
    for (let i = 0; i < Object.keys(monthTag).length; i++){
        if(i === month){
            monthString = monthTag[i];
        }
    }
    let headMonth = document.querySelector("#head-month");
    headMonth.innerHTML = monthString;
}

// Prev button logic
let leftBtn = document.querySelector("#prev-btn");
leftBtn.addEventListener('click', () => {
    // check month
    if(month < 1) { 
        month = 11;
        year = year - 1; 
    }
    else {
        month = month - 1;
    }
    // draw calendar
    drawDays();
});

// Next button logic
let rightBtn = document.querySelector("#next-btn");
rightBtn.addEventListener('click', () => {
    // check month
    if(month >= 11) {
        month = 0;
        year = year + 1; 
    }
    else {
        month = month + 1;
    }
    // darw calendar
    drawDays();
});

// TODAY button
let todayBtn = document.querySelector("#reset")
todayBtn.addEventListener("click", () => {
    // get today's date 
    month = today.getMonth();
    year = today.getFullYear();
    day = today.getDate();
    // draw calendar
    drawDays();
});