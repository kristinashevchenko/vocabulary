import React, {Component} from 'react';
import {Form, Button, Table} from "react-bootstrap";

const CorpusText = {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto"
};


class TabCorpus extends Component {

    state = {
        files: null
    };

    constructor(props) {
        super();
        this.downloadAndReadFile = this.downloadAndReadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.saveText = this.saveText.bind(this);
    }

    openFileDialog() {
        document.getElementById('file-input').click();
    }

    downloadAndReadFile(event) {
        const textFile = event.target.files[0];
        const data = new FormData();
        data.append('file', textFile);
        //data.append('filename', this.fileName.value);

        // fetch('http://localhost:5000/uploadFile', {
        //     method: 'POST',
        //     mode: 'no-cors',
        //     body: data,
        // }).then((response) => {
        //     console.log(response);
        //     response.json().then((body) => {
        //         console.log(body);
        //     });
        // });
        const makeRequest = async () => {
            let file = await this.loadFile(textFile);
            console.log(file.text);
            this.setState({data: file.text, filename: file.name});
        }
        makeRequest();

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
        //  const textFile = this.state.filename;


        //data.append('filename', this.fileName.value);

        // fetch('http://localhost:5000/uploadFile', {
        //     method: 'POST',
        //     mode: 'no-cors',
        //     body: data,
        // }).then((response) => {
        //     console.log(response);
        //     response.json().then((body) => {
        //         console.log(body);
        //     });
        // });
        const makeRequest = async () => {
            let file = await this.saveFile();
            console.log(file);
            //this.setState({data:file.text,filename:file.name});
        }
        makeRequest();
    }

    handleChange(event) {
        this.setState({data: event.target.value});
    }

    handleChangeName(event) {
        this.setState({filename: event.target.value});
    }

    render() {
        return (

            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Filename</th>
                        <th>Number of words</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.files.map(function(file){
                        return <tr><td>{file.id}</td><td>{file.name}</td><td>{file.words}</td>
                            <td><Button style={{marginLeft:1+'em'}}>Open</Button><Button>Delete</Button></td></tr>
                    })}

                    </tbody>
                </Table>
            </div>

        );
    }
}

export default TabCorpus;