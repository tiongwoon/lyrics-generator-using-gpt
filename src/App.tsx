import { useState } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import './canvas-toBlob.js';
import { inject } from '@vercel/analytics';

function App() {

  //For vercel analytics, can ignore 
  inject();

  const [result, setResult] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  /*   const configuration = new Configuration({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });
  
    const openai = new OpenAIApi(configuration); */

  async function generateText(prompt: string) {
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + ' ' + String(import.meta.env.VITE_OPENAI_API_KEY) //String(import.meta.env.OPENAI_API_KEY)
    //   },
    //   body: JSON.stringify({
    //     model: "text-davinci-003",
    //     prompt: 'Write a diss track for' + prompt + 'to the melody of the song Killshot by Eminem',
    //     temperature: 0.9,
    //     max_tokens: 100,
    //   })
    // };
    const refinedPrompt = 'Get the lyrics of Killshot by Eminem. Write a diss track for' + prompt + '. The lyrics should match up with the syllabus of each line of the song Killshot by Eminem'

    try {
    const requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt: refinedPrompt })
    }

    // fetch ("http://localhost:5000/write-lyrics", requestOptions2)
    //   .then(response => {

    //     setLoading(false);
    //     setResult(response.message);
    //     // console.log(data.choices[0].text);
    //   }).catch(err => {
    //     console.log(err);
    //     setResult(String(err));
    //   });

      const res = await fetch("https://lyrics-generator-api.vercel.app/write-lyrics", requestOptions2);
      const { success, message } = await res.json();
      if (success == true) {
      setResult(message)
    }

  } catch (err) {
    console.log(err)
  } finally {
    setLoading(false)
  }

    // fetch('https://api.openai.com/v1/completions', requestOptions)
    //   .then(response => response.json())
    //   .then(data => {
    //     {
    //       if (typeof data.choices[0].text === 'string') {
    //         setLoading(false);
    //         setResult(data.choices[0].text);
    //         console.log(data.choices[0].text);
    //       }
    //     }
    //   }).catch(err => {
    //     console.log(err);
    //     setResult(String(err));
    //   });

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

    //To display loading ui
    setLoading(true);
    //Call API using function above.
    generateText(userPrompt);
  }

  async function handleGenerateImage() {
    const element: HTMLElement = document.getElementById('lyrics')!;
    const canvas = await html2canvas(element, { backgroundColor: null, scale: 1 });
    const imageUrl = canvas.toDataURL('image/png');
    canvas.toBlob(function (blob) { saveAs(blob!, 'my_image.png') });
    console.log(canvas);
    setImageUrl(imageUrl);
  }


  return (
    <div className="App">
      <div className='py-16 max-w-lg flex flex-col gap-y-8'>
        <div className='flex flex-col gap-y-4'>
          <h1 className="text-5xl font-black text-center">Turn your rage into a hit 🥊</h1>
          <h2>Describe the person you hate and let the AI generate lyrics that to the rhythm of Killshot - Eminem. You can then download an image of the lyrics. <br></br><br></br> Disscribe. Where hate 😡 becomes art 🎵.</h2>
        </div>
        <div>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <textarea className="max-h-40 min-h-20 rounded-md p-6 whitespace-normal align-top break-words" name="prompt" placeholder="Describe dis bisch" />
            {result === '' ? <button className='bg-[#7c3aed] rounded-md' type="submit">Write me a diss lyric</button> : <button className='rounded-md bg-[#7c3aed]' type="submit">Rewrite</button>}
          </form>
        </div>
        {isLoading ? <div className='flex justify-center'><div
          className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
          role="status">
        </div></div> : ''}
        {result === '' ? '' : <div className='bg-transparent'><pre id="lyrics" className='text-white from-sky-800 to-gray-800 font-bold whitespace-pre-line px-10 rounded-md bg-gradient-to-b pb-10'>{result}</pre></div>}
        {result === '' ? '' : <button className='bg-[#5b21b6] rounded-md' onClick={handleGenerateImage}>Generate image & download</button>}
      </div>
      {/* {imageUrl ? <button onClick={share}>Share this</button> : ''} */}
      {/* <p>{imageUrl}</p> 
      <img src={imageUrl}></img> */}
    </div>
  )
}

export default App
