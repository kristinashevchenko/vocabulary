import React, {Component} from 'react';
import {Button, Table} from "react-bootstrap";
const table = require('./table');

class TabCodeDef extends Component {

    state = {
        table
    };

    constructor(props) {
        super(props);
    }

    openText(event){
        this.props.updateKey({tab:2,filename:event.target.name});
    }

    openAnnotateText(event){
        this.props.updateKey({tab:4,filenameAn:event.target.name});
    }


    render() {
        let i=0;
        return (

            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Definition</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.table.map((code)=>{
                        i++;
                        return <tr><td>{i}</td><td>{code[0]}</td><td>{code[1]}</td></tr>
                    })}

                    </tbody>
                </Table>
            </div>

        );
    }
}

export default TabCodeDef;