import React, {Component} from 'react';
import {Form, Button, Table, Modal, Dropdown} from "react-bootstrap";
import '../App.css';

const CorpusText = {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto"
};
const marginL = {
    margin: "1.5em"
};

const marginCode = {
    margin: "0.5em",
    width: "85%"
};

const marginAdd = {
    margin: "2em",
    //marginRight: "15em"

};

const modal = {
    position: 'fixed',
    left: "500px",
    top: "200px",
    width: "400px"
};

const table = {
    wordWrap: 'break-word',
};
const table2 = {
    width: '30%',
};
const SortedMap = require("collections/sorted-map");


class TabDict extends Component {

    state = {
        map: new SortedMap(),
        filteredMap: new SortedMap(),
        showModal: false,
        corpus: null,
        word: null,
        codeModal: null
    };

    constructor(props) {
        super(props);

        this.downloadDictionary();

        this.sortRev = this.sortRev.bind(this);
        this.sortAlph = this.sortAlph.bind(this);
        this.sortAlphRev = this.sortAlphRev.bind(this);
        this.sortFreqRev = this.sortFreqRev.bind(this);
        this.filterMap = this.filterMap.bind(this);
        this.addWord = this.addWord.bind(this);
        this.addForm = this.addForm.bind(this);
        this.saveForm = this.saveForm.bind(this);
        this.saveCode = this.saveCode.bind(this);
        this.changeWord = this.changeWord.bind(this);
        this.viewForms = this.viewForms.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.openText = this.openText.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }

    async downloadDictionary() {
        let responseJS = await fetch("http://localhost:5000/dictionary");
        let response = await responseJS.json();
        console.log(response.map);
        this.setState({map: response.map, filteredMap: response.map});

    }

    saveCode(){
        const word = this.state.word;
        const button = document.querySelector(`[name='${word}']`);
        const code = document.querySelector(`#code`).value;
        fetch(`http://localhost:5000/changeWord?word=${word}&code=${code}`).then(() => {
            button.parentElement.parentElement.querySelector('.wordCode').textContent = code;
        });

    }

    handleChange2(event) {
        this.setState({codeModal: event.target.value});

    }
    viewForms(event) {
        const canon_word = event.target.name;
        fetch(`http://localhost:5000/getWord?word=${canon_word}`).then((dataJS) => {
            dataJS.json().then((data) => {
                console.log(data);
                const words = data.words;
                let forms;
                let sibling = document.getElementById(canon_word).nextSibling;
                words.map((word,index) => {
                    let tr = document.createElement('tr');
                    tr.className='green';
                    tr.setAttribute('name',`${word[1]}_form`);
                    tr.innerHTML = `<td></td>
                            <td>${word[1]}</td>
                            <td>${word[4]}</td>
                            <td style="width:30%;" class="wordCode">${word[3]}</td>
                            <td>
                                <Button style="margin-left:1em;border-radius: 5px;background-color:darkgreen;color:white;" name=${word[1]}
                                        >Change</Button>
                                <Button style="margin-left:1em;border-radius: 5px;background-color:darkgreen;color:white;" name=${word[1]}
                                        >Delete</Button>


                            </td>`;
                    let buttons = tr.querySelectorAll(`[name=${word[1]}]`);
                    buttons[0].addEventListener('click',this.changeWord);
                    buttons[1].addEventListener('click',this.deleteWord);

                    document.querySelector(`tbody`).insertBefore(tr,sibling);

                });

            });

        }).catch(() => {
            alert('Such word already exists');
        });
    }

    addForm(event) {
        const word = event.target.name;
        this.setState({showModal2: true,word:word});
    }

    saveForm(){
        const word = this.state.word;
        const form = document.querySelector(`#formW`).value;
        const code = document.querySelector(`#codeW`).value;
        fetch(`http://localhost:5000/addForm?word=${word}&code=${code}&form=${form}`).then(() => {
            alert('added');
        });
    }

    openText(event) {
        this.props.updateKey({tab: 2, filename: event.target.name, word: this.state.word});
    }

    addWord() {
        let word = prompt('Add word', 'Please enter new word');
        if (word) {
            fetch(`http://localhost:5000/addWord?word=${word}`).then(() => {
                this.downloadDictionary();
            }).catch(() => {
                alert('Such word already exists');
            });
        }

    }

    async deleteWord(event) {
        const word = event.target.name;
        document.querySelector(`[name="${word}_form"]`).classList.add('isHidden');
        fetch(`http://localhost:5000/deleteWord?word=${word}`).then(() => {

            this.downloadDictionary();

        });
    }

    changeWord(event) {
        const word = event.target.name;
        fetch(`http://localhost:5000/selectWord?word=${word}`).then((dataJS) => {
            dataJS.json().then((data) => {
                const button = document.querySelector(`[name='${word}']`);
                const text = button.parentElement.parentElement.querySelector('.wordCode').textContent;
                this.setState({corpus: data.corpus, showModal: true, word: word, codeModal: text});
                setTimeout(()=>{
                    document.querySelector(`#code`).value=text;
                }, 100);
            });
        });

    }

    sortAlph() {
        let sorted = this.state.map.sort((a, b) => {
            console.log(a);
            if (a[0] < b[0]) return -1;
            else if (a[0] > b[0]) return 1;
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
        let i = 0;
        let shouldOpenModal = this.state.showModal;
        let shouldOpenModal2 = this.state.showModal2;
        return (

            <div>
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

                    <Button variant="primary" type="button" style={marginAdd} onClick={this.addWord}>
                        Add Word
                    </Button>

                    <input style={marginL} id="filter" type="text"/>
                    <Button variant="primary" type="button" style={marginL} onClick={this.filterMap}>
                        Filter
                    </Button></div>
                {shouldOpenModal &&
                <Modal.Dialog style={modal}>
                    <Modal.Header>
                        <Modal.Title>Change word</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Dropdown style={marginL}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Text
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.state.corpus.map((filename) => {
                                    return <Dropdown.Item name={filename}
                                                          onClick={this.openText}>{filename}</Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        <input style={marginCode} id="code" type="text"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.saveCode}>Save</Button>
                        <Button variant="secondary" onClick={() => {
                            this.setState({showModal: false})
                        }}>Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
                }

                {shouldOpenModal2 &&
                <Modal.Dialog style={modal}>
                    <Modal.Header>
                        <Modal.Title>Add form</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input style={marginCode} id="formW" type="text"/>
                        <input style={marginCode} id="codeW" type="text"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.saveForm}>Save</Button>
                        <Button variant="secondary" onClick={() => {
                            this.setState({showModal2: false})
                        }}>Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
                }
                <Table style={table} striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Word</th>
                        <th>Number</th>
                        <th style={table2}>Code</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.filteredMap.map((value, key) => {
                        i++;
                        return <tr id={value[0]}>
                            <td>{key}</td>
                            <td>{value[0]}</td>
                            <td>{value[1].amount}</td>
                            <td style={table2} className="wordCode">{value[1].code}</td>
                            <td>
                                {/*<Button style={{marginLeft: 1 + 'em'}} name={value[0]}*/}
                                {/*        onClick={this.changeWord}>Change</Button>*/}
                                {/*<Button style={{marginLeft: 1 + 'em'}} name={value[0]}*/}
                                {/*        onClick={this.deleteWord}>Delete</Button>*/}

                                <Button style={{marginLeft: 1 + 'em'}} name={value[0]}
                                        onClick={this.viewForms}>View forms</Button>
                                <Button style={{marginLeft: 1 + 'em'}} name={value[0]}
                                        onClick={this.addForm}>Add form</Button>
                            </td>
                        </tr>

                    })}

                    </tbody>
                </Table>
            </div>

        );
    }
}

export default TabDict;