import React, { Component, PropTypes } from 'react';
import Square from './Square';

class PlayerSquare extends Component {

    render() {
        const { size, squarePosition: { top, left }} = this.props;

        return (
            <div ref={ n => { this.playerSquare = n }}
                 onMouseOver={this.props.handleMouseEnter}
                 onMouseOut={this.props.handleMouseLeave}
            >
                <Square

                    size={size}
                    position={{ top, left }}
                    color='darkgray' />
            </div>

        );
    }
}

PlayerSquare.propTypes = {
    size: PropTypes.number.isRequired,
    squarePosition: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired
    })
};

export default PlayerSquare;