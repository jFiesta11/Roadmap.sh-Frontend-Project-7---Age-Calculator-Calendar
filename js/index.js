import {DateTime, Interval} from '../node_modules/luxon/build/es6/luxon.mjs'
    let now = DateTime.now().toLocal()
    const year = now.year
    const month = now.month
    const day = now.day

function valid_input (date, index){

    switch (index) {
        case 0:
            if(date < 32 && date != 0){
                return true
            }   
            else{
                return false
            }
            break;
        case 1:
            if(date < 13 && date != 0){
                return true
            }   
            else{
                return false
            }   
            return true
            break;
        case 2:
            if(date < now.year && date != 0 && String(date).length == 4){
                return true
            }   
            else{
                return false
            }
            break;
        default:
            break;
    }
}

let user_day;
let user_month;
let user_year;

    const input = document.querySelectorAll(".calendar-input")

    function updateDateInputs(day, month, year) {
        input[0].value = String(day).padStart(2, '0')
        input[1].value = String(month).padStart(2, '0')
        input[2].value = String(year)
    }

    function clearDaySelection() {
        document.querySelectorAll('.day').forEach((dayElement) => {
            dayElement.classList.remove('active')
        })
    }

    input.forEach((e,i) => {
        let max = e.maxLength

        e.addEventListener('input',(event)=>{
            if(event.target.value.length == max){
                if(i === input.length-1){
                    e.blur()
                    
                }
                else{
                    input[i+1].focus()
                }    
            }

            if (input[0].value === '' && input[1].value === '' && input[2].value === '') {
                clearDaySelection()
            }
        })
        e.addEventListener('keydown', (event)=>{
            if(event.key === "Backspace" && i !== 0 && e.value == "" ){
                input[i-1].focus()
            }
        })
    });

    const calculate_btn = document.querySelector(".calculate-button")
    
    calculate_btn.addEventListener('click', () => {
                let result = document.querySelector('.result-container')
        
        user_day = Number(input[0].value) 
        user_month = Number(input[1].value) 
        user_year = Number(input[2].value) 
        
        const resultMonth = day >= user_day ? (12-user_month) + month : ((12-user_month) + month)-1;
        const resultYear =  month >= user_month ? year-user_year : (year - user_year)-1 ;
        
        if(valid_input(user_day,0) && valid_input(user_month,1) && valid_input(user_year,2)){
            result.textContent = `You are ${resultYear} years and ${resultMonth} months old`
        }
        else{
            result.textContent = "Invalid Input"
        }
    })

    const calendar_button = document.querySelector(".calendar-button button")
    const calendar_content = document.querySelector(".calendar-container")

    calendar_button.addEventListener('click', ()=>{
        calendar_content.classList.toggle("hidden")
    
    })
    // function nextMonth(){

    // }
    let calendar_count = 0
    
    function calendar_days(user_index){
        let grid = []
        // month in a year
        let year_interval = Interval.fromDateTimes(now.startOf('year'),now.endOf('year'))
        let monthsin_year  = year_interval.splitBy({month : 1}).map(m => m.start)
        
        // target month
        let target_month = monthsin_year[user_index]

        // days in a month
        let month_interval = Interval.fromDateTimes(target_month.startOf('month'),target_month.endOf('month'))
        let daysin_month  = month_interval.splitBy({days : 1}).map(d => d.start)

        // daysin_month array length
        const days_count = daysin_month.length
        
        // the first day of the week of target_month
        const firstday_weekday = target_month.weekday 

        const leading_empty = firstday_weekday === 7 ? 0 : firstday_weekday

        const grid_slots = 42
        const trail_empty = grid_slots - (leading_empty + days_count)

        let leading_spaces = new Array(leading_empty).fill(null)
        let trailing_spaces = new Array(trail_empty).fill(null)
        
        let first = leading_spaces.map(grid => ({origin:'leading_space', value : grid}))
        let second = daysin_month.map(grid => ({origin:'daysin_month', value: grid}))
        let third = trailing_spaces.map(grid => ({origin:'trailing_space', value: grid}))

        grid = [...first, ...second, ...third]

        return grid;
    } 

    

    function display_calendar(array){
        let grid_container = document.querySelector('.days')
        
        
        let leading_space = array.filter(e => e.origin === 'leading_space')
        let daysin_month = array.filter(e => e.origin === 'daysin_month')
        let trailing_space = array.filter(e => e.origin === 'trailing_space')
        
        leading_space.forEach(empty => { 
            let grids = document.createElement('div')
            grids.className = 'day'

            grids.textContent = ''
            grids.classList.toggle('empty')
            
            grid_container.append(grids)
    
        });
        
        daysin_month.forEach(days => { 
            let grids = document.createElement('div')
            grids.className = 'day'

            let day_number = days.value.toFormat('d')
            grids.textContent = day_number
            
            grids.addEventListener(('click'), (event) =>{
                const days = document.querySelectorAll('.day')
                const targetDate = now.plus({ months: calendar_count })

                days.forEach((d)=>{
                    d.classList.remove('active')
                })
                event.target.classList.add('active')
                updateDateInputs(day_number, targetDate.month, targetDate.year)
            })

            grid_container.append(grids)
        });

        trailing_space.forEach(empty => {
            let grids = document.createElement('div')
            grids.className = 'day'

            grids.textContent = ''
            grids.classList.toggle('empty')
            
            grid_container.append(grids)
        });
    }

    const nextButton = document.querySelector('.next')
    const prevButton = document.querySelector('.prev')

    nextButton.addEventListener(('click'),()=>{
        if((calendar_count+1) != 12){
            calendar_count++
            update_output()
        }
            return;
    })

    prevButton.addEventListener(('click'),()=>{
        if((calendar_count-1) >= 0){
            calendar_count--
            update_output()
        }
        return;
    })

    function update_output(){
        document.querySelector('.days').innerHTML =''
        display_calendar(calendar_days(calendar_count))
        
        // prototype_for_now_lolz


    }    
    update_output()
    
    
