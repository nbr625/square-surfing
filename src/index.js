import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Game boardSize={11} squareSize={25} />, document.getElementById('root'));
registerServiceWorker();
