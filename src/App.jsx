import { useEffect, useState } from "react";
import quizLogo from './quiz-logo.png';

function App() {
  const [currentGame, setCurrentGame] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(15);
  const [gameRound, setGameRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const getGameData = async () => {
    let res = await fetch('https://raw.githubusercontent.com/aaronnech/who-wants-to-be-a-millionaire/master/questions.json');
    let data = await res.json();
    setCurrentGame(data.games[0]?.questions);
  };

  useEffect(() => {
    getGameData();
    setCurrentQuestion(0);
    setPlayerScore(0);
    setGameOver(false);
  }, [gameRound]);

  const updateScore = (answer_index, el) => {
    if (currentQuestion >= maxQuestions) return;
    if (answer_index === currentGame[currentQuestion].correct) {
      setPlayerScore(prevScore => prevScore + 1000);
      el.target.classList.add('correct');
    } else {
      el.target.classList.add('wrong');
    }
    setTimeout(() => {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      el.target.classList.remove('correct');
      el.target.classList.remove('wrong');
    }, 1000);
  };

  const handleEndQuiz = () => {
    setGameOver(true);
  };

  const showScoreScreen = () => (
    <div className="my-auto p-6 header-bg">
      <h2 className="font-bold text-lg">Your Final Score</h2>
      <h3 className="text-2xl">${playerScore}</h3>
      <div className="flex p-3 text-white">
        <button className="py-2 px-5 bg-green-500 rounded-xl mr-3" onClick={() => setGameRound(prev => prev + 1)}>Play Again</button>
      </div>
    </div>
  );

  return (
    <div className="container h-screen flex flex-col">
      <div className="text-center py-4 header-bg shadow-md text-lg font-semibold text-white">
        <h2>Who Wants To Be A Millionaire</h2>
      </div>
      {gameOver ? (
        showScoreScreen()
      ) : currentQuestion < maxQuestions ? (
        <>
          <div id="game-container" className="items-center justify-center my-auto">
            <img src={quizLogo} alt="Quiz Logo" className="w-1/4 mx-auto mb-4" />
            <div className="text-xl text-center btn-primary">
              {currentQuestion + 1}/{maxQuestions} Questions
            </div>
            <div className="p-3 text-2xl text-center">
              {currentGame[currentQuestion]?.question}
            </div>
            <div id="answers-container" className="p-3">
              {currentGame[currentQuestion]?.content.map((answer, index) => (
                <div
                  key={index}
                  className="container btn-container items-center flex border border-gray-700 mb-2 rounded-3xl cursor-pointer"
                  onClick={(el) => updateScore(index, el)}
                >
                  <div className="py-2 px-4 bg-gray-700 text-white font-bold text-lg rounded-3xl m-1 shadow-md btn-primary">{index + 1}</div>
                  <div className="py-2 px-4 text-gray-700 font-semibold">{answer}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="container text-center header-bg p-2 text-white mt-auto">
            <h2 className="text-2xl pb-1 border-b border-gray-500">Bank: ${playerScore}</h2>
          </div>
        </>
      ) : (
        <div className="my-auto p-6 header-bg">
          <h2 className="font-bold text-lg">You completed the quiz!</h2>
          <p>Your final score is <strong>${playerScore}</strong>.</p>
          <div className="flex p-3 text-white">
            <button className="py-2 px-5 bg-green-500 rounded-xl mr-3" onClick={handleEndQuiz}>End Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
