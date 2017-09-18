import React, { Component } from 'react';
import axios from 'axios';
import { GameInfo, Board, PlayerSquare} from 'components';
import { UP, DOWN, LEFT, RIGHT } from 'helpers/constants';
import url from 'api';

const getDefaultState = ({ boardSize, squareSize, highScore = 0 }) => {
    const half = Math.floor(boardSize / 2) * playerSize;
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
    }

    pluck = (arr) => arr[Math.floor(Math.random() * arr.length)];

    moveSquare = () => {
        const { square, maxDim } = this.state.size;
        const squarePosition = this.state.squarePosition;

        // assign to a random side
        const newDirection = pluck([UP, DOWN, LEFT, RIGHT]);

        // generate enemy object
        this.updateSquarePosition(squarePos, side);

    }



    updateSquarePosition = (dirObj) => {
        const { top, left } = this.state.squarePosition;
        const { square, maxDim } = this.state.size;

        // check walls
        switch (dirObj.dir) {
            case UP:
                if (top === 0) return;
                break;
            case DOWN:
                if (top === maxDim - square) return;
                break;
            case LEFT:
                if (left === 0) return;
                break;
            case RIGHT:
                if (left === maxDim - square) return;
                break;
        }

        this.setState({
            squarePosition: {
                top: top + (square * dirObj.top),
                left: left + (square * dirObj.left)
            }
        });
    }

    handleMouseEnter = (e) => {
        this.startGame()

    }

    handleMouseLeave = () => {
        this.resetGame();
    }

    startGame = () => {
        this.timeInterval = setInterval(this.updateGame, 1000);
        this.gameInterval = setInterval(this.updateSquarePosition, 250);
    }

    updateGame = () => {
        const { timeElapsed } = this.state;

        this.updateTimeAndScore();

        if (timeElapsed > 0) {

            // increment square speed
            if (timeElapsed % 3 === 0) {
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
            squareSpeed: parseFloat((squareSpeed + 0.25).toFixed(2))
        });
    }

    resetGame = () => {
        const { boardSize, squareSize } = this.props;
        const { playerScore, highScore, globalHighScore, debug } = this.state;

        // clear intervals
        clearInterval(this.gameInterval);
        clearInterval(this.timeInterval);

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
                    <Player
                        size={square}
                        position={squarePosition}
                        handleMouseEnter={this.handleMouseEnter}
                        handleMouseLeave={this.handleMouseLeave}/>
                </Board>
                {false && <p style={{ position: 'fixed', bottom: 0, left: 16 }}>Debug: <input type="checkbox" onChange={this.handleDebugToggle} ref={ n => this.debug = n }/></p>}
                {this.state.debug && <DebugState data={this.state} />}
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
