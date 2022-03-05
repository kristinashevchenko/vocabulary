import React, { useState, memo} from 'react';
import {Button, Dropdown, Table, Form, Col} from "react-bootstrap";
import wordsComparator from './words_sort';

const table = require('../table');
const marginAdd = {
    margin: "2em"
};

const marginDisplay = {
    margin: "1em",
    display: "inline"
};

const WordsTable = ({statistics}) => {

    const [filterStatistics, setFilterStatistics] = useState(statistics);
    const [word, setWord] = useState('');

    
    const showTags = (event) => {
        let code = event.target.name;
        let sibling = document.getElementById(code).nextSibling;
        let codeObj = statistics.find(elems => elems[0] === code);
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

    const onWordChange = (event) => {
        setWord(event.target.value);
    }

    const showWords = (event) => {
        let code = event.target.name;
        let trs = document.querySelectorAll(`tr[name="${code}"]`);
        trs.forEach(tr => tr.classList.toggle('isHidden'));
    }

   

    const sortWords = (eventKey, tag) => {
        const compFunc = wordsComparator(eventKey);
        const sorted_words = filterStatistics.sort(compFunc);
        setFilterStatistics(sorted_words);
    };

    const sortNestedWords = (eventKey, tag) => {
        const sort = eventKey;
        const index = filterStatistics.findIndex(elem => elem[0] === tag);
        const obj = filterStatistics[index][1].word_freq;
        let obj2 = {}, keys;
        switch (sort) {
            case 'alphabet':
                keys = Object.keys(obj)
                    .sort((a, b) => {
                        if (a.toLowerCase() < b.toLowerCase()) return -1;
                        else if (a.toLowerCase() > b.toLowerCase()) return 1;
                        else return 0;
                    });
                break;
            case 'rev_alphabet':
                keys = Object.keys(obj)
                    .sort((a, b) => {
                        if (a.toLowerCase() > b.toLowerCase()) return -1;
                        else if (a.toLowerCase() < b.toLowerCase()) return 1;
                        else return 0;
                    });
                break;
            case 'frequency':
                keys = Object.keys(obj)
                    .sort((a, b) => {
                        return obj[a] - obj[b];
                    });
                break;
            case 'rev_frequency':
                keys = Object.keys(obj)
                    .sort((a, b) => {
                        return obj[b] - obj[a];
                    });
                break;

        }
        keys.forEach(key => {
            obj2[key] = obj[key];
        });
        setFilterStatistics(prev => prev[index][1].word_freq = obj2);
    };

    const filterWords = (event) => {
        event.preventDefault();
        if (!word) {
            setFilterStatistics(statistics);
        } else {
            let stat = statistics.filter(elem => {
                const words = Object.keys(elem[1].word_freq);
                return words.includes(word);
            });
            stat = stat.map(elem => {
                let word_freq = {};
                word_freq[word] = elem[1].word_freq[word];
                return [elem[0], {
                    freq: elem[1].freq, word_freq
                }]
            });
            setFilterStatistics(stat);
            console.log(word, stat);
        }
    };

    return (
        <div id="wordsTable">
            <Form style={marginDisplay} onSubmit={filterWords}>
                <Form.Row>
                    <Col>
                        <Dropdown style={{margin: '1em'}} onSelect={sortWords}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic2">
                                Sort
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="alphabet">Alphabet Tags</Dropdown.Item>
                                <Dropdown.Item eventKey="rev_alphabet">Reverted Alphabet Tags</Dropdown.Item>
                                <Dropdown.Item eventKey="frequency">Frequency Tags</Dropdown.Item>
                                <Dropdown.Item eventKey="rev_frequency">Reverted Frequency Tags</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Form.Control 
                            type="text" 
                            onChange={onWordChange}
                            value={word}
                            placeholder="Enter word" 
                            style={marginDisplay}/> 
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" style={marginDisplay}>
                            Filter
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
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
                {filterStatistics.map((obj, index) => {
                    let def = table.find(elem => elem[0] === obj[0]);
                    let trs = [<tr>
                        <td>{index}</td>
                        <td>{obj[0]}</td>
                        <td>{def  && def[1]}</td>
                        <td>{obj[1].freq}</td>
                        <td>
                            {/*<Button name={obj[0]} onClick={this.showTags} style={marginAdd}>Tags</Button>*/}
                            <Button name={obj[0]} onClick={showWords} style={marginAdd}>Words</Button>
                            <Dropdown style={marginDisplay} onSelect={e => sortNestedWords(e, obj[0])}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic2">
                                    Sort
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="alphabet">Alphabet Words</Dropdown.Item>
                                    <Dropdown.Item eventKey="rev_alphabet">Reverted Alphabet Words</Dropdown.Item>
                                    <Dropdown.Item eventKey="frequency">Frequency Words</Dropdown.Item>
                                    <Dropdown.Item eventKey="rev_frequency">Reverted Frequency Words</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>];
                    const words = Object.keys(obj[1].word_freq);
                    words.forEach(word => {
                        trs.push(<tr className="green isHidden" key={word} name={obj[0]}>
                            <td>{index}</td>
                            <td></td>
                            <td>{word}</td>
                            <td>{obj[1].word_freq[word]}</td>
                            <td></td>
                        </tr>)
                    });
                    return trs;
                })}

                </tbody>
            </Table>
        </div>
           

        );
}

export default memo(WordsTable);