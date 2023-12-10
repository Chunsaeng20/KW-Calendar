let DATA={} ;

document.addEventListener('DOMContentLoaded', () => {
    // 오늘 날짜 받아오기
    let today = new Date();   

    const inputBox=document.querySelector('.input-box');
    const inputBtn=document.querySelector('.input-btn');
    const inputList=document.querySelector('.todoList');
    let clickedDate;

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
            else if(i === today.getDate() + firstDate - 1 && currMonth === today.toLocaleString('en-US', { month: 'long' }) && currYear === today.getFullYear()){
                days[i].id = "today";
            }
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

        // 만약 To do list가 켜져 있으면 끈다
        let todoList = document.querySelector('.todo-list');
        if(todoList.style.visibility === 'visible')
        {
            document.querySelector('#close-btn').click();
        }        
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
            event.target.classList.add('active');
            currDate = new Date(currDate.getFullYear(), currDate.getMonth(), event.target.innerHTML);
            clickedDate = currDate.toLocaleDateString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'});
            // info-day, info-month 업데이트
            document.querySelector('.info-day').textContent   = clickedDay;
            document.querySelector('.info-month').textContent = currMonth;
            // 화면 바꾸기
            slideWindowRight();
            // 클릭된 날짜의 Todo List로 업데이트
            updateList();
            // Todo list 띄우기
            showOnTodolist();
        }
    });

    // -------------------------------------------------------------------------------------------------------

    // 캘린더를 오른쪽으로 이동
    function slideWindowRight () {
        const selector = document.querySelector('.wrap-calendar');
        selector.classList.remove('magictime', 'slideRightReturn');
        selector.classList.add('magictime', 'slideRight');
        setTimeout(() => {
            selector.style.visibility = 'hidden';
            selector.style.position   = 'absolute';
            selector.style.opacity    = 0;
        }, 1000);
    }

    // 캘린더를 왼쪽으로 이동
    function slideWindowLeft () {
        const selector = document.querySelector('.wrap-calendar');
        selector.classList.remove('magictime', 'slideRight');
        selector.classList.add('magictime', 'slideRightReturn');
        selector.style.visibility = 'visible';
        selector.style.position   = 'relative';
        selector.style.opacity    = 1;
    }

    // -------------------------------------------------------------------------------------------------------

    // Todo list 띄우기
    function showOnTodolist () {
        let todoList = document.querySelector('.todo-list');
        let selectorHeight = document.querySelector('.wrap-calendar').offsetHeight;
        todoList.style.height     = selectorHeight + "px";
        setTimeout(() => {
            todoList.style.visibility = 'visible';
            todoList.style.position   = 'static';
            todoList.style.opacity    = 1;
        }, 1000);
    }

    // Todo list 끄기
    function showOffTodolist () {
        let todoList = document.querySelector('.todo-list');
        todoList.style.visibility = 'hidden';
        todoList.style.position   = 'absolute';
        todoList.style.opacity    = 0;
    }

    // 'Close button'에 대한 이벤트 처리기
    document.querySelector('#close-btn').addEventListener('click', () => {
        // Todo list 끄기
        showOffTodolist();
        // 화면 바꾸기
        slideWindowLeft();
    });

    // -------------------------------------------------------------------------------------------------------

    // Todo 삭제
    function deleteTodo(E) {
        E.preventDefault();
        let delParentLi = E.target.parentNode;
        inputList.removeChild(delParentLi);

        if (!DATA[clickedDate] || !Array.isArray(DATA[clickedDate])) {
            DATA[clickedDate] = [];
        }

        const cleanToDos = DATA[clickedDate].filter(function (todo) {
            return todo.id !== parseInt(delParentLi.id);
        });

        DATA[clickedDate] = cleanToDos;
        save();
    }

    // Todo list 인풋 입력 이벤트 리스너
    inputBtn.addEventListener('click',function(E){ 
        E.preventDefault();
        let input = inputBox.value;
        InsertTodo(input);
    });

    // Todo list에 삽입
    function InsertTodo(text){
        let todo = {
            todo: text,
        }

        if(!DATA[clickedDate]) {
            DATA[clickedDate] = [];
            DATA[clickedDate].push(todo);
        } else {
            DATA[clickedDate].push(todo);
        }

        const listE     = document.createElement('li');
        const spanE     = document.createElement('span');
        const deleteBtn = document.createElement('button');

        deleteBtn.setAttribute('class', 'del-data');
        deleteBtn.innerText = "DEL";
        spanE.innerHTML = text;
        listE.appendChild(spanE);
        listE.appendChild(deleteBtn);
        inputList.appendChild(listE);

        listE.setAttribute('id', DATA[clickedDate].length);
        deleteBtn.addEventListener('click', deleteTodo);

        todo.id = DATA[clickedDate].length;
        save();
        inputBox.value='';
    }

    // 선택된 날짜의 Todo List출력
    function updateList(){ 
        let savedE = localStorage.getItem(clickedDate);

        let listE = document.querySelectorAll('LI');

        for(let i = 0; i < listE.length; i++) {
            inputList.removeChild(listE[i])
        }

        if ( savedE!==null ) {
            const parsed=JSON.parse(localStorage.getItem(clickedDate));
            parsed.forEach(function(Todo){
                if(Todo){
                    let li     = document.createElement('li');
                    let sp     = document.createElement('span');
                    let delbtn = document.createElement('button');

                    delbtn.setAttribute('class', 'del-data');
                    delbtn.innerText = "DEL";
                    sp.innerHTML = Todo.todo;
                    li.appendChild(sp);
                    li.appendChild(delbtn);
                    inputList.appendChild(li);

                    li.setAttribute('id', Todo.id);
                    delbtn.addEventListener('click', deleteTodo);
                }
            });
        }
    }

    // 로컬 스토리지 저장
    function save(){ 
        localStorage.setItem(clickedDate, JSON.stringify(DATA[clickedDate]));
    }

    // -------------------------------------------------------------------------------------------------------

});