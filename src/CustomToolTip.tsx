import { colors } from "./utils/ColorList"

const CustomToolTip = (props: any) => {
    if(!props.active || props.payload.length === 0) {
        return null
    }
    const fields = props.payload[0].payload
    let tooltip = [<div id='tooltip' key="tooltip">{props?.payload[0]?.payload.quarter}</div>]
    const keyList = Object.keys(fields).sort()

    for(let i = 0; i < props.payload.length;  i++) {
        if(keyList[i] === "quarter") {
           // continue
        }
        const index = props.data.state.checkOrder[i]
        const line = props.payload[i].name + ": " + props.payload[i].value
        tooltip.push(<div id='tooltip' style={{color:colors[i]}} key={keyList[i]}>{line}</div>)
    }
    return (
        <div id='tooltip'>{tooltip}</div>
    )
}

export default CustomToolTip