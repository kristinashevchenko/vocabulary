import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import TagsTable from './TagsTable/TagsTable';
import WordsTable from './WordsTable/WordsTable';

const marginAdd = {
    margin: "2em"
};

const TabCode = () => {
    const [showWords, setShowWords] = useState(true);
    const [tags, setTags] = useState([]);
    const [statistics, setStatistics] = useState([]);


    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async() => {
        const responseJS = await fetch("http://localhost:5000/statistics");
        const response = await responseJS.json();
        let tags = [];
        response.map.forEach(elem => {
            const tag_freq = elem[1].tag_freq;
            Object.keys(tag_freq).forEach(tag => {
                tags.push({code: elem[0], tag, tag_freq: tag_freq[tag]})
            })
        });
        setTags(tags);
        setStatistics(response.map);
    }

    const disableButton = () => {
        setShowWords(! showWords);
    };

    return (
        <div>
            <Button id="words" disabled={showWords} onClick={disableButton}
                    style={marginAdd}>Words</Button>
            <Button id="tags" disabled={! showWords} onClick={disableButton}
                    style={marginAdd}>Tags</Button>
            {showWords && <WordsTable statistics={statistics}/>}
            {! showWords && <TagsTable tags={tags}/>}
        </div>
    );   
}

export default TabCode;