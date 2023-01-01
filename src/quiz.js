import React, { useState } from 'react';
import Speech from 'react-speech';
import { ClipboardEvent } from "react"
import { vocabulary } from './quizes/engtogreekalphabet';
import './styles.css'

const STATES = {
    ASKING: 'ASKING',
    AGAIN: 'AGAIN',
    CORRECT: 'CORRECT',
    WRONG: 'WRONG'
}

const Quiz = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [numCorrect, setNumCorrect] = useState(0);
    const [numTotal, setNumTotal] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizState, setQuizState] = useState(STATES.ASKING)

    let currentQuiz = vocabulary[currentIndex];

    /*********************************************************************
    *    State Changing functions
    *********************************************************************/
    const pickQuiz = () => {
        let index = Math.floor(Math.random() * vocabulary.length)
        setCurrentIndex(index);
    }

    const handleChange = (event) => {
        setUserAnswer(event.target.value);
    };

    const isCorrect = () => userAnswer.toLowerCase() === currentQuiz.answer.toLowerCase()
    const stateCorrect = () => {
        setNumCorrect(numCorrect + 1)
        setNumTotal(numTotal + 1)
        addOne('total')
        addOne('correct')
        console.log(vocabulary)
        setQuizState(STATES.CORRECT)
    }
    const stateWrong = () => {
        setNumTotal(numTotal + 1)
        addOne('total')
        addOne('wrong')
        setQuizState(STATES.WRONG)
        console.log(vocabulary)
    }
    const stateAsking = () => {
        pickQuiz()
        setUserAnswer('');
        setQuizState(STATES.ASKING)
    }
    const stateAgain = () => {
        setUserAnswer('');
        setQuizState(STATES.ASKING)
    }

    const addOne = (property) => {
        if (isNaN(vocabulary[currentIndex][property])) {
            vocabulary[currentIndex][property] = 0
        }
        vocabulary[currentIndex][property] = vocabulary[currentIndex][property] + 1
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        switch (quizState) {
            case STATES.ASKING:
                isCorrect() ? stateCorrect() : stateWrong()
                break;
            case STATES.WRONG:
                stateAgain()
                break
            default:
                return (stateAsking())
        }
    };

    const preventCopyPaste = (e) => {
        e.preventDefault()
        alert("Copying and pasting is not allowed!")
    }

    /*********************************************************************
    *   JSX
    *********************************************************************/

    let Question = () => <p id="question">{currentQuiz.question}</p>
    let Answer = () => <p>{currentQuiz.question}: {currentQuiz.answer}</p>
    let PronounceButton = () => <Speech text={currentQuiz.question} textAsButton displayText={"Press to Hear"} />
    let QuestionForm = () => <form onSubmit={handleSubmit}>
        <input autoFocus type="text"
            onCopy={(e) => preventCopyPaste(e)}
            onPaste={(e) => preventCopyPaste(e)}
            onCut={(e) => preventCopyPaste(e)}
            value={userAnswer} onChange={handleChange} />
        <button type="submit">Submit</button>
    </form>
    let GameStatus = () => <p style={{ color: "yellow" }}>Correct: {numCorrect}&emsp;Total: {numTotal}&emsp;Percentage: {numTotal === 0 ? 0 : (numCorrect * 100 / numTotal).toFixed(0)}%</p>
    let CorrectStatement = () => <p style={{ color: "lightgreen", fontSize: "32px" }}>CORRECT!</p>
    let WrongStatement = () => <p style={{ color: "red", fontSize: "32px" }}>WRONG!</p>
    let ContinueForm = () => <form onSubmit={handleSubmit}>
        <button autoFocus type="submit">Submit</button>
    </form>


    let Asking = () => <div>
        <Question />
        <PronounceButton />
        <QuestionForm />
        <GameStatus />
    </div>

    let Correct = () => <div>
        <CorrectStatement />
        <Answer />
        <ContinueForm />
        <GameStatus />
    </div>

    let Wrong = () => <div>
        <WrongStatement />
        <Answer />
        <ContinueForm />
        <GameStatus />
    </div>

    /*********************************************************************
    *   State Machine
    *********************************************************************/
    switch (quizState) {
        case STATES.ASKING:
            return <Asking />
        case STATES.CORRECT:
            return <Correct />
        case STATES.WRONG:
            return <Wrong />
        default:
            return (<p>ERROR</p>)
    }
};

export default Quiz;
