document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "https://opentdb.com/api.php?amount=10&difficulty=easy";
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const nextQuestionButton = document.getElementById("next-question");
    const earningsElement = document.getElementById("earnings");

    let questions = [];
    let currentQuestionIndex = 0;
    let earnings = 0;

    function decodeHTML(html) {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = html;
        return textArea.value;
    }

    function carregarPreguntes() {
        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                questions = data.results;
                mostrarPregunta();
            })
            .catch(error => console.error("Error carregant preguntes:", error));
    }

    function mostrarPregunta() {
        const preguntaActual = questions[currentQuestionIndex];
        const numeroPregunta = currentQuestionIndex + 1; 
        questionElement.textContent = `${numeroPregunta}. ${decodeHTML(preguntaActual.question)}`; 
        answersElement.innerHTML = "";

        const respostes = [...preguntaActual.incorrect_answers, preguntaActual.correct_answer];
        respostes.sort(() => Math.random() - 0.5);

        respostes.forEach(resposta => {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.textContent = decodeHTML(resposta); 

            td.addEventListener("click", () => {
                if (resposta === preguntaActual.correct_answer) {
                    td.style.backgroundColor = "lightgreen";
                    td.style.color = "white"; 
                    alert("Correcte!");
                    incrementarGuanys();
                } else {
                    td.style.backgroundColor = "lightcoral";
                    td.style.color = "white"; 
                    alert("Incorrecte!");
                }
                desactivarClics();
            });

            tr.appendChild(td);
            answersElement.appendChild(tr);
        });
    }

    function incrementarGuanys() {
        earnings = earnings === 0 ? 100 : earnings * 2; 
        earningsElement.textContent = earnings;
    }

    function desactivarClics() {
        const totsElsTd = document.querySelectorAll("#answers td");
        totsElsTd.forEach((element) => {
            element.style.pointerEvents = "none"; 
        });
    }

    nextQuestionButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            mostrarPregunta();
        } else {
            alert("Has acabat el trivial!");
            currentQuestionIndex = 0;
            carregarPreguntes();
        }
    });

    carregarPreguntes();
});
