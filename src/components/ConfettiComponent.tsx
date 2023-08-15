import Confetti from "react-confetti";
import useWindowSize from "../hooks/useWindowSize";

const ConfettiComponent = () => {
  const { height, width } = useWindowSize();

  return (
    <Confetti
      gravity={0.3}
      tweenDuration={4000}
      width={width - 1}
      height={height - 1}
    />
  );
};

export default ConfettiComponent;
