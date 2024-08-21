"use strict";
const notes = document.querySelector(".notes");
const addNoteTitle = document.querySelector("#title");
const addMood = document.querySelector("#mood");
const addStressLevel = document.querySelector("#stressLevel");
const addAnxietyLevel = document.querySelector("#anxietyLevel");
const addNoteText = document.querySelector("#reflection");
const addNoteBtn = document.querySelector(".add_note_btn");
const deleteAllNote = document.querySelector(".delete_all_note_btn");

let noteId = 0; // ID inicial para notas, será usado na criação e atualização

// Função para adicionar uma nova nota ao DOM
function adicionarNota(diary) {
    const article = document.createElement("ARTICLE");
    const inputTitle = document.createElement("INPUT");
    const textArea = document.createElement("TEXTAREA");
    const buttons = document.createElement("DIV");
    const deleteNoteBtn = document.createElement("BUTTON");
    const saveNoteBtn = document.createElement("BUTTON");

    inputTitle.value = diary.title;
    textArea.value = diary.reflection;

    deleteNoteBtn.textContent = "Excluir";
    saveNoteBtn.textContent = "Salvar";

    article.appendChild(inputTitle);
    article.appendChild(textArea);
    article.appendChild(buttons);
    buttons.appendChild(deleteNoteBtn);
    buttons.appendChild(saveNoteBtn);
    notes.appendChild(article);

    article.classList.add("your_note");
    article.classList.add(`your_note_${noteId}`);
    inputTitle.classList.add(`your_note_title_${noteId}`);
    textArea.classList.add(`your_note_text_${noteId}`);
    buttons.classList.add("button_action");
    deleteNoteBtn.addEventListener("click", () => eliminarNota(diary._id, article));
    saveNoteBtn.addEventListener("click", () => guardarNota(diary._id, inputTitle.value, textArea.value));
}

// Função para criar uma nova nota
async function criarNota() {
    const diaryData = {
        title: addNoteTitle.value,
        mood: addMood.value,
        stressLevel: addStressLevel.value,
        anxietyLevel: addAnxietyLevel.value,
        reflection: addNoteText.value
    };

    try {
        const response = await fetch("http://localhost:3001/api/diaries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(diaryData)
        });
        const data = await response.json();
        if (data.success) {
            adicionarNota(data.data);
            addNoteTitle.value = "";
            addNoteText.value = "";
        } else {
            alert("Erro ao criar a nota: " + data.error);
        }
    } catch (error) {
        alert("Erro de rede: " + error.message);
    }
}

// Função para atualizar uma nota
async function guardarNota(id, newTitle, newText) {
    const diaryData = {
        title: newTitle,
        reflection: newText
    };

    try {
        const response = await fetch(`http://localhost:3001/api/diaries/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(diaryData)
        });
        const data = await response.json();
        if (!data.success) {
            alert("Erro ao atualizar a nota: " + data.error);
        }
    } catch (error) {
        alert("Erro de rede: " + error.message);
    }
}

// Função para excluir uma nota
async function eliminarNota(id, article) {
    if (confirm("Tem certeza de que deseja excluir esta nota?")) {
        try {
            const response = await fetch(`http://localhost:3001/api/diaries/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                notes.removeChild(article);
            } else {
                alert("Erro ao excluir a nota: " + data.error);
            }
        } catch (error) {
            alert("Erro de rede: " + error.message);
        }
    }
}

// Função para deletar todas as notas
async function deleteAllNotes() {
    if (confirm("Tem certeza de que deseja excluir todas as notas?")) {
        try {
            const response = await fetch("http://localhost:3001/api/diaries", {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                notes.innerHTML = "";
            } else {
                alert("Erro ao excluir todas as notas: " + data.error);
            }
        } catch (error) {
            alert("Erro de rede: " + error.message);
        }
    }
}

// Adiciona um evento ao botão de adicionar nota
addNoteBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (addNoteTitle.value && addNoteText.value) {
        criarNota();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

// Carrega notas existentes ao inicializar a página
window.addEventListener("load", async () => {
    try {
        const response = await fetch("http://localhost:3001/api/diaries");
        const data = await response.json();
        if (data.success) {
            data.data.forEach(diary => adicionarNota(diary));
        } else {
            alert("Erro ao carregar notas: " + data.error);
        }
    } catch (error) {
        alert("Erro de rede: " + error.message);
    }
});
