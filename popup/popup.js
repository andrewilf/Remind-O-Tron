const key = "timer"
const reminderTimeElement = document.getElementById("time")
const nextBreakElement = document.getElementById("nextBreak")
const breakDurationElement = document.getElementById("breakDuration")

const start = document.getElementById("start")
start.addEventListener("click", () => {
    
    let flag = false

    chrome.storage.local.get([key], (result) => {
        if(result[key] === undefined)
            flag = true

        if(flag) {
            
            const reminderTime = parseFloat(reminderTimeElement.value || 60)
            const breakDuration = parseFloat(breakDurationElement.value || 60)
            reminderTimeElement.value = reminderTime
            const time = Math.floor(Date.now()/1000) + (reminderTime * 60)

            createBreakIndicator(time)

            chrome.storage.local.set({[key]: reminderTime, "break": time, "breakDuration": breakDuration})
            
            chrome.runtime.sendMessage({ time: reminderTime, type: 'breakTime' }, (response) => {
                console.log(response);
            });
            chrome.runtime.sendMessage({ time: reminderTime + breakDuration, type: 'breakOver' }, (response) => {
                console.log(response);
            });
        } else {
            alert(`Already triggered. Current interval is: ${result[key]} min`)
        }
      });
   
})

const end = document.getElementById("end")
end.addEventListener("click", () => {
    chrome.storage.local.remove([key, "break"]);
    chrome.alarms.clearAll()
    nextBreakElement.innerHTML = ""
});

window.addEventListener("load", () => {
    chrome.storage.local.get("break", (result) => {
        console.log(result)
        if (result["break"] !== undefined)
            createBreakIndicator(result.break)
    })
})

const createBreakIndicator = (time) => {
    const title = document.createElement("h2")
    title.innerHTML = "Next break at:"

    const timeValue = document.createElement("h3")
    console.log(time)
    timeValue.innerHTML = new Date(time * 1000)
    timeValue.id = "timeValue"

    nextBreakElement.appendChild(title)
    nextBreakElement.appendChild(timeValue)
}

chrome.storage.onChanged.addListener(
    () => {
        const reminderTimeElement = document.getElementById("timeValue")
        chrome.storage.local.get("break", (result) => {
            if(reminderTimeElement) {
                reminderTimeElement.innerHTML = new Date(result.break * 1000)
            }
        })
        
            
    }
  )