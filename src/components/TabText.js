import React, {Component} from 'react';
import {Form, Button, InputGroup, Table} from "react-bootstrap";

import $ from 'jquery';

const CorpusText = {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto"
};

const marginL = {

    marginLeft: "2em"

};
const SortedMap = require("collections/sorted-map");

const map = new SortedMap();


class TabText extends Component {

    state = {
        data: '',
        filename: '',
        map: map,
        filteredMap: null,
        textLength: 0,
        shouldLoadText: false,
    };

    constructor(props) {
        super();

        this.downloadAndReadFile = this.downloadAndReadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.saveText = this.saveText.bind(this);
        this.sortRev = this.sortRev.bind(this);
        this.sortAlph = this.sortAlph.bind(this);
        this.sortAlphRev = this.sortAlphRev.bind(this);
        this.sortFreqRev = this.sortFreqRev.bind(this);
        this.filterMap = this.filterMap.bind(this);

    }


    openFileDialog() {
        document.getElementById('file-input').click();
    }

    downloadAndReadFile(event) {
        const textFile = event.target.files[0];
        const data = new FormData();
        data.append('file', textFile);

        const makeRequest = async () => {
            let file = await this.loadFile(textFile);
            this.setState({data: file.text, filename: file.name});
        }
        makeRequest();

    }

    async readFile() {
        const textFile = this.state.filename;
        let responseJS = await fetch(`http://localhost:5000/readFile?filename=${textFile}`);
        let file = await responseJS.json();

        this.setState({map: file.map, textLength: file.textLength, filteredMap: file.map, data: file.text});
    }


    loadFile(file) {
        return new Promise(((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://localhost:5000/uploadFile", true);
            xmlhttp.onload = function () {
                if (xmlhttp.status === 200) {
                    resolve(JSON.parse(xmlhttp.response));
                } else {
                    reject();
                }
            };
            xmlhttp.send(formData);
        }));
    }

    saveFile() {
        return new Promise(((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", this.state.filename);
            formData.append('text', this.state.data);
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://localhost:5000/saveFile", true);
            xmlhttp.onload = function () {
                if (xmlhttp.status === 200) {
                    resolve(JSON.parse(xmlhttp.response));
                } else {
                    reject();
                }
            };
            xmlhttp.send(formData);
        }));
    }


    saveText() {
        const makeRequest = async () => {
            let file = await this.saveFile();
            this.setState({map: file.map, textLength: file.textLength, filteredMap: file.map});
            alert('file saved');
        }
        makeRequest();
    }

    analyzeText() {
        const makeRequest = async () => {
            let file = await this.saveFile();
            let map2 = new SortedMap;
            file.map.forEach(function (item, key) {
                map2.set(item[0], item[1]);

            });

            this.setState({map: file.map, textLength: file.textLength, filteredMap: file.map});
        }
        makeRequest();
    }

    handleChange(event) {
        this.setState({data: event.target.value});

    }

    handleChangeName(event) {
        this.setState({filename: event.target.value});

    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;

        if (oldProps.filename !== newProps.filename) {
            this.setState({filename: newProps.filename});
            setTimeout(this.readFile.bind(this), 100);
        }
    }

    sortAlph() {
        let sorted = this.state.map.sort((a, b) => {
            if (a[0] < b[0]) return -1;
            else if (a[0] > b[0]) return 1;
            else return 0;
        });
        this.setState({filteredMap: sorted});
    }

    sortAlphRev() {
        let sorted = this.state.map.sort((a, b) => {
            if (a[0] > b[0]) return -1;
            else if (a[0] < b[0]) return 1;
            else return 0;
        });
        this.setState({filteredMap: sorted});
    }

    sortRev() {
        let sorted = this.state.map.sort((a, b) => {
            if (a[1].amount < b[1].amount) return 1;
            else if (a[1].amount > b[1].amount) return -1;
            else return 0;
        });

        this.setState({filteredMap: sorted});
    }

    sortFreqRev() {
        let sorted = this.state.map.sort((a, b) => {
            if (a[1].amount > b[1].amount) return 1;
            else if (a[1].amount < b[1].amount) return -1;
            else return 0;
        });

        this.setState({filteredMap: sorted});
    }

    filterMap() {
        let filter = document.getElementById("filter").value;
        let regex = new RegExp(`/\w*${filter}\w*/g`);
        let sorted = this.state.map.filter((word) => {
            if (word[0].includes(filter)) {
                return true;
            }
            return false;
        });

        this.setState({filteredMap: sorted});
    }


    render() {
        const isSaved = this.state.map;
        let i = 0;

        return (
            <div>
                <Form>

                    <Form.Group controlId="exampleForm.ControlTextarea1" style={CorpusText}>

                        <InputGroup>
                            <Form.Label>Filename</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="new_text.txt"
                                aria-describedby="inputGroupPrepend"
                                value={this.state.filename}
                                required
                                onChange={this.handleChangeName}
                            />
                        </InputGroup>
                        <Form.Control as="textarea" rows="15" cols="7" placeholder="Insert/type text here" id="textData"
                                      onChange={this.handleChange}
                                      value={this.state.data}>
                            {this.state.data}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="warning" style={{marginRight: 2 + 'em'}} onClick={this.saveText}>
                        Add to texts
                    </Button>
                    <input id="file-input" type="file" name="name" style={{display: 'none'}}
                           onChange={this.downloadAndReadFile}/>
                    <Button variant="primary" type="button" onClick={this.openFileDialog}>
                        File
                    </Button>
                </Form>
                {this.state.filteredMap &&
                <div>
                    <h3>Number of words: {this.state.textLength}</h3>
                    <div>
                        <Button variant="primary" type="button" style={marginL} onClick={this.sortAlph}>
                            Alphabet Order
                        </Button>
                        <Button variant="primary" type="button" style={marginL} onClick={this.sortAlphRev}>
                            Reverse Alphabet Order
                        </Button>
                        <Button variant="primary" type="button" style={marginL} onClick={this.sortRev}>
                            Frequency
                        </Button>
                        <Button variant="primary" type="button" style={marginL} onClick={this.sortFreqRev}>
                            Reverse Frequency
                        </Button>
                        <input style={marginL} id="filter" type="text"/>
                        <Button variant="primary" type="button" style={marginL} onClick={this.filterMap}>
                            Filter
                        </Button></div>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Word</th>
                            <th>Number</th>
                            <th>Code</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.filteredMap.map(function (value, key) {
                            i++;
                            return <tr>
                                <td>{key}</td>
                                <td>{value[0]}</td>
                                <td>{value[1].amount}</td>
                                <td>{value[1].code}</td>
                            </tr>
                        })}

                        </tbody>
                    </Table>
                </div>}
            </div>
        );
    }

}

export default TabText;