import React, { Component } from 'react';
import axios from 'axios';
import GameInfo from './components/GameInfo';
import PlayerSquare from './components/PlayerSquare';
import Board from './components/Board';
import { UP, DOWN, LEFT, RIGHT } from './helpers/constants';
import { pluck } from './helpers/utils'
const getDefaultState = ({ boardSize, squareSize, highScore = 0 }) => {
    const half = Math.floor(boardSize / 2) * squareSize;
    return {
        size: {
            board: boardSize,
            square: squareSize,
            maxDim: boardSize * squareSize
        },
        squarePosition: {
            top: half,
            left: half
        },
        playerScore: 0,
        highScore,
        timeElapsed: 0,
        squareSpeed: 5,
        baseScore: 10
    }
};

export default class Game extends Component {
    constructor(props) {
        super(props);
        const half = Math.floor(props.boardSize / 2) * props.squareSize;
        const { boardSize, squareSize } = props;
        this.state = getDefaultState({ boardSize, squareSize })
        this.moveSquare = this.moveSquare.bind(this);
        this.updateSquarePosition = this.updateSquarePosition.bind(this)
    }



    moveSquare() {
        const newDirection = pluck([UP, DOWN, LEFT, RIGHT]);
        debugger;

        // update new direction
        this.updateSquarePosition(newDirection);

    }



    updateSquarePosition = (direction) => {
        const { top, left } = this.state.squarePosition;
        const { square, maxDim } = this.state.size;
        const squareSpeed = this.state.squareSpeed ;
        let newDirection;
        debugger;

        // check walls
        switch (direction) {
            case UP:
                if (top === 0) {
                    return
                } else {
                    newDirection = { top: top + squareSpeed, left: left };
                };
                break;
            case DOWN:
                if (top === maxDim - square) {
                    return
                } else {
                    newDirection = { top: top - squareSpeed, left: left };
                };
                break;
            case LEFT:
                if (left === 0) {
                    return
                } else {
                    newDirection = { top: top, left: left - squareSpeed };
                };
                break;
            case RIGHT:
                if (left === maxDim - square){
                    return
                } else {
                    newDirection = { top: top , left: left + squareSpeed };
                };
                break;
        }

        debugger;



        this.setState({
            squarePosition: {
                top: newDirection.top,
                left: newDirection.left
            }
        });
    }

    handleMouseEnter() {
        debugger;
        this.startGame()

    }

    handleMouseLeave(){
        this.resetGame();
    }

    startGame = () => {
        debugger;
        let timeInterval = setInterval(this.updateGame, 1000);
        let gameInterval = setInterval(this.moveSquare, 1000);
        this.setState({
            timeInterval,
            gameInterval
        })
    }

    updateGame = () => {
        const { timeElapsed } = this.state;

        this.updateTimeAndScore();

        if (timeElapsed > 0) {

            // increment square speed
            if (timeElapsed % 10 === 0) {
                this.incrementSquareSpeed();
            }
        }
    }


    updateTimeAndScore = () => {
        const { timeElapsed, playerScore, baseScore } = this.state;

        this.setState({
            timeElapsed: timeElapsed + 1,
            playerScore: playerScore + baseScore,
        });
    }

    incrementSquareSpeed = () => {
        const { squareSpeed } = this.state;

        this.setState({
            squareSpeed: parseFloat((squareSpeed + 0.01).toFixed(2))
        });
    }

    resetGame = () => {
        const { boardSize, squareSize } = this.props;
        const { playerScore, highScore, globalHighScore, debug } = this.state;

        alert("Oh No! You got off the box!");


        // clear intervals
        clearInterval(this.state.gameInterval);
        clearInterval(this.state.timeInterval);

        // if high score is higher than global high score, update it
        if (playerScore > globalHighScore) {
            this.updateGlobalHighScore(playerScore);
        }

        // reset state
        this.setState({
            ...getDefaultState({ boardSize, squareSize, highScore }),
            // persist debug state and high scores
            debug,
            highScore: playerScore > highScore ? playerScore : highScore,
            globalHighScore
        });


    }

    handleDebugToggle = () => {
        this.setState({
            debug: this.debug.checked
        });
    }

    fetchGlobalHighScore = () => {
        // axios.get(url)
        //     .then(data => {
        //         this.setState({
        //             globalHighScore: data.data.fields.global_high_score
        //         })
        //     })
        //     .catch(err => console.warn(err))
    }

    updateGlobalHighScore = (highScore) => {
        // axios.patch(url, {
        //     "fields": {
        //         "global_high_score": highScore
        //     }
        // })
        // .then(data => {
        //     this.setState({
        //         globalHighScore: data.data.fields.global_high_score
        //     });
        // })
        // .catch(err => console.warn(err))
    }

    style = () => {
        return {
            width: '85%',
            maxWidth: '600px',
            margin: '0 auto'
        };
    }

    render() {
        const {
            size: { board, square },
            squarePosition,
            playerScore,
            timeElapsed,
            highScore,
            squareSpeed,
            globalHighScore
            } = this.state;

        return (
            <div style={this.style()}>
                <GameInfo
                    playerScore={playerScore}
                    timeElapsed={timeElapsed}
                    highScore={highScore}
                    globalHighScore={globalHighScore} />

                <Board dimension={board * square}>
                    <PlayerSquare
                        size={square}
                        squarePosition={squarePosition}
                        squareSpeed={squareSpeed}
                        handleMouseEnter={this.handleMouseEnter.bind(this)}
                        handleMouseLeave={this.handleMouseLeave.bind(this)}/>
                </Board>
            </div>
        )
    }

    componentDidMount() {
        this.fetchGlobalHighScore();
    }

    componentWillUnmount() {
        clearInterval(this.state.gameInterval);
        clearInterval(this.state.timeInterval);
    }
}
