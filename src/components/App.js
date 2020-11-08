import './App.css';
import React, {useState, useEffect} from 'react'
import Title from './title'
import RulesModal from './rules'

/* importing images as components */
import {ReactComponent as PaperLogo} from '../images/icon-paper.svg'
import {ReactComponent as ScissorLogo} from '../images/icon-scissors.svg'
import {ReactComponent as RockLogo} from '../images/icon-rock.svg'

const App = () => {
  //initialising states using useState hook
  const [values, setValues] = useState({
    rules: false,
    score: 0,
    myPick: "",
    hostPick: "",
    result: false,
    win: -2
  })
  //destructuring states
  const {rules, score,  result, win} = values;

  const [myPick,setMyPick] = useState(null);
  const [hostPick,setHostPick] = useState(null);
  
  
  const showRulesModal = () =>{
    setValues({...values, rules: true})
  }
  const hideRulesModal = () =>{
    setValues({...values, rules: false})
  }
  const resetGame = () =>{
    setMyPick(null);
    setHostPick(null)
    setValues({...values, result: false, win:-2})
  }

  
  const evaluateWin = () =>{
    if(myPick === hostPick){
      return 0;
    }
    else if( (myPick === 'rock' && hostPick === 'scissor') || (myPick === 'paper' && hostPick=== 'rock') || (myPick === 'scissor' && hostPick=== 'paper')){
      return 1;
    }
    else{
      return -1;
    }
  }
  const storeScore = (permanentScore) =>{
    localStorage.setItem('score', permanentScore);
  }
  const pickFigure = (figure) =>{
    console.log("my figure", figure)
    setMyPick(figure)
  }

  

  const chooseShape = () => {
    return(
      <section className="chooseShape">
        <span className="logoSpan" id="paper-logo-span" onClick={() => pickFigure("paper")}>
          <PaperLogo />
        </span>
        <span className="logoSpan" id="rock-logo-span" onClick={() => pickFigure("rock")}>
          <RockLogo />
        </span>
        <span className="logoSpan" id="scissor-logo-span" onClick={() => pickFigure("scissor")}>
          <ScissorLogo />
        </span>
      </section>
    )
  }
  const returnPlayerFigure = (pick) =>{
    return(pick === 'rock' ? 
              <span className="logoSpan2" id="rock-logo-span" >
                <RockLogo />
              </span> 
            : 
              (pick === 'paper' ? 
              <span className="logoSpan2" id="paper-logo-span" >
                <PaperLogo />
              </span>   
              : 
              <span className="logoSpan2" id="scissor-logo-span">
                <ScissorLogo />
              </span>));
  }
  const displayMyPick = () =>{
    return(
      <section className="displayMyPickHeader">
        <div className="displayMyPick">
          <div className="resultsSection2">
            <span className="titles">YOU PICKED</span>
            {returnPlayerFigure(myPick)}
          </div>
          
          <div className="resultsSection2">
            <span className="titles">THE HOUSE PICKED</span>
            <span className="blankFigure"></span> 
          </div>
        </div>
        
      </section>
    )
  }
  const displayMyAndHost = () =>{
    return(
      <section className="displayMyPickHeader">
        <div className="displayMyPick">
          <div className="resultsSection2">
            <span className="titles">YOU PICKED</span>
            {returnPlayerFigure(myPick)}
          </div>
          
          <div className="resultsSection2">
            <span className="titles">THE HOUSE PICKED</span>
            {returnPlayerFigure(hostPick)}
          </div>
        </div>
        
      </section>
    )
  }
  
  const displayWinLooseSlide = () =>{
    return(
      <section className="displayMyPickHeader">
        <div className="displayMyPick">
          <div className="resultsSection2">
            <span className="titles">YOU PICKED</span>
            {returnPlayerFigure(myPick)}
          </div>
          <div className="resultsSection">
            {win === 0 ? <span className="winStates">DRAW</span> : (win === 1 ? <span className="winStates">YOU WIN</span> : <span className="winStates">YOU LOSE</span>)}
            <button className="playAgain" onClick={resetGame} >
              PLAY AGAIN
            </button>
          </div>
          <div className="resultsSection2">
            <span className="titles">THE HOUSE PICKED</span>
            {returnPlayerFigure(hostPick)}
          </div>
        </div>
        <div className="resultsSectionCopy">
        {win === 0 ? <span className="winStates2">DRAW</span> : (win === 1 ? <span className="winStates2">YOU WIN</span> : <span className="winStates2">YOU LOSE</span>)}
            <button className="playAgain2" onClick={resetGame} >
              PLAY AGAIN
            </button>
          </div>
      </section>

    )
  }

  /* Fetches the result from the Local Storage and sets in state */
  const loadInitialResult = async () =>{
    let finalScore;
    let localStorageResult = await localStorage.getItem('score');
    if(!localStorageResult){
      finalScore = 0;
    }else{
      finalScore = localStorageResult;
    }
    setValues({...values, score: finalScore})
  }


  let mainStage;
  if(!myPick && !hostPick && !result){
    mainStage = chooseShape()
  }else if(myPick && !hostPick && !result){
    mainStage = displayMyPick();
  }else if(myPick && hostPick && !result){
    mainStage = displayMyAndHost();
  }else{
    mainStage = displayWinLooseSlide();
  }

  /* Only gets executed once  */
  useEffect(() =>{
    
    loadInitialResult();
  }, [])

  useEffect(() => {
    let timerId = null
    if(myPick){
      timerId =  setTimeout(() => {
        const values = ["rock","paper","scissor"];
        const random = Math.floor(Math.random() * 3);
        const hostSelection  = values[random];
        console.log(hostSelection)
        setHostPick(hostSelection)
      },1500)
   }
    return () => {
      if(timerId) clearTimeout(timerId)
    }
  },[myPick]);

  useEffect(() => {
    let timerId = null
    if(hostPick){
      timerId =  setTimeout(() => {
        let ans = evaluateWin();
        let permanentScore = Number(score) + ans;
        setValues((prevState) => ({
          ...values,
          win: ans,
          result: true,
          score: permanentScore
        }))
        storeScore(permanentScore);
      }, 1500)
   }
    return () => {
      if(timerId) clearTimeout(timerId)
    }
  },[hostPick]);

  return (
    <div className="app">
      {/* Conditional rendering the RulesModal according to the state */}
      {rules? <RulesModal  hideRulesModal= {hideRulesModal}/> : <> </>}
      {/* Passing score as prop to title component */}
      <Title score={score}/>
      {mainStage}
      <button onClick={showRulesModal} className="rulesBtn">Rules</button>
    </div>
  );
}

export default App;
