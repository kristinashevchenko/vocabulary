import React, {Component} from 'react';
import {Button, Table} from "react-bootstrap";

const marginL = {
    margin: "1.5em"
};

class TabCorpus extends Component {

    state = {
        corpuse: []
    };

    constructor(props) {
        super(props);
        this.openText = this.openText.bind(this);
        this.openAnnotateText = this.openAnnotateText.bind(this);
        this.loadCorpuse();
    }

    openText(event) {
        this.props.updateKey({tab: 2, filename: event.target.name});
    }

    openAnnotateText(event) {
        this.props.updateKey({tab: 4, filenameAn: event.target.name});
    }

    async loadCorpuse() {
        let responseJS = await fetch("http://localhost:5000/corpuse");
        let response = await responseJS.json();
        this.setState({corpuse: response.corpuse});
    }

    searchText = async () => {
        let words = document.querySelector('#search').value;
        document.querySelectorAll('tr').forEach(tr=> tr.classList.remove('textTr'));
        let responseJS = await fetch(`http://localhost:5000/searchText?words=${words}`);
        let response = await responseJS.json();
        let name = response.text.name.replace('.json', '.txt');
        document.querySelector(`[name="${name}"]`).classList.add('textTr');
    }

    render() {
        let i = 0;
        return (

            <div>
                <input style={marginL} id="search" type="text"/>
                <Button variant="primary" type="button" style={marginL} onClick={this.searchText}>
                    Search
                </Button>
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
                    {this.state.corpuse.map((file) => {
                        i++;
                        return <tr name={file.name}>
                            <td>{i}</td>
                            <td>{file.name}</td>
                            <td>{file.number}</td>
                            <td><Button style={{marginLeft: 1 + 'em'}} name={file.name}
                                        onClick={this.openText}>Open</Button>
                                <Button style={{marginLeft: 1 + 'em'}} name={file.name}
                                        onClick={this.openAnnotateText}>Annotate</Button></td>
                        </tr>
                    })}

                    </tbody>
                </Table>
            </div>

        );
    }
}

export default TabCorpus;