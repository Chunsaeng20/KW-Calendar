// 일정
let DATA = {};
// 일정이 저장된 날짜
let scheduleDate = [];
//progress바 값 계산을 위한 Todo count, Done count 변수
let TodoCnt={};
let DoneCnt={};
let progressbar='0';
//D-day용 배열
let D_day_DATA={} ;
let taskIndex = 0; // Global variable to store task index
document.addEventListener('DOMContentLoaded', () => {
    // 오늘 날짜 받아오기
    let today = new Date();  
    const inputBox=document.querySelector('.input-box');
    const inputBtn=document.querySelector('.input-btn');
    const inputList=document.querySelector('.todoList');
    let clickedDate;
    let loading = 0;

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

        // 일정이 저장된 날짜 불러오기
        loadScheduleDate();

        // id 삽입
        for(let i = 0; i < 42; i++) {
            // 날짜가 비었으면
            if(days[i].innerHTML === ""){
                days[i].id = "disabled";
            }
            // 오늘 날짜라면
            else if(i === today.getDate() + firstDate - 1 && currMonth === today.toLocaleString('en-US', { month: 'long' }) && currYear === today.getFullYear()){
                // 오늘 날짜를 달력에 표시
                days[i].id = "today";
            }
            // 일정이 존재하는지 확인
            for(let j = 0; j < scheduleDate.length; j++){
                // 일정이 존재하면 달력에 표시
                if(i === parseInt(scheduleDate[j].substr(10, 2)) + firstDate - 1 && 
                   currDate.getMonth() + 1 === parseInt(scheduleDate[j].substr(6, 2)) && 
                   currYear === parseInt(scheduleDate[j].substr(0, 4))){
                    days[i].id = "scheduled";
                }
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
            // Tips 띄우기
            showOnTips();
        }
    });
    function updateProgress() {
        let progressContent = document.querySelector('.info-progress-content');
        let totalTasks = 0;
        let taskDetails = '';
        taskIndex =0;
        // Get D_day_DATA directly
        const sortedDates = Object.keys(D_day_DATA).sort((a, b) => new Date(a) - new Date(b));
    
        for (const date of sortedDates) {
            if (D_day_DATA[date] && D_day_DATA[date].length > 0) {
                // For each date, iterate through its Todo List
                D_day_DATA[date].forEach((todo) => {
                    if (todo && todo.todo.trim() !== "") {
                        totalTasks++;
    
                        let today = new Date();
                        let dueDate = new Date(date);
                        let diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
                        // Format the due date as a string
                        let formattedDueDate = dueDate.toLocaleDateString();
    
                        // Determine whether to display 'D+' or 'D-' along with the exact number of days and due date
                        let daysLabel = diffDays >= 0 ? `D-${diffDays}` : `D+${diffDays*(-1)}`;
    
                        // Display task number (taskIndex + 1) along with task details
                        taskDetails += `${taskIndex + 1}. ${todo.todo.trim()} (${daysLabel}, ${formattedDueDate})<br>`;
                        taskIndex++; // Increment the global task index
                    }
                });
            }
        }
    
        if (totalTasks > 0) {
            // Remove the trailing line break from taskDetails
            taskDetails = taskDetails.replace(/(<br>)$/, "");
            progressContent.innerHTML = `${taskDetails}`;
        } else {
            progressContent.innerHTML = ''; // 할 일 목록이 없을 경우 내용을 지움
        }
    }

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

    function ProgressUpdate (){
        let Todocnt=localStorage.getItem(clickedDate+'TodoCnt');
        let Donecnt=localStorage.getItem(clickedDate+'DoneCnt');
        progressbar='0';
        if(!(Todocnt[clickedDate]==='0' || Donecnt[clickedDate]==='0')){
            progressbar=String((DoneCnt[clickedDate]/TodoCnt[clickedDate])*100);
        }
        document.getElementById('progress').value=progressbar;
    }
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
        progressbar='0';
        document.getElementById('progress').value=progressbar;
        let todoList = document.querySelector('.todo-list');
        todoList.style.visibility = 'hidden';
        todoList.style.position   = 'absolute';
        todoList.style.opacity    = 0;
    }

    // Tips 띄우기
    function showOnTips () {
        ProgressUpdate();
        let tips = document.querySelector('.info-tips');
        setTimeout(() => {
            tips.style.visibility = 'visible';
            tips.style.opacity    = 1;
        }, 100);
        tips.classList.add('magictime', 'slideRightReturn');        
    }

    // Tips 끄기
    function showOffTips () {
        let tips = document.querySelector('.info-tips');
        tips.classList.remove('magictime', 'slideRightReturn');
        tips.classList.add('magictime', 'slideRight');   
        setTimeout(() => {
            tips.style.visibility = 'hidden';
            tips.style.opacity    = 0;
            tips.classList.remove('magictime', 'slideRight');
        }, 300);
    }

    // 'Close button'에 대한 이벤트 처리기
    document.querySelector('#close-btn').addEventListener('click', () => {
        // Todo list 끄기
        showOffTodolist();
        // Tips 끄기
        showOffTips();
        // 화면 바꾸기
        slideWindowLeft();
    });

    // -------------------------------------------------------------------------------------------------------
    function isDdayChecked() {
        const checkedRadio = document.querySelector('.checkDdayRadio:checked');
        return checkedRadio && checkedRadio.value === 'yes';
    }
    // Todo 삭제
    function deleteTodo(E) {
        E.preventDefault();
        let delParentLi = E.target.parentNode;
        let delcbInfo=delParentLi.querySelector('span').innerHTML;
        if(localStorage.getItem(clickedDate+delcbInfo)==='true'){
            DoneCnt[clickedDate]--;
        }
        localStorage.setItem(clickedDate+delcbInfo,'false'); 
        TodoCnt[clickedDate]--;
        inputList.removeChild(delParentLi);

        if (!DATA[clickedDate] || !Array.isArray(DATA[clickedDate])) {
            DATA[clickedDate] = [];
        }

        const cleanToDos = DATA[clickedDate].filter(function (todo) {
            return todo.id !== parseInt(delParentLi.id);
        });

        DATA[clickedDate] = cleanToDos;

        // 일정이 비면 그날을 배열에서 삭제
        if(Object.keys(DATA[clickedDate]).length === 0){
            scheduleDate = scheduleDate.filter((value)=>{
                if(value !== clickedDate) return true;
            });
        }
        localStorage.setItem(clickedDate+'DoneCnt',DoneCnt[clickedDate]);
        localStorage.setItem(clickedDate+'TodoCnt',TodoCnt[clickedDate]);
        ProgressUpdate();
        save();
        // 화면 업데이트
        updateCalendar();
    }

    // Todo list 인풋 입력 이벤트 리스너
    inputBtn.addEventListener('click', function(E) { 
        E.preventDefault();
        let input = inputBox.value;
        
        // 빈 입력은 무시
        if(input === "") return;

        InsertTodo(input);
        // 화면 업데이트
        updateCalendar();
    });

    // Todo list에 삽입
    function InsertTodo(text){
        let todo = {
            todo: text,
            checkDday: isDdayChecked() ? "Yes" : "No"  // Check if D-day is checked
        }

        // 문자열이 없으면 생성
        if(!DATA[clickedDate]) {
            DATA[clickedDate] = [];
            DATA[clickedDate].push(todo);
            TodoCnt[clickedDate]=[];
            TodoCnt[clickedDate]=1;
        } else {
            DATA[clickedDate].push(todo);
            TodoCnt[clickedDate]++;
        }

        if (isDdayChecked() && todo.checkDday === "Yes") {
            // Save to D_day_DATA if D-day is checked
            if (!D_day_DATA[clickedDate]) {
                D_day_DATA[clickedDate] = [];
            }
    
            D_day_DATA[clickedDate].push({
                todo: todo.todo
            });
        }

        const listE     = document.createElement('li');
        const spanE     = document.createElement('span');
        const deleteBtn = document.createElement('button');
        const checkbox  = document.createElement('input');

        checkbox.setAttribute('type','checkbox');
        checkbox.setAttribute('id','cb');
        deleteBtn.setAttribute('class', 'del-data');
        deleteBtn.innerText = "DEL";
        spanE.innerHTML = text;
        listE.appendChild(spanE);
        listE.appendChild(checkbox);
        listE.appendChild(deleteBtn);
        inputList.appendChild(listE);

        listE.setAttribute('id', DATA[clickedDate].length);
        deleteBtn.addEventListener('click', deleteTodo);
        checkbox.addEventListener('click',(e)=>{ //체크박스 상태 저장 이벤트리스너
            const spantext=e.target.parentNode.querySelector('span').innerHTML;
            if(e.target.checked===true){
                DoneCnt[clickedDate]++;
            }
            else{
                DoneCnt[clickedDate]--;
            }
            //해당 날짜의 일정 완료 count 저장
            localStorage.setItem(clickedDate+'DoneCnt',DoneCnt[clickedDate]);
            localStorage.setItem(clickedDate+spantext,e.target.checked); 
            ProgressUpdate();
        });
        todo.id = DATA[clickedDate].length;

        // 일정이 생긴 날짜를 저장
        scheduleDate.push(clickedDate);
        //해당 날짜의 일정 count 저장
        localStorage.setItem(clickedDate+'DoneCnt',DoneCnt[clickedDate]);
        localStorage.setItem(clickedDate+'TodoCnt',TodoCnt[clickedDate]);
        save();
        updateProgress();
        inputBox.value='';
    }

    // 선택된 날짜의 Todo List출력
    function updateList(){ 
        let savedE = localStorage.getItem(clickedDate);
        TodoCnt[clickedDate]=localStorage.getItem(clickedDate+'TodoCnt');
        DoneCnt[clickedDate]=localStorage.getItem(clickedDate+'DoneCnt');
        let listE = document.querySelectorAll('LI');
        for(let i = 0; i < listE.length; i++) {
            inputList.removeChild(listE[i])
        }

        // Tips에서 지도 삭제
        findPlace("1");

        let loaded = 0;
        // 문자열이 없으면 생성
        if(!DATA[clickedDate]) {
            DATA[clickedDate] = [];
            loaded = 1;
        } 

        if ( savedE !== null ) {
            const parsed = JSON.parse(localStorage.getItem(clickedDate));
            parsed.forEach(function(Todo){
                if(Todo){
                    let li     = document.createElement('li');
                    let sp     = document.createElement('span');
                    let delbtn = document.createElement('button');
                    let cb  = document.createElement('input');

                    delbtn.setAttribute('class', 'del-data');
                    cb.setAttribute('type','checkbox');
                    cb.setAttribute('id','cb');
                    delbtn.innerText = "DEL";
                    sp.innerHTML = Todo.todo;
                    li.appendChild(sp);
                    li.appendChild(cb);
                    li.appendChild(delbtn);
                    inputList.appendChild(li);

                    li.setAttribute('id', Todo.id);
                    delbtn.addEventListener('click', deleteTodo);
                    cb.addEventListener('click',(e)=>{ //체크박스 상태 저장 이벤트리스너
                        const spantext=e.target.parentNode.querySelector('span').innerHTML;
                        if(e.target.checked===true){
                            DoneCnt[clickedDate]++;
                        }
                        else{
                            DoneCnt[clickedDate]--;
                        }
                        localStorage.setItem(clickedDate+'DoneCnt',DoneCnt[clickedDate]);
                        localStorage.setItem(clickedDate+spantext,e.target.checked); 
                        ProgressUpdate();
                    });
                    var checked=localStorage.getItem(clickedDate+sp.innerHTML);
                    if(checked==='true'){
                        cb.checked=true;
                    }
                    // Tips에 지도 생성
                    findPlace(Todo.todo);
                    // 새로고침 했을 경우
                    if(loaded === 1){
                        DATA[clickedDate].push(Todo);
                    }
                }
            });
            // 로컬 스토리지 저장
            localStorage.setItem(clickedDate, JSON.stringify(DATA[clickedDate]));
        }
    }

    // 로컬 스토리지 저장
    function save(){ 
        // 로컬 스토리지에 일정 저장
        localStorage.setItem(clickedDate, JSON.stringify(DATA[clickedDate]));
        // 로컬 스토리지에 날짜 저장
        localStorage.setItem("Date", JSON.stringify(scheduleDate));
    }

    // -------------------------------------------------------------------------------------------------------

    // 일정이 저장된 날짜 불러오기
    function loadScheduleDate() {
        // 배열 초기화
        scheduleDate.splice(0, scheduleDate.length);
        let item = JSON.parse(localStorage.getItem("Date"));
        if(item){
            item.forEach((element)=>{
                scheduleDate.push(element)
            });
        }
        // 로컬 스토리지에 날짜 저장
        localStorage.setItem("Date", JSON.stringify(scheduleDate));
    }

    // -------------------------------------------------------------------------------------------------------

    // 일정에서 장소 찾기
    function findPlace(todo){
        const place = ["화도관", "비마관", "옥의관", "중앙도서관", "복지관", "연구관", "참빛관", "연촌재", "한천재", "한울관", "승리관", "누리관", "새빛관", "빛솔재", "노천극장", "동해문화예술관", "80주년 기념관", "아이스링크", "광운대"];
        // 일정에 존재하는 장소
        let currPlace = "";

        if(!todo) return;

        // 일정에 장소가 들어있는지 확인
        place.forEach((value)=>{
            if(todo.includes(value) && currPlace === ""){
                currPlace = value;
            }
        });

        let map = document.querySelector('#map')
        map.innerHTML = "";
        // 일정에 장소가 들어있으면
        if(currPlace === "화도관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.222639320751!2d127.05456138852148!3d37.62045044891418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbeadac4e8b9%3A0x83a20eb4f21855d0!2z7ISc7Jq47Yq567OE7IucIOyblOqzhDHrj5kg6rSR7Jq064yA7ZWZ6rWQIO2ZlOuPhOq0gA!5e0!3m2!1sko!2skr!4v1702463570333!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "비마관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.2580531117346!2d127.05730177629862!3d37.61961732108192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbeacb4cfbf7%3A0x4fd43175e455c4d1!2z7ISc7Jq47Yq567OE7IucIOyblOqzhOuPmSDqtJHsmrTrjIDtlZnqtZAg67mE66eI6rSA!5e0!3m2!1sko!2skr!4v1702464482013!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "옥의관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.2922949537688!2d127.0542280885211!3d37.61881174900933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb9521ecd6e3%3A0xd5055206b7732228!2z7ISc7Jq47Yq567OE7IucIOyblOqzhDHrj5kg6rSR7Jq064yA7ZWZ6rWQIOyYpeydmOq0gA!5e0!3m2!1sko!2skr!4v1702464560969!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "중앙도서관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1117.32090722732!2d127.05899625231243!3d37.61955361483271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb76dbe145ff%3A0xfd66f26178ce0d69!2z6rSR7Jq064yA7ZWZ6rWQIOykkeyVmeuPhOyEnOq0gA!5e0!3m2!1sko!2skr!4v1702464613606!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "복지관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1580.122476336857!2d127.05757818887326!3d37.61992551752468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb94dc6a2833%3A0x31d57fa9e0666424!2z7ISc7Jq47Yq567OE7IucIOyblOqzhDHrj5kg6rSR7Jq064yA7ZWZ6rWQIOuzteyngOq0gA!5e0!3m2!1sko!2skr!4v1702464661645!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "연구관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1580.1373366405057!2d127.05708943887329!3d37.619226317544666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb94c11a71d1%3A0x72d3894d13bed9ff!2z7ISc7Jq47Yq567OE7IucIOyblOqzhDHrj5kg6rSR7Jq064yA7ZWZ6rWQIOyXsOq1rOq0gA!5e0!3m2!1sko!2skr!4v1702464683015!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "참빛관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d939.5497942453098!2d127.0594983994693!3d37.61966054675825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb9552b79ad7%3A0xa353b2a95c2f83f2!2z7ISc7Jq47Yq567OE7IucIOyblOqzhDHrj5kg6rSR7Jq064yA7ZWZ6rWQIOywuOu5m-q0gA!5e0!3m2!1sko!2skr!4v1702465765176!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "연촌재"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.1636052586978!2d127.05399647629875!3d37.6218392209543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbeb5db411ff%3A0xbdb9d725d53cbf3f!2z6rSR7Jq064yA7ZWZ6rWQIOyXsOy0jOyerA!5e0!3m2!1sko!2skr!4v1702465789622!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "한천재"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.2332630825667!2d127.0550241762988!3d37.620200521048346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb94ca3a7079%3A0x9cc2f2b37e432b2d!2z6rSR7Jq064yA7ZWZ6rWQIO2VnOyynOyerA!5e0!3m2!1sko!2skr!4v1702465806278!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "한울관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.2108319046556!2d127.05441317629892!3d37.620728221018226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbeb4cde60a1%3A0xdacff6df925558e9!2z6rSR7Jq064yA7ZWZ6rWQIO2VnOyauOq0gA!5e0!3m2!1sko!2skr!4v1702465822122!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "누리관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.2104730531146!2d127.05441317617165!3d37.62073666305378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb936ac3b12f%3A0xb90a5aa83e0116dd!2z6rSR7Jq064yAIOuIhOumrOq0gA!5e0!3m2!1sko!2skr!4v1702465860076!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "새빛관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.2104730531146!2d127.05441317617165!3d37.62073666305378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbeaaf919c85%3A0xbef57637167e129c!2z6rSR7Jq064yA7ZWZ6rWQIOyDiOu5m-q0gA!5e0!3m2!1sko!2skr!4v1702465873076!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "빛솔재"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1879.0658096828442!2d127.05527043928855!3d37.62099699805559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbeca86fafd5%3A0xac616b5898e6d7d9!2z6rSR7Jq064yA7ZWZ6rWQ6rO16rO16riw7IiZ7IKsKOycoCk!5e0!3m2!1sko!2skr!4v1702465903851!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "노천극장"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1117.3170957559892!2d127.05907404932606!3d37.619807232994745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb952907ece3%3A0x15c12166c3c20e4a!2z6rSR7Jq064yA7ZWZ6rWQ!5e0!3m2!1sko!2skr!4v1702465948377!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "동해문화예술관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1117.3170957559892!2d127.05907404932606!3d37.619807232994745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb94b89cf307%3A0x6bce5ccde500f450!2z64-Z7ZW066y47ZmU7JiI7Iig6rSA!5e0!3m2!1sko!2skr!4v1702465960520!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "80주년 기념관"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d790.0621597558062!2d127.05888122665434!3d37.61983879393919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb94dc983783%3A0x1e29cce379bed986!2z6rSR7Jq064yA7ZWZ6rWQ7Jqw7Y647Leo6riJ6rWt!5e0!3m2!1sko!2skr!4v1702466018904!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "아이스링크"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1580.1166957603248!2d127.05473454916594!3d37.62019749948702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbbde6e8d5f73%3A0x33619639d65ad4f5!2z6rSR7Jq064yA7ZWZ6rWQIOyVhOydtOyKpOunge2BrOyepQ!5e0!3m2!1sko!2skr!4v1702465981963!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
        else if(currPlace === "광운대"){
            map.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d790.0621597558062!2d127.05888122665434!3d37.61983879393919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb952907ece3%3A0x15c12166c3c20e4a!2z6rSR7Jq064yA7ZWZ6rWQ!5e0!3m2!1sko!2skr!4v1702466070675!5m2!1sko!2skr" width="200" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
    }
    // -------------------------------------------------------------------------------------------------------
});
