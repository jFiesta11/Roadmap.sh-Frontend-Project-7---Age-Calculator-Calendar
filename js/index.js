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

    function updateMonthLabel() {
        const monthLabel = document.querySelector('.month h5')
        const targetMonth = currentMonth.plus({ months: calendar_count })

        monthLabel.textContent = `${targetMonth.toFormat('MMMM')} ${targetMonth.year}`
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
        calendar_content.classList.toggle("show")
    
    })
    const startingMonth = DateTime.fromObject({ year: 2026, month: 7, day: 1 }, { zone: now.zone })
    let currentMonth = startingMonth
    let calendar_count = 0

    function calendar_days(targetMonth){
        let grid = []

        let month_interval = Interval.fromDateTimes(targetMonth.startOf('month'), targetMonth.endOf('month'))
        let daysin_month = month_interval.splitBy({days : 1}).map(d => d.start)

        const days_count = daysin_month.length
        const firstday_weekday = targetMonth.weekday
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

    function display_calendar(array, monthDate){
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

                days.forEach((d)=>{
                    d.classList.remove('active')
                })
                event.target.classList.add('active')
                updateDateInputs(day_number, monthDate.month, monthDate.year)
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

    const nextButton_month = document.querySelector('.next')
    const prevButton_month = document.querySelector('.prev')

    nextButton_month.addEventListener(('click'),()=>{
        const nextMonth = currentMonth.plus({ months: calendar_count + 1 })
        if(nextMonth <= now.startOf('month')){
            calendar_count++
            update_output()
        }
    })

    prevButton_month.addEventListener(('click'),()=>{
        calendar_count--
        update_output()
    })

    function update_output(){
        const targetMonth = currentMonth.plus({ months: calendar_count })
        document.querySelector('.days').innerHTML =''
        display_calendar(calendar_days(targetMonth), targetMonth)
        updateMonthLabel()
    }

    const month_button = document.querySelector('.month')
    const month_year_options = document.querySelector('.month-year-options')
    const prev_year_button = document.querySelector('.prev_year')
    const next_year_button = document.querySelector('.next_year')

    month_year_options.classList.toggle('hidden')

    let yearWindowStart = 1950
    let selectedYear = 2026
    let selectedMonth = 7

    function show_yearMonth_options(){
        month_year_options.innerHTML = ''

        const yearsToShow = 8
        const maxYear = Math.min(year, 2026)
        const minYear = Math.max(1950, yearWindowStart)
        const startYear = Math.min(minYear, maxYear - yearsToShow + 1)

        for (let y = startYear; y < startYear + yearsToShow; y++) {
            const element_container = document.createElement('button')
            element_container.className = 'yearMonth_grid'
            element_container.textContent = y
            element_container.addEventListener('click', () => {
                selectedYear = y
                show_month_options(selectedYear)
            })
            month_year_options.appendChild(element_container)
        }
    }

    function show_month_options(yearToShow){
        month_year_options.innerHTML = ''

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        monthNames.forEach((monthName, index) => {
            const month_button_item = document.createElement('button')
            month_button_item.className = 'yearMonth_grid'
            month_button_item.textContent = `${monthName}`
            month_button_item.addEventListener('click', () => {
                selectedMonth = index + 1
                currentMonth = DateTime.fromObject({ year: yearToShow, month: selectedMonth, day: 1 }, { zone: now.zone })
                calendar_count = 0
                update_output()

                month_year_options.classList.add('hidden')
                document.querySelector('.days').classList.remove('hidden')
                document.querySelector('.days-container').classList.remove('hidden')
                document.querySelector('.prev_year').classList.remove('show')
                document.querySelector('.next_year').classList.remove('show')
                prevButton_month.classList.remove('hidden')
                nextButton_month.classList.remove('hidden')
                month_button.classList.remove('adjust')
            })
            month_year_options.appendChild(month_button_item)
        })
    }

    prev_year_button.addEventListener('click', () => {
        yearWindowStart = Math.max(1950, yearWindowStart - 8)
        show_yearMonth_options()
    })

    next_year_button.addEventListener('click', () => {
        yearWindowStart = Math.min(2026, yearWindowStart + 8)
        show_yearMonth_options()
    })

    month_button.addEventListener('click', ()=>{
        month_button.classList.toggle('adjust')
        document.querySelector('.days').classList.toggle('hidden')
        document.querySelector('.month-year-options').classList.toggle('hidden')
        document.querySelector('.days-container').classList.toggle('hidden')

        document.querySelector('.prev_year').classList.toggle('show')
        document.querySelector('.next_year').classList.toggle('show')

        prevButton_month.classList.toggle('hidden')
        nextButton_month.classList.toggle('hidden')

        show_yearMonth_options()
    
    })
    update_output()
