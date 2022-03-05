import React, { memo } from 'react';
import { Table } from 'react-bootstrap';
const table = require('./table');

const TabCodeDef = () => {
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Definition</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map((code, i) => {
                        return (<tr key={i}>
                                    <td>{i}</td>
                                    <td>{code[0]}</td>
                                    <td>{code[1]}</td>
                                </tr>)
                    })}

                </tbody>
            </Table>
        </div>

    );
}

export default memo(TabCodeDef);