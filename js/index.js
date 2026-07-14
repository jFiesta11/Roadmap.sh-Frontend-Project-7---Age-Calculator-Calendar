// DateTime Import : Central Unit for calendar's data

import { DateTime, Interval } from 'https://cdn.jsdelivr.net/npm/luxon@3.4.4/+esm';
    let now = DateTime.now().toLocal()
    const year = now.year
    const month = now.month
    const day = now.day

// function to validate if each of the 3 input has its respective value
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
// users input 
let user_day;
let user_month;
let user_year;

    const input = document.querySelectorAll(".calendar-input")

    // function updates the inputs for when a grid is clicked
    function updateDateInputs(day, month, year) {
        // pads a zero before the value of day and month if it is a single digit
        input[0].value = String(day).padStart(2, '0')
        input[1].value = String(month).padStart(2, '0')
        input[2].value = String(year)
    }

    // function that clears the active attribute: is used later on
    function clearDaySelection() {
        document.querySelectorAll('.day').forEach((dayElement) => {
            dayElement.classList.remove('active')
        })
    }
    // month label gets updated as month value changes or the calendar moves
    function updateMonthLabel() {
        const monthLabel = document.querySelector('.month h5')
        const targetMonth = currentMonth.plus({ months: calendar_count })
        
        monthLabel.textContent = `${targetMonth.toFormat('MMMM')} ${targetMonth.year}`
    }
    
    // handles auto tabbing
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

        // formula to calculate user's age in months and years
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
    // returns the constant value of the starting month fo rreference
    const startingMonth = DateTime.fromObject({ year: 2026, month: 7, day: 1 }, { zone: now.zone })
    let currentMonth = startingMonth
    let calendar_count = 0

    function calendar_days(targetMonth){
        let grid = []
        // gets the interval of days in each month. returns an object
        let month_interval = Interval.fromDateTimes(targetMonth.startOf('month'), targetMonth.endOf('month'))
        // retrieves the value from the variable above returns an array (map)
        let daysin_month = month_interval.splitBy({days : 1}).map(d => d.start)

        // VVV The calendar is formatted via getting the empty slots of the leading days and the trailing days and the number of days in month 
        // LEADING EMPTY || DAYS IN THE MONTH || TRAILING EMPTY
        // 
        // LEADING EMPTY = if the first day of the week is a sunday there is ZERO leading empty however if it isnt the value of that day is where the calendar starts
        //  E.I.: first day of the week = sunday || 0 leading empty  #### first day of the week = thursday  || 4 leading empty
        // 
        // Days in month is a given value just get the length of daysin_month
        // 
        // TRAILING EMPTY = get the difference of the total grids(42 || 6*7(not funny)) and the sum of LEADING EMPTY and DAYS IN THE MONTH

        // Just stack the arrays and tadah! you got the layout you need per month :D  
        const days_count = daysin_month.length
        const firstday_weekday = targetMonth.weekday
        const leading_empty = firstday_weekday === 7 ? 0 : firstday_weekday
        const grid_slots = 42
        const trail_empty = grid_slots - (leading_empty + days_count)

        let leading_spaces = new Array(leading_empty).fill(null)
        let trailing_spaces = new Array(trail_empty).fill(null)

        // creates a map so these data can be passed throughout the code
        let first = leading_spaces.map(grid => ({origin:'leading_space', value : grid}))
        let second = daysin_month.map(grid => ({origin:'daysin_month', value: grid}))
        let third = trailing_spaces.map(grid => ({origin:'trailing_space', value: grid}))

        grid = [...first, ...second, ...third]

        return grid;
    }
    // handles the display of each days given the array returned above and the month date
    function display_calendar(array, monthDate){
        let grid_container = document.querySelector('.days')
        
        
        let leading_space = array.filter(e => e.origin === 'leading_space')
        let daysin_month = array.filter(e => e.origin === 'daysin_month')
        let trailing_space = array.filter(e => e.origin === 'trailing_space')

        // each item within each arrays are created into an UI element with its respective css styles and attributes
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

    // next button updates the month header and checks if it is beyond the current month
    nextButton_month.addEventListener(('click'),()=>{
        const nextMonth = currentMonth.plus({ months: calendar_count + 1 })
        if(nextMonth <= now.startOf('month')){
            calendar_count++
            update_output()
        }
    })
    
    // prev button updates the month header and checks if it is below the year limit = 1950
    // btw the year updates once month goes past the value 12 or below 1, increasing or decreasing year depending on its incre or decrementation
    prevButton_month.addEventListener('click', () => {
        const yearLimit = DateTime.fromObject({ year: 1950, month: 1, day: 1 }, { zone: now.zone })
        const previousMonth = currentMonth.minus({ months: 1 })

        if (previousMonth >= yearLimit) {
            calendar_count--
            update_output()
        }
    })
    // this handles updates once variables value changes
    function update_output(){
        const targetMonth = currentMonth.plus({ months: calendar_count })
        document.querySelector('.days').innerHTML =''
        display_calendar(calendar_days(targetMonth), targetMonth)
        updateMonthLabel()
    }

    // this code block up to line 331  handles the year and month selection | its goal is to simply increase UX and overall efficiency
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

        // handles the minimum and maximum of values
        // ensures the years and monthts shown never go past 2026 and 1950
        // also ensures that only 8 grids are shown 
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
    // handles each month to be shown
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
    // handles user navigation for year and month selection for efficient navigation compared to scrolling
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
