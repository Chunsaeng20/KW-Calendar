document.addEventListener('DOMContentLoaded', () => {
    // 오늘 날짜 받아오기
    let today = new Date();   

    // 현재 날짜 받아오기
    let currDate  = new Date();
    let currYear  = currDate.getFullYear();
    let currMonth = currDate.toLocaleString('en-US', { month: 'long' });
    let currDay   = currDate.getDate();

    // 날짜 업데이트
    document.querySelector('.info-month').textContent   = currMonth;                    // info-month 업데이트
    document.querySelector('.info-day').textContent     = currDay;                      // info-day 업데이트
    document.querySelector('#head-month').textContent   = currMonth + ' ' + currYear;   // button-month 업데이트

    // 캘린더 업데이트
    function updateCalendar() {
        // 이번 달의 첫 날짜, 마지막 날짜, 시작 요일 받아오기
        let firstDate = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay();      // 첫 날짜
        let lastDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();  // 마지막 날짜
        let n = firstDate;                                                                      // 시작 요일

        let days = document.getElementsByTagName('td');

        // 캘린더 초기화
        for(let i = 0; i < 42; i++) {
            days[i].innerHTML = '';
            days[i].id = '';
            days[i].className = '';
        }
        // 캘린더 그리기
        for(let i = 1; i <= lastDate ; i++) {
            days[n].innerHTML = i; 
            n++;
        }
        // id 삽입
        for(let i = 0; i < 42; i++) {
            // 날짜가 비었으면
            if(days[i].innerHTML === ""){
                days[i].id = "disabled";
            }
            // 오늘 날짜라면
            else if(i === today.getDay() + firstDate - 1){
                if(currMonth === today.getMonth() && currDate === today.getFullYear()) {
                    days[i].id = "today";
                }
            }
            // 선택된 날짜라면
            //if(selectedDay){
            //    days[i].className = "selected";
            //}
        }
    }

    // 초기 달력 업데이트
    updateCalendar();
    
    // -------------------------------------------------------------------------------------------------------

    // 'TODAY button'에 대한 이벤트 처리기
    document.querySelector('#reset').addEventListener('click', () => {
        // 현재 날짜로 변수 업데이트
        currDate  = new Date();
        currMonth = currDate.toLocaleString('en-US', { month: 'long' });
        currYear  = currDate.getFullYear();
        // 화면 업데이트
        document.querySelector('.info-month').textContent = currMonth;
        document.querySelector('.info-day').textContent   = currDay;
        document.querySelector('#head-month').textContent = currMonth + ' ' + currYear;
        updateCalendar();
    });

    // -------------------------------------------------------------------------------------------------------

    // 'Previous month button'에 대한 이벤트 처리기
    document.querySelector('#prev-btn').addEventListener('click', () => {
        // 변수 업데이트
        currDate.setMonth(currDate.getMonth() - 1);
        currMonth = currDate.toLocaleString('en-US', { month: 'long' });
        currYear  = currDate.getFullYear();
        // 화면 업데이트
        document.querySelector('#head-month').textContent = currMonth + ' ' + currYear;
        updateCalendar();
    });

    // -------------------------------------------------------------------------------------------------------

    // 'Next month button'에 대한 이벤트 처리기
    document.querySelector('#next-btn').addEventListener('click', () => {
        // 변수 업데이트
        currDate.setMonth(currDate.getMonth() + 1);
        currMonth = currDate.toLocaleString('en-US', { month: 'long' });
        currYear  = currDate.getFullYear();
        // 화면 업데이트
        document.querySelector('#head-month').textContent = currMonth + ' ' + currYear;
        updateCalendar();
    });

    // -------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------

    // 이하 필요 기능 추가 작성.
    let calendarTable = document.querySelector('#calendar');
    calendarTable.addEventListener('click', (event) => {
        // 날짜가 없으면 반환
        if(event.target.id === 'disabled'){
            return;
        }
        else if (event.target.tagName === 'TD' && event.target.closest('#calendar')) {
            // 클릭된 날짜 받아오기
            let clickedDay = parseInt(event.target.textContent);
            // info-day, info-month 업데이트
            document.querySelector('.info-day').textContent   = clickedDay;
            document.querySelector('.info-month').textContent = currMonth;

            // 선택된 날짜에 해당하는 to-do list 가져오기 (이 부분은 서버에서 데이터를 가져오는 로직이 들어가야 합니다.)
            let selectedDate = `${currMonth} ${clickedDay}, ${currYear}`;

            // 팝업에 날짜 업데이트
            document.getElementById('selected-date-popup').textContent = selectedDate;

            // 팝업 표시
            document.getElementById('to-do-popup').style.display = 'block';

            // To-Do List 표시 로직 추가 (이 부분도 서버에서 데이터를 가져오는 로직이 필요합니다.)
            // 아래는 예시 코드이므로 실제 데이터 연동을 위해서는 서버와의 통신 등이 필요합니다.
            let toDoListItems = ["Task 1", "Task 2", "Task 3"];
            let toDoList = document.getElementById('to-do-items-popup');
            toDoList.innerHTML = '';
            toDoListItems.forEach((item) => {
                let li = document.createElement('li');
                li.textContent = item;
                toDoList.appendChild(li);
            });

            // Add Task 버튼에 대한 이벤트 처리기
            document.getElementById('add-task-btn-popup').addEventListener('click', () => {
                let newTask = document.getElementById('new-task-popup').value;
                if (newTask.trim() !== '') {
                    // 실제로 서버에 데이터를 추가하는 로직이 필요합니다.
                    // 이 부분은 예시 코드로 실제로 동작하지 않습니다.
                    toDoListItems.push(newTask);
                    let li = document.createElement('li');
                    li.textContent = newTask;
                    toDoList.appendChild(li);
                    document.getElementById('new-task-popup').value = '';
                }
            });
        }
    });

    
});

function closePopup() {
    document.getElementById('to-do-popup').style.display = 'none';
}
