// ============================================
// ENGLISH CHECK
// GESTÃO DE AULAS DE CÓDIGO DA ESTRADA
// ============================================

// ============================================
// FIREBASE
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDszFM_wU6LDvlsf1lXYzmInRnAgMEdp7w",
    authDomain: "english-check-a82ef.firebaseapp.com",
    projectId: "english-check-a82ef",
    storageBucket: "english-check-a82ef.firebasestorage.app",
    messagingSenderId: "524538268036",
    appId: "1:524538268036:web:0d8bd3e1cd81a910cbb5d1",
    measurementId: "G-F1WCZ9E7KR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Base de dados em memória
let alunos = [];
let aulas = [];

// Alunos da aula que está a ser criada
let alunosDaAula = [];

// Ler alunos
onSnapshot(collection(db, "alunos"), (snapshot) => {

    alunos = [];

    snapshot.forEach((documento) => {

        alunos.push({
            id: documento.id,
            ...documento.data()
        });

    });

    atualizarDashboard();

});

// Ler aulas
onSnapshot(collection(db, "aulas"), (snapshot) => {

    alert("onSnapshot das aulas executado");

    aulas = [];

    snapshot.forEach((documento) => {

        aulas.push({
            id: documento.id,
            ...documento.data()
        });

    });

    alert("Foram lidas " + aulas.length + " aulas");

    mostrarAulas();

});

// ============================================
// LOGIN
// ============================================

const utilizadores = [
    {
        username: "andria",
        password: "druxa2099"
    },
    {
        username: "joaof",
        password: "lumiar2026"
    }
];

document.getElementById("loginButton").addEventListener("click", function () {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const utilizador = utilizadores.find(u =>
        u.username === username && u.password === password
    );

    if (utilizador) {

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("loginMessage").innerHTML = "";

} else {

    document.getElementById("loginMessage").innerHTML = "Utilizador ou palavra-passe incorretos.";
    document.getElementById("loginMessage").style.color = "red";

}

});

// ============================================
// LOGOUT
// ============================================

document
    .getElementById("logoutButton")
    .addEventListener("click", function () {

        document.getElementById("app").style.display = "none";
        document.getElementById("loginPage").style.display = "flex";

        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("loginMessage").innerHTML = "";

    });

// ============================================
// ADICIONAR ALUNO
// ============================================

document
    .getElementById("addStudentButton")
    .addEventListener("click", async function () {

        const numero =
            document
            .getElementById("studentNumber")
            .value
            .trim();


        const nome =
            document
            .getElementById("studentName")
            .value
            .trim();


        const validadeLicenca =
            document
            .getElementById("licenceExpiry")
            .value;


        const estadoExame =
            document
            .getElementById("examStatus")
            .value;


        const validadeCodigo =
            document
            .getElementById("codeExpiry")
            .value;


        const qrCode =
            document
            .getElementById("qrCode")
            .value
            .trim();


        const estadoAluno =
            document
            .getElementById("studentStatus")
            .value;


        if (

            numero === ""

            ||

            nome === ""

        ) {

            alert(
                "Preenche o número e o nome do aluno."
            );

            return;

        }


    const aluno = {

    numero: numero,
    nome: nome,
    validadeLicenca: validadeLicenca,
    aulasRealizadas: 0,
    estadoExame: estadoExame,
    validadeCodigo: validadeCodigo,
    qrCode: qrCode,
    estado: estadoAluno

};

try {

    await addDoc(collection(db, "alunos"), aluno);

    limparFormulario();
    atualizarDashboard();

    alert("Aluno adicionado com sucesso ✅");

} catch (erro) {

    alert("ERRO: " + erro.message);
    console.log(erro);

}

        limparFormulario();


        atualizarDashboard();


        alert(
            "Aluno adicionado com sucesso ✅"
        );

    });


// ============================================
// LIMPAR FORMULÁRIO
// ============================================

function limparFormulario() {


    document
        .getElementById("studentNumber")
        .value = "";


    document
        .getElementById("studentName")
        .value = "";


    document
        .getElementById("licenceExpiry")
        .value = "";


    document
        .getElementById("examStatus")
        .value = "Por fazer";


    document
        .getElementById("codeExpiry")
        .value = "";


    document
        .getElementById("qrCode")
        .value = "";


    document
        .getElementById("studentStatus")
        .value = "Ativo";

}


// ============================================
// PESQUISAR ALUNOS
// ============================================

document
    .getElementById("searchStudent")
    .addEventListener("input", function () {

        mostrarAlunos();

    });


// ============================================
// MOSTRAR ALUNOS
// ============================================

function mostrarAlunos() {

    const lista = document.getElementById("studentsList");

    const pesquisa = document
        .getElementById("searchStudent")
        .value
        .toLowerCase()
        .trim();

    const alunosFiltrados = alunos.filter(function (aluno) {

        return (
            aluno.nome.toLowerCase().includes(pesquisa) ||
            aluno.numero.toLowerCase().includes(pesquisa)
        );

    });

    if (alunosFiltrados.length === 0) {

        lista.innerHTML = "Ainda não existem alunos.";
        return;

    }

    lista.innerHTML = "";

    alunosFiltrados.forEach(function (aluno) {

        const cartao = document.createElement("div");

        cartao.className = "student-card";

        let historico = "Sem aulas registadas";

        if (aluno.historicoAulas && aluno.historicoAulas.length > 0) {

            historico = aluno.historicoAulas.join("<br>");

        }

        cartao.innerHTML = `

            <h3>👨‍🎓 ${aluno.nome}</h3>

            <p><strong>N.º de aluno:</strong> ${aluno.numero}</p>

            <p><strong>Validade da licença:</strong> ${formatarData(aluno.validadeLicenca)}</p>

            <p><strong>Aulas realizadas:</strong> ${aluno.aulasRealizadas}</p>

            <p><strong>Estado do exame:</strong> ${aluno.estadoExame}</p>

            <p><strong>Validade do código:</strong> ${formatarData(aluno.validadeCodigo)}</p>

            <p><strong>QR Code:</strong> ${aluno.qrCode || "Não registado"}</p>

            <p><strong>Estado:</strong> ${aluno.estado}</p>

            <p>
                <strong>Histórico de aulas:</strong><br>
                ${historico}
            </p>

            <button
                class="add-lesson-button"
                data-docid="${aluno.id}">
                ➕ Registar Aula
            </button>

            <button
                class="danger-button delete-button"
                data-docid="${aluno.id}">
                🗑️ Apagar Aluno
            </button>

        `;

        lista.appendChild(cartao);

    });

    adicionarEventosDosBotoes();

}

// ============================================
// BOTÕES DOS ALUNOS
// ============================================

function adicionarEventosDosBotoes() {

    const botoesAula = document.querySelectorAll(".add-lesson-button");

    botoesAula.forEach(function (botao) {

        botao.onclick = async function () {

            const docid = this.getAttribute("data-docid");

            const aluno = alunos.find(function (aluno) {
                return aluno.id === docid;
            });

            if (!aluno) {
                alert("Aluno não encontrado.");
                return;
            }

            try {

                await updateDoc(doc(db, "alunos", docid), {
                    aulasRealizadas: (aluno.aulasRealizadas || 0) + 1
                });

                alert("Aula registada com sucesso ✅");

            } catch (error) {

                alert("Erro ao registar aula: " + error.message);
                console.error(error);

            }

        };

    });


    const botoesApagar = document.querySelectorAll(".delete-button");

    botoesApagar.forEach(function (botao) {

        botao.onclick = async function () {

            const docid = this.getAttribute("data-docid");

            const confirmar = confirm("Tens a certeza que queres apagar este aluno?");

            if (!confirmar) {
                return;
            }

            try {

                await deleteDoc(doc(db, "alunos", docid));

                alert("Aluno apagado com sucesso ✅");

            } catch (error) {

                alert("Erro ao apagar aluno: " + error.message);
                console.error(error);

            }

        };

    });

}

// ============================================
// ATUALIZAR DASHBOARD
// ============================================

function atualizarDashboard() {


    const alunosAtivos =

        alunos.filter(function (aluno) {


            return (

                aluno.estado === "Ativo"

            );

        });


    document
        .getElementById("totalStudents")
        .innerText =

        alunosAtivos.length;


    const totalAulas =

        alunos.reduce(function (

            total,

            aluno

        ) {


            return (

                total +

                aluno.aulasRealizadas

            );

        }, 0);


    document
        .getElementById("totalLessons")
        .innerText =

        totalAulas;


    const examesAprovados =

        alunos.filter(function (aluno) {


            return (

                aluno.estadoExame ===

                "Aprovado"

            );

        });


    document
        .getElementById("totalApproved")
        .innerText =

        examesAprovados.length;


    mostrarAlertas();
    mostrarAlunos();
    mostrarAulas();
}


// ============================================
// ALERTAS DE VALIDADE
// ============================================

function mostrarAlertas() {


    const listaAlertas =

        document

        .getElementById(

            "alertsList"

        );


    const hoje =

        new Date();


    const tresMesesDepois =

        new Date();


    tresMesesDepois.setMonth(

        hoje.getMonth() + 3

    );


    let alertas = [];


    alunos.forEach(function (aluno) {


        verificarValidade(

            aluno,

            aluno.validadeLicenca,

            "Licença de aprendizagem"

        );


        verificarValidade(

            aluno,

            aluno.validadeCodigo,

            "Validade do código"

        );

    });


    function verificarValidade(

        aluno,

        data,

        tipo

    ) {


        if (!data) {

            return;

        }


        const dataValidade =

            new Date(data);


        if (

            dataValidade < hoje

        ) {


            alertas.push(`


                <div class="alert expired">


                    🔴


                    <strong>

                        ${aluno.nome}

                    </strong>


                    <br>


                    ${tipo}

                    já expirou.


                </div>

            `);

        }


        else if (

            dataValidade <=

            tresMesesDepois

        ) {


            alertas.push(`


                <div class="alert">


                    ⚠️


                    <strong>

                        ${aluno.nome}

                    </strong>


                    <br>


                    ${tipo}

                    termina em breve:


                    ${formatarData(data)}


                </div>

            `);

        }

    }


    if (

        alertas.length === 0

    ) {


        listaAlertas.innerHTML = `


            <div class="alert good">


                ✅


                Não existem validades a terminar nos próximos 3 meses.


            </div>

        `;

    }

    else {


        listaAlertas.innerHTML =

            alertas.join("");

    }


    document

        .getElementById(

            "totalAlerts"

        )

        .innerText =

        alertas.length;

}


// ============================================
// FORMATAR DATA
// ============================================

function formatarData(data) {

    if (!data) {
        return "Não definida";
    }

    const dataFormatada = new Date(data);

    return dataFormatada.toLocaleDateString("pt-PT");

}

// ============================================
// LISTA DOS ALUNOS DA AULA
// ============================================

function atualizarListaDaAula() {

    const lista = document.getElementById("lessonStudents");

    if (!lista) {
        return;
    }

    if (alunosDaAula.length === 0) {
        lista.innerHTML = "Ainda não existem alunos nesta aula.";
        return;
    }

    lista.innerHTML = "";

    alunosDaAula.forEach(function (aluno) {

        lista.innerHTML += `
            <div class="student-card">
                <strong>${aluno.numero}</strong> - ${aluno.nome}
            </div>
        `;

    });

}

// ============================================
// ADICIONAR ALUNO À AULA
// ============================================

document.getElementById("addStudentToLesson").addEventListener("click", function () {

    const numero = document.getElementById("lessonStudentNumber").value.trim();

    if (numero === "") {
        alert("Introduz o número do aluno.");
        return;
    }

    const aluno = alunos.find(function (a) {
        return a.numero === numero;
    });

    if (!aluno) {
        alert("Aluno não encontrado.");
        return;
    }

    const existe = alunosDaAula.find(function (a) {
        return a.id === aluno.id;
    });

    if (existe) {
        alert("Este aluno já foi adicionado à aula.");
        return;
    }

    alunosDaAula.push(aluno);

    document.getElementById("lessonStudentNumber").value = "";

    atualizarListaDaAula();

});

// ============================================
// GUARDAR AULA
// ============================================

document.getElementById("saveLesson").addEventListener("click", async function () {

    const idAula = document.getElementById("lessonId").value.trim();
    const materia = document.getElementById("lessonSubject").value.trim();
    const data = document.getElementById("lessonDate").value;

    if (idAula === "" || materia === "" || data === "") {
        alert("Preenche o ID da aula, a matéria e a data.");
        return;
    }

    if (alunosDaAula.length === 0) {
        alert("Ainda não adicionaste nenhum aluno.");
        return;
    }

    try {

        // Verifica se estamos a editar uma aula existente
const aulaExistente = aulas.find(function(a){
    return a.idAula === idAula;
});

if (aulaExistente) {

    await updateDoc(doc(db, "aulas", aulaExistente.id), {

        idAula: idAula,
        materia: materia,
        data: data,
        alunos: alunosDaAula.map(a => a.numero)

    });

    console.log("Aula atualizada:", idAula);

} else {

    await addDoc(collection(db, "aulas"), {

        idAula: idAula,
        materia: materia,
        data: data,
        alunos: alunosDaAula.map(a => a.numero)

    });

    console.log("Aula criada:", idAula);

}
        
        // Atualiza todos os alunos
        for (const aluno of alunosDaAula) {

            await updateDoc(doc(db, "alunos", aluno.id), {

                aulasRealizadas: (aluno.aulasRealizadas || 0) + 1,

                historicoAulas: arrayUnion(idAula)

            });

        }

        alert("Aula guardada com sucesso ✅");

        alunosDaAula = [];

        atualizarListaDaAula();

        document.getElementById("lessonId").value = "";
        document.getElementById("lessonSubject").value = "";
        document.getElementById("lessonDate").value = "";

    } catch (erro) {

        alert("Erro: " + erro.message);
        console.error(erro);

    }

});

// ============================================
// MOSTRAR AULAS
// ============================================

function mostrarAulas() {

    console.log("Aulas:", aulas);

    const lista = document.getElementById("lessonsList");

    if (!lista) return;

    if (aulas.length === 0) {

        lista.innerHTML = "Ainda não existem aulas.";
        return;

    }

    lista.innerHTML = "";

    aulas.forEach(function (aula) {

        let alunosTexto = "";

        (aula.alunos || []).forEach(function(numero){
            
            const aluno = alunos.find(function(a){
                return a.numero === numero;
            });

            if(aluno){

                alunosTexto += "• " + aluno.numero + " - " + aluno.nome + "<br>";

            }else{

                alunosTexto += "• " + numero + "<br>";

            }

        });

        lista.innerHTML += `

            <div class="student-card">

                <h3>📚 ${aula.idAula}</h3>

                <p><strong>Matéria:</strong> ${aula.materia}</p>

                <p><strong>Data:</strong> ${formatarData(aula.data)}</p>

                <p><strong>Alunos presentes:</strong><br>${alunosTexto}</p>

                <button class="editLessonButton" data-id="${aula.id}">
                    ✏️ Editar Aula
                </button>

                <button class="deleteLessonButton danger-button" data-id="${aula.id}">
                    🗑️ Apagar Aula
                </button>

            </div>

        `;

    });

    adicionarEventosDasAulas();

}

// ============================================
// EVENTOS DAS AULAS
// ============================================

function adicionarEventosDasAulas() {

    // APAGAR AULA
    document.querySelectorAll(".deleteLessonButton").forEach(function(botao){

        botao.onclick = async function(){

            const id = this.getAttribute("data-id");

            const confirmar = confirm("Pretendes apagar esta aula?");

            if(!confirmar){
                return;
            }

            try{

                // Encontrar a aula
                const aula = aulas.find(function(a){
                    return a.id === id;
                });

                // Atualizar todos os alunos dessa aula
                if(aula){

                    for(const numero of aula.alunos){

                        const aluno = alunos.find(function(a){
                            return a.numero === numero;
                        });

                        if(aluno){

                            try {

    const novoHistorico = (aluno.historicoAulas || []).filter(function(item) {
    return item !== aula.idAula;
});

await updateDoc(doc(db, "alunos", aluno.id), {

    aulasRealizadas: Math.max((aluno.aulasRealizadas || 1) - 1, 0),

    historicoAulas: novoHistorico

});
                                
    alert("Atualizou: " + aluno.nome);

} catch (e) {

    alert("Erro no aluno " + aluno.nome + ": " + e.message);

}
                        }

                    }

                }

                // Apagar a aula
                await deleteDoc(doc(db, "aulas", id));

                alert("Aula apagada com sucesso ✅");

            }catch(erro){

                alert("Erro ao apagar aula: " + erro.message);

            }

        };

    });

    // EDITAR AULA
document.querySelectorAll(".editLessonButton").forEach(function(botao){

    botao.onclick = function(){

        const id = this.getAttribute("data-id");

        const aula = aulas.find(function(a){
            return a.id === id;
        });

        if(!aula){
            alert("Aula não encontrada.");
            return;
        }

        document.getElementById("lessonId").value = aula.idAula;
        document.getElementById("lessonSubject").value = aula.materia;
        document.getElementById("lessonDate").value = aula.data;

        alunosDaAula = [];

        aula.alunos.forEach(function(numero){

            const aluno = alunos.find(function(a){
                return a.numero === numero;
            });

            if(aluno){
                alunosDaAula.push(aluno);
            }

        });

        atualizarListaDaAula();

        alert("Aula carregada para edição. Depois altera os dados e clica em Guardar Aula.");
    };

});
