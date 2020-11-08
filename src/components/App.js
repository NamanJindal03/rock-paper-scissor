import './App.css';
import React, {useState, useEffect} from 'react'
import Title from './title'
import RulesModal from './rules'

/* importing images as components */
import {ReactComponent as PaperLogo} from '../images/icon-paper.svg'
import {ReactComponent as ScissorLogo} from '../images/icon-scissors.svg'
import {ReactComponent as RockLogo} from '../images/icon-rock.svg'
import {ReactComponent as TriangleLogo} from '../images/bg-triangle.svg'

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

  //initialising myPick and hostPick States
  const [myPick,setMyPick] = useState(null);
  const [hostPick,setHostPick] = useState(null);
  
  //Hides and shows the rules modal
  const showRulesModal = () =>{
    setValues({...values, rules: true})
  }
  const hideRulesModal = () =>{
    setValues({...values, rules: false})
  }

  //Upon clicking playagain resets the game by reseting certain states
  const resetGame = () =>{
    setMyPick(null);
    setHostPick(null)
    setValues({...values, result: false, win:-2})
  }

  //this function checks who won
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
  //Stores the score in localStorage for persistent storage
  const storeScore = (permanentScore) =>{
    localStorage.setItem('score', permanentScore);
  }

  //sets states for myfigure
  const pickFigure = (figure) =>{
    setMyPick(figure)
  }

  //depending on the players figures returns the required JSX
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

  //iniial setup of choose states
  const chooseShape = () => {
    return(
      <section className="chooseShape">
        <TriangleLogo style={{"position":"absolute", "z-index":"-1", "margin-top":"35px","height":"160px"}}/>
        <span className="logoSpan" id="paper-logo-span" onClick={() => pickFigure("paper")}>
          {/* <span className="logoSpanCircle"> </span> */}
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

  //Implements the screen when we just select our figure
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
  //implements the screen where we see both host and my figure #screen2
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
  
  //displays the final slide where we get to see who won that round
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


  //when the state of myPick changes it implements a timer to slect the state of host
  useEffect(() => {
    let timerId = null
    if(myPick){
      timerId =  setTimeout(() => {
        const values = ["rock","paper","scissor"];
        const random = Math.floor(Math.random() * 3);
        const hostSelection  = values[random];
        
        setHostPick(hostSelection)
      },1500)
   }
    return () => {
      if(timerId) clearTimeout(timerId)
    }
  },[myPick]);

  //once figures of both host and person has been set we implement timer to show result
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

      {/* Mainstage has all the screens */}
      {mainStage}
      <div className="rulesBtnDiv">

        <button onClick={showRulesModal} className="rulesBtn">Rules</button>
      </div>
    </div>
  );
}

export default App;
