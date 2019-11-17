import React, {Component} from 'react';
import {Button, Table} from "react-bootstrap";


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

    openText(event){
        this.props.updateKey({tab:2,filename:event.target.name});
    }

    openAnnotateText(event){
        console.log(event.target.name);
        this.props.updateKey({tab:4,filenameAn:event.target.name});
    }

    async loadCorpuse() {
        let responseJS =await fetch("http://localhost:5000/corpuse");
        let response = await responseJS.json();

        this.setState({corpuse:response.corpuse});

    }

    render() {
        let i=0;
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
                    {this.state.corpuse.map((file)=>{
                        i++;
                        return <tr><td>{i}</td><td>{file[1]}</td><td>{file[2]}</td>
                            <td><Button style={{marginLeft:1+'em'}} name={file[1]} onClick={this.openText} >Open</Button>
                                <Button style={{marginLeft:1+'em'}} name={file[1]} onClick={this.openAnnotateText} >Annotate</Button></td></tr>
                    })}

                    </tbody>
                </Table>
            </div>

        );
    }
}

export default TabCorpus;