import { useState } from "react";

const baseUrl = "https://opentdb.com/api.php?type=multiple&amount=";

function Trivial() {
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [questions, setQuestions] = useState([]);

  const handleStartGame = () => {
    resetGame();
    const input = document.querySelector('[data-function="questions-number"]').value;
    fetch(baseUrl + input).then((res) => res.json()).then((res) => {
      setQuestions(res.results);
    });
  };

  const resetGame = () => {
    setQuestionsAnswered([]);
    setQuestions([]);
  };

  const handleAnswerClick = (event, answer, questionIndex) => {
    const isAnswerCorrect = checkAnswer(answer, questions[questionIndex].correct_answer);
    markAnswer(event, questionIndex, isAnswerCorrect);
    updateQuestionsAnswered(questionIndex, isAnswerCorrect);
  };

  const markAnswer = (event, questionIndex, isAnswerCorrect) => {
    const allAnswers = document.querySelectorAll(`[data-answer="${questionIndex}"]`);
    allAnswers.forEach((answer) => answer.classList.remove("marked"));
    event.currentTarget.classList.add("marked", isAnswerCorrect ? "correct" : "incorrect");
  };

  const updateQuestionsAnswered = (questionIndex, isAnswerCorrect) => {
    const newQuestionsAnswered = [...questionsAnswered];
    newQuestionsAnswered[questionIndex] = isAnswerCorrect;
    setQuestionsAnswered(newQuestionsAnswered);
  };

  const checkAnswer = (answer, correctAnswer) => {
    return answer === correctAnswer;
  };

  const shuffleAnswers = (question) => {
    const shuffledAnswers = [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5);
    return shuffledAnswers;
  };

  const checkGame = () => {
    const correctResult = questionsAnswered.filter((questionAnswered) => questionAnswered).length;
    const incorrectResult = questionsAnswered.filter((questionAnswered) => !questionAnswered).length;

    return (
      <div>
        {questions.map((question, index) => (
          <p key={index}>
            {question.question} -{" "}
            {questionsAnswered[index] ? <span className="correct">Correct</span> : <span className="incorrect">Incorrect</span>}
          </p>
        ))}
        {questionsAnswered.length > 0 && (
  <p>You have {correctResult} correct answers and {incorrectResult} incorrect answers.</p>
)}

      </div>
    );
    
  };

  return (
    <div>
      <div data-function="gameboard">
        {questions.map((question, index) => (
          <div key={index}>
            <h4>{question.question}</h4>
            {shuffleAnswers(question).map((answer, answerIndex) => (
              <button
                key={answerIndex}
                className="answer"
                data-answer={index}
                onClick={(event) => handleAnswerClick(event, answer, index)}
              >
                {answer}
              </button>
            ))}
            <div className="answer-feedback"></div>
          </div>
        ))}
      </div>
      <input placeholder="Number of questions" type="number" data-function="questions-number" />
      <button data-function="start-game" onClick={handleStartGame}>Start Game</button>
      <div data-function="check-game">{questionsAnswered.length === questions.length && checkGame()}</div>
    </div>
  );
}

export default Trivial;
