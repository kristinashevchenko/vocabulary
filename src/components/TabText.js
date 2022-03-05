import React, {Component} from 'react';
import {Form, Button, InputGroup, Table} from "react-bootstrap";
import { sortFunc } from './tabTextSort';

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
        filter: '',
        map: map,
        filteredMap: null,
        textLength: 0,
        shouldLoadText: false,
    };

    constructor(props) {
        super(props);

        this.downloadAndReadFile = this.downloadAndReadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.saveText = this.saveText.bind(this);
        this.filterMap = this.filterMap.bind(this);
    }

    openFileDialog() {
        document.getElementById('file-input').click();
    }

    downloadAndReadFile(event) {
        const textFile = event.target.files[0];

        const makeRequest = async () => {
            const file = await this.loadFile(textFile);
            this.setState({data: file.text, filename: file.name});
        }
        makeRequest();
    }

    async readFile() {
        const textFile = this.state.filename;
        const responseJS = await fetch(`http://localhost:5000/readFile?filename=${textFile}`);
        const file = await responseJS.json();

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
            const file = await this.saveFile();
            this.setState({map: file.map, textLength: file.textLength, filteredMap: file.map});
        }
        makeRequest();
    }

    analyzeText() {
        const makeRequest = async () => {
            let file = await this.saveFile();
            let map2 = new SortedMap();
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

    handleKeyChange = (event, key) => {
        this.setState({
            [key]: event.target.value
        })
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;

        if (oldProps.filename !== newProps.filename) {
            this.setState({filename: newProps.filename});
            setTimeout(this.readFile.bind(this), 100);
        }
    }

    sortMap = (sortType) => {
        const sortF = sortFunc(sortType);
        const sorted = this.state.map.sort(sortF);
        this.setState({filteredMap: sorted});
    }

    filterMap() {
        let filter = this.state.filter;
        let regex = new RegExp(`/\w*${filter}\w*/g`);
        let sorted = this.state.map.filter(word => word[0].includes(filter));

        this.setState({filteredMap: sorted});
    }


    render() {
        return (
            <div>
                <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1" style={CorpusText}>
                        <InputGroup>
                            <Form.Label>Filename</Form.Label>
                            <Form.Control
                                type="text"
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
                        <Button 
                            variant="primary"
                            type="button" 
                            style={marginL} 
                            onClick={this.sortMap.bind(this, 'sort_alph')}
                        >
                            Alphabet Order
                        </Button>
                        <Button 
                            variant="primary" 
                            type="button" 
                            style={marginL} 
                            onClick={this.sortMap.bind(this, 'sort_alph_rev')}
                        >
                            Reverse Alphabet Order
                        </Button>
                        <Button 
                            variant="primary" 
                            type="button" 
                            style={marginL} 
                            onClick={this.sortMap.bind(this, 'sort_rev')}
                        >
                            Frequency
                        </Button>
                        <Button 
                            variant="primary" 
                            type="button" 
                            style={marginL} 
                            onClick={this.sortMap.bind(this, 'sort_freq_rev')}
                        >
                            Reverse Frequency
                        </Button>
                        <input 
                            style={marginL} 
                            id="filter" 
                            type="text"
                            value={this.state.filter}
                            onChange={(event) => this.handleKeyChange(event, 'filter')}
                        />
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
                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{value[0]}</td>
                                    <td>{value[1].amount}</td>
                                    <td>{value[1].code}</td>
                                </tr>
                            )
                        })}

                        </tbody>
                    </Table>
                </div>}
            </div>
        );
    }

}

export default TabText;