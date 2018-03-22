import React from 'react';
import ReactDOM from 'react-dom';
import CenterLayout from './components/CenterLayout'
import Card from './components/Card'
import { shuffle } from './utils/array'
import './index.css';

class MemoryGame extends React.Component {
    constructor(props){
        super(props);

        this.state = this.resetGame();
    }

    resetGame(){
        return {
            cards: this.createCardsList(),
            selected: [],
            score: 0
        };
    }

    createCardsList(){
        const cardsValues = [
            <React.Fragment><span role="img" aria-label="Smiling Face With Sunglasses">😎</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Smiling Face With Heart-Eyes">😍</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Money-Mouth Face">🤑</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Clown Face">🤡</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Smiling Face With Horns">😈</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Smiling Face With Smiling Eyes">😊</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Ghost">👻</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Alien">👽</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Squinting Face With Tongue">😝</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Face With Tears of Joy">😂</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Smiling Face With Halo">😇</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="Baby">👶</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="dog">🐶</span></React.Fragment>,
            <React.Fragment><span role="img" aria-label="cat">🐱</span></React.Fragment>
        ]

        let cards = [];
        for(let i = 0 ; i < cardsValues.length; i++){
            cards.push(this.getCardObject(i , cardsValues[i]));
            cards.push(this.getCardObject(i , cardsValues[i]));
        }

        return shuffle(cards);
    }

    getCardObject(value , html){
        return {
            value: value,
            html: html,
            foundMatch: false,
            openCounter: 0
        };
    }

    handleCardClicked(i){
        let selectedCards = this.state.selected.slice();
        
        if(selectedCards.length >= 2){
            // already opened 2 cards
            
            // update their counters
            this.setState((prevState , props) => {
                const cards = prevState.cards.slice();
                cards[ prevState.selected[0] ].openCounter++;
                cards[ prevState.selected[1] ].openCounter++;
                return {
                    cards: cards,
                }
            });

            // close them
            selectedCards = [];
        }

        if(selectedCards.includes(i) || this.state.cards[ i ].foundMatch){
            // prevent clicking on an opened card,
            // or on an already matched card
            return;
        }

        selectedCards.push(i);

        if(selectedCards.length >= 2){
            const firstCardIndex = selectedCards[0];
            const secondCardIndex = selectedCards[1];

            const firstCard = this.state.cards[ firstCardIndex ];
            const secondCard = this.state.cards[ secondCardIndex ];

            if(firstCard.value === secondCard.value){
                const cards = this.state.cards.slice();
                cards[firstCardIndex].foundMatch = true;
                cards[secondCardIndex].foundMatch = true;
                
                this.setState((prevState , props) => {
                    return {
                        score: prevState.score + this.calcCardScore(firstCard) + this.calcCardScore(secondCard),
                        cards: cards
                    }
                });

                if( this.isGameWon() ){
                    if(window.confirm("You WON!\n\nStart new game?") === true){
                        this.setState(this.resetGame());
                        return;
                    }
                }
            }
        }

        this.setState({
            selected : selectedCards
        });
    }

    calcCardScore(card){
        if(card.openCounter <= 0){
            // luck is great, but not in this game
            return 2;
        }
        else if(card.openCounter === 1){
            // saw this card once and remembered it!
            return 3;
        }
        else {
            // multiple tries
            return 1;
        }
    }

    isGameWon(){
        const totalCards = this.state.cards.length;
        for(let i = 0; i < totalCards; i++){
            if(this.state.cards[i].value !== null && this.state.cards[i].foundMatch !== true){
                return false;
            }
        }

        return true;
    }

    render(){
        const totalCards = this.state.cards.length + 2;
        const cols = Math.ceil(Math.sqrt( totalCards ));
        const rows = Math.ceil(totalCards / cols);
        const card_width = (100 / cols) + "%";
        const card_height = (100 / rows) + "%";

        return (
            <div className="cards">
                <Card showFront={true} hide={false} width={card_width} height={card_height}>
                    <CenterLayout className="game_title">
                        <h1>Memory<br />Game</h1>
                    </CenterLayout>
                </Card>

                {
                    this.state.cards.map(
                        (card , index) => {
                            return (
                                <Card
                                    key={index}
                                    showFront={this.state.selected.includes(index)}
                                    hide={card.foundMatch}
                                    onClick={() => this.handleCardClicked(index)}
                                    width={card_width}
                                    height={card_height}>

                                    <CenterLayout>
                                        {card.html}
                                    </CenterLayout>
                                    
                                </Card>
                            )
                        }
                    )
                }

                <Card showFront={true} hide={false} width={card_width} height={card_height}>
                    <CenterLayout className="game_score">
                        Score: <span>{this.state.score}</span>
                    </CenterLayout>
                </Card>
            </div>
        );
    }
}

/**
 * Memory Game
 * Created by Matan Mizrachi
 * while1.co.il
 */
ReactDOM.render(<MemoryGame />, document.getElementById('root'));