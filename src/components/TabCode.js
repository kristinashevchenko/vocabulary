import React, {Component} from 'react';
import {Button, Table} from "react-bootstrap";

const table = require('./table');
const marginAdd = {
    margin: "2em",
    //marginRight: "15em"

};

class TabCode extends Component {

    state = {
        codes: table
    };

    constructor(props) {
        super(props);
        this.addCode = this.addCode.bind(this);
        this.showTags = this.showTags.bind(this);
        this.showWords = this.showWords.bind(this);
        this.loadStatistics();
    }

    async loadStatistics() {
        let responseJS = await fetch("http://localhost:5000/statistics");
        let response = await responseJS.json();
        console.log(response);
        this.setState({statistics: response.map});
    }

    showTags(event) {
        let code = event.target.name;
        let sibling = document.getElementById(code).nextSibling;
        let codeObj = this.state.statistics.find(elems => elems[0] === code);
        Object.keys(codeObj[1].tag_freq).map((key) => {
            let tr = document.createElement('tr');
            tr.className = 'green';
            tr.innerHTML = `<td></td>
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
            tr.innerHTML = `<td></td>
                            <td>${key}</td>
                            <td>${codeObj[1].word_freq[key]}</td>
                            <td style="width:30%;" class="wordCode"></td>`;
            sibling.parentNode.insertBefore(tr, sibling);
        });
    }

    async addCode() {
        let responseJS = await fetch("http://localhost:5000/corpuse");
        let response = await responseJS.json();
        this.setState({corpuse: response.corpuse});
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
                        <th>Frequency</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.statistics && this.state.statistics.map((file) => {
                        i++;
                        return <tr id={file[0]}>
                            <td>{i}</td>
                            <td>{file[0]}</td>
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