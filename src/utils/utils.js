import { END_DATE, MAX_TIME, START_DATE } from "./constants"

export function generateDefaultXAxis() {
    let date = START_DATE
    let list = [date]

    for(let i = 0; i < MAX_TIME; i++) {
        date = incDate(date)
        list.push({quarter: date})
    }
    return list
}

export function getStatesList(data) {
    let list = []

    for(let i = 1; i < data.length;i++) {
        if(!list.includes(data[i][0]) && data[i][0] !== ""){
            list.push(data[i][0])
        }
    }
    return list
}

export function getNumQs(startY, startQ, endY, endQ) {
    if(startY === endY) {
        return (endQ - startQ + 1)
    }
    let quarters = 4 * (endY - startY - 1)
    quarters += (4 - startQ + 1)
    return quarters + endQ
}

export function createDate(data) {
    let dates = new Array(data.length)

    for(let i = 0; i < dates.length; i++) {
        dates[i] = data[i][1] + " Q" + data[i][2]
    }
    return dates
}

export function formatData(data, series, startY, startQ, endY, endQ) {
    let formattedData = new Array(data.length)
    const numQuarters = getNumQs(startY, startQ, endY, endQ)
    for(let i = 0; i < data.length; i++) {
        let stateData = []
        const state = data[i][0][0]
        for(let j = 0; j < data[i].length; j++) {
            if(series.length === 1) {
                stateData.push({
                    quarter: data[i][j][1] + " Q" + data[i][j][2],
                    [state]: data[i][j][series]
                })
            }
            else {
                stateData.push({
                    quarter: data[i][j][1] + " Q" + data[i][j][2],
                    nontradeable: data[i][j][3],
                    tradeable: data[i][j][4],
                    overall: data[i][j][5]
                })
            }
            
        }
        formattedData[i] = stateData
    }
    
    return formattedData
}

export function findMinDate(data) {
    let mins = []
    for(let i = 0; i < data.length; i++){
        for(let j = 0; j < data[i].length; j++){
            mins.push(data[i][j].quarter)
        }
    }
    mins.sort()
    return mins[0]
}

export function incDate(date) {
    if(date.substring(date.length-1) !== "4") {
        const year = date.substring(0, date.length-1)
        const quarter = parseInt(date.substring(date.length-1)) +1
        return year + quarter
    }
    else {
        let year = parseInt(date.substring(0,4))
        year += 1
        return year + " Q1"
    }
}

export function mergeData(data, endY, endQ){
    if(data.length === 0) {
        return []
    }
    const end_date = incDate(endY + " Q" + endQ)
    let mergedData = []
    let date = findMinDate(data)

    while(date !== end_date) {
        let point = {
            quarter: date
        }

        for(let i = 0; i < data.length; i++){
            let state = Object.keys(data[i][0]).filter((elem) => elem !== "quarter")
            state = state[0]
            let pi = data[i].filter((elem) => elem.quarter === date)
            if(pi[0] == undefined) {
                pi = NaN
            }
            else {
                pi = pi[0][state]
            }
            point[state] = pi
        }
        mergedData.push(point)
        date = incDate(date)
    }

    return mergedData
}

export function piRange(data) {
    let mins = []
    let max = []
    for(let i = 0; i < data.length; i++) {
        const keys = Object.keys(data[i][0])
        mins.push(Math.floor(Math.min(...data[i].map((elem) => elem[keys[1]]))))
        max.push(Math.ceil(Math.max(...data[i].map((elem) => elem[keys[1]]))))
        if(keys.length > 2) {
            mins.push(Math.floor(Math.min(...data[i].map((elem) => elem[keys[2]]))))
            max.push(Math.ceil(Math.max(...data[i].map((elem) => elem[keys[2]]))))
            mins.push(Math.floor(Math.min(...data[i].map((elem) => elem[keys[3]]))))
            max.push(Math.ceil(Math.max(...data[i].map((elem) => elem[keys[3]]))))
        }        
    }
    let minval = Math.min(...mins)
    let maxval = Math.max(...max)

    if(minval % 2 !== 0) {
        minval -= 1
    }
    if(maxval % 2 !== 0) {
        maxval += 1
    }
    return [minval, maxval]
}

export function getWidth() {
    if(window.innerWidth >= 850 && window.innerWidth < 1700) {
        return 0.95 * (window.innerWidth - 200)
    }
    else if( window.innerWidth >= 1700) {
        return 1300
    }
    else {
        return 0.9 * window.innerWidth
    }
}

export function getHeight() {
    if(window.innerWidth >= 850 && window.innerWidth < 1700){
        return 0.75 * window.innerHeight;
    }
    else if(window.innerWidth >= 1700) {
        return 750
    }
    else {
        return 0.45 * window.innerHeight
    }

}

export function toCSV(data, series, series_ind) {

    let csvContent = "state,year,quarter," 
    
    for(let i = 0; i < series.length; i++) {
        csvContent += series[i]
        if(i < series.length - 1) {
            csvContent += ","
        }
    }
    
    csvContent += "\n"
    
    if(series.length === 1) {
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < data[i].length; j++) {
                csvContent += data[i][j][0] + ',' + data[i][j][1] + ',' + data[i][j][2] + ',' + data[i][j][series_ind] + '\n'
            }
        }
    }
    else {
        for(let i = 0; i < data[0].length; i++) {
            csvContent += data[0][i][0] + ',' + data[0][i][1] + ',' + data[0][i][2] + ',' + data[0][i][3] + ',' + data[0][i][4] + ',' + data[0][i][5] + '\n'
        }
    }
    
    return csvContent
}

export function getSeries(series) {
    if(series === 3) {
        return "nontradeable"
    }
    else if(series === 4) {
        return "tradeable"
    }
    else {
        return "overall"
    }
}

export function getSeriesIndex(series) {
    if(series === "nontradeable") {
        return 3
    }
    else if(series === "tradeable") {
        return 4
    }
    return 5
}

export function getSelected(boolList, states) {
    let totalData = []
    for(let i = 0; i < boolList.length; i++) {
        if(boolList[i] === true) {
            totalData.push(states[i])
        }

    }
    return totalData
}

export function generateData(selected, csvData, index, startY, startQ, endY, endQ) {
    let dataBundle = {}
    let statesData = []
    for(let i = 0; i < selected.length; i++) {
        statesData.push(csvData.filter((elem) => elem[0] === selected[i] && 
            ((elem[1] == startY && 
            elem[2] >= startQ) || 
            elem[1] > startY) &&
            ((elem[1] == endY &&
            elem[2] <= endQ) ||
            elem[1] < endY)))
    }
    
    let series = [getSeries(index[0])]
    if(index.length > 1) {
        series.push(getSeries(index[1]))
        series.push(getSeries(index[2]))
    }
    const csv = toCSV(statesData, series, index)
    const formattedData = formatData(statesData, index, startY, startQ, endY, endQ)

    let mergedData = []
    let range = []
    if(selected.length !== 0) {
        if(index.length === 1){
            mergedData = mergeData(formattedData, endY, endQ)
        }
        else {
            mergedData = formattedData
        }
        range = piRange(formattedData)
    }
    else{ 
        mergedData = generateDefaultXAxis()
        range = [0,2]
    }
    let ticks = []
    for(let i = range[0]; i <= range[1]; i+=2){
        ticks.push(i)
    }
    dataBundle = {
        data: selected, 
        csv: csv,
        formattedData: formattedData,
        mergedData: mergedData,
        range: range,
        ticks: ticks
    }
    
    return dataBundle
}

export function parseDate(date) {
    let parsedDate = {}
    const year = parseInt(date.substring(0,4))
    const quarter = parseInt(date.substring(date.length - 1))
    if(isNaN(year)|| isNaN(quarter) || year < 1978 || year > 2017 || quarter < 1 || quarter > 4) {
        return null
    }
    parsedDate.year = year
    parsedDate.quarter = quarter
    return parsedDate
}