import { colors } from "./utils/ColorList"

const CustomToolTip = (props: any) => {
    if(!props.active || props.payload.length === 0) {
        return null
    }
    const fields = props.payload[0].payload
    let tooltip = [<div id='tooltip'>{props?.payload[0]?.payload.name}</div>]
    const keyList = Object.keys(fields).sort()

    for(let i = 0; i < keyList.length;  i++) {
        if(keyList[i] === "name") {
            continue
        }
        const line = keyList[i] + ": " + fields[keyList[i]]
        tooltip.push(<div id='tooltip' style={{color:colors[i]}}>{line}</div>)
    }
    return (
        <div id='tooltip'>{tooltip}</div>
    )
}

export default CustomToolTip