import React, { Component } from 'react';
import './App.css';
import TabsCustom from './components/Tabs';


class App extends Component {

    render() {
        return (
            <div className="App">
                <h2>Welcome to Dictionary!</h2>
                <TabsCustom activeTab={2} />
            </div>
    );
    }
}

export default App;
