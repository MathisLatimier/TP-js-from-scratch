import {Question} from "./Quiz.js"

console.log("Hello, World!");
const app = document.getElementById("app");
const statut = "home";
const questions = [
    new Question(
        "Quel mot-clé est utilisé pour déclarer une variable constante ?",
        ["var", "let", "const", "define"],
        2
    ),
    new Question(
        "Quelle est la sortie de 'typeof null' en JavaScript ?",
        ["null", "object", "undefined", "boolean"],
        1
    ),
    new Question(
        "Quelle méthode permet de convertir une chaîne en entier ?",
        ["parseInt()", "toString()", "JSON.parse()", "Math.floor()"],
        0
    ),
    new Question(
        "Quelle est la valeur de 'NaN === NaN' ?",
        ["true", "false", "undefined", "error"],
        1
    ),
    new Question(
        "Comment déclare-t-on une fonction fléchée ?",
        ["function => ()", "() => {}", "=> function() {}", "() -> {}"],
        1
    )
];
let currentQuestion = 0;

function loadHome() {
    app.innerHTML = "";
    app.classList.value = "";
    app.classList.add("home");
    localStorage.clear();
    const h1 = document.createElement("h1");
    h1.innerText = "Start the quiz !";
    app.appendChild(h1);
    const button = document.createElement("button");
    button.innerText = "Start";
    button.addEventListener("click", () => {
        app.innerHTML = "";
        loadQuiz();
    })
    app.appendChild(button);
}

function loadQuiz() {
    app.classList.value = "";
    app.classList.add("quiz");
    const question = questions[currentQuestion];
    const card = document.createElement("div");
    card.classList.add("card");
    app.appendChild(card);
    const progressBar = document.createElement("progress");
    progressBar.value = currentQuestion;
    progressBar.max = questions.length;
    card.appendChild(progressBar);
    const progressText = document.createElement("p");
    progressText.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
    card.appendChild(progressText);
    const h1 = document.createElement("h1");
    h1.innerText = question.question;
    card.appendChild(h1);
    const form = document.createElement("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = form.querySelector("input[name='question']:checked");
        console.log(answer);
        if (answer) {
            localStorage.setItem(`answer-${currentQuestion}`, answer.value);
            loadNextQuestion();
        } else {
            alert("Please select an answer");
        }
    });
    card.appendChild(form);
    const ul = document.createElement("ul");
    const previousAnswer = localStorage.getItem(`answer-${currentQuestion}`) || -1;
    question.choices.forEach((choice, index) => {
        console.log(choice);
        const li = document.createElement("li");
        // li.innerHTML = `<input type='radio' name='question' value='${index}'> ${choice}`;
        
        ul.appendChild(li);
        const label = document.createElement("label");
        li.appendChild(label);
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "question";
        input.value = index;
        if (previousAnswer == index) {
            input.checked = true;
        }
        label.appendChild(input);
        label.appendChild(document.createTextNode(choice));
    });
    form.appendChild(ul);
    const buttonWrap = document.createElement("div");
    buttonWrap.classList.add("button-wrap");
    if (currentQuestion != 0) {
        const previousButton = document.createElement("button");
        previousButton.classList.add("previous");
        previousButton.innerText = "Previous";
        previousButton.addEventListener("click", (event) => {
            event.preventDefault();
            loadPreviousQuestion();
        });
        buttonWrap.appendChild(previousButton);
    }
    
    
    const button = document.createElement("button");
    button.classList.add("next");
    button.innerText = "Next";
    button.type = "submit";
    buttonWrap.appendChild(button);
    form.appendChild(buttonWrap);
}

function loadNextQuestion() {
    app.innerHTML = "";
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuiz();
    } else {
        loadResult();
    }
}

function loadPreviousQuestion() {
    app.innerHTML = "";
    currentQuestion--;
    if (currentQuestion >= 0) {
        loadQuiz();
    } else {
        loadHome();
    }
}

function loadResult() {
    app.innerHTML = "";
    app.classList.value = "";
    app.classList.add("result");
    const score = calculResult();
    const h1 = document.createElement("h1");
    h1.innerText = "Result";
    app.appendChild(h1);
    if (score == questions.length) {
        const h2 = document.createElement("h2");
        h2.innerText = "Congratulations ! You are a genius !";
        h2.classList.add("genius");
        app.appendChild(h2);
        addImg(app, "https://media1.tenor.com/m/pZkO3VLAuaYAAAAC/o-zi-frumoasa.gif", "You Win");
        
    }
    if (score == 0) {
        const h2 = document.createElement("h2");
        h2.innerText = "You are a loser !";
        h2.classList.add("looser");
        app.appendChild(h2);
        addImg(app, "https://media1.tenor.com/m/w0dZ4Eltk7IAAAAC/vuknok.gif", "You are a loser !");
    }
    if (score == 1) {
        const h2 = document.createElement("h2");
        h2.innerText = "1 c'est mieux que 0 !";
        h2.classList.add("looser");
        app.appendChild(h2);
        addImg(app, "https://media1.tenor.com/m/XwW2gq51WX0AAAAd/cat.gif", "You are a loser !");
    }
    
    const p = document.createElement("p");
    p.innerText = `You scored ${score} out of ${questions.length}`;
    app.appendChild(p);
    const ul = document.createElement("ul");
    questions.forEach((question, index) => {
        const li = document.createElement("li");
        li.innerText = question.question;
        const answer = localStorage.getItem(`answer-${index}`);
        if (answer == question.answer) {
            li.classList.add("success");
            li.innerText += " : " + question.choices[question.answer];
        } else {
            li.classList.add("error");
            li.innerText += " : " + question.choices[answer] + " (correct answer : " + question.choices[question.answer] + ")";
        }
        ul.appendChild(li);
    });
    app.appendChild(ul);
    const button = document.createElement("button");
    button.innerText = "Restart";
    button.addEventListener("click", () => {
        app.innerHTML = "";
        currentQuestion = 0;
        loadHome();
    });
    app.appendChild(button);
}

function addImg(element, src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    element.appendChild(img);

}

function calculResult() {
    let score = 0;
    questions.forEach((question, index) => {
        const answer = localStorage.getItem(`answer-${index}`);
        console.log("choice :" + answer + " answer :" + question.answer);
        console.log(answer == question.answer)
        if (answer == question.answer) {
            score++;
        }
    });
    console.log("Score: " + score);
    return score;
}



window.addEventListener("load", () => {
    if (statut === "home") {
        loadHome();
    } else {
        const h1 = document.createElement("h1");
        h1.innerText = "Page not found";
        app.appendChild(h1);
    }
}
);