import React, {Component} from 'react';
import {Form, Button, InputGroup, Table, Dropdown, Modal} from "react-bootstrap";
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import '../App.css';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const CorpusText = {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto"
};

const modal = {
    position: 'fixed',
    left: "500px",
    top: "200px",
    width: "400px"
};

const marginDisplay = {
    margin: "1em",
    display: "inline"
};

const marginL = {
    marginLeft: "2em"
};

const marginCode = {
    margin: "0.5em",
    width: "85%"
};
const table = require('./table');
const SortedMap = require("collections/sorted-map");

const map = new SortedMap();


class TabAnnotateText extends Component {

    state = {
        data: '',
        filename: '',
        map: map,
        filteredMap: new SortedMap(),
        textLength: 0,
        shouldLoadText: false,
        word: null,
        codes: table,
        text: null,
        offset: null,
        scrollTop: null,
        words: null,
        sorted_words: null,
        wordChange: null,
        codeChange: null,
        codesChange: null,
        showModal: false
    };

    constructor(props) {
        super();

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.saveText = this.saveText.bind(this);
        this.textAreaRef = React.createRef();
    }


    async readFile() {
        const textFile = this.state.filename;
        let responseJS = await fetch(`http://localhost:5000/readAnnotateFile?filename=${textFile}`);
        let file = await responseJS.json();
        let words = file.words;
        this.setState({data: file.text, scrollTop: file.scrollTop, words: words, sorted_words: words});

    }

    showDict = () => {
        let text = this.state.data;
        let wordTags = text.split(/(\w*<\w+\$?>)/);
        wordTags = wordTags.filter(elem => elem.match(/(\w*<\w+\$?>)/));
        const wordMap = new Map();

        wordTags.forEach(elem => {
            let wordTag = elem.split(/(\w*)<(\w+\$?)>/);
            let word = wordTag[1];
            let tag = wordTag[2];
            let wordM = wordMap.get(word);
            if (wordM) {
                wordM.amount++;
                if (wordM.codes.indexOf(tag) === -1) {
                    wordM.codes.push(tag);
                }

            } else {
                wordM = {amount: 1, codes: [tag]};
            }
            wordMap.set(word, wordM);

        });
        let map = wordMap.entries();
        this.setState({words: map, sorted_words: map});
    };

    saveFile(text) {
        return new Promise(((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", this.state.filename);
            formData.append('text', text);
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://localhost:5000/saveAnnotateFile", true);
            xmlhttp.onload = function () {
                if (xmlhttp.status === 200) {
                    resolve();
                } else {
                    reject();
                }
            };
            xmlhttp.send(formData);
        }));
    }


    saveText() {
        const makeRequest = async () => {
            let textareaPos = Math.floor(this.textAreaRef.current.scrollTop);
            let text = `Scroll top ${textareaPos} Scroll top.` + this.state.data;
            let file = await this.saveFile(text);
            alert('file saved');
        }
        makeRequest();
    }

    handleChange(event) {
        this.setState({data: event.target.value});

    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;

        if (oldProps.filename !== newProps.filename) {
            this.setState({filename: newProps.filename});
            setTimeout(this.readFile.bind(this), 100);
        }

    }

    handleSelect = () => {
        const textArea = (this.textAreaRef.current);
        this.setState({text: window.getSelection().toString(), offset: textArea.selectionStart});
    };


    savePosition = () => {
        this.textAreaRef.current.scrollTop = +this.state.scrollTop;
    };


    handleClick(event, data) {
        let code = data.cod;
        let txt = this.state.text;
        if (txt) {
            let textValue = this.state.data;
            let index = this.state.offset;
            let reg = new RegExp(`${txt}`, "g");
            textValue = textValue.replace(reg, (match, offset) => {
                if (index >= offset - 2 && index <= offset + 2) {

                    match = match.replace(/<[A-Z]*\$?>/, `<${code}>`);
                }
                return match;
            });
            this.setState({data: textValue, offset: null, text: null});
        }
    }

    sortWords = (event) => {
        let sort = event.target.name;
        let compFunc;
        switch (sort) {
            case 'word_alphabet':
                compFunc = (a, b) => {
                    if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
                    else if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
                    else return 0;
                };
                break;
            case 'word_rev_alphabet':
                compFunc = (a, b) => {
                    if (a[0].toLowerCase() > b[0].toLowerCase()) return -1;
                    else if (a[0].toLowerCase() < b[0].toLowerCase()) return 1;
                    else return 0;
                };
                break;
            case 'tag_alphabet':
                compFunc = (a, b) => {
                    if (a[1].codes < b[1].codes) return -1;
                    else if (a[1].codes > b[1].codes) return 1;
                    else return 0;
                };
                break;
            case 'tag_rev_alphabet':
                compFunc = (a, b) => {
                    if (a[1].codes > b[1].codes) return -1;
                    else if (a[1].codes < b[1].codes) return 1;
                    else return 0;
                };
                break;
            case 'word_frequency':
                compFunc = (a, b) => {
                    return a[1].amount - b[1].amount;
                };
                break;
            case 'word_rev_frequency':
                compFunc = (a, b) => {
                    return b[1].amount - a[1].amount;
                };
                break;
        }
        let sorted_words = this.state.sorted_words.sort(compFunc);

        this.setState({sorted_words: sorted_words});

    };

    filterWords = () => {
        let word = document.querySelector('#filter_word').value;
        let stat = this.state.words;
        if (!word) this.setState({sorted_words: stat});
        else {
            stat = stat.filter(elem => {
                return elem[0].includes(word);
            });
            this.setState({sorted_words: stat});
        }
    };

    saveCode = () => {
        let word = this.state.wordChange, code = this.state.codeChange,
            newCode = document.querySelector('#codeChange').value;
        const reg = new RegExp(`${word}<${code}>`, "g");
        let text = this.state.data.replace(reg, `${word}<${newCode}>`);
        let words = this.state.words.map(elem => {
            if (elem[0] === word) {
                let index = elem[1].codes.indexOf(code);
                elem[1].codes[index] = newCode;
            }
            return elem;
        });
        this.setState({data: text, words: words, sorted_words: words});
    };

    changeWord = (event) => {
        let word = this.state.words.find(elem => elem[0] === event.target.name);
        this.setState({wordChange: event.target.name, showModal: true, codesChange: word[1].codes});
    };

    deleteWord = (event) => {
        let word = event.target.name;
        const reg = new RegExp(`${word}<\\w+\\$?>`, "g");
        let text = this.state.data.replace(reg, '');
        let words = this.state.words.filter(elem => elem[0] !== word);
        this.setState({data: text, words: words, sorted_words: words});
    };

    render() {
        return (
            <div>
                <Form>
                    <Form.Group style={CorpusText}>
                        <InputGroup>
                            <Form.Label>Filename</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="new_text.txt"
                                aria-describedby="inputGroupPrepend"
                                value={this.state.filename}
                                required
                            />
                        </InputGroup>

                        <ContextMenuTrigger id="contextMenu">
                            <Form.Control as="textarea" rows="15" cols="7" placeholder="Insert/type text here"
                                          id="textData" onSelect={this.handleSelect}
                                          ref={this.textAreaRef}
                                          onChange={this.handleChange}
                                          value={this.state.data}>
                                {this.state.data}

                            </Form.Control>
                        </ContextMenuTrigger>


                    </Form.Group>
                    <Button variant="warning" style={{marginRight: 2 + 'em'}} onClick={this.saveText}>
                        Save
                    </Button>
                    <Button variant="warning" style={{marginRight: 2 + 'em'}} onClick={this.savePosition}>
                        Previous position
                    </Button>
                    <Button variant="warning" style={{marginRight: 2 + 'em'}} onClick={this.showDict}>
                        Update
                    </Button>
                </Form>

                {this.state.sorted_words &&
                <div>
                    <Dropdown style={marginDisplay}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic2">
                            Sort
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item name="word_alphabet"
                                           onClick={this.sortWords}>Alphabet Words</Dropdown.Item>
                            <Dropdown.Item name="word_rev_alphabet"
                                           onClick={this.sortWords}>Reverted Alphabet Words</Dropdown.Item>
                            <Dropdown.Item name="word_frequency"
                                           onClick={this.sortWords}>Frequency Words</Dropdown.Item>
                            <Dropdown.Item name="word_rev_frequency"
                                           onClick={this.sortWords}>Reverted Frequency Words</Dropdown.Item>
                            <Dropdown.Item name="tag_alphabet"
                                           onClick={this.sortWords}>Alphabet Tags</Dropdown.Item>
                            <Dropdown.Item name="tag_rev_alphabet"
                                           onClick={this.sortWords}>Reverted Alphabet Tags</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <input id="filter_word" style={marginDisplay} type="text"/>
                    <Button variant="primary" type="button" style={marginDisplay} onClick={this.filterWords}>
                        Filter
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Word</th>
                            <th>Number</th>
                            <th>Code</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.sorted_words.map((value, key) => {

                            return <tr id={value[0]}>
                                <td>{key}</td>
                                <td>{value[0]}</td>
                                <td>{value[1].amount}</td>
                                <td>{value[1].codes.join(';')}</td>
                                <td>
                                    <Button style={{marginLeft: 1 + 'em'}} name={value[0]}
                                            onClick={this.changeWord}>Change</Button>
                                    <Button style={{marginLeft: 1 + 'em'}} name={value[0]}
                                            onClick={this.deleteWord}>Delete</Button>
                                </td>
                            </tr>

                        })}

                        </tbody>
                    </Table>
                </div>}
                {this.state.showModal &&
                <Modal.Dialog style={modal}>
                    <Modal.Header>
                        <Modal.Title>Change word</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Dropdown style={marginL}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Code
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.state.codesChange && this.state.codesChange.map((code) => {
                                    return <Dropdown.Item name={code}
                                                          onClick={(event) => {
                                                              document.querySelector('#codeChange').value = event.target.name;
                                                              this.setState({codeChange: event.target.name});
                                                          }}>{code}</Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        <input style={marginCode} id="codeChange" type="text"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.saveCode}>Save</Button>
                        <Button variant="secondary" onClick={() => {
                            this.setState({showModal: false})
                        }}>Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
                }
                <ContextMenu id="contextMenu" className="context-menu">
                    {this.state.codes.map(code => {
                        return <MenuItem onClick={this.handleClick} className="context-menu-item"
                                         data={{cod: code[0]}}>{code[0]}</MenuItem>
                    })}
                    <MenuItem divider/>
                </ContextMenu>

            </div>
        );
    }

}

export default TabAnnotateText;