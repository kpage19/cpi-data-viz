import { CAPTION, SITES, AUTHORS } from "./utils/constants"

const Citation = () => {
    return(
        <p id="cite">
            {CAPTION[0]}
            <a href={SITES[0]}>{AUTHORS[0]}</a>
            {", "} 
            <a href={SITES[1]}>{AUTHORS[1]}</a>
            {", "} 
            <a href={SITES[2]}>{AUTHORS[2]}</a>
            {", and "} 
            <a href={SITES[3]}>{AUTHORS[3]}</a>{CAPTION[1]}
        </p>
    )
}

export default Citation