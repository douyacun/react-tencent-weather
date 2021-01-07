import React from 'react';
import ReactDOM from 'react-dom';
import Weather from '../src/index';

ReactDOM.render(
    <div><Weather province="上海" city="上海"/></div>,
    document.getElementById('root')
)