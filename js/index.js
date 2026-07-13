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
            result.textContent = `You are ${resultYear} years and ${resultMonth} months old`
            result.textContent = "Invalid Input"
        }
    })

    const calendar_button = document.querySelector(".calendar-button button")
    const calendar_content = document.querySelector(".calendar-container")

    calendar_button.addEventListener('click', ()=>{
        calendar_content.classList.toggle("hidden")
    
    })

