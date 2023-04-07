import { useState } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import html2canvas from 'html2canvas';


function App() {
  const [result, setResult] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  //const [fileData, setFileData] = useState<File | null>(null);
  /*   const configuration = new Configuration({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });
  
    const openai = new OpenAIApi(configuration); */

  async function generateText(prompt: string) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ' ' + String(import.meta.env.VITE_OPENAI_API_KEY) //String(import.meta.env.OPENAI_API_KEY)
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: 'Write a diss track for' + prompt + 'to the melody of the song Killshot by Eminem',
        temperature: 0.9,
        max_tokens: 100,
      })
    };

    fetch('https://api.openai.com/v1/completions', requestOptions)
      .then(response => response.json())
      .then(data => {
        {
          if (typeof data.choices[0].text === 'string') {
            setResult(data.choices[0].text);
            console.log(data.choices[0].text);
          }
        }
      }).catch(err => {
        console.log(err);
        setResult(String(err));
      });

    /*     const completion = await openai.createCompletion({
          model: "gpt-3.5-turbo",
          prompt: 'Create a name for a new color',
          temperature: 0.8,
        });
    
        if (typeof completion === 'string') {
          setResult(completion);
        } */
  }

  function handleSubmit(e: any) {
    //prevent browser from reloading page
    e.preventDefault();

    //Read form data and extract it to be a standalone string
    const formData = new FormData(e.target);
    const userPrompt: string = String(Object.fromEntries(formData.entries()).prompt);
    console.log(userPrompt);

    //Call API using function above.
    generateText(userPrompt);

    
  }

  async function handleGenerateImage() {
    const element: HTMLElement = document.getElementById('lyrics')!;
    const canvas = await html2canvas(element);
    const imageUrl = canvas.toDataURL('image/png');
    console.log(canvas);
    setImageUrl(imageUrl);
  }

  async function share() {
    const shareDetails = {
      title: "Just gonna put this here",
      //files: [fileData!]
      url: imageUrl,
      'intent/instagram-stories': imageUrl
    };

    if (navigator.canShare()) {
      try {
        await navigator
          .share(shareDetails)
          .then(() => console.log("Yay"))
      } catch (err) {
        console.log(err)
      };
    } else {
      //fallback text 
      console.log("share not supported on this browser")
    }

  }


  return (
    <div className="App">
      <h1>Diss someone through the art of music</h1>
      <h2>Never back down, give them the killshot</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Describe who you wanna diss" />
        {result === '' ? <button type="submit">Write me a diss lyric</button> : <button type="submit">Rewrite</button>}
      </form>
      <div className='lyricsContainer' id="lyrics">
        <pre>{result}</pre>
      </div>
      <button onClick={handleGenerateImage}>Generate image</button>
      {imageUrl ? <button onClick={share}>Share this</button> : ''}
      <p>{imageUrl}</p>
      <img src={imageUrl}></img>
    </div>
  )
}

export default App
