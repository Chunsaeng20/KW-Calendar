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

    // 'calender 내부의 td element'에 대한 이벤트 처리기
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
            // 화면 바꾸기
            flipWindowRight();
            // Todo list 띄우기
            let todoList = document.querySelector('.todo-list');
            todoList.style.visibility = 'visible';
            todoList.style.position   = 'static';
            todoList.style.opacity    = 1;
        }
    });

    // -------------------------------------------------------------------------------------------------------

    // 캘린더를 오른쪽으로 이동
    function flipWindowRight () {
        const selector = document.querySelector('.wrap-calendar');
        selector.classList.remove('magictime', 'slideRightReturn');
        selector.classList.add('magictime', 'slideRight');
    }

    // 캘린더를 왼쪽으로 이동
    function flipWindowLeft () {
        const selector = document.querySelector('.wrap-calendar');
        selector.classList.remove('magictime', 'slideRight');
        selector.classList.add('magictime', 'slideRightReturn');
    }
    // -------------------------------------------------------------------------------------------------------

    // 'Close button'에 대한 이벤트 처리기
    document.querySelector('#close-btn').addEventListener('click', () => {
        // Todo list 끄기
        let todoList = document.querySelector('.todo-list');
        todoList.style.visibility = 'hidden';
        todoList.style.position   = 'absolute';
        todoList.style.opacity    = 0;
        // 화면 바꾸기
        flipWindowLeft();
    });

    // -------------------------------------------------------------------------------------------------------

});