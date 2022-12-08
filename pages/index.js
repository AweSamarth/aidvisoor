import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState, useRef } from "react";
import Typical from "react-typical";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [choice, setChoice] = useState("Songs");
  const scrollToRef = useRef()

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, choice } ),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
    scrollToRef.current.scrollIntoView()
  };
  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const handleChange = (event) => {
    setChoice(event.target.value);
    setUserInput("")
    console.log(choice);
  };

  const Submit = (event) =>{
    if (event.ctrlKey&&event.keyCode==13){
      callGenerateEndpoint()
    }
  }

  return (
    <div className="root">
      <Head>
        <title>AI-dvisoor</title>
      </Head>
      <div className="container ">
        <div className="header">
          <div className="header-title ">
            <h1>
              Get{" "}
              <Typical
                steps={["Song", 2000, "Movie", 2000, "Game", 2000]}
                loop={Infinity}
                wrapper="span"
              />{" "}
              <br />
              Recommendations from an AI
            </h1>
          </div>
          <div className="header-subtitle mt-2">
            <h2>Tailored to your current taste. </h2>
          </div>
        </div>
        <div className="text-[white] text-lg -mt-5 -mb-12">
          What do you want the AI to recommend you?
        </div>
        <div className="selector">
          <select
            className=" hover:cursor-pointer  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={choice}
            onChange={handleChange}
          >
            <option>Songs</option>
            <option>Movies</option>
            <option>Games</option>
          </select>
        </div>
        <div className="prompt-container  ">
          <textarea
            placeholder={`enter some ${choice.toLowerCase()} you like ${
              choice == "Songs"
                ? "(if possible, mention their artists too)"
                : ""
            }`}
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
            onKeyDown={Submit}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
          <div ref={scrollToRef} className=" select-none">You weren't supposed to find this!</div>
        </div>
      </div>
      <div className="badge-container grow" >
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
