import React, {Component} from 'react';
import {Form, Button, InputGroup, Table} from "react-bootstrap";
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import '../App.css';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';

import $ from 'jquery';

const CorpusText = {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto"
};

const marginL = {

    marginLeft: "2em"

};
const table = require('./table');
const SortedMap = require("collections/sorted-map");

const map = new SortedMap();
let textRef = React.createRef();


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
        editorState: EditorState.createEmpty(),
        scrollTop: null
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
        // const contentBlock = htmlToDraft(file.text);
        // if (contentBlock) {
        // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        // const editorState = EditorState.createWithContent(contentState);
        this.setState({data: file.text, scrollTop: file.scrollTop});
        // }

    }

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


    saveText(text = this.state.data) {
        const makeRequest = async () => {
            let textareaPos = this.textAreaRef.current.scrollTop;
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
        console.log(9);
        const newProps = this.props;

        if (oldProps.filename !== newProps.filename) {
            this.setState({filename: newProps.filename});
            setTimeout(this.readFile.bind(this), 100);
        }

    }

    handleSelect = () => {
        const textArea = (this.textAreaRef.current);
        this.setState({text: window.getSelection().toString(), offset: textArea.selectionStart});
    }

    onEditorStateChange = (editorState) => {
        console.log(editorState);
        this.setState({
            editorState,
        });
    };


    savePosition = () => {
        this.textAreaRef.current.scrollTop = +this.state.scrollTop;
    }


    handleClick(event, data) {
        let code = data.cod;
        let txt = this.state.text;
        if (txt) {
            let textValue = this.state.data;
            let index = this.state.offset;
            let reg = new RegExp(`${txt}`, "g");
            textValue = textValue.replace(reg, (match, offset, input) => {
                if (index >= offset - 2 && index <= offset + 2) {

                    match = match.replace(/<[A-Z]*\$?>/, `<${code}>`);
                }
                return match;
            });
            this.setState({data: textValue, editorState: textValue, offset: null, text: null});
        }

        console.log(123, this.state.text, code);
    }


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
                            {/*<Editor*/}
                            {/*    editorState={this.state.editorState}*/}
                            {/*    toolbarClassName="toolbarClassName"*/}
                            {/*    wrapperClassName="wrapperClassName"*/}
                            {/*    editorClassName="editorClassName"*/}
                            {/*    onMouseUp={this.handleSelect}*/}
                            {/*    ref={this.textAreaRef}*/}
                            {/*    onEditorStateChange={this.onEditorStateChange}*/}
                            {/*/>*/}
                        </ContextMenuTrigger>


                    </Form.Group>
                    <Button variant="warning" style={{marginRight: 2 + 'em'}} onClick={this.saveText}>
                        Save
                    </Button>
                    <Button variant="warning" style={{marginRight: 2 + 'em'}} onClick={this.savePosition}>
                        Previous position
                    </Button>
                </Form>
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