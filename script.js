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
    setDoc,
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

// ============================================
// CALENDÁRIO
// ============================================

let mesesCalendario = [];
let diasFechados = [];

// Alunos da aula que está a ser criada
let alunosDaAula = [];
let aulaEmEdicao = null;

// Aluno que está a ser editado
let alunoEmEdicao = null;

// Aluno para registar resultado de exame
let alunoResultadoExame = null;

// ============================================
// NOTIFICAÇÕES RÁPIDAS
// ============================================

function mostrarNotificacao(mensagem, tipo = "sucesso") {
    const notificacao = document.createElement("div");

    notificacao.textContent = mensagem;

    notificacao.style.position = "fixed";
    notificacao.style.top = "20px";
    notificacao.style.right = "20px";
    notificacao.style.zIndex = "9999";

    notificacao.style.padding = "14px 20px";
    notificacao.style.borderRadius = "10px";

    notificacao.style.fontSize = "15px";
    notificacao.style.fontWeight = "bold";

    notificacao.style.boxShadow = "0 5px 15px rgba(0,0,0,0.20)";

    if (tipo === "erro") {
        notificacao.style.background = "#d90000";
        notificacao.style.color = "#ffffff";
    } else {
        notificacao.style.background = "#FFD500";
        notificacao.style.color = "#111111";
    }

    document.body.appendChild(notificacao);

    setTimeout(function () {

        notificacao.style.opacity = "0";
        notificacao.style.transition = "opacity 0.3s ease";

        setTimeout(function () {
            notificacao.remove();
        }, 300);

    }, 2500);

}

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

onSnapshot(
    collection(db, "aulas"),
    (snapshot) => {

        aulas = [];

        snapshot.forEach((documento) => {

            aulas.push({
                id: documento.id,
                ...documento.data()
            });

        });

        console.log("Aulas carregadas:", aulas);


        // Atualizar lista de aulas
        if (typeof mostrarAulas === "function") {
            mostrarAulas();
        }


        // Atualizar grelha mensal
        if (typeof renderizarCalendario === "function") {
            renderizarCalendario();
        }

    }
);

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

mostrarNotificacao(
    "Preenche o número e o nome do aluno.",
    "erro"
);
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
    
        mostrarNotificacao("Aluno atualizado com sucesso ✅");
    
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
    
    
    
    mostrarNotificacao("Aluno adicionado com sucesso ✅");
    
    
    }
    
    
    
    limparFormulario();
    
    atualizarDashboard();
    
    
    
    }
    
    catch(erro){
    
    mostrarNotificacao(
    "Erro: " + erro.message,
    "erro"
);
    
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

    // Ordenar por número de aluno
    const alunosFiltrados = [...alunos]

        .sort(function (a, b) {

            return Number(a.numero) - Number(b.numero);

        })

        .filter(function (aluno) {

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
                mostrarNotificacao("Aluno não encontrado.", "erro");
                return;
            }

            try {

                await updateDoc(doc(db, "alunos", docid), {
                    aulasRealizadas: (aluno.aulasRealizadas || 0) + 1
                });

                mostrarNotificacao("Aula registada com sucesso ✅");

            } catch (error) {

                mostrarNotificacao(
    "Erro ao registar aula: " + error.message,
    "erro"
);
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
            mostrarNotificacao("Aluno não encontrado.", "erro");
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
                mostrarNotificacao("Aluno não encontrado.", "erro");
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

                mostrarNotificacao("Aluno apagado com sucesso ✅");

            } catch (error) {

                mostrarNotificacao(
    "Erro ao apagar aluno: " + error.message,
    "erro"
);
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
        mostrarNotificacao("Introduz o número do aluno.", "erro");
        return;
    }

    const aluno = alunos.find(function (a) {
        return a.numero === numero;
    });

    if (!aluno) {
        mostrarNotificacao("Aluno não encontrado.", "erro");
        return;
    }

    const existe = alunosDaAula.find(function (a) {
        return a.id === aluno.id;
    });

    if (existe) {
        mostrarNotificacao("Este aluno já foi adicionado à aula.", "erro");
        return;
    }

    alunosDaAula.push(aluno);

    document.getElementById("lessonStudentNumber").value = "";

    atualizarListaDaAula();

});

document.getElementById("selectMultipleStudents").addEventListener("click", function () {

    const caixa = document.getElementById("multipleStudentsBox");
    const botao = document.getElementById("addSelectedStudents");

    caixa.innerHTML = "";

    [...alunos]
        .sort(function (a, b) {
            return Number(a.numero) - Number(b.numero);
        })
        .forEach(function (aluno) {

            const marcado = alunosDaAula.some(function(a){
                return a.id === aluno.id;
            });

            caixa.innerHTML += `
                <label style="display:block;margin-bottom:5px;">
                    <input type="checkbox" value="${aluno.numero}" ${marcado ? "checked" : ""}>
                    ${aluno.numero} - ${aluno.nome}
                </label>
            `;

        });

    caixa.style.display = "block";
    botao.style.display = "inline-block";

});

document.getElementById("addSelectedStudents").addEventListener("click", function () {

    const selecionados = document.querySelectorAll("#multipleStudentsBox input:checked");

    selecionados.forEach(function (checkbox) {

        const numero = checkbox.value;

        const aluno = alunos.find(function (a) {
            return a.numero === numero;
        });

        if (!aluno) return;

        const existe = alunosDaAula.find(function (a) {
            return a.id === aluno.id;
        });

        if (!existe) {
            alunosDaAula.push(aluno);
        }

    });

    atualizarListaDaAula();

    document.getElementById("multipleStudentsBox").style.display = "none";
    document.getElementById("addSelectedStudents").style.display = "none";

});

// ============================================
// GUARDAR AULA
// ============================================

document.getElementById("saveLesson").addEventListener("click", async function () {

    const idAula =
        document.getElementById("lessonId").value.trim();

    const materia =
        document.getElementById("lessonSubject").value.trim();

    const data =
        document.getElementById("lessonDate").value;

    const hora =
        document.getElementById("lessonTime").value;


    // ========================================
    // VALIDAR AULA
    // ========================================

    if (
        idAula === "" ||
        materia === "" ||
        data === "" ||
        hora === ""
    ) {

        mostrarNotificacao(
            "Seleciona a aula, a data e a hora.",
            "erro"
        );

        return;
    }


    // ========================================
    // VALIDAR ALUNOS
    // ========================================

    if (alunosDaAula.length === 0) {

        mostrarNotificacao(
            "Ainda não adicionaste nenhum aluno.",
            "erro"
        );

        return;
    }


    // ========================================
    // OBTER COR DA AULA
    // ========================================

    const aulaInfo =
        materiasAulas[idAula];

    const corAula =
        aulaInfo
            ? aulaInfo.cor
            : "verde";


    try {

        // ====================================
        // ALUNOS DA AULA
        // ====================================

        const numerosAlunos =
            alunosDaAula.map(function (aluno) {
                return aluno.numero;
            });


        // ====================================
        // EDITAR AULA
        // ====================================

        if (aulaEmEdicao) {

            await updateDoc(
                doc(
                    db,
                    "aulas",
                    aulaEmEdicao.id
                ),
                {

                    idAula: idAula,

                    materia: materia,

                    data: data,

                    hora: hora,

                    cor: corAula,

                    alunos: numerosAlunos

                }
            );


            console.log(
                "Aula atualizada:",
                idAula,
                data,
                hora
            );

        }


        // ====================================
        // CRIAR NOVA AULA
        // ====================================

        else {

            await addDoc(
                collection(db, "aulas"),
                {

                    idAula: idAula,

                    materia: materia,

                    data: data,

                    hora: hora,

                    cor: corAula,

                    alunos: numerosAlunos,

                    criadaEm:
                        new Date().toISOString()

                }
            );


            console.log(
                "Aula criada:",
                idAula,
                data,
                hora
            );


            // =================================
            // ATUALIZAR ALUNOS
            // =================================

            for (
                const aluno of alunosDaAula
            ) {

                const novasAulas =
                    (aluno.aulasRealizadas || 0) + 1;


                const dadosAtualizar = {

                    aulasRealizadas:
                        novasAulas,

                    historicoAulas:
                        arrayUnion(idAula)

                };


                // =============================
                // REPROVAÇÃO
                // =============================

                if (aluno.ultimaReprovacao) {

                    const aulasReprovacao =
                        novasAulas -
                        (
                            aluno.aulasNaUltimaReprovacao ||
                            0
                        );


                    dadosAtualizar
                        .aulasReprovacaoFeitas =
                            Math.min(
                                aulasReprovacao,
                                5
                            );


                    let historico =
                        aluno.historicoExames || [];


                    if (
                        historico.length > 0
                    ) {

                        const ultimaEntrada =
                            historico[
                                historico.length - 1
                            ];


                        if (
                            ultimaEntrada.resultado ===
                                "Reprovado" &&
                            !ultimaEntrada.aulasConcluidas
                        ) {

                            ultimaEntrada.aulasReprovacao =
                                Math.min(
                                    aulasReprovacao,
                                    5
                                );


                            if (
                                aulasReprovacao >= 5
                            ) {

                                ultimaEntrada.aulasConcluidas =
                                    true;

                            }

                        }

                    }


                    dadosAtualizar
                        .historicoExames =
                            historico;

                }


                await updateDoc(

                    doc(
                        db,
                        "alunos",
                        aluno.id
                    ),

                    dadosAtualizar

                );

            }

        }


        // ====================================
        // FINALIZAR
        // ====================================

        mostrarNotificacao(
            "Aula guardada com sucesso ✅"
        );


        alunosDaAula = [];

        aulaEmEdicao = null;


        atualizarListaDaAula();


        document.getElementById(
            "lessonId"
        ).value = "";


        document.getElementById(
            "lessonSubject"
        ).value = "";


        document.getElementById(
            "lessonDate"
        ).value = "";


        document.getElementById(
            "lessonTime"
        ).value = "";


        // Voltar a desenhar a grelha

        renderizarCalendario();


    } catch (erro) {

        console.error(
            "Erro ao guardar aula:",
            
            
            
    erro
        );


        mostrarNotificacao(
            "Erro ao guardar aula: " +
            erro.message,
            "erro"
        );

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

    [...aulas]

.sort(function (a, b) {

    return new Date(b.data) - new Date(a.data);

})

.forEach(function (aula) {

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
                                
    mostrarNotificacao("Atualizou: " + aluno.nome);

} catch (e) {

    mostrarNotificacao(
    "Erro no aluno " + aluno.nome + ": " + e.message,
    "erro"
);

}
                        }

                    }

                }

                // Apagar a aula
                await deleteDoc(doc(db, "aulas", id));

                mostrarNotificacao("Aula apagada com sucesso ✅");

            }catch(erro){

                mostrarNotificacao(
    "Erro ao apagar aula: " + erro.message,
    "erro"
);

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
            mostrarNotificacao("Aula não encontrada.", "erro");
            return;
        }

        document.getElementById("lessonId").value = aula.idAula;
        document.getElementById("lessonSubject").value = aula.materia;
        document.getElementById("lessonDate").value = aula.data;
        document.getElementById("lessonTime").value = aula.hora || "";

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

        mostrarNotificacao(
    "Aula carregada para edição. Altera os dados e clica em Guardar Aula."
);
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

                mostrarNotificacao("QR lido: " + decodedText);

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

                    mostrarNotificacao("Aluno não encontrado.", "erro");
                    return;

                }

                const existe = alunosDaAula.find(function (a) {
                    return a.id === aluno.id;
                });

                if (existe) {

                    mostrarNotificacao("Este aluno já foi adicionado.", "erro");
                    return;

                }

                alunosDaAula.push(aluno);
                atualizarListaDaAula();
                mostrarNotificacao("Aluno adicionado: " + aluno.nome);
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
    document.getElementById("calendarPage").style.display = "none";
    document.getElementById("reportsPage").style.display = "none";

});


document.getElementById("studentsMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentsPage").style.display = "block";
    document.getElementById("lessonsPage").style.display = "none";
    document.getElementById("calendarPage").style.display = "none";
    document.getElementById("reportsPage").style.display = "none";

    mostrarAlunos();

});


document.getElementById("lessonsMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentsPage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "block";
    document.getElementById("calendarPage").style.display = "none";
    document.getElementById("reportsPage").style.display = "none";

    mostrarAulas();

});


document.getElementById("calendarMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentsPage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "none";
    document.getElementById("calendarPage").style.display = "block";
    document.getElementById("reportsPage").style.display = "none";

});


document.getElementById("reportsMenu").addEventListener("click", function () {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentsPage").style.display = "none";
    document.getElementById("lessonsPage").style.display = "none";
    document.getElementById("calendarPage").style.display = "none";
    document.getElementById("reportsPage").style.display = "block";

});

// ============================================
// CALENDÁRIO
// ============================================

// ============================================
// ADICIONAR NOVO MÊS
// ============================================

document.getElementById("addMonthButton").addEventListener("click", async function () {

    const nomeMes = prompt(
        "Introduz o mês e o ano.\nExemplo: Agosto 2026"
    );

    if (!nomeMes) {
        return;
    }

    try {

        await addDoc(collection(db, "calendarioMeses"), {
            nome: nomeMes,
            criadoEm: new Date().toISOString()
        });

        mostrarNotificacao("Mês adicionado com sucesso ✅");

    } catch (erro) {

        mostrarNotificacao(
            "Erro ao guardar mês: " + erro.message,
            "erro"
        );

    }

});


// ============================================
// LER MESES DO CALENDÁRIO
// ============================================

onSnapshot(
    collection(db, "calendarioMeses"),
    function (snapshot) {

        mesesCalendario = [];

        snapshot.forEach(function (documento) {

            mesesCalendario.push({
                id: documento.id,
                ...documento.data()
            });

        });

        renderizarCalendario();

    }
);


// ============================================
// LER DIAS FECHADOS
// ============================================

onSnapshot(
    collection(db, "diasFechados"),
    function (snapshot) {

        diasFechados = [];

        snapshot.forEach(function (documento) {

            diasFechados.push({
                id: documento.id,
                ...documento.data()
            });

        });

        console.log("Dias fechados:", diasFechados);

        renderizarCalendario();

    }
);


// ============================================
// CALCULAR PÁSCOA
// ============================================

function calcularPascoa(ano) {

    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);

    const h =
        (19 * a + b - d - g + 15) % 30;

    const i = Math.floor(c / 4);
    const k = c % 4;

    const l =
        (32 + 2 * e + 2 * i - h - k) % 7;

    const m =
        Math.floor(
            (a + 11 * h + 22 * l) / 451
        );

    const mes =
        Math.floor(
            (h + l - 7 * m + 114) / 31
        );

    const dia =
        ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(
        ano,
        mes - 1,
        dia
    );

}


// ============================================
// OBTER FERIADOS DE LISBOA
// ============================================

function obterFeriados(ano) {

    const feriados = [];

    function adicionar(data, nome) {

        feriados.push({
            data: data,
            nome: nome
        });

    }


    // ========================================
    // FERIADOS FIXOS
    // ========================================

    adicionar(
        new Date(ano, 0, 1),
        "Ano Novo"
    );

    adicionar(
        new Date(ano, 3, 25),
        "Dia da Liberdade"
    );

    adicionar(
        new Date(ano, 4, 1),
        "Dia do Trabalhador"
    );

    adicionar(
        new Date(ano, 5, 10),
        "Dia de Portugal"
    );

    // Feriado municipal de Lisboa

    adicionar(
        new Date(ano, 5, 13),
        "Santo António — Lisboa"
    );

    adicionar(
        new Date(ano, 9, 5),
        "Implantação da República"
    );

    adicionar(
        new Date(ano, 10, 1),
        "Dia de Todos os Santos"
    );

    adicionar(
        new Date(ano, 11, 1),
        "Restauração da Independência"
    );

    adicionar(
        new Date(ano, 11, 8),
        "Imaculada Conceição"
    );

    adicionar(
        new Date(ano, 11, 25),
        "Natal"
    );


    // ========================================
    // FERIADOS MÓVEIS
    // ========================================

    const pascoa =
        calcularPascoa(ano);


    const sextaFeiraSanta =
        new Date(pascoa);

    sextaFeiraSanta.setDate(
        pascoa.getDate() - 2
    );

    adicionar(
        sextaFeiraSanta,
        "Sexta-feira Santa"
    );


    // Páscoa
    adicionar(
        new Date(pascoa),
        "Páscoa"
    );


    // Corpo de Deus
    const corpoDeus =
        new Date(pascoa);

    corpoDeus.setDate(
        pascoa.getDate() + 60
    );

    adicionar(
        corpoDeus,
        "Corpo de Deus"
    );


    return feriados;

}


// ============================================
// OBTER FERIADO
// ============================================

function obterFeriado(data, feriados) {

    return feriados.find(function (feriado) {

        return (
            feriado.data.getFullYear() === data.getFullYear() &&
            feriado.data.getMonth() === data.getMonth() &&
            feriado.data.getDate() === data.getDate()
        );

    });

}


// ============================================
// CONVERTER DATA PARA YYYY-MM-DD
// ============================================

function obterDataString(ano, mes, dia) {

    return (
        ano +
        "-" +
        String(mes + 1).padStart(2, "0") +
        "-" +
        String(dia).padStart(2, "0")
    );

}


// ============================================
// VERIFICAR SE O DIA ESTÁ FECHADO
// ============================================

function obterDiaFechado(dataString) {

    return diasFechados.find(function (dia) {

        return dia.id === dataString;

    });

}


// ============================================
// MENU DO DIA
// ============================================

function mostrarMenuDoDia(cabecalho) {

    // Fechar menus anteriores

    const menuAnterior =
        document.querySelector(".calendar-day-menu");

    if (menuAnterior) {
        menuAnterior.remove();
    }


    const dataString =
        cabecalho.getAttribute("data-date");

    const feriado =
        cabecalho.getAttribute("data-holiday");


    // Feriados não podem ser alterados

    if (feriado === "true") {

        mostrarNotificacao(
            "Este dia está bloqueado por ser feriado.",
            "erro"
        );

        return;

    }


    const diaFechado =
        obterDiaFechado(dataString);


    const menu =
        document.createElement("div");

    menu.className =
        "calendar-day-menu";


    menu.style.position = "fixed";
    menu.style.zIndex = "10000";
    menu.style.background = "#ffffff";
    menu.style.border = "2px solid #111111";
    menu.style.borderRadius = "10px";
    menu.style.padding = "10px";
    menu.style.boxShadow = "0 5px 20px rgba(0,0,0,0.25)";


    const botao =
        document.createElement("button");


    if (diaFechado) {

        botao.innerHTML =
            "🔓 Reabrir dia";

    } else {

        botao.innerHTML =
            "🔒 Fechar dia inteiro";

    }


    botao.style.display = "block";
    botao.style.width = "100%";
    botao.style.padding = "10px 14px";
    botao.style.border = "none";
    botao.style.borderRadius = "8px";
    botao.style.background = "#FFD500";
    botao.style.color = "#111111";
    botao.style.fontWeight = "bold";
    botao.style.cursor = "pointer";


    botao.onclick = async function () {

        menu.remove();


        // ====================================
        // REABRIR
        // ====================================

        if (diaFechado) {

            const confirmar =
                confirm(
                    "Queres reabrir este dia?\n\n" +
                    "As células voltarão a ficar disponíveis."
                );


            if (!confirmar) {
                return;
            }


            try {

                await deleteDoc(
                    doc(
                        db,
                        "diasFechados",
                        dataString
                    )
                );


                mostrarNotificacao(
                    "Dia reaberto com sucesso ✅"
                );


            } catch (erro) {

                mostrarNotificacao(
                    "Erro ao reabrir o dia: " +
                    erro.message,
                    "erro"
                );

            }

            return;

        }


        // ====================================
        // FECHAR
        // ====================================

        const confirmar =
            confirm(
                "Queres fechar este dia inteiro?\n\n" +
                "Não será possível criar aulas neste dia."
            );


        if (!confirmar) {
            return;
        }


        try {

            await setDoc(
                doc(
                    db,
                    "diasFechados",
                    dataString
                ),
                {
                    data: dataString,
                    tipo: "FECHADO",
                    criadoEm: new Date().toISOString()
                }
            );


            mostrarNotificacao(
                "Dia fechado com sucesso 🔒"
            );


        } catch (erro) {

            mostrarNotificacao(
                "Erro ao fechar o dia: " +
                erro.message,
                "erro"
            );

        }

    };


    menu.appendChild(botao);

    document.body.appendChild(menu);


    // ========================================
    // POSICIONAR MENU
    // ========================================

    const rect =
        cabecalho.getBoundingClientRect();


    let left =
        rect.left;


    let top =
        rect.bottom + 5;


    // Evitar sair do lado direito

    if (
        left + 220 >
        window.innerWidth
    ) {

        left =
            window.innerWidth - 230;

    }


    menu.style.left =
        Math.max(left, 5) + "px";

    menu.style.top =
        top + "px";


    // ========================================
    // FECHAR AO CLICAR FORA
    // ========================================

    setTimeout(function () {

        document.addEventListener(
            "click",
            function fecharMenu(event) {

                if (
                    !menu.contains(event.target) &&
                    event.target !== cabecalho
                ) {

                    menu.remove();

                    document.removeEventListener(
                        "click",
                        fecharMenu
                    );

                }

            }
        );

    }, 0);

}


// ============================================
// CRIAR ESCALA MENSAL
// ============================================

function renderizarCalendario() {

    const monthsContainer =
        document.getElementById("monthsContainer");

    if (!monthsContainer) {
        return;
    }

    // ----------------------------------------
    // SEM MESES
    // ----------------------------------------

    if (mesesCalendario.length === 0) {

        monthsContainer.innerHTML = `

            <div class="calendar-empty">

                📅

                <p>
                    Ainda não existe nenhum mês.
                </p>

                <p>
                    Clica em <strong>➕ Adicionar novo mês</strong>
                    para começar.
                </p>

            </div>

        `;

        return;
    }


    // ----------------------------------------
    // HORÁRIOS
    // ----------------------------------------

    const horarios = [

        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",

        "17:00",
        "18:00",
        "19:00",
        "20:00"

    ];


    // ----------------------------------------
    // NOMES DOS MESES
    // ----------------------------------------

    const nomesMeses = [

        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"

    ];


    let html = "";


    // ----------------------------------------
    // CADA MÊS
    // ----------------------------------------

    mesesCalendario.forEach(function (mes) {

        const partes =
            mes.nome.trim().split(/\s+/);


        const nomeMesTexto =
            partes[0];


        const ano =
            parseInt(partes[1]);


        const mesNumero =
            nomesMeses.indexOf(
                nomeMesTexto.toLowerCase()
            );


        // ------------------------------------
        // MÊS INVÁLIDO
        // ------------------------------------

        if (
            mesNumero === -1 ||
            isNaN(ano)
        ) {

            html += `

                <div class="calendar-month">

                    <h3>
                        📅 ${mes.nome}
                    </h3>

                    <p>
                        Não foi possível interpretar
                        o mês e o ano.
                    </p>

                </div>

            `;

            return;
        }


        // ------------------------------------
        // ÚLTIMO DIA DO MÊS
        // ------------------------------------

        const ultimoDia =
            new Date(
                ano,
                mesNumero + 1,
                0
            ).getDate();


        const feriados =
            obterFeriados(ano);


        // ------------------------------------
        // OBTER APENAS DIAS ÚTEIS
        // ------------------------------------

        const diasUteis = [];


        for (
            let dia = 1;
            dia <= ultimoDia;
            dia++
        ) {

            const data =
                new Date(
                    ano,
                    mesNumero,
                    dia
                );


            const diaSemana =
                data.getDay();


            // Domingo não aparece
            if (diaSemana === 0) {
                continue;
            }


            diasUteis.push({

                numero: dia,

                data: data,

                diaSemana: diaSemana,

                dataString:
                    obterDataString(
                        ano,
                        mesNumero,
                        dia
                    ),

                feriado:
                    obterFeriado(
                        data,
                        feriados
                    )

            });

        }


        // ------------------------------------
        // TÍTULO DO MÊS
        // ------------------------------------

        html += `

            <div
                class="calendar-month"
                data-month-id="${mes.id}"
            >

                <h3>
                    📅 ${mes.nome}
                </h3>

                <div class="calendar-scroll">

                    <div class="calendar-table">


                        <!-- ======================
                             CABEÇALHO
                        ======================= -->

                        <div class="calendar-header">


                            <div class="calendar-time-header">
                                HORÁRIO
                            </div>

        `;


        // ------------------------------------
        // COLUNAS DOS DIAS
        // ------------------------------------

        diasUteis.forEach(function (dia) {

            let classe =
                "calendar-day-header";


            if (dia.feriado) {

                classe += " holiday";

            }
            else if (
                obterDiaFechado(
                    dia.dataString
                )
            ) {

                classe += " closed-day";

            }


            html += `

                <div
                    class="${classe}"
                    data-date="${dia.dataString}"
                    data-holiday="${
                        dia.feriado
                            ? "true"
                            : "false"
                    }"
                >

                    <strong>
                        ${dia.numero}
                    </strong>

                    <span>
                        ${
                            [
                                "",
                                "Seg",
                                "Ter",
                                "Qua",
                                "Qui",
                                "Sex",
                                "Sáb"
                            ][dia.diaSemana]
                        }
                    </span>

                    ${
                        dia.feriado
                            ? `
                                <small>
                                    ${dia.feriado.nome}
                                </small>
                              `
                            : obterDiaFechado(
                                dia.dataString
                            )
                                ? `
                                    <small>
                                        FECHADO
                                    </small>
                                  `
                                : ""
                    }

                </div>

            `;

        });


        html += `

                        </div>


                        <!-- ======================
                             LINHAS DOS HORÁRIOS
                        ======================= -->

        `;


        // ------------------------------------
        // CADA HORÁRIO
        // ------------------------------------

        horarios.forEach(function (horario) {


            // --------------------------------
            // INTERVALO
            // --------------------------------

            if (horario === "17:00") {

                html += `

                    <div class="calendar-break">

                        <span>
                            INTERVALO
                        </span>

                    </div>

                `;

            }


            html += `

                <div class="calendar-row">


                    <div class="calendar-time">
                        ${horario}
                    </div>

            `;


            // --------------------------------
            // CADA DIA
            // --------------------------------

            diasUteis.forEach(function (dia) {

                const diaFechado =
                    obterDiaFechado(
                        dia.dataString
                    );


                // ----------------------------
                // FERIADO
                // ----------------------------

                if (dia.feriado) {

                    html += `

                        <div
                            class="calendar-cell holiday"
                            data-date="${dia.dataString}"
                            data-time="${horario}"
                            data-blocked="holiday"
                            title="${dia.feriado.nome}"
                        >

                            <span>
                                ⬛
                            </span>

                        </div>

                    `;

                }


                // ----------------------------
                // DIA FECHADO
                // ----------------------------

                else if (diaFechado) {

                    html += `

                        <div
                            class="calendar-cell closed-day"
                            data-date="${dia.dataString}"
                            data-time="${horario}"
                            data-blocked="closed"
                            title="Dia fechado"
                        >

                            <span>
                                🔒
                            </span>

                        </div>

                    `;

                }


// ----------------------------
// CÉLULA NORMAL / AULA
// ----------------------------

else {

    const aulaEncontrada =
        aulas.find(function (aula) {

            return (
                aula.data === dia.dataString &&
                aula.hora === horario
            );

        });


    // ================================
    // EXISTE UMA AULA
    // ================================

    if (aulaEncontrada) {

        const cor =
            aulaEncontrada.cor || "verde";


        html += `

            <div
                class="calendar-cell lesson-cell lesson-${cor}"
                data-date="${dia.dataString}"
                data-time="${horario}"
                data-lesson-id="${aulaEncontrada.id}"
            >

                <div class="lesson-number">
                    ${aulaEncontrada.idAula}
                </div>

                <div class="lesson-subject">
                    ${aulaEncontrada.materia}
                </div>

            </div>

        `;

    }


    // ================================
    // CÉLULA VAZIA
    // ================================

    else {

        html += `

            <div
                class="calendar-cell"
                data-date="${dia.dataString}"
                data-time="${horario}"
            >
            </div>
        `;

    }

}
            });
            });
        });
            
                
    // ----------------------------------------
    // COLOCAR NO ECRÃ
    // ----------------------------------------

    monthsContainer.innerHTML =
        html;


    // ========================================
    // CLICAR NO CABEÇALHO DO DIA
    // ========================================

    document
        .querySelectorAll(".calendar-day-header")
        .forEach(function (cabecalho) {

            cabecalho.onclick =
                function (event) {

                    event.stopPropagation();

                    mostrarMenuDoDia(
                        this
                    );

                };

        });


    // ========================================
// CLICAR NUMA CÉLULA PARA CRIAR AULA
// ========================================

document
    .querySelectorAll(".calendar-cell")
    .forEach(function (celula) {

        celula.onclick = function () {

            const bloqueado =
                this.getAttribute("data-blocked");

            if (bloqueado === "holiday") {

                mostrarNotificacao(
                    "Este dia está bloqueado por feriado.",
                    "erro"
                );

                return;
            }

            if (bloqueado === "closed") {

                mostrarNotificacao(
                    "Este dia está fechado. Reabre o dia para criares aulas.",
                    "erro"
                );

                return;
            }

            const data =
                this.getAttribute("data-date");

            const horario =
                this.getAttribute("data-time");

            const campoData =
                    document.getElementById("lessonDate");

                const campoHora =
                    document.getElementById("lessonTime");

                if (campoData) {
                    campoData.value = data;
                }

                if (campoHora) {
                    campoHora.value = horario;
                }


                document.getElementById("homePage").style.display = "none";
                document.getElementById("studentsPage").style.display = "none";
                document.getElementById("lessonsPage").style.display = "block";
                document.getElementById("calendarPage").style.display = "none";
                document.getElementById("reportsPage").style.display = "none";


                mostrarNotificacao(
                    "Data e hora selecionadas: " +
                    formatarData(data) +
                    " às " +
                    horario +
                    " ⏰"
                );


                const formulario =
                    document.getElementById("saveLesson");

                if (formulario) {

                    formulario.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            };

        });

}

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

// ============================================
// GUARDAR RESULTADO DO EXAME
// ============================================

document.getElementById("saveExamResult").onclick = async function () {

    if (!alunoResultadoExame) {
        mostrarNotificacao("Nenhum aluno selecionado.", "erro");
        return;
    }

    const data = document.getElementById("examDate").value;
    const resultado = document.getElementById("examResult").value;

    if (data === "") {
        mostrarNotificacao("Seleciona a data do exame.", "erro");
        return;
    }

    try {

        let historico = alunoResultadoExame.historicoExames || [];

        historico.push({
            data: data,
            resultado: resultado
        });

        const dadosAtualizar = {

            estadoExame: resultado,
            historicoExames: historico

        };

        if (resultado === "Reprovado") {

            dadosAtualizar.ultimaReprovacao = data;
            dadosAtualizar.aulasNaUltimaReprovacao =
                alunoResultadoExame.aulasRealizadas || 0;
            dadosAtualizar.aulasReprovacaoFeitas = 0;

        }

        await updateDoc(
            doc(db, "alunos", alunoResultadoExame.id),
            dadosAtualizar
        );

        document.getElementById("examModal").style.display = "none";

        mostrarNotificacao("Resultado do exame guardado com sucesso ✅");

    } catch (erro) {

        mostrarNotificacao(
    "Erro ao guardar: " + erro.message,
    "erro"
);

    }

};

// ============================================
// EXPORTAR RELATÓRIO
// ============================================

document.getElementById("exportReportButton").addEventListener("click", function () {

    const livro = XLSX.utils.book_new();

    const dadosAlunos = alunos.map(function (aluno) {

        return {

            "N.º": aluno.numero,
            "Nome": aluno.nome,
            "Estado": aluno.estado,
            "Aulas": aluno.aulasRealizadas || 0,
            "Exame": aluno.estadoExame,
            "Validade Licença": aluno.validadeLicenca,
            "Validade Código": aluno.validadeCodigo

        };

    });

    const folhaAlunos = XLSX.utils.json_to_sheet(dadosAlunos);

    XLSX.utils.book_append_sheet(
        livro,
        folhaAlunos,
        "Alunos"
    );

    const dadosAulas = aulas.map(function (aula) {

    return {

        "ID da Aula": aula.idAula,
        "Data": aula.data,
        "Matéria": aula.materia,
        "Alunos": (aula.alunos || []).join(", ")

    };

});

const folhaAulas = XLSX.utils.json_to_sheet(dadosAulas);

XLSX.utils.book_append_sheet(
    livro,
    folhaAulas,
    "Aulas"
);

    XLSX.writeFile(
        livro,
        "Relatorio_English_Check.xlsx"
    );

});

// ============================================
// IMPRIMIR ALUNOS ATIVOS (PDF)
// ============================================

document.getElementById("printActiveStudentsButton").addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("English Check", 20, 20);

    pdf.setFontSize(14);
    pdf.text("Lista de Alunos Ativos", 20, 30);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const dataAtual = new Date().toLocaleDateString("pt-PT");

    pdf.text("Data: " + dataAtual, 20, 38);

    let y = 50;

    const alunosAtivos = [...alunos]

.filter(function(aluno){
    return aluno.estado === "Ativo";
})

.sort(function(a, b){
    return Number(a.numero) - Number(b.numero);
});

    alunosAtivos.forEach(function (aluno, index) {

        if (y > 275) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.text((index + 1) + ". " + aluno.nome, 20, y);

        pdf.setFont("helvetica", "normal");

        pdf.text("N.º: " + aluno.numero, 25, y + 6);
        pdf.text("Aulas: " + (aluno.aulasRealizadas || 0), 70, y + 6);
        pdf.text("Exame: " + (aluno.estadoExame || "Sem exames"), 120, y + 6);

        y += 18;

    });

    pdf.save("Alunos_Ativos.pdf");

});
