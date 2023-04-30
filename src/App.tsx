import React, { useEffect } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";

function App() {
  const [ballPos, setBallPos] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const [gameOver, setGameOver] = React.useState(false);

  useEffect(() => {
    const teeBox = document.getElementById("teeBox");
    const clientRect = teeBox?.getBoundingClientRect();

    const teeBoxX =
      (clientRect?.x || 0) + ((clientRect?.width || 0) - 16) / 2 || 0;
    const teeBoxY =
      (clientRect?.y || 0) + ((clientRect?.height || 0) - 16) / 2 || 0;

    // set the ball to the tee
    setBallPos({
      x: teeBoxX,
      y: teeBoxY,
    });
  }, []);

  const onSwiped = (eventData: SwipeEventData) => {
    if (gameOver) {
      return;
    }
    const {
      event, // source event
      initial, // initial swipe [x,y]
      deltaX, // x offset (current.x - initial.x)
      deltaY, // y offset (current.y - initial.y)
      velocity, // √(absX^2 + absY^2) / time - "absolute velocity" (speed)
    } = eventData;
    console.log(event);

    // calculate the new position of the ball
    const relativeDeltaX = deltaX * velocity * 1.2;
    const relativeDeltaY = deltaY * velocity * 1.2;

    const x = initial[0] + relativeDeltaX;
    const y = initial[1] + relativeDeltaY;

    // set the new position of the ball
    setBallPos({ x, y });

    setTimeout(() => {
      // if ball is on the green, alert the user
      const green = document.getElementById("green");
      const greenRect = green?.getBoundingClientRect();

      const greenX = greenRect?.x || 0;
      const greenY = greenRect?.y || 0;

      const greenWidth = greenRect?.width || 0;
      const greenHeight = greenRect?.height || 0;

      const ball = document.getElementById("ball");
      const ballRect = ball?.getBoundingClientRect();

      const ballX = ballRect?.x || 0;
      const ballY = ballRect?.y || 0;

      const ballWidth = ballRect?.width || 0;
      const ballHeight = ballRect?.height || 0;

      const ballCenterX = ballX + ballWidth / 2;
      const ballCenterY = ballY + ballHeight / 2;

      const ballIsOnGreen =
        ballCenterX > greenX &&
        ballCenterX < greenX + greenWidth &&
        ballCenterY > greenY &&
        ballCenterY < greenY + greenHeight;

      console.log(ballIsOnGreen);
      if (ballIsOnGreen) {
        alert("You made it on the green!");
      } else {
        alert("You missed the green!");
      }
      setGameOver(true);
    }, 1250);
  };

  const handlers = useSwipeable({
    onSwiped,
    preventScrollOnSwipe: true,
  });

  const resetGame = () => {
    setGameOver(false);

    const teeBox = document.getElementById("teeBox");
    const clientRect = teeBox?.getBoundingClientRect();

    const teeBoxX =
      (clientRect?.x || 0) + ((clientRect?.width || 0) - 16) / 2 || 0;
    const teeBoxY =
      (clientRect?.y || 0) + ((clientRect?.height || 0) - 16) / 2 || 0;

    // set the ball to the tee
    setBallPos({
      x: teeBoxX,
      y: teeBoxY,
    });
  };

  return (
    <div {...handlers} className="w-full h-full bg-green-500 fixed">
      {ballPos && <GolfBall pos={ballPos} />}
      <Green />
      <TeeBox />
      <ResetButton resetGame={resetGame} />
    </div>
  );
}

function Green() {
  return (
    <div
      id="green"
      className="w-[5rem] h-[5rem] rounded-full bg-green-600 absolute top-[calc(25%_-_2.5rem)] left-[calc(50%_-_2.5rem)] flex items-center justify-center"
    >
      <img src="/golf-hole.png" width="32" height="32" />
    </div>
  );
}

function TeeBox() {
  return (
    <div
      id="teeBox"
      className="absolute bottom-0 border-2 border-black h-[8rem] w-full  flex justify-center items-center"
    ></div>
  );
}

function GolfBall({
  pos: { x = 0, y = 0 },
}: {
  pos: { x: number; y: number };
}) {
  return (
    <div
      id="ball"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 1s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      }}
      className=" transform  w-[1rem] h-[1rem] rounded-full bg-white absolute z-10  "
    ></div>
  );
}

function ResetButton({ resetGame }: { resetGame: () => void }) {
  return (
    <button
      className="absolute bottom-0 right-0 m-4 p-4 bg-white rounded-full"
      onClick={resetGame}
    >
      Reset
    </button>
  );
}
export default App;
