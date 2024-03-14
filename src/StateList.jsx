import React from "react"
import Checkbox from '@mui/material/Checkbox'
import { Box, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateDefaultXAxis, formatData, getStatesList, mergeData, piRange, getHeight, getWidth, createCSV, toCSV, getSeries } from "./utils/utils";
import { colors } from "./utils/ColorList";
import CustomToolTip from "./CustomToolTip";

class StateList extends React.Component {
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
            max: 5,
            index: 5
        }
    }
    render() {
        const states = getStatesList(this.props.csvData)
        const handleChangeStatesList = (position) => {
            const updateCheckedState = this.state.isChecked.map((item, index) =>
                index == position ? !item : item
            )

            let totalData = []
            for(let i = 0; i < states.length; i++) {
                if(updateCheckedState[i] === true) {
                    totalData.push(states[i])
                }
                else {
                    totalData.filter((elem) => elem !== states[i])
                }
            }

            let checkedStatesList = []
            let formattedData = []
            let mergedData = []
            let range = []
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
    
            for(let i = 0; i < totalData.length; i++) {
                checkedStatesList.push(this.props.csvData.filter((elem) => elem[0] === totalData[i]))
            }
            let series = "overall"
            if(this.state.index === 4) {
                series = "tradeable"
            }
            if(this.state.index === 3) {
                series = "nontradeable"
            }
            const csv = toCSV(checkedStatesList, series, this.state.index)
            formattedData = formatData(checkedStatesList, this.state.index)

            if(checkOrder.length !== 0) {
                mergedData = mergeData(formattedData)
                range = piRange(formattedData)
            }
            else{ 
                mergedData = generateDefaultXAxis()
                range = [0,2]
            }
    
            this.setState({
                isChecked: updateCheckedState,
                checkOrder: checkOrder,
                data: totalData,
                rows: mergedData,
                csv: csv,
                min: range[0],
                max: range[1],
            })
        }

        const handleChangeSeries = (position) => {
            const updateCheckedState = this.state.isChecked.map((item, index) =>
                index == position ? !item : item
            )
            let index = 5
            if(position.target.defaultValue === "tradeable"){
                index = 4
            }
            if(position.target.defaultValue === "nontradeable"){
                index = 3
            }
            let totalData = []
            for(let i = 0; i < states.length; i++) {
                if(updateCheckedState[i] === true) {
                    totalData.push(states[i])
                }
                else {
                    totalData.filter((elem) => elem !== states[i])
                }
            }

            let checkedStatesList = []
            let formattedData = []
            let mergedData = []
            let range = []
            let checkOrder = this.state.checkOrder
    
            for(let i = 0; i < totalData.length; i++) {
                checkedStatesList.push(this.props.csvData.filter((elem) => elem[0] === totalData[i]))
            }
            const csv = toCSV(checkedStatesList, position.target.defaultValue, index)
            formattedData = formatData(checkedStatesList, index)

            if(checkOrder.length !== 0) {
                mergedData = mergeData(formattedData)
                range = piRange(formattedData)
            }
            else{ 
                mergedData = generateDefaultXAxis()
                range = [0,2]
            }
    
            this.setState({
                isChecked: updateCheckedState,
                checkOrder: checkOrder,
                data: totalData,
                rows: mergedData,
                csv: csv,
                states: states,
                min: range[0],
                max: range[1],
                index: index
            })
        }

        const handleDownload = () => {
            const blob = new Blob([this.state.csv], {type: 'text/csv;charset=utf-8,' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            const fileName = 'state_cpi_' + getSeries(this.state.index) + '.csv'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
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

        let lineList = []
        for(let i = 0; i < this.state.data.length; i++) {
            const index = states[this.state.checkOrder[i]]
            lineList.push(<Line key={index} type="monotone" dataKey={index} strokeWidth="3" stroke={colors[i]} dot={false}/>)
        }
        let height = getHeight()
        let width = getWidth()

        return(
            <div id="StateList">

                <div id="list">
                    {this.state.checkOrder.length !== 0 ?  
                        <div id="button">
                            <button id="download" onClick={handleDownload}>Download Data</button>
                        </div> 
                    : null}
                
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
                            <XAxis dataKey="name"
                            style={{fontSize:'10px'}}
                            />
                            <YAxis dataKey={this.state.data[0]}
                            domain={[this.state.min, this.state.max]}
                            style={{fontSize:'10px'}}
                            label={{ value: 'Percent Change From Year Ago, Percent', angle: -90, position: 'insideStart' }}/>
                            <Tooltip content={<CustomToolTip data={this}/>} itemStyle={{fontSize: '15px'}}/>
                            <Legend />
                            {lineList}

                        </LineChart>
                        <p id="cite">
                            {"Data obtained from "}
                            <a href="https://sites.google.com/view/jadhazell/home">Hazell, J.</a>
                            {", "} 
                            <a href="https://sites.google.com/view/juanherreno">J. Herre&#241;o</a>
                            {", "} 
                            <a href="https://eml.berkeley.edu/~enakamura/">E. Nakamura</a>
                            {", and "} 
                            <a href="https://eml.berkeley.edu/~jsteinsson/">J. Steinsson</a> (2020): “The Slope of the Phillips Curve: Evidence from U.S. States”. Inflation rates for the CPI excluding shelter for the period 1978-2017.</p>
                </div>
            </div>
        );
                    
    }
}

export default StateList