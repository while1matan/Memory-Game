import React from 'react';
import "./Card.css";

class Card extends React.Component {
    render(){
        const showFrontClass = (this.props.showFront)? " flip " : "";
        const hideClass = (this.props.hide)? " hidden " : "";
        const clickableClass = (this.props.onClick)? " clickable " : "";

        // onTouchStart={this.props.onClick}

        return (
            <div
                className={"card" + showFrontClass + hideClass + clickableClass}
                onClick={this.props.onClick}
                style={{width: this.props.width , height: this.props.height}}>
                <div className="flipper">
                    <div className="front">
                        {this.props.children}
                    </div>
                    <div className="back">
                        {this.props.back}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;