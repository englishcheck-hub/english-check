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
let aulaEmEdicao = null;

// Aluno que está a ser editado
let alunoEmEdicao = null;

// Aluno para registar resultado de exame
let alunoResultadoExame = null;

// ============================================
// LER ALUNOS
// ============================================

onSnapshot(collection(db, "alunos"), (snapshot) => {

    alunos = [];

    snapshot.forEach((documento) => {

        alunos.push({
            id: documento.id,
            ...documento.data()
        });

    });

    console.log("Alunos carregados:", alunos);

    atualizarDashboard();

    if (typeof mostrarAlunos === "function") {
        mostrarAlunos();
    }

});

// ============================================
// LER AULAS
// ============================================

onSnapshot(collection(db, "aulas"), (snapshot) => {

    aulas = [];

    snapshot.forEach((documento) => {

        aulas.push({
            id: documento.id,
            ...documento.data()
        });

    });

    console.log("Aulas carregadas:", aulas);

    if (typeof mostrarAulas === "function") {
        mostrarAulas();
    }

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


const loginButton = document.getElementById("loginButton");


if (loginButton) {


    loginButton.addEventListener("click", function () {


        const username = document.getElementById("username").value.trim();

        const password = document.getElementById("password").value.trim();


        const utilizador = utilizadores.find(function(u){

            return u.username === username &&
                   u.password === password;

        });


        if (utilizador) {


            document.getElementById("loginPage").style.display = "none";

            document.getElementById("app").style.display = "block";

            document.getElementById("loginMessage").innerHTML = "";


        } else {


            document.getElementById("loginMessage").innerHTML =
            "Utilizador ou palavra-passe incorretos.";


            document.getElementById("loginMessage").style.color = "red";


        }


    });


}
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
// ADICIONAR / EDITAR ALUNO
// ============================================

document
.getElementById("addStudentButton")
.addEventListener("click", async function () {


const numero = document.getElementById("studentNumber").value.trim();
const nome = document.getElementById("studentName").value.trim();
const validadeLicenca = document.getElementById("licenceExpiry").value;
const validadeCodigo = document.getElementById("codeExpiry").value;
const qrCode = document.getElementById("qrCode").value.trim();
const estadoAluno = document.getElementById("studentStatus").value;


if(numero === "" || nome === ""){

alert("Preenche o número e o nome do aluno.");
return;

}


const aluno = {

    numero,
    nome,
    validadeLicenca,
    estadoExame: alunoEmEdicao
        ? alunoEmEdicao.estadoExame
        : "Sem exames registados",
    validadeCodigo,
    qrCode,
    estado: estadoAluno,

    historicoExames: alunoEmEdicao
        ? alunoEmEdicao.historicoExames
        : [],

    ultimaReprovacao: alunoEmEdicao
        ? alunoEmEdicao.ultimaReprovacao
        : null,

    aulasNaUltimaReprovacao: alunoEmEdicao
        ? alunoEmEdicao.aulasNaUltimaReprovacao
        : 0,

    aulasReprovacaoFeitas: alunoEmEdicao
        ? alunoEmEdicao.aulasReprovacaoFeitas
        : 0

};

try {


if (alunoEmEdicao) {

    aluno.historicoExames =
        alunoEmEdicao.historicoExames || [];

    aluno.ultimaReprovacao =
        alunoEmEdicao.ultimaReprovacao || null;

    aluno.aulasNaUltimaReprovacao =
        alunoEmEdicao.aulasNaUltimaReprovacao || 0;

    aluno.aulasReprovacaoFeitas =
        alunoEmEdicao.aulasReprovacaoFeitas || 0;

    aluno.aulasRealizadas =
        alunoEmEdicao.aulasRealizadas || 0;

    aluno.historicoAulas =
        alunoEmEdicao.historicoAulas || [];

    await updateDoc(
        doc(db, "alunos", alunoEmEdicao.id),
        aluno
    );

    alert("Aluno atualizado com sucesso ✅");

    alunoEmEdicao = null;

    document.getElementById("addStudentButton").innerText =
        "Adicionar Aluno";

}

else{


aluno.aulasRealizadas = 0;

aluno.historicoExames = [];

aluno.ultimaReprovacao = null;

aluno.aulasNaUltimaReprovacao = 0;

aluno.aulasReprovacaoFeitas = 0;



const novoAluno =
await addDoc(
collection(db,"alunos"),
aluno
);



await updateDoc(
doc(db,"alunos",novoAluno.id),
{
idAluno: novoAluno.id
}
);



alert("Aluno adicionado com sucesso ✅");


}



limparFormulario();

atualizarDashboard();



}

catch(erro){

alert("ERRO: " + erro.message);

console.log(erro);

}


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

    console.log("Entrou em mostrarAlunos");

    const lista = document.getElementById("studentsList");

    if (!lista) {
        console.log("Não encontrou studentsList");
        return;
    }


    const campoPesquisa = document.getElementById("searchStudent");

    const pesquisa = campoPesquisa
        ? campoPesquisa.value.toLowerCase().trim()
        : "";


    const alunosFiltrados = alunos.filter(function (aluno) {

        const nome = String(aluno.nome || "").toLowerCase();
        const numero = String(aluno.numero || "").toLowerCase();

        return (
            nome.includes(pesquisa) ||
            numero.includes(pesquisa)
        );

    });


    console.log("Alunos filtrados:", alunosFiltrados);


    if (alunosFiltrados.length === 0) {

        lista.innerHTML = "Ainda não existem alunos.";
        return;

    }


    lista.innerHTML = "";


    alunosFiltrados.forEach(function (aluno) {


        console.log("A criar cartão:", aluno);


        const cartao = document.createElement("div");

        cartao.className = "student-card";


        let historico = "Sem aulas registadas";


        if (
            aluno.historicoAulas &&
            aluno.historicoAulas.length > 0
        ) {

            historico = aluno.historicoAulas.join("<br>");

        }


        let teoria = "";

        try {

            teoria = verificarTeoriaCompleta(aluno) || "";

        } catch (erro) {

            console.log("Erro na teoria:", erro);

        }


        let reprovacao = "";

        try {

            reprovacao = mostrarEstadoReprovacao(aluno) || "";

        } catch (erro) {

            console.log("Erro na reprovação:", erro);

        }



        cartao.innerHTML = `

            <h3>👨‍🎓 ${aluno.nome || "Sem nome"}</h3>

            <p><strong>N.º de aluno:</strong> ${aluno.numero || "-"}</p>

            <p><strong>Validade da licença:</strong> ${formatarData(aluno.validadeLicenca)}</p>

            <p><strong>Aulas realizadas:</strong> ${aluno.aulasRealizadas || 0}</p>


            ${teoria}


            <p><strong>Estado do exame:</strong> ${aluno.estadoExame || "Sem exames registados"}</p>


            ${reprovacao}


            <p><strong>Validade do código:</strong> ${formatarData(aluno.validadeCodigo)}</p>


            <p><strong>QR Code:</strong></p>

            <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(aluno.id || "")}"
                alt="QR Code do aluno"
            >


            <p><strong>Estado:</strong> ${aluno.estado || "-"}</p>


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
                class="exam-button"
                data-docid="${aluno.id}">
                📝 Resultado de Exame
            </button>


            <button
                class="edit-button"
                data-docid="${aluno.id}">
                ✏️ Editar
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

    // REGISTAR AULA
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

    // RESULTADO DE EXAME
const botoesResultado = document.querySelectorAll(".exam-button");

botoesResultado.forEach(function (botao) {

    botao.onclick = function () {

        const docid = this.getAttribute("data-docid");

        const aluno = alunos.find(function (a) {
            return a.id === docid;
        });

        if (!aluno) {
            alert("Aluno não encontrado.");
            return;
        }

        alunoResultadoExame = aluno;

        document.getElementById("examDate").value =
            new Date().toISOString().split("T")[0];

        document.getElementById("examResult").value =
            "Aprovado";

        document.getElementById("examModal").style.display =
            "flex";

    };

});
    
    // EDITAR ALUNO
    const botoesEditar = document.querySelectorAll(".edit-button");

    botoesEditar.forEach(function (botao) {

        botao.onclick = function () {

            const docid = this.getAttribute("data-docid");

            const aluno = alunos.find(function (a) {
                return a.id === docid;
            });

            if (!aluno) {
                alert("Aluno não encontrado.");
                return;
            }

            alunoEmEdicao = aluno;

            document.getElementById("studentNumber").value = aluno.numero;
            document.getElementById("studentName").value = aluno.nome;
            document.getElementById("licenceExpiry").value = aluno.validadeLicenca || "";
            document.getElementById("codeExpiry").value = aluno.validadeCodigo || "";
            document.getElementById("qrCode").value = aluno.qrCode || "";
            document.getElementById("studentStatus").value = aluno.estado;

            document.getElementById("addStudentButton").innerText = "💾 Guardar Alterações";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

    });

    // APAGAR ALUNO
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
// VERIFICAR TEORIA COMPLETA
// ============================================

function verificarTeoriaCompleta(aluno) {

    if ((aluno.aulasRealizadas || 0) >= 28) {

        return `
            <div style="
                margin:12px 0;
                padding:12px;
                background:#dcfce7;
                border:2px solid #16a34a;
                border-radius:8px;
                color:#166534;
                font-weight:bold;
                text-align:center;
            ">
                🎉 TEORIA COMPLETA<br>
                ✅ O aluno já pode marcar o exame de código.
            </div>
        `;

    }

    return "";

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

        // Editar aula existente
        if (aulaEmEdicao) {

            await updateDoc(doc(db, "aulas", aulaEmEdicao.id), {

                idAula: idAula,
                materia: materia,
                data: data,
                alunos: alunosDaAula.map(a => a.numero)

            });

            console.log("Aula atualizada:", idAula);

        } else {

            // Criar nova aula
            await addDoc(collection(db, "aulas"), {

                idAula: idAula,
                materia: materia,
                data: data,
                alunos: alunosDaAula.map(a => a.numero)

            });

            console.log("Aula criada:", idAula);

            // Atualiza os alunos apenas quando a aula é nova
            for (const aluno of alunosDaAula) {

    const novasAulas = (aluno.aulasRealizadas || 0) + 1;

    const dadosAtualizar = {

        aulasRealizadas: novasAulas,

        historicoAulas: arrayUnion(idAula)

    };

    // Se o aluno tiver uma reprovação ativa
    if (aluno.ultimaReprovacao) {

        const aulasReprovacao =
            novasAulas - (aluno.aulasNaUltimaReprovacao || 0);

        dadosAtualizar.aulasReprovacaoFeitas =
            Math.min(aulasReprovacao, 5);

        // Atualizar também o histórico de exames
        let historico = aluno.historicoExames || [];

        if (historico.length > 0) {

            const ultimaEntrada = historico[historico.length - 1];

            if (
                ultimaEntrada.resultado === "Reprovado" &&
                !ultimaEntrada.aulasConcluidas
            ) {

                ultimaEntrada.aulasReprovacao =
                    Math.min(aulasReprovacao, 5);

                if (aulasReprovacao >= 5) {

                    ultimaEntrada.aulasConcluidas = true;

                }

            }

        }

        dadosAtualizar.historicoExames = historico;

    }

    await updateDoc(

        doc(db, "alunos", aluno.id),

        dadosAtualizar

    );

}
        }

        alert("Aula guardada com sucesso ✅");

        alunosDaAula = [];
        aulaEmEdicao = null;

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

        aulaEmEdicao = aula;

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
    
}

// ============================================
// LER QR CODE
// ============================================

const scanButton = document.getElementById("scanQRCodeButton");

if (scanButton) {

    scanButton.addEventListener("click", function () {

        const reader = document.getElementById("reader");

        reader.style.display = "block";

        const html5QrCode = new Html5Qrcode("reader");

        html5QrCode.start(

            { facingMode: "environment" },

            {
                fps: 10,
                qrbox: 250
            },

            function (decodedText) {

                html5QrCode.stop();

                reader.style.display = "none";

                decodedText = decodedText.trim();

                alert("QR lido: " + decodedText);

                console.log("QR lido:", decodedText);
                console.log("Alunos:", alunos);

                const aluno = alunos.find(function (a) {

                    return (
                        a.idAluno === decodedText ||
                        a.id === decodedText ||
                        a.numero === decodedText ||
                        a.qrCode === decodedText
                    );

                });

                if (!aluno) {

                    alert("Aluno não encontrado.");
                    return;

                }

                const existe = alunosDaAula.find(function (a) {
                    return a.id === aluno.id;
                });

                if (existe) {

                    alert("Este aluno já foi adicionado.");
                    return;

                }

                alunosDaAula.push(aluno);
                atualizarListaDaAula();
                alert("Aluno adicionado: " + aluno.nome);
            },

            function () {
                // Ignora erros enquanto procura o QR
            }
            );
    });

}

// ============================================
// MENU
// ============================================

document.getElementById("homeMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "block";
    document.getElementById("studentsPage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "none";

});

document.getElementById("studentsMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentsPage").style.display = "block";
    document.getElementById("lessonsPage").style.display = "none";

    mostrarAlunos();
    
});

document.getElementById("lessonsMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentsPage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "block";

    mostrarAulas();
    
});

// ============================================
// ESTADO DAS AULAS DE REPROVAÇÃO
// ============================================

function mostrarEstadoReprovacao(aluno) {

    if (!aluno.ultimaReprovacao) {
        return "";
    }

    let html = `
        <p><strong>Última reprovação:</strong> ${formatarData(aluno.ultimaReprovacao)}</p>
    `;

    if ((aluno.aulasReprovacaoFeitas || 0) >= 5) {

        html += `
            <p style="color:green;font-weight:bold;">
                ✅ Aulas de reprovação concluídas (5/5)
            </p>
        `;

    } else {

        html += `
            <p style="color:#d97706;font-weight:bold;">
                📚 Aulas de reprovação: ${aluno.aulasReprovacaoFeitas || 0}/5
            </p>
        `;

    }

    return html;

}


// ============================================
// FECHAR MODAL DO EXAME
// ============================================

document.getElementById("cancelExamResult").onclick = function () {

    document.getElementById("examModal").style.display = "none";

};

