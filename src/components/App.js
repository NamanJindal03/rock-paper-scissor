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
    score: 100,
    myPick: "",
    hostPick: "",
    result: false,
    win: -2
  })
  //destructuring states
  const {rules, score, myPick, hostPick, result, win} = values;
  
  
  const showRulesModal = () =>{
    setValues({...values, rules: true})
  }
  const hideRulesModal = () =>{
    setValues({...values, rules: false})
  }
  const resetGame = () =>{
    setValues({...values, myPick:"", hostPick: "", result: false, win:-2})
  }

  const displayMyAndHost = () =>{
    return(
      <section className="displayMyPickHeader">
        <div className="displayMyPickTitle">
          <span>YOU PICKED</span>
          <span>THE HOUSE PICKED</span>
        </div>
        <div className="displayMyPick">
          {returnPlayerFigure(myPick)}
          {returnPlayerFigure(hostPick)}
        </div>
        
      </section>
    )
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
  const storeScore = async() =>{
    await localStorage.setItem('score', score);
  }
  const pickFigure = (event) =>{
    let figure=event.target.id
    figure= figure.split('-')[0];
    console.log(figure);

    //setValues({...values, myPick: figure})
    setValues((prevState)=>({
      ...values, 
      myPick: figure
    })) 
    setTimeout(() => {
      let figureArray = ['rock', 'paper', 'scissor'];
      let selectedFigure = figureArray[Math.floor(Math.random()*3)];
      setValues((prevState)=>({
        ...values, 
        hostPick: selectedFigure
      }))
      /* mainStage = pickHostFigure();  */
      setTimeout(() => {
        let ans = evaluateWin();
        let permanentScore = Number(score) + ans;
        setValues((prevState) => ({
          ...values,
          win: ans,
          result: true,
          score: permanentScore
        }))
        storeScore();
      }, 1000);

    }, 1000);
  }

  const chooseShape = () => {
    return(
      <section className="chooseShape">
        <span className="logoSpan" id="paper-logo-span" onClick={pickFigure}>
          <PaperLogo />
        </span>
        <span className="logoSpan" id="rock-logo-span" onClick={pickFigure}>
          <RockLogo />
        </span>
        <span className="logoSpan" id="scissor-logo-span" onClick={pickFigure}>
          <ScissorLogo />
        </span>
        {/* <RockLogo />
        <ScissorLogo /> */}
      </section>
    )
  }
  const returnPlayerFigure = (Pick) =>{
    return(Pick === 'rock' ? 
              <span className="logoSpan2" id="rock-logo-span" >
                <RockLogo />
              </span> 
            : 
              (myPick === 'paper' ? 
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
        <div className="displayMyPickTitle">
          <span>YOU PICKED</span>
          <span>THE HOUSE PICKED</span>
        </div>
        <div className="displayMyPick">
          {returnPlayerFigure()}
          <span className="blankFigure"></span> 
        </div>
        
      </section>
    )
  }
  const displayWinLooseSlide = () =>{
    return(
      <section className="displayMyPickHeader">
        <div className="displayMyPickTitle">
          <span>YOU PICKED</span>
          <span>THE HOUSE PICKED</span>
        </div>
        <div className="displayMyPick">
          {returnPlayerFigure(myPick)}
          <div className="resultsSection">

            {win === 0 ? <h1>Draw</h1> : (win === 1 ? <h1>Win</h1> : <h1>Lose</h1>)}
            <button className="playAgain" onClick={resetGame}>PLAY AGAIN</button>
          </div>
          {returnPlayerFigure(hostPick)}
        </div>
        
      </section>
    )
  }
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
  useEffect(() =>{
    
    loadInitialResult();
  }, [])
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
