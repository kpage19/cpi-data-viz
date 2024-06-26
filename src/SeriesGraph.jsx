import React from "react"
import Checkbox from '@mui/material/Checkbox'
import { Box, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateDefaultXAxis, formatData, getStatesList, mergeData, piRange, getHeight, getWidth, createCSV, toCSV, getSeries, getSeriesIndex, getSelected, parseDate, generateData } from "./utils/utils";
import { colors } from "./utils/ColorList";
import CustomToolTip from "./CustomToolTip";
import DateRangePicker from "./DateRangePicker";
import Citation from "./Citation";

//COMPARING STATES IN A GIVEN SERIES
class SeriesGraph extends React.Component {
    constructor(props) {
        super(props)
        const xaxis = generateDefaultXAxis()
        this.state = {
            isChecked: new Array(34).fill(false),
            checkOrder: [],
            data: [],
            states: [],
            rows: xaxis,
            csv: "",
            min: 0,
            max: 4,
            range: [0,2,4],
            index: [5],
            startYear: 1978,
            startQ: 1,
            endYear: 2017,
            endQ: 4
        }
    }
    render() {
        const states = getStatesList(this.props.csvData)
        const handleChangeStatesList = (position) => {
            const updateCheckedState = this.state.isChecked.map((item, index) =>
                index == position ? !item : item
            )

            const totalData = getSelected(updateCheckedState, states)
            let checkOrder = this.state.checkOrder
            if(this.state.checkOrder.length === 5 && updateCheckedState[position]) {
                return null
            }
            if(!this.state.isChecked[position]){
                checkOrder.push(position)
            }
            else {
                checkOrder = checkOrder.filter((elem) => elem !== position)
            }
    
            const combinedData = generateData(totalData, this.props.csvData, this.state.index, this.state.startYear, this.state.startQ, this.state.endYear, this.state.endQ)

            this.setState({
                isChecked: updateCheckedState,
                checkOrder: checkOrder,
                data: combinedData.data,
                rows: combinedData.mergedData,
                csv: combinedData.csv,
                min: combinedData.range[0],
                max: combinedData.range[1],
                range: combinedData.ticks
            })
        }

        const handleChangeSeries = (position) => {
            const updateCheckedState = this.state.isChecked.map((item, index) =>
                index == position ? !item : item
            )
            const index = [getSeriesIndex(position.target.defaultValue)]
            const totalData = getSelected(updateCheckedState, states)
            let checkOrder = this.state.checkOrder
    
            const combinedData = generateData(totalData, this.props.csvData, index, this.state.startYear, this.state.startQ, this.state.endYear, this.state.endQ)

            this.setState({
                isChecked: updateCheckedState,
                checkOrder: checkOrder,
                data: combinedData.data,
                rows: combinedData.mergedData,
                csv: combinedData.csv,
                min: combinedData.range[0],
                max: combinedData.range[1],
                index: index,
                range: combinedData.ticks
            })
        }

        const handleDownload = () => {
            const blob = new Blob([this.state.csv], {type: 'text/csv;charset=utf-8,' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            const fileName = 'state_cpi_' + getSeries(this.state.index[0]) + '.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
        }

        const handleStartDate = (data) => {
            this.setState({
                data: data.data,
                rows: data.rows,
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
                rows: data.rows,
                csv: data.csv,
                min: data.min,
                max: data.max,
                endYear: data.endYear,
                endQ: data.endQ,
                range: data.range})
        }

        const handleChangeToState = () => {
            this.props.onChangeToState({graph: "state"})
        }

        let listStates = [];
        for(let i = 0; i < states.length; i++) {
            listStates.push(<Box id="checkboxList" key={states[i]}>
                <FormControlLabel id="checkbox"
                        label={states[i]}
                        control={<Checkbox 
                                    checked={this.state.isChecked[i]}
                                    onChange={() =>  handleChangeStatesList(i)}/>}
                    /></Box>);
        }

        let lineList = [<ReferenceLine y={0} stroke='black' strokeWidth={2}/>]
        for(let i = 0; i < this.state.data.length; i++) {
            const index = states[this.state.checkOrder[i]]
            lineList.push(<Line key={index} type="linear" dataKey={index} strokeWidth="2" stroke={colors[i]} dot={false}/>)
        }
        let height = getHeight()
        let width = getWidth()

        return(
            <div id="StateList">
                <div id="list">
                <div id="buttonContainer">
                    <div id="button">
                        <button id="changeGraph" onClick={handleChangeToState}>Compare Series</button>
                    </div>
                    {this.state.checkOrder.length !== 0 ?  
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
                <FormControl>
                    <FormLabel id="series">Inflation Series</FormLabel>
                    <RadioGroup                         
                        defaultValue={"overall"}
                        onChange={handleChangeSeries}
                    >
                        <FormControlLabel id="seriesGroup" value="overall" control={<Radio size="small"/>} label="Overall" />
                        <FormControlLabel id="seriesGroup" value="tradeable" control={<Radio size="small"/>} label="Tradeable Sector" />
                        <FormControlLabel id="seriesGroup" value="nontradeable" control={<Radio size="small"/>} label="Non-Tradeable Sector" />
                    </RadioGroup>
                </FormControl>
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

export default SeriesGraph
