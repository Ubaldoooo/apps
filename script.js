const startBtn = document.getElementById('start');
const questionDisplay = document.getElementById('question');
const responseDisplay = document.getElementById('response');

const apiKey = "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";

// Reconocimiento de voz
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.interimResults = false;

startBtn.onclick = () => {
  recognition.start();
};

recognition.onresult = async (event) => {
  const pregunta = event.results[0][0].transcript;
  questionDisplay.textContent = pregunta;

  const respuesta = await obtenerRespuesta(pregunta);
  responseDisplay.textContent = respuesta;

  hablar(respuesta);
};

async function obtenerRespuesta(pregunta) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un experto en informática. Responde preguntas de forma clara, precisa y fácil de entender para jóvenes estudiantes."
        },
        {
          role: "user",
          content: pregunta
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Hablar la respuesta con voz
function hablar(texto) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = texto;
  speech.lang = "es-ES";
  speech.rate = 1;
  speech.pitch = 1;
  speechSynthesis.speak(speech);
}
