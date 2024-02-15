import React from "react"
import Checkbox from '@mui/material/Checkbox'
import { Box, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateDefaultXAxis, formatData, getStatesList, mergeData, piRange, getHeight, getWidth } from "./utils/utils";
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
            rows: xaxis,
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
                states: states,
                min: range[0],
                max: range[1],
                index: index
            })
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
            lineList.push(<Line type="monotone" dataKey={index} strokeWidth="3" stroke={colors[i]} dot={false}/>)
        }
        let height = getHeight()
        let width = getWidth()

        return(
            <div id="StateList">
                <div id="list">
                <FormControl>
                    <FormLabel id="series">Inflation Series</FormLabel>
                    <RadioGroup
                        row
                        defaultValue={"overall"}
                        onChange={handleChangeSeries}
                    >
                        <FormControlLabel value="overall" control={<Radio />} label="Overall" />
                        <FormControlLabel value="tradeable" control={<Radio />} label="Tradeable" />
                        <FormControlLabel value="nontradeable" control={<Radio />} label="Non-Tradeable" />
                    </RadioGroup>
                </FormControl>
                    <p id="directions">{"Select up to 5 states to view at a time"}</p>
                    {listStates}
                </div>
                <div id="chart">
                        <LineChart
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
                            style={{fontSize:'10px'}}/>
                            <Tooltip content={<CustomToolTip data={this}/>} itemStyle={{fontSize: '15px'}}/>
                            <Legend />
                            {lineList}

                        </LineChart>
                        <p id="cite">Data obtained from Hazell, J., J. Herre&#241;o, E. Nakamura, and J. Steinsson (2020): “The Slope of the Phillips Curve: Evidence from U.S. States”. Inflation rates for the CPI excluding shelter for the period 1978-2017.</p>
                </div>
            </div>
        );
                    
    }
}

export default StateList