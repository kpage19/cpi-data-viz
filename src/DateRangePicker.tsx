import { parseDate, generateData } from "./utils/utils"

const DateRangePicker = (props: {
    startYear: number,
    startQ: number, 
    endYear: number,
    endQ: number,
    csvData: [string],
    data: any,
    index: number,
    onStartDateChange: any,
    onEndDateChange: any
}) => {
    
    const handleSetStart = (data: any) => {
        const val = data.currentTarget.value.toUpperCase()
        const end_date = props.endYear + " Q" + props.endQ
        if(val.length !== 7 || val > end_date) {
            return null
        }
        const date = parseDate(val)
        
        if(date !== null && val <= end_date) {
            const combinedData: any = generateData(props.data, props.csvData, props.index, date.year, date.quarter, props.endYear, props.endQ)
            props.onStartDateChange({
                data: combinedData.data,
                rows: combinedData.mergedData,
                csv: combinedData.csv,
                min: combinedData.range[0],
                max: combinedData.range[1],
                startYear: date.year,
                startQ: date.quarter,
                range: combinedData.ticks
            })
        }
    }

    const handleSetEnd = (data: any) => {
    
        const val = data.currentTarget.value.toUpperCase()
        const start_date = props.startYear + " Q" + props.startQ
        if(val.length !== 7 || val < start_date) {
            return null
        }
        const date = parseDate(val)
        
        if(date !== null && val >= start_date ) {
            const combinedData: any = generateData(props.data, props.csvData, props.index, props.startYear, props.startQ, date.year, date.quarter)

            props.onEndDateChange({
                data: combinedData.data,
                rows: combinedData.mergedData,
                csv: combinedData.csv,
                min: combinedData.range[0],
                max: combinedData.range[1],
                endYear: date.year,
                endQ: date.quarter,
                range: combinedData.ticks})
        }
    }
    
    return(
        <div id="date">
            <p id="dateLabel">{"Start:    "}</p>
            <input id="dateLabel" type="text" maxLength={7} size={5} placeholder={"1978 Q1"} onChange={handleSetStart}></input>
            <p id="dateLabel">{"\tEnd:      "}</p>
            <input id="dateLabel" type="text"  maxLength={7} size={5} placeholder={"2017 Q4"} onChange={handleSetEnd}></input>
        </div>
    )
}

export default DateRangePicker