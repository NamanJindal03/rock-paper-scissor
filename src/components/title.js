import './App.css';
import React from 'react';
const Title = (props) =>{
    const ScoreCard = () =>{
        return(

            <div className="scoreCard">
                <span id="score-title">SCORE</span>
                <span id="current-score">{props.score}</span>
            </div>
        )
    }
    const titleAndScore = () =>{
        return(
            <div className="titleAndScoreHeader">
                <span>
                    ROCK PAPER SCISSORS
                </span>
                
                {ScoreCard()}
            </div>
        )
    }
    return(
        <>
            {titleAndScore()}
        </>
    )
}

export default Title;