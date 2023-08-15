/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import blank from "./assets/images/blank.png";
import blueCandy from "./assets/images/blue-candy.png";
import greenCandy from "./assets/images/green-candy.png";
import orangeCandy from "./assets/images/orange-candy.png";
import purpleCandy from "./assets/images/purple-candy.png";
import redCandy from "./assets/images/red-candy.png";
import yellowCandy from "./assets/images/yellow-candy.png";
import aud1 from "./assets/music/not1.wav";
import aud2 from "./assets/music/not2.wav";
import aud3 from "./assets/music/not3.wav";
import win from "./assets/music/win.wav";
import ConfettiComponent from "./components/ConfettiComponent";

const width = 8;
const candys = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
  greenCandy,
];

const App = () => {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState<
    string[]
  >([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState<
    EventTarget & HTMLImageElement
  >();
  const [squareBeingReplaced, setSquareBeingReplaced] = useState<
    EventTarget & HTMLImageElement
  >();
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  const playAudio = useCallback(
    (audioFile: string) => {
      if (!gameStarted) return;
      try {
        console.log("playing audio....");
        const audio = new Audio(audioFile);
        audio.play();
      } catch (error) {
        console.log("error", error);
      }
    },
    [gameStarted]
  );

  const dragStart = (e: React.DragEvent<HTMLImageElement>) => {
    playAudio(aud1);
    setSquareBeingDragged(e.currentTarget);
  };
  const dragDrop = (e: React.DragEvent<HTMLImageElement>) => {
    setSquareBeingReplaced(e.currentTarget);
  };

  const dragEnd = () => {
    if (!squareBeingDragged || !squareBeingReplaced) return;

    const squareBeingDraggedId = squareBeingDragged.getAttribute("data-id");
    const squareBeingDraggedSrc = squareBeingDragged.getAttribute("src");
    const squareBeingReplacedId = squareBeingReplaced.getAttribute("data-id");
    const squareBeingReplacedSrc = squareBeingReplaced.getAttribute("src");

    console.log(squareBeingDraggedId, squareBeingReplacedId);

    if (
      !squareBeingDraggedId ||
      !squareBeingReplacedId ||
      !squareBeingDraggedSrc ||
      !squareBeingReplacedSrc
    )
      return console.log("something is null");

    const validMoves = [
      +squareBeingDraggedId - 1,
      +squareBeingDraggedId - width,
      +squareBeingDraggedId + 1,
      +squareBeingDraggedId + width,
    ];

    const validMove = validMoves.includes(+squareBeingReplacedId);
    console.log("valid move ==>", validMove, validMoves);
    if (!validMove) return;

    setCurrentCandyArrangement((prev) => {
      prev[+squareBeingReplacedId] = squareBeingDraggedSrc;
      prev[+squareBeingDraggedId] = squareBeingReplacedSrc;
      return [...prev];
    });

    // currentCandyArrangement[+squareBeingReplacedId] = squareBeingDraggedSrc;
    // currentCandyArrangement[+squareBeingDraggedId] = squareBeingReplacedSrc;
  };

  const createBoard = () => {
    const randomCandyArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candys[Math.floor(Math.random() * candys.length)];
      randomCandyArrangement.push(randomColor);
    }
    setCurrentCandyArrangement(randomCandyArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    if (!gameStarted) return console.log("game not started");

    const checkForColumnOfFour = () => {
      for (let i = 0; i <= 39; i++) {
        const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
        const decidedColor = currentCandyArrangement[i];
        const isBlank = currentCandyArrangement[i] === blank;

        if (
          columnOfFour.every(
            (square) =>
              currentCandyArrangement[square] === decidedColor && !isBlank
          )
        ) {
          setScoreDisplay((score) => score + 4);
          columnOfFour.forEach(
            (square) => (currentCandyArrangement[square] = blank)
          );
          playAudio(aud3);
        }
      }
    };

    const checkForRowOfFour = () => {
      for (let i = 0; i < 64; i++) {
        const rowOfFour = [i, i + 1, i + 2, i + 3];
        const decidedColor = currentCandyArrangement[i];
        const notValid = [
          5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47,
          53, 54, 55, 62, 63, 64,
        ];
        const isBlank = currentCandyArrangement[i] === blank;

        if (notValid.includes(i)) continue;

        if (
          rowOfFour.every(
            (square) =>
              currentCandyArrangement[square] === decidedColor && !isBlank
          )
        ) {
          setScoreDisplay((score) => score + 4);
          rowOfFour.forEach(
            (square) => (currentCandyArrangement[square] = blank)
          );
          playAudio(aud3);
        }
      }
    };

    const checkForColumnOfThree = () => {
      for (let i = 0; i <= 47; i++) {
        const columnOfThree = [i, i + width, i + width * 2];
        const decidedCandy = currentCandyArrangement[i];
        const isBlank = currentCandyArrangement[i] === blank;

        if (
          columnOfThree.every(
            (candy) =>
              currentCandyArrangement[candy] === decidedCandy && !isBlank
          )
        ) {
          setScoreDisplay((score) => score + 3);
          columnOfThree.forEach(
            (square) => (currentCandyArrangement[square] = blank)
          );
          playAudio(aud2);
        }
      }
    };

    const checkForRowOfThree = () => {
      for (let i = 0; i < 64; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = currentCandyArrangement[i];
        const notValid = [
          6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
        ];
        const isBlank = currentCandyArrangement[i] === blank;

        if (notValid.includes(i)) continue;

        if (
          rowOfThree.every(
            (square) =>
              currentCandyArrangement[square] === decidedColor && !isBlank
          )
        ) {
          setScoreDisplay((score) => score + 3);
          rowOfThree.forEach(
            (square) => (currentCandyArrangement[square] = blank)
          );
          playAudio(aud2);
        }
      }
    };

    const moveIntoSquareBelow = () => {
      for (let i = 0; i <= 55; i++) {
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);

        if (isFirstRow && currentCandyArrangement[i] === blank) {
          const randomNumber = Math.floor(Math.random() * candys.length);
          currentCandyArrangement[i] = candys[randomNumber];
        }

        if (currentCandyArrangement[i + width] === blank) {
          currentCandyArrangement[i + width] = currentCandyArrangement[i];
          currentCandyArrangement[i] = blank;
        }
      }
    };

    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentCandyArrangement([...currentCandyArrangement]);
    }, 500);

    return () => clearInterval(timer);
  }, [currentCandyArrangement, gameStarted, playAudio]);

  useEffect(() => {
    if (scoreDisplay > 20) {
      setShowConfetti(true);
      playAudio(win);
    }
  }, [scoreDisplay, playAudio]);

  return (
    <>
      {showConfetti && <ConfettiComponent />}

      <h1>Candy Crash Game</h1>

      <div className="flex items-center py-2 px-4 rounded-md shadow-lg bg-slate-500">
        <p className="">Target: 100 points</p>
        <p>Score: {scoreDisplay}</p>
      </div>

      {gameStarted ? (
        <div className="app">
          <div className="game">
            {currentCandyArrangement.map((candyColor, index) => (
              <img
                key={index}
                src={candyColor}
                alt={candyColor}
                data-id={index}
                draggable={true}
                onClick={(e) => console.log(e.target)}
                onDragStart={dragStart}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
              />
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setGameStarted(true)}>Start Game</button>
      )}
    </>
  );
};

export default App;
