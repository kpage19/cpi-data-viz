import React from "react";
import SeriesGraph from "./SeriesGraph";
import StateGraph from "./StateGraph";

class GraphWrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            graph: "state"
        }
        
    }

    render () {

        const handleChangeToState = (data) => {
            this.setState({graph: "state"})
        }

        const handleChangeToSeries = (data) => {
            this.setState({graph: "series"})
        }
        return(
            <div className="App">
                <header className="App-header">
                   {this.state.graph === "series" ? 
                        <SeriesGraph 
                            className="list" 
                            csvData={this.props.csvData}
                            graph={this.state.graph}
                            onChangeToState={handleChangeToState}
                        /> :
                        <StateGraph
                            className="list"
                            csvData={this.props.csvData}
                            graph={this.state.graph}
                            onChangetoSeries={handleChangeToSeries}/>
                   }  
                
                </header>
            </div>
        )
    }
}

export default GraphWrapper