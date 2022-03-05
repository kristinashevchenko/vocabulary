import React, { useState, memo } from 'react';
import {Button, Dropdown, Table, Form, Col } from "react-bootstrap";
import sortComparator from './tags_sort';

const marginDisplay = {
    margin: "1em",
    display: "inline"
};

const TagsTable = ({tags}) => {

    const [filteredTags, setFilterTags] = useState(tags);
    const [firstTag, setFirstTag] = useState('');
    const [secondTag, setSecondTag] = useState('');
    const [selectValue, setSelectValue] = useState('');


    const sortTags = (eventKey) => {
        setSelectValue(eventKey);
        const compFunc = sortComparator(eventKey);
        const sorted_tags = filteredTags.sort(compFunc);
        setFilterTags(sorted_tags);
    };

    const filterTags = (event) => {
        event.preventDefault();
        const filter_tags = tags.filter(elem => {
            let isOk = true;
            if (firstTag) {
                isOk = isOk && elem.code === firstTag;
            }
            if (secondTag) {
                isOk = isOk && elem.tag === secondTag;
            }
            return isOk;
        });
        setFilterTags(filter_tags);
    };

    const onFirstTagChange = (event) => {
        setFirstTag(event.target.value);
    }
    const onSecondTagChange = (event) => {
        setSecondTag(event.target.value);
    }

    return (
            <div id="tagsTable">   
                <Form style={marginDisplay} onSubmit={filterTags}>
                    <Form.Row>
                        <Col>
                            <Dropdown style={{margin: '1em'}} onSelect={sortTags} value={selectValue}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Sort
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="alphabet">Alphabet</Dropdown.Item>
                                    <Dropdown.Item eventKey="rev_alphabet">Reverted Alphabet</Dropdown.Item>
                                    <Dropdown.Item eventKey="frequency">Frequency</Dropdown.Item>
                                    <Dropdown.Item eventKey="rev_frequency">Reverted Frequency</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Form.Control 
                                type="text"
                                placeholder="Enter first tag" 
                                onChange={onFirstTagChange}
                                value={firstTag}
                                style={marginDisplay}/>
                        </Col>
                        <Col>
                            <Form.Control 
                                type="text" 
                                onChange={onSecondTagChange}
                                value={secondTag}
                                placeholder="Enter second tag" 
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
                            <th>First Code</th>
                            <th>Second Code</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredTags.map((tag, index) => {
                        return (<tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{tag.code}</td>
                                    <td>{tag.tag}</td>
                                    <td>{tag.tag_freq}</td>
                                </tr>)
                    })}
                    </tbody>
                </Table>
            </div>
    );
}

export default memo(TagsTable);