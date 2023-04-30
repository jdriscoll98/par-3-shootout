import React, { useEffect } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";

function App() {
  const [ballPos, setBallPos] = React.useState<{ x: number; y: number } | null>(
    null
  );

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
    const {
      event, // source event
      initial, // initial swipe [x,y]
      deltaX, // x offset (current.x - initial.x)
      deltaY, // y offset (current.y - initial.y)
      velocity, // √(absX^2 + absY^2) / time - "absolute velocity" (speed)
    } = eventData;
    console.log(event);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(event.srcElement.id === "teeBox")) {
      return;
    }

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

      if (ballIsOnGreen) {
        alert("You made it on the green!");
      }
    }, 1000);
  };

  const handlers = useSwipeable({
    onSwiped,
    preventScrollOnSwipe: true,
  });

  return (
    <div {...handlers} className="w-full h-full bg-green-500 fixed">
      {ballPos && <GolfBall pos={ballPos} />}
      <Green />
      <TeeBox />
      <ResetButton setBallPos={setBallPos} />
    </div>
  );
}

function Green() {
  return (
    <div
      id="green"
      className="w-[5rem] h-[5rem] rounded-full bg-green-600 absolute top-[calc(25%_-_2.5rem)] left-[calc(50%_-_2.5rem)]"
    ></div>
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

function ResetButton({
  setBallPos,
}: {
  setBallPos: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}) {
  return (
    <button
      className="absolute bottom-0 right-0 m-4 p-4 bg-white rounded-full"
      onClick={() => {
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
      }}
    >
      Reset
    </button>
  );
}
export default App;
