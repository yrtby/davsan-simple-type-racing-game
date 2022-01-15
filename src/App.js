import { useState, useEffect, useRef } from "react";

function App() {
  const [raceText, setRaceText] = useState("");
  const [inputText, setInputText] = useState("");
  const [fakeText, setFakeText] = useState("");
  const [wordList, setWordList] = useState([]);
  const [wordState, setWordState] = useState(0);
  const [letterState, setLetterState] = useState(0);
  const [imageState, setImageState] = useState(null);
  const [imageCss, setImageCss] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [startButton, setStartButton] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [countDownStatus, setCountDownStatus] = useState(true);
  const [animationWidth, setAnimationWidth] = useState(0);

  const backgroundRef = useRef();
  const tavsanRef = useRef();
  const inputRef = useRef();
  const tavsanGeriSayimRef = useRef();

  useEffect(() => {
    setRaceText("Hayvanat bahçesinde her yeri kaplayan tuhaf bir koku vardı.");
  }, []);

  useEffect(() => {
    setWordList(raceText.split(" "));
  }, [raceText]);

  useEffect(() => {
    setInputText(fakeText);
  }, [fakeText]);

  useEffect(() => {
    let letters = document.getElementById(wordState);

    if (!!letters) {
      if (letters.innerHTML.length > 1) {
        let innerText = wordList[wordState].split(" ").join("");
        let successLetter = innerText.substring(0, letterState);
        let firstLetter = innerText.substring(letterState, letterState + 1);
        let nextLetter = innerText.substring(letterState + 1, innerText.length);
        letters.innerHTML = `<span style="color: green; font-weight: bold;">${successLetter}</span><span style="color: red; font-weight: bold;">${firstLetter}</span><span style="color: black; font-weight: bold;">${nextLetter}${" "}</span>`;
      }
    }
  }, [wordList, fakeText, startButton]);

  const handleOnKeyUp = (e) => {
    if (e.keyCode === 32) {
      if (!!wordList[wordState]) {
        if (wordList[wordState] === fakeText.split(" ").join("")) {
          setWordState(wordState + 1);
          setLetterState(0);
          setFakeText("");
        }
      } else {
        setInputDisabled(true);
        setImageState(null);
      }
    }
  };

  const handleOnChange = (e) => {
    if (!!wordList[wordState]) {
      const elem = e.target.value;
      let getValue = elem.slice(elem.length - 1);

      if (getValue === wordList[wordState][letterState]) {
        setFakeText(elem);
        setLetterState(letterState + 1);
        setImageState(!imageState);
        animation();
      }
    } else {
      setInputDisabled(true);
      setImageState(null);
      setStartButton(!startButton);
      setCountDown(3);
    }
  };

  const startGame = async () => {
    setWordState(0);
    setLetterState(0);
    setImageCss(0);
    setFakeText("");

    let tavsanRefer = tavsanRef.current.getBoundingClientRect();
    setAnimationWidth(tavsanRefer.width);
    setStartButton(!startButton);
    setCountDownStatus(false);

    let i = countDown;
    while (i > 0) {
      setCountDown(i);
      i--;
      await timeout(1000);
    }

    setCountDownStatus(true);
    setInputDisabled(false);
    inputRef.current.focus();
  };

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function animation() {
    let backgroundRefer = backgroundRef.current.getBoundingClientRect();
    let rl = raceText.split(" ").join("").length;
    let x = backgroundRefer.width;
    let y = animationWidth;
    let total = imageCss + (100 * ((x - y) / rl)) / x;

    setImageCss(total);
  }

  const startInfo = () => {
    if (startButton) {
      return (
        <>
          <div id="race-text-div">
            {wordList.map(function (object, i) {
              return (
                <span id={i} key={i}>
                  {" "}
                  {object}
                </span>
              );
            })}
          </div>
          <div id="race-input-div">
            <input
              ref={inputRef}
              onKeyDown={(e) => handleOnKeyUp(e)}
              onChange={(e) => handleOnChange(e)}
              value={inputText}
              id="raceinput"
              rows="10"
              disabled={inputDisabled ? "disabled" : ""}
            />
          </div>
        </>
      );
    } else {
      return (
        <div id="race-input-div">
          <button onClick={startGame} id="startbutton">
            Start Game
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="App">
        <div id="davsan-box">
          <img
            ref={backgroundRef}
            id="davsan-background"
            src="/images/background.jpg"
          />
          <img
            ref={tavsanRef}
            style={{ left: `${imageCss}vw` }}
            id="davsan-animation"
            src={imageState === null ? "/images/tavsanwait.png" : imageState ? "/images/tavsanrun1.png" : "/images/tavsanrun2.png"}
          />
          <img
            ref={tavsanGeriSayimRef}
            id="davsan-countdown"
            src={`/images/number${countDown}.png`}
            hidden={countDownStatus ? "hidden" : ""}
          />
        </div>
        {startInfo()}
      </div>
    </>
  );
}

export default App;
