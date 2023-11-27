document.addEventListener('DOMContentLoaded', function () {
    // 현재 day, month 받아오기
    let currentDate = new Date();
    let currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
    let currentDay = currentDate.getDate();

    // 날짜 업데이트
    document.querySelector('.info-month').textContent = currentMonth; // info-month 업데이트
    document.querySelector('.info-day').textContent = currentDay;     // info-day 업데이트
    document.querySelector('.button-month').textContent = currentMonth + ' ' + currentDate.getFullYear(); // button-month 업데이트

    // calender body 업데이트 함수 (month의 이동이 있을 때 호출)
    function updateCalendar() {
        // 이번 달의 첫 날짜, 마지막 날짜, 시작 요일 받아오기
        let firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);     // 첫 날짜
        let lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // 마지막 날짜
        let startingDay = firstDate.getDay();                                               // 시작 요일

        let tableBody = document.querySelector('#calendar tbody');  // calender body 가져오기
        tableBody.innerHTML = '';                                   // calender body의 기존 text 제거
        let date = 1;                                               // date count를 위한 변수

        // row 반복문
        for (let i = 0; i < 6; i++) {
            // td element를 받을 tr element 생성
            let row = document.createElement('tr');

            // coloumn 반복문
            for (let j = 0; j < 7; j++) {
                // 날짜를 받을 td element 생성
                let cell = document.createElement('td');

                // 이번달의 마지막 date를 넘었는지 확인
                if (date > lastDate.getDate()) {
                    break;
                }

                // 첫번째 row에서 시작 요일 이전의 날짜는 empty 처리
                if (i === 0 && j < startingDay) {
                    cell.textContent = '';
                } 
                else {
                    // td element에 현재 날짜 저장
                    cell.textContent = date;
                    date++;
                }

                // tr element에 td element 삽입
                row.appendChild(cell);
            }

            // calender body에 td element가 정상적으로 추가된 tr element 삽입
            tableBody.appendChild(row);
        }
    }

    // 초기 달력 업데이트
    updateCalendar();
    
    // -------------------------------------------------------------------------------------------------------

    // 'reset button'에 대한 event
    document.getElementById('reset').addEventListener('click', function () {
        // 현재 날짜로 변수 업데이트
        currentDate = new Date();
        currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
        // 화면 업데이트
        document.querySelector('.info-month').textContent = currentMonth;
        document.querySelector('.info-day').textContent = currentDay;
        document.querySelector('.button-month').textContent = currentMonth + ' ' + currentDate.getFullYear();
        updateCalendar();
    });

    // -------------------------------------------------------------------------------------------------------

    // 'Previous month button'에 대한 event
    document.querySelector('.wrap-button .btn:first-child').addEventListener('click', function () {
        // 변수 업데이트
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
        // 화면 업데이트
        document.querySelector('.button-month').textContent = currentMonth + ' ' + currentDate.getFullYear();
        updateCalendar();
    });

    // -------------------------------------------------------------------------------------------------------

    // 'Next month button'에 대한 event
    document.querySelector('.wrap-button .btn:last-child').addEventListener('click', function () {
        // 변수 업데이트
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
        // 화면 업데이트
        document.querySelector('.button-month').textContent = currentMonth + ' ' + currentDate.getFullYear();
        updateCalendar();
    });

    // -------------------------------------------------------------------------------------------------------

    // 'calender 내부의 td element'에 대한 event
    let calendarTable = document.getElementById('calendar');
    calendarTable.addEventListener('click', function (event) {
        // calender 내부의 td element에 대해서만 실행
        if (event.target.tagName === 'TD' && event.target.closest('#calendar')) {
        // 클릭된 날짜 받아오기
        let clickedDay = parseInt(event.target.textContent);

        // info-day, info-month 업데이트
        document.querySelector('.info-day').textContent = clickedDay;
        document.querySelector('.info-month').textContent = currentMonth;
        }
    });

    // -------------------------------------------------------------------------------------------------------

    // 이하 필요 기능 추가 작성.

});