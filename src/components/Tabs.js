
import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TabText from './TabText';
import TabCorpus from './TabCorpus';
import TabDict from './TabDict';
import TabCode from './TabCode';
import TabAnnotateText from "./TabAnnotateText";

class TabsCustom extends Component {
    constructor(props) {
        super();
        this.state = {
            activeTab: props.activeTab || 1,
            filename:undefined,
            word:undefined
        };

        // Bind the handleSelect function already here (not in the render function)
        this.handleSelect = this.handleSelect.bind(this);
    }

    updateKey = (value) => {
        this.setState({ activeTab: value.tab,filename:value.filename,word:value.word, filenameAn: value.filenameAn });
    }

    render() {
        return (
            <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect}>
                <Tab eventKey={1} title="Dictionary"><TabDict updateKey={this.updateKey}/></Tab>
                <Tab eventKey={2} title="Text"><TabText filename={this.state.filename} word={this.state.word}/></Tab>
                <Tab eventKey={3} title="Corpus"  ><TabCorpus updateKey={this.updateKey}/></Tab>
                <Tab eventKey={4} title="Annotate text"  ><TabAnnotateText filename={this.state.filenameAn} /></Tab>
                <Tab eventKey={5} title="Codes"  ><TabCode updateKey={this.updateKey}/></Tab>
            </Tabs>
        );
    }

    handleSelect(selectedTab) {
        this.setState({
            activeTab: selectedTab
        });
    }
}

export default TabsCustom;