import React, { useEffect, useState } from 'react';
import {Button, Table} from "react-bootstrap";

const TabCorpus = ({ updateKey }) => {

    const [corpuse, setCorpuse] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchedText, setSearchedText] = useState('');

    useEffect(() => {
        async function loadCorpuse() {
            const responseJS = await fetch("http://localhost:5000/corpuse");
            const response = await responseJS.json();
            setCorpuse(response.corpuse);
        }
        loadCorpuse();        
    }, []);

    const openText = (name) => {
        updateKey({tab: 2, filename: name});
    }

    const openAnnotateText = (name) => {
        updateKey({tab: 4, filenameAn: name});
    }

    const searchText = async () => {
        const responseJS = await fetch(`http://localhost:5000/searchText?words=${inputValue}`);
        const response = await responseJS.json();
        const name = response.text.name.replace('.json', '.txt');
        setSearchedText(name);
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }
    
    return (
        <div>
            <input 
                style={{margin: '1em'}}
                id="search" 
                type="text" 
                value={inputValue} 
                onChange={handleChange} 
            />
            <Button variant="primary" type="button" style={{margin: '1em'}} onClick={searchText}>
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
                {corpuse.map((file, i) => {
                    const { name, number } = file;
                    return (
                    <tr 
                        name={name}
                        key={name}
                        className={name === searchedText ? 'textTr' : ''}
                    >
                        <td>{i}</td>
                        <td>{name}</td>
                        <td>{number}</td>
                        <td>
                            <Button 
                                style={{marginLeft: '1em'}}
                                onClick={openText.bind(this, name)}
                            >
                                Open
                            </Button>
                            <Button 
                                style={{marginLeft: '1em'}}
                                onClick={openAnnotateText.bind(this, name)}
                            >
                                Annotate          
                            </Button>
                        </td>
                    </tr>)
                })}
                </tbody>
            </Table>
        </div>
    );
}

export default TabCorpus;