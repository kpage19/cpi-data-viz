import React from "react"
import Checkbox from '@mui/material/Checkbox'
import { Box, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateDefaultXAxis, formatData, getStatesList, mergeData, piRange, getHeight, getWidth, createCSV, toCSV, getSeries, getSeriesIndex, getSelected, parseDate, generateData } from "./utils/utils";
import { colors } from "./utils/ColorList";
import CustomToolTip from "./CustomToolTip";
import { AUTHORS, CAPTION, SITES } from "./utils/constants";
import DateRangePicker from "./DateRangePicker";
import Citation from "./Citation";

//COMPARING SERIES FOR A GIVEN STATE
class StateGraph extends React.Component {
    constructor(props) {
        super(props)
        const xaxis = generateDefaultXAxis()
        this.state = {
            checkedState: "",
            isChecked: new Array(34).fill(false),
            checkOrder: [],
            data: [],
            states: [],
            rows: xaxis,
            csv: "",
            min: 0,
            max: 4,
            range: [0,2,4],
            index: [3,4,5],
            startYear: 1978,
            startQ: 1,
            endYear: 2017,
            endQ: 4
        }
    }
    render() {
        const states = getStatesList(this.props.csvData)
        const handleChangeStatesList = (position) => {
            let updateCheckedState = new Array(states.length).fill(false)
            updateCheckedState[position] = true
            const totalData = [states[position]]
            let checkOrder = this.state.checkOrder
            const combinedData = generateData(totalData, this.props.csvData, this.state.index, this.state.startYear, this.state.startQ, this.state.endYear, this.state.endQ)

            this.setState({
                checkedState: states[position],
                isChecked: updateCheckedState,
                checkOrder: checkOrder,
                data: combinedData.data,
                rows: combinedData.mergedData[0],
                csv: combinedData.csv,
                min: combinedData.range[0],
                max: combinedData.range[1],
                range: combinedData.ticks
            })
        }

        const handleDownload = () => {
            const blob = new Blob([this.state.csv], {type: 'text/csv;charset=utf-8,' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            const fileName = 'State CPI ' + this.state.checkedState + '.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
        }

        const handleChangeToSeries = () => {
            this.props.onChangetoSeries({graph: "series"})
        }

        const handleStartDate = (data) => {
            this.setState({
                data: data.data,
                rows: data.rows[0],
                csv: data.csv,
                min: data.min,
                max: data.max,
                startYear: data.startYear,
                startQ: data.startQ,
                range: data.range
            })
        }
        const handleEndDate = (data) => {
            this.setState({
                data: data.data,
                rows: data.rows[0],
                csv: data.csv,
                min: data.min,
                max: data.max,
                endYear: data.endYear,
                endQ: data.endQ,
                range: data.range})
        }
        let listStates = [];
        for(let i = 0; i < states.length; i++) {
            listStates.push(<RadioGroup id="checkboxList" key={states[i]}>
                <FormControlLabel id="checkbox"
                        label={states[i]}
                        control={<Radio 
                                    checked={this.state.isChecked[i]}
                                    onChange={() =>  handleChangeStatesList(i)}/>}
                    /></RadioGroup>);
        }

        let lineList = [<ReferenceLine y={0} stroke='black' strokeWidth={2}/>]
        for(let i = 3; i <= 5; i++) {
            const series = getSeries(i)
            lineList.push(<Line key={series} type="linear" dataKey={series} strokeWidth="2" stroke={colors[i-3]} dot={false}/>)
        }
        let height = getHeight()
        let width = getWidth()

        return(
            <div id="StateList">

                <div id="list">
                    <div id="buttonContainer">
                        <div id="button">
                            <button id="changeGraph" onClick={handleChangeToSeries}>Compare States</button>
                        </div>
                        {this.state.checkedState !== "" ?  
                            <div id="button">
                                <button id="download" onClick={handleDownload}>Download Data</button>
                            </div> 
                        : null}
                    </div>
                    <DateRangePicker
                        startYear={this.state.startYear}
                        startQ={this.state.startQ}
                        endYear={this.state.endYear}
                        endQ={this.state.endQ}
                        csvData={this.props.csvData}
                        data={this.state.data}
                        index={this.state.index}
                        onStartDateChange={handleStartDate}
                        onEndDateChange={handleEndDate}
                    />
                    <p id="directions">{"Select up to 5 states to view at a time"}</p>
                    {listStates}
                </div>
                <div id="chart" style={{width: width}}>
                        <LineChart
                            id="lineChart"
                            width={width}
                            height={height}
                            data={this.state.rows}
                            margin={{
                            top: 5,
                            right: 20,
                            left: 0,
                            bottom: 0,
                            }}
                        >
                            <XAxis dataKey="quarter"
                            style={{fontSize:'10px'}}
                            />
                            <YAxis dataKey={this.state.data[0]}
                            ticks={this.state.range}
                            domain={[this.state.min, this.state.max]}
                            style={{fontSize:'10px'}}
                            label={{ value: 'Percent Change From Year Ago, Percent', angle: -90, position: 'insideStart' }}/>
                            <Tooltip content={<CustomToolTip data={this}/>} itemStyle={{fontSize: '15px'}}/>
                            <Legend />
                            {lineList}

                        </LineChart>
                        <Citation/>
                </div>
            </div>
        );
                    
    }
}

export default StateGraph