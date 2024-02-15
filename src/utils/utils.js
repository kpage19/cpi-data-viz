export function generateDefaultXAxis() {
    let date = "1978 Q1"
    let list = [date]

    for(let i = 0; i < 160; i++) {
        date = incDate(date)
        list.push({name: date})
    }
    return list
}

export function getStatesList(data) {
    let list = []

    for(let i = 1; i < data.length;i++) {
        if(!list.includes(data[i][0])){
            list.push(data[i][0])
        }
    }

    return list
}

export function createDate(data) {
    let dates = []

    for(let i = 0; i < data.length; i++) {
        const date = data[i][1] + " Q" + data[i][2]
        dates.push(date)
    }
    return dates
}

export function getInflation(data) {
    let inflation = []

    for(let i = 0; i < data.length; i++) {
        inflation.push(data[i][5])
    }
    
    return inflation
}

export function formatData(data, series) {
    let formattedData = []

    for(let i = 0; i < data.length; i++) {
        let stateData = []
        const state = data[i][0][0]
        for(let j = 0; j < data[i].length; j++) {
            stateData.push({
                name: data[i][j][1] + " Q" + data[i][j][2],
                [state]: data[i][j][series]
            })
        }
        formattedData.push(stateData)
    }
    
    return formattedData
}

export function findMinDate(data) {
    let mins = []
    for(let i = 0; i < data.length; i++){
        mins.push(data[i][0].name)
    }
    mins.sort()
    return mins[0]
}

export function incDate(date) {
    if(date.substring(date.length-1) !== "4") {
        const year = date.substring(0, date.length-1)
        let quarter = parseInt(date.substring(date.length-1))
        quarter += 1
        return year + quarter
    }
    else {
        let year = parseInt(date.substring(0,4))
        year += 1
        return year + " Q1"
    }
}

export function mergeData(data){
    if(data.length === 0) {
        return []
    }
    let mergedData = []
    let date = findMinDate(data)

    while(date !== "2018 Q1") {
        let point = {
            name: date
        }

        for(let i = 0; i < data.length; i++){
            let state = Object.keys(data[i][0]).filter((elem) => elem !== "name")
            state = state[0]
            let pi = data[i].filter((elem) => elem.name === date)
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
    }

    return [Math.min(...mins), Math.max(...max)]
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
