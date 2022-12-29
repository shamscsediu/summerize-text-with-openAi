import React, { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (summary) {
      let i = 0;
      let interval = setInterval(() => {
        document.getElementById("summary").innerHTML += summary[i];
        i++;
        if (i === summary.length) {
          clearInterval(interval);
        }
      }, 20);
    }
  }, [summary]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSummarize = async () => {
    setSummary("");
    if (inputText === "") return setError({message: "Please Type something"});
    setIsLoading(true);
    console.log(process.env.REACT_APP_OPENAI_API_KEY);
    setError(null);
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: "Summarize this for a second-grade student:" + inputText,
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      })
      .then((response) => {
        setSummary(response.data.choices[0].text);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
    console.log(completion);
  };

  return (
    <div className="App">
      {/* Display the title within the container element */}
      <div className="container">
        <h1 style={{ color: "white" }}>Summarize Text Using OpenAi</h1>
        <h4 style={{ color: "white" }}>Paste here the complex Text to Summarize</h4>
      </div>

      {/* Display the textarea and "Summarize" button within the container element */}
      <div className="container">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          className="textarea"
        />
        <button
          onClick={handleSummarize}
          style={{ marginTop: "20px", color: "white"}}
        >
          Summarize
        </button>
      </div>
      <div className="container">
        {/* Display a "Loading..." message while the summary is being generated */}
        {isLoading ? <p style={{ color: "white" }}>Loading...</p> : null}

        {/* Display an error message if there is an error */}
        {error ? (
          <p style={{ color: "white" }}>Error: {error.message}</p>
        ) : null}
      </div>

      {/* If a summary has been generated, display it in a beautiful box */}
      {summary ? (
        <div className="container summary-box">
          <p id="summary" style={{ color: "#282c34" }} />
        </div>
      ) : null}
    </div>
  );
}
export default App;
