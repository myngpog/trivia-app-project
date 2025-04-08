import { useState, useEffect } from 'react';
import './App.css';
import Button from '@mui/material/Button'; // Material UI req

function App() {
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({}); 

  useEffect(() => {
    fetch('https://the-trivia-api.com/v2/questions')
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map((q) => {
          const allAnswers = [...q.incorrectAnswers, q.correctAnswer];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          return {
            ...q,
            shuffledAnswers,
          };
        });
  
        setQuestions(processed);
        setLoaded(true);
      })
      .catch((err) => console.error('Failed to fetch trivia:', err));
  }, []);
  

  const handleAnswerClick = (questionIndex, selectedAnswer, correctAnswer) => {
    if (selectedAnswers[questionIndex]) return;

    setSelectedAnswers((prev) => ({...prev,
      [questionIndex]: { selected: selectedAnswer, correct: selectedAnswer === correctAnswer, },
    }));
  };

  const resetGame = () => {
    setSelectedAnswers({});
    setLoaded(false);
    setQuestions([]);
  
    fetch('https://the-trivia-api.com/v2/questions')
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map((q) => {
          const allAnswers = [...q.incorrectAnswers, q.correctAnswer];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          return {
            ...q,
            shuffledAnswers,
          };
        });
  
        setQuestions(processed);
        setLoaded(true);
      })
      .catch((err) => console.error('Failed to fetch trivia:', err));
  };  

  return (
    <div className="app">
      <h1>Trivia Game</h1>
      <Button variant="contained" onClick={resetGame}>Reset</Button>
      {!loaded && <p>Loading questions...</p>}

      {loaded &&
        questions.map((q, i) => {
          const shuffledAnswers = q.shuffledAnswers;
          const userAnswer = selectedAnswers[i];

          return (
            <div key={i} className="question-card">
              <h3>{q.question.text}</h3>
              <div className="answers">
                {shuffledAnswers.map((answer, j) => {
                  const isSelected = userAnswer?.selected === answer;
                  const isCorrect = answer === q.correctAnswer;

                  return (
                    <button
                      key={j}
                      className="answer-button"
                      onClick={() => handleAnswerClick(i, answer, q.correctAnswer)}
                      style={{
                        backgroundColor: userAnswer
                          ? isSelected
                            ? isCorrect
                              ? 'green'
                              : 'lightcoral'
                            : ''
                          : '',
                        cursor: userAnswer ? 'not-allowed' : 'pointer',
                      }}
                      disabled={!!userAnswer}
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>
              {userAnswer && (
                <p className="feedback">
                    Correct answer: <strong>{q.correctAnswer}</strong>
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default App;
