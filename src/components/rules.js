import './App.css';
import React from 'react';
import {ReactComponent as RulesLogo} from '../images/image-rules.svg'
const RulesModal = (props) =>{
    
    return(
        <div className="modal">
            <section className="modal-main">
                <div >
                    <span>Rules</span>
                    <button onClick={props.hideRulesModal} className="close-rules-1">X</button>
                </div>
                <RulesLogo className="rules-logo"/>
                <button onClick={props.hideRulesModal} className="close-rules-2" >X</button>
            </section>
        </div>
    )
}

export default RulesModal;