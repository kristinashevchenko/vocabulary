import React, {Component} from 'react';
import {Button, Table} from "react-bootstrap";

const table = require('./table');
const marginAdd = {
    margin: "2em"
};

class TabCode extends Component {

    state = {
        codes: table,
        statistics: null
    };

    constructor(props) {
        super(props);
        this.showTags = this.showTags.bind(this);
        this.showWords = this.showWords.bind(this);
        this.loadStatistics();
        console.log(this.state.codes);
    }

    async loadStatistics() {
        let responseJS = await fetch("http://localhost:5000/statistics");
        let response = await responseJS.json();
        this.setState({statistics: response.map});
    }

    showTags(event) {
        let code = event.target.name;
        let sibling = document.getElementById(code).nextSibling;
        let codeObj = this.state.statistics.find(elems => elems[0] === code);
        Object.keys(codeObj[1].tag_freq).map((key) => {
            let tr = document.createElement('tr');
            tr.className = 'green';
            tr.innerHTML = `<td></td><td></td>
                            <td>${key}</td>
                            <td>${codeObj[1].tag_freq[key]}</td>
                            <td style="width:30%;" class="wordCode"></td>`;

            sibling.parentNode.insertBefore(tr, sibling);
        });
    }

    showWords(event) {
        let code = event.target.name;
        let sibling = document.getElementById(code).nextSibling;
        let codeObj = this.state.statistics.find(elems => elems[0] === code);
        Object.keys(codeObj[1].word_freq).map((key) => {
            let tr = document.createElement('tr');
            tr.className = 'red';
            tr.innerHTML = `<td></td><td></td>
                            <td>${key}</td>
                            <td>${codeObj[1].word_freq[key]}</td>
                            <td style="width:30%;" class="wordCode"></td>`;
            sibling.parentNode.insertBefore(tr, sibling);
        });
    }

    render() {
        let i = 0;
        return (

            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Definition</th>
                        <th>Frequency</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.statistics && this.state.statistics.map((file) => {
                        i++;
                        let def = this.state.codes.find(elem => elem[0] === file[0]);
                        //def = def[1];
                        console.log(def);
                        return <tr id={file[0]}>
                            <td>{i}</td>
                            <td>{file[0]}</td>
                            <td>{def && def[1]}</td>
                            <td>{file[1].freq}</td>
                            <td><Button name={file[0]} onClick={this.showTags}>Tags</Button>
                                <Button name={file[0]} onClick={this.showWords}>Words</Button></td>
                        </tr>
                    })}

                    </tbody>
                </Table>
            </div>

        );
    }
}

export default TabCode;