import React, {Component} from 'react';
import {Button, Dropdown, Table} from "react-bootstrap";

const table = require('./table');
const marginAdd = {
    margin: "2em"
};

const marginDisplay = {
    margin: "1em",
    display: "inline"
};

class TabCode extends Component {

    state = {
        codes: table,
        statistics: null,
        filter_statistics: null,
        tags: [],
        filter_tags: [],
        showW: true,
        showT: false
    };

    constructor(props) {
        super(props);
        this.showTags = this.showTags.bind(this);
        this.showWords = this.showWords.bind(this);
        this.loadStatistics();
    }


    async loadStatistics() {
        let responseJS = await fetch("http://localhost:5000/statistics");
        let response = await responseJS.json();
        let tags = [];
        response.map.forEach(elem => {
            let tag_freq = elem[1].tag_freq;
            Object.keys(tag_freq).forEach(tag => {
                tags.push({code: elem[0], tag, tag_freq: tag_freq[tag]})
            })

        });
        this.setState({
            statistics: response.map,
            filter_statistics: response.map,
            tags,
            filter_tags: tags
        });
    }

    showTags(event) {
        let code = event.target.name;
        let sibling = document.getElementById(code).nextSibling;
        let codeObj = this.state.statistics.find(elems => elems[0] === code);
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

    showWords(event) {
        let code = event.target.name;
        let trs = document.querySelectorAll(`tr[name="${code}"]`);
        trs.forEach(tr => tr.classList.toggle('isHidden'));
    }

    disableButton = () => {
        let sT = this.state.showT;
        let sW = this.state.showW;
        this.setState({showT: !sT, showW: !sW});
    };

    sortTags = (event) => {
        let sort = event.target.name;
        let compFunc;
        switch (sort) {
            case 'alphabet':
                compFunc = (a, b) => {
                    if (a.code < b.code) return -1;
                    else if (a.code > b.code) return 1;
                    else if (a.tag < b.tag) return -1;
                    else if (a.tag > b.tag) return 1;
                    else return 0;
                };
                break;
            case 'rev_alphabet':
                compFunc = (a, b) => {
                    if (a.code > b.code) return -1;
                    else if (a.code < b.code) return 1;
                    else if (a.tag > b.tag) return -1;
                    else if (a.tag < b.tag) return 1;
                    else return 0;
                };
                break;
            case 'frequency':
                compFunc = (a, b) => {
                    if (a.tag_freq < b.tag_freq) return -1;
                    else if (a.tag_freq > b.tag_freq) return 1;
                    else if (a.code < b.code) return -1;
                    else if (a.code > b.code) return 1;
                    else if (a.tag < b.tag) return -1;
                    else if (a.tag > b.tag) return 1;
                    else return 0;
                };
                break;
            case 'rev_frequency':
                compFunc = (a, b) => {
                    if (a.tag_freq > b.tag_freq) return -1;
                    else if (a.tag_freq < b.tag_freq) return 1;
                    else if (a.code > b.code) return -1;
                    else if (a.code < b.code) return 1;
                    else if (a.tag > b.tag) return -1;
                    else if (a.tag < b.tag) return 1;
                    else return 0;
                };
                break;
        }
        let sorted_tags = this.state.filter_tags.sort(compFunc);
        this.setState({filter_tags: sorted_tags});

    };

    sortWords = (event, tag) => {
        let sort = event.target.name;
        let compFunc;
        switch (sort) {
            case 'tag_alphabet':
                compFunc = (a, b) => {
                    if (a[0] < b[0]) return -1;
                    else if (a[0] > b[0]) return 1;
                    else return 0;
                };
                break;
            case 'tag_rev_alphabet':
                compFunc = (a, b) => {
                    if (a[0] > b[0]) return -1;
                    else if (a[0] < b[0]) return 1;
                    else return 0;
                };
                break;
            case 'tag_frequency':
                compFunc = (a, b) => {
                    return a[1].freq - b[1].freq;
                };
                break;
            case 'tag_rev_frequency':
                compFunc = (a, b) => {
                    return b[1].freq - a[1].freq;
                };
                break;
        }
        let sorted_stat = this.state.filter_statistics;
        if (compFunc)
            sorted_stat = sorted_stat.sort(compFunc);
        else {
            let index = sorted_stat.findIndex(elem => elem[0] === tag);
            let obj = sorted_stat[index][1].word_freq;
            let obj2 = {}, keys;
            switch (sort) {
                case 'word_alphabet':
                    keys = Object.keys(obj)
                        .sort((a, b) => {
                            if (a.toLowerCase() < b.toLowerCase()) return -1;
                            else if (a.toLowerCase() > b.toLowerCase()) return 1;
                            else return 0;
                        });
                    break;
                case 'word_rev_alphabet':
                    keys = Object.keys(obj)
                        .sort((a, b) => {
                            if (a.toLowerCase() > b.toLowerCase()) return -1;
                            else if (a.toLowerCase() < b.toLowerCase()) return 1;
                            else return 0;
                        });
                    break;
                case 'word_frequency':
                    keys = Object.keys(obj)
                        .sort((a, b) => {
                            return obj[a] - obj[b];
                        });
                    break;
                case 'word_rev_frequency':
                    keys = Object.keys(obj)
                        .sort((a, b) => {
                            return obj[b] - obj[a];
                        });
                    break;

            }
            keys.forEach(key => {
                obj2[key] = obj[key];
            });
            sorted_stat[index][1].word_freq = obj2;
        }
        this.setState({filter_statistics: sorted_stat});

    };

    filterTags = () => {
        let firstTag = document.querySelector('#first_tag').value;
        let secondTag = document.querySelector('#second_tag').value;
        let filter_tags = this.state.tags.filter(elem => {
            let isOk = true;
            if (firstTag) {
                isOk = isOk && elem.code === firstTag;
            }
            if (secondTag) {
                isOk = isOk && elem.tag === secondTag;
            }
            return isOk;
        });
        this.setState({filter_tags: filter_tags});

    };

    filterWords = () => {
        let word = document.querySelector('#filter_word').value;
        let stat = this.state.statistics;
        if (!word) this.setState({filter_statistics: stat});
        else {
            stat = stat.filter(elem => {
                let words = Object.keys(elem[1].word_freq);
                return words.includes(word);
            });
            stat = stat.map(elem => {
                let word_freq = {};
                word_freq[word] = elem[1].word_freq[word];
                return [elem[0], {
                    freq: elem[1].freq, word_freq
                }]
            });
            this.setState({filter_statistics: stat});
        }


    };

    render() {
        let i = 0;
        return (

            <div>
                <Button id="words" disabled={this.state.showW} onClick={this.disableButton}
                        style={marginAdd}>Words</Button>
                <Button id="tags" disabled={this.state.showT} onClick={this.disableButton}
                        style={marginAdd}>Tags</Button>
                {this.state.showW && <div id="wordsTable">
                    <Dropdown style={marginDisplay}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic2">
                            Sort
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item name="tag_alphabet"
                                           onClick={this.sortWords}>Alphabet Tags</Dropdown.Item>
                            <Dropdown.Item name="tag_rev_alphabet"
                                           onClick={this.sortWords}>Reverted Alphabet Tags</Dropdown.Item>
                            <Dropdown.Item name="tag_frequency"
                                           onClick={this.sortWords}>Frequency Tags</Dropdown.Item>
                            <Dropdown.Item name="tag_rev_frequency"
                                           onClick={this.sortWords}>Reverted Frequency Tags</Dropdown.Item>
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
                            <th>Code</th>
                            <th>Definition</th>
                            <th>Frequency</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.filter_statistics && this.state.filter_statistics.map((obj) => {
                            i++;
                            let def = this.state.codes.find(elem => elem[0] === obj[0]);
                            let trs = [<tr>
                                <td>{i}</td>
                                <td>{obj[0]}</td>
                                <td>{def  && def[1]}</td>
                                <td>{obj[1].freq}</td>
                                <td>
                                    {/*<Button name={obj[0]} onClick={this.showTags} style={marginAdd}>Tags</Button>*/}
                                    <Button name={obj[0]} onClick={this.showWords} style={marginAdd}>Words</Button>
                                    <Dropdown style={marginDisplay}>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic2">
                                            Sort
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item name="word_alphabet" onClick={(e) => {
                                                this.sortWords(e, obj[0])
                                            }}
                                            >Alphabet Words</Dropdown.Item>
                                            <Dropdown.Item name="word_rev_alphabet"
                                                           onClick={(e) => {
                                                               this.sortWords(e, obj[0])
                                                           }}>Reverted Alphabet Words</Dropdown.Item>
                                            <Dropdown.Item name="word_frequency"
                                                           onClick={(e) => {
                                                               this.sortWords(e, obj[0])
                                                           }}>Frequency Words</Dropdown.Item>
                                            <Dropdown.Item name="word_rev_frequency"
                                                           onClick={(e) => {
                                                               this.sortWords(e, obj[0])
                                                           }}>Reverted Frequency Words</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>];
                            let words = Object.keys(obj[1].word_freq);
                            words.forEach(word => {

                                trs.push(<tr className="red isHidden" name={obj[0]}>
                                    <td>{i}</td>
                                    <td></td>
                                    <td>{word}</td>
                                    <td>{obj[1].word_freq[word]}</td>
                                    <td></td>
                                </tr>)
                                // i++;
                            });
                            return trs;
                        })}

                        </tbody>
                    </Table>
                </div>}


                {this.state.showT && <div id="tagsTable">
                    <Dropdown style={marginDisplay}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Sort
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item name="alphabet"
                                           onClick={this.sortTags}>Alphabet</Dropdown.Item>
                            <Dropdown.Item name="rev_alphabet"
                                           onClick={this.sortTags}>Reverted Alphabet</Dropdown.Item>
                            <Dropdown.Item name="frequency"
                                           onClick={this.sortTags}>Frequency</Dropdown.Item>
                            <Dropdown.Item name="rev_frequency"
                                           onClick={this.sortTags}>Reverted Frequency</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <input id="first_tag" style={marginDisplay} type="text"/> <input id="second_tag"
                                                                                     style={marginDisplay} type="text"/>
                    <Button variant="primary" type="button" style={marginDisplay} onClick={this.filterTags}>
                        Filter
                    </Button>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Code</th>
                            <th>Second Code</th>
                            <th>Frequency</th>

                        </tr>
                        </thead>
                        <tbody>
                        {this.state.filter_tags && this.state.filter_tags.map((tag) => {
                            i++;

                            return <tr>
                                <td>{i}</td>
                                <td>{tag.code}</td>
                                <td>{tag.tag}</td>
                                <td>{tag.tag_freq}</td>
                            </tr>
                        })}

                        </tbody>
                    </Table>
                </div>}
            </div>

        );
    }
}

export default TabCode;