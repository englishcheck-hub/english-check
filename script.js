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
    arrayUnion
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


// ============================================
// BASE DE DADOS EM MEMÓRIA
// ============================================

let alunos = [];
let aulas = [];

let mesesCalendario = [];
let diasFechados = [];


// ============================================
// ESTADO DA AULA
// ============================================

let alunosDaAula = [];
let aulaEmEdicao = null;


// ============================================
// ESTADO DOS ALUNOS
// ============================================

let alunoEmEdicao = null;
let alunoResultadoExame = null;


// ============================================
// NOTIFICAÇÕES
// ============================================

function mostrarNotificacao(mensagem, tipo = "sucesso") {

    const notificacao = document.createElement("div");

    notificacao.textContent = mensagem;

    notificacao.style.position = "fixed";
    notificacao.style.top = "20px";
    notificacao.style.right = "20px";
    notificacao.style.zIndex = "99999";

    notificacao.style.padding = "14px 20px";
    notificacao.style.borderRadius = "10px";

    notificacao.style.fontSize = "15px";
    notificacao.style.fontWeight = "bold";

    notificacao.style.boxShadow =
        "0 5px 15px rgba(0,0,0,0.20)";

    notificacao.style.background =
        tipo === "erro"
            ? "#d90000"
            : "#FFD500";

    notificacao.style.color =
        tipo === "erro"
            ? "#ffffff"
            : "#111111";

    document.body.appendChild(notificacao);

    setTimeout(function () {

        notificacao.style.opacity = "0";
        notificacao.style.transition =
            "opacity 0.3s ease";

        setTimeout(function () {

            notificacao.remove();

        }, 300);

    }, 2500);
}


// ============================================
// LER ALUNOS
// ============================================

onSnapshot(
    collection(db, "alunos"),
    function (snapshot) {

        alunos = [];

        snapshot.forEach(function (documento) {

            alunos.push({
                id: documento.id,
                ...documento.data()
            });

        });

        console.log("Alunos carregados:", alunos);

        atualizarDashboard();

        mostrarAlunos();
        mostrarAulas();
    }
);


// ============================================
// LER AULAS
// ============================================

onSnapshot(
    collection(db, "aulas"),
    function (snapshot) {

        aulas = [];

        snapshot.forEach(function (documento) {

            aulas.push({
                id: documento.id,
                ...documento.data()
            });

        });

        console.log("Aulas carregadas:", aulas);

        mostrarAulas();
        renderizarCalendario();
    }
);

console.log("CHEGUEI AO LOGIN");

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


const loginButton =
    document.getElementById("loginButton");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value
                    .trim();


            const utilizador =
                utilizadores.find(function (u) {

                    return (
                        u.username === username &&
                        u.password === password
                    );

                });


            if (utilizador) {

                document.getElementById(
                    "loginPage"
                ).style.display = "none";

                document.getElementById(
                    "app"
                ).style.display = "block";

                document.getElementById(
                    "loginMessage"
                ).innerHTML = "";

            }

            else {

                document.getElementById(
                    "loginMessage"
                ).innerHTML =
                    "Utilizador ou palavra-passe incorretos.";

                document.getElementById(
                    "loginMessage"
                ).style.color = "red";

            }

        }
    );
}


// ============================================
// LOGOUT
// ============================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            document.getElementById(
                "app"
            ).style.display = "none";

            document.getElementById(
                "loginPage"
            ).style.display = "flex";

            document.getElementById(
                "username"
            ).value = "";

            document.getElementById(
                "password"
            ).value = "";

            document.getElementById(
                "loginMessage"
            ).innerHTML = "";

        }
    );
}


// ============================================
// ADICIONAR / EDITAR ALUNO
// ============================================

const addStudentButton =
    document.getElementById("addStudentButton");


if (addStudentButton) {

    addStudentButton.addEventListener(
        "click",
        async function () {

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


            if (numero === "" || nome === "") {

                mostrarNotificacao(
                    "Preenche o número e o nome do aluno.",
                    "erro"
                );

                return;
            }


            const aluno = {

                numero: numero,

                nome: nome,

                validadeLicenca:
                    validadeLicenca,

                validadeCodigo:
                    validadeCodigo,

                qrCode:
                    qrCode,

                estado:
                    estadoAluno,

                estadoExame:
                    alunoEmEdicao
                        ? alunoEmEdicao.estadoExame
                        : "Sem exames registados",

                historicoExames:
                    alunoEmEdicao
                        ? (
                            alunoEmEdicao.historicoExames || []
                        )
                        : [],

                ultimaReprovacao:
                    alunoEmEdicao
                        ? (
                            alunoEmEdicao.ultimaReprovacao || null
                        )
                        : null,

                aulasNaUltimaReprovacao:
                    alunoEmEdicao
                        ? (
                            alunoEmEdicao.aulasNaUltimaReprovacao || 0
                        )
                        : 0,

                aulasReprovacaoFeitas:
                    alunoEmEdicao
                        ? (
                            alunoEmEdicao.aulasReprovacaoFeitas || 0
                        )
                        : 0,

                aulasRealizadas:
                    alunoEmEdicao
                        ? (
                            alunoEmEdicao.aulasRealizadas || 0
                        )
                        : 0,

                historicoAulas:
                    alunoEmEdicao
                        ? (
                            alunoEmEdicao.historicoAulas || []
                        )
                        : []

            };


            try {

                if (alunoEmEdicao) {

                    await updateDoc(
                        doc(
                            db,
                            "alunos",
                            alunoEmEdicao.id
                        ),
                        aluno
                    );

                    mostrarNotificacao(
                        "Aluno atualizado com sucesso ✅"
                    );

                    alunoEmEdicao = null;

                    document.getElementById(
                        "addStudentButton"
                    ).innerText =
                        "Adicionar Aluno";

                }

                else {

                    const novoAluno =
                        await addDoc(
                            collection(db, "alunos"),
                            aluno
                        );


                    await updateDoc(
                        doc(
                            db,
                            "alunos",
                            novoAluno.id
                        ),
                        {
                            idAluno:
                                novoAluno.id
                        }
                    );


                    mostrarNotificacao(
                        "Aluno adicionado com sucesso ✅"
                    );
                }


                limparFormulario();

                atualizarDashboard();

            }

            catch (erro) {

                console.error(erro);

                mostrarNotificacao(
                    "Erro: " + erro.message,
                    "erro"
                );
            }

        }
    );
}


// ============================================
// LIMPAR FORMULÁRIO
// ============================================

function limparFormulario() {

    const campos = [

        "studentNumber",
        "studentName",
        "licenceExpiry",
        "codeExpiry",
        "qrCode"

    ];


    campos.forEach(function (id) {

        const campo =
            document.getElementById(id);

        if (campo) {
            campo.value = "";
        }

    });


    const estado =
        document.getElementById("studentStatus");

    if (estado) {
        estado.value = "Ativo";
    }
}


// ============================================
// PESQUISAR ALUNOS
// ============================================

const searchStudent =
    document.getElementById("searchStudent");


if (searchStudent) {

    searchStudent.addEventListener(
        "input",
        function () {

            mostrarAlunos();

        }
    );
}


// ============================================
// MOSTRAR ALUNOS
// ============================================

function mostrarAlunos() {

    const lista =
        document.getElementById("studentsList");

    if (!lista) {
        return;
    }


    const campoPesquisa =
        document.getElementById("searchStudent");


    const pesquisa =
        campoPesquisa
            ? campoPesquisa.value
                .toLowerCase()
                .trim()
            : "";


    const alunosFiltrados =
        [...alunos]

            .sort(function (a, b) {

                return (
                    Number(a.numero) -
                    Number(b.numero)
                );

            })

            .filter(function (aluno) {

                const nome =
                    String(
                        aluno.nome || ""
                    ).toLowerCase();

                const numero =
                    String(
                        aluno.numero || ""
                    ).toLowerCase();


                return (
                    nome.includes(pesquisa) ||
                    numero.includes(pesquisa)
                );

            });


    if (alunosFiltrados.length === 0) {

        lista.innerHTML =
            "Ainda não existem alunos.";

        return;
    }


    lista.innerHTML = "";


    alunosFiltrados.forEach(
        function (aluno) {

            const cartao =
                document.createElement("div");

            cartao.className =
                "student-card";


            let historico =
                "Sem aulas registadas";


            if (
                aluno.historicoAulas &&
                aluno.historicoAulas.length > 0
            ) {

                historico =
                    aluno.historicoAulas.join("<br>");

            }


            let teoria = "";

            try {

                teoria =
                    verificarTeoriaCompleta(aluno);

            }

            catch (erro) {

                console.log(
                    "Erro na teoria:",
                    erro
                );

            }


            let reprovacao = "";

            try {

                reprovacao =
                    mostrarEstadoReprovacao(aluno);

            }

            catch (erro) {

                console.log(
                    "Erro na reprovação:",
                    erro
                );

            }


            cartao.innerHTML = `

                <h3>
                    👨‍🎓 ${aluno.nome || "Sem nome"}
                </h3>

                <p>
                    <strong>N.º de aluno:</strong>
                    ${aluno.numero || "-"}
                </p>

                <p>
                    <strong>Validade da licença:</strong>
                    ${formatarData(aluno.validadeLicenca)}
                </p>

                <p>
                    <strong>Aulas realizadas:</strong>
                    ${aluno.aulasRealizadas || 0}
                </p>

                ${teoria}

                <p>
                    <strong>Estado do exame:</strong>
                    ${aluno.estadoExame || "Sem exames registados"}
                </p>

                ${reprovacao}

                <p>
                    <strong>Validade do código:</strong>
                    ${formatarData(aluno.validadeCodigo)}
                </p>

                <p>
                    <strong>QR Code:</strong>
                </p>

                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(aluno.id || "")}"
                    alt="QR Code do aluno"
                >

                <p>
                    <strong>Estado:</strong>
                    ${aluno.estado || "-"}
                </p>

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

        }
    );


    adicionarEventosDosBotoes();
}


// ============================================
// BOTÕES DOS ALUNOS
// ============================================

function adicionarEventosDosBotoes() {

    // ========================================
    // REGISTAR AULA ANTIGO
    // ========================================

    document
        .querySelectorAll(".add-lesson-button")
        .forEach(function (botao) {

            botao.onclick = function () {

                const docid =
                    this.getAttribute(
                        "data-docid"
                    );

                const aluno =
                    alunos.find(function (a) {

                        return a.id === docid;

                    });


                if (!aluno) {

                    mostrarNotificacao(
                        "Aluno não encontrado.",
                        "erro"
                    );

                    return;
                }


                mostrarNotificacao(
                    "As aulas devem agora ser criadas através do calendário.",
                    "erro"
                );

            };

        });


    // ========================================
    // RESULTADO DE EXAME
    // ========================================

    document
        .querySelectorAll(".exam-button")
        .forEach(function (botao) {

            botao.onclick = function () {

                const docid =
                    this.getAttribute(
                        "data-docid"
                    );


                const aluno =
                    alunos.find(function (a) {

                        return a.id === docid;

                    });


                if (!aluno) {

                    mostrarNotificacao(
                        "Aluno não encontrado.",
                        "erro"
                    );

                    return;
                }


                alunoResultadoExame =
                    aluno;


                const examDate =
                    document.getElementById(
                        "examDate"
                    );


                const examResult =
                    document.getElementById(
                        "examResult"
                    );


                if (examDate) {

                    examDate.value =
                        new Date()
                            .toISOString()
                            .split("T")[0];

                }


                if (examResult) {

                    examResult.value =
                        "Aprovado";

                }


                document.getElementById(
                    "examModal"
                ).style.display = "flex";

            };

        });


    // ========================================
    // EDITAR ALUNO
    // ========================================

    document
        .querySelectorAll(".edit-button")
        .forEach(function (botao) {

            botao.onclick = function () {

                const docid =
                    this.getAttribute(
                        "data-docid"
                    );


                const aluno =
                    alunos.find(function (a) {

                        return a.id === docid;

                    });


                if (!aluno) {

                    mostrarNotificacao(
                        "Aluno não encontrado.",
                        "erro"
                    );

                    return;
                }


                alunoEmEdicao =
                    aluno;


                document.getElementById(
                    "studentNumber"
                ).value =
                    aluno.numero || "";


                document.getElementById(
                    "studentName"
                ).value =
                    aluno.nome || "";


                document.getElementById(
                    "licenceExpiry"
                ).value =
                    aluno.validadeLicenca || "";


                document.getElementById(
                    "codeExpiry"
                ).value =
                    aluno.validadeCodigo || "";


                document.getElementById(
                    "qrCode"
                ).value =
                    aluno.qrCode || "";


                document.getElementById(
                    "studentStatus"
                ).value =
                    aluno.estado || "Ativo";


                document.getElementById(
                    "addStudentButton"
                ).innerText =
                    "💾 Guardar Alterações";


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            };

        });


    // ========================================
    // APAGAR ALUNO
    // ========================================

    document
        .querySelectorAll(".delete-button")
        .forEach(function (botao) {

            botao.onclick = async function () {

                const docid =
                    this.getAttribute(
                        "data-docid"
                    );


                if (
                    !confirm(
                        "Tens a certeza que queres apagar este aluno?"
                    )
                ) {

                    return;

                }


                try {

                    await deleteDoc(
                        doc(
                            db,
                            "alunos",
                            docid
                        )
                    );


                    mostrarNotificacao(
                        "Aluno apagado com sucesso ✅"
                    );

                }

                catch (erro) {

                    mostrarNotificacao(
                        "Erro ao apagar aluno: " +
                        erro.message,
                        "erro"
                    );

                }

            };

        });

}


// ============================================
// DASHBOARD
// ============================================

function atualizarDashboard() {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const totalApproved =
        document.getElementById(
            "totalApproved"
        );


    const alunosAtivos =
        alunos.filter(function (aluno) {

            return aluno.estado === "Ativo";

        });


    const examesAprovados =
        alunos.filter(function (aluno) {

            return (
                aluno.estadoExame ===
                "Aprovado"
            );

        });


    if (totalStudents) {

        totalStudents.innerText =
            alunosAtivos.length;

    }


    if (totalApproved) {

        totalApproved.innerText =
            examesAprovados.length;

    }


    mostrarAlertas();
}


// ============================================
// ALERTAS
// ============================================

function mostrarAlertas() {

    const listaAlertas =
        document.getElementById(
            "alertsList"
        );


    if (!listaAlertas) {
        return;
    }


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


        if (dataValidade < hoje) {

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


    if (alertas.length === 0) {

        listaAlertas.innerHTML = `

            <div class="alert good">

                ✅

                Não existem validades
                a terminar nos próximos 3 meses.

            </div>

        `;

    }

    else {

        listaAlertas.innerHTML =
            alertas.join("");

    }


    const totalAlerts =
        document.getElementById(
            "totalAlerts"
        );


    if (totalAlerts) {

        totalAlerts.innerText =
            alertas.length;

    }
}


// ============================================
// TEORIA COMPLETA
// ============================================

function verificarTeoriaCompleta(aluno) {

    if (
        (aluno.aulasRealizadas || 0) >= 28
    ) {

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

                🎉 TEORIA COMPLETA

                <br>

                ✅ O aluno já pode marcar
                o exame de código.

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


    return new Date(data)
        .toLocaleDateString("pt-PT");
}


// ============================================
// ============================================
// AULAS
// ============================================
// ============================================


// ============================================
// LISTA DE ALUNOS DA AULA
// ============================================

function atualizarListaDaAula() {

    const lista =
        document.getElementById(
            "lessonStudents"
        );


    if (!lista) {
        return;
    }


    if (alunosDaAula.length === 0) {

        lista.innerHTML =
            "Ainda não existem alunos nesta aula.";

        return;
    }


    lista.innerHTML = "";


    alunosDaAula.forEach(function (aluno) {

        const div =
            document.createElement("div");

        div.className =
            "student-card";


        div.innerHTML = `

            <strong>
                ${aluno.numero}
            </strong>

            -
            
            ${aluno.nome}

        `;


        lista.appendChild(div);

    });
}


// ============================================
// ABRIR AULA EXISTENTE
// ============================================

function abrirAula(aula) {

    if (!aula) {

        mostrarNotificacao(
            "Aula não encontrada.",
            "erro"
        );

        return;
    }

    // ========================================
    // GUARDAR AULA QUE ESTAMOS A EDITAR
    // ========================================

    aulaEmEdicao = aula;

    // ========================================
    // LIMPAR LISTA ATUAL
    // ========================================

    alunosDaAula = [];

    // ========================================
    // CARREGAR OS ALUNOS DA AULA
    // ========================================

    (aula.alunos || []).forEach(function (numero) {

        const aluno = alunos.find(function (a) {

            return String(a.numero) === String(numero);

        });

        if (aluno) {

            alunosDaAula.push(aluno);

        }

    });

    // ========================================
    // PREENCHER DADOS DA AULA
    // ========================================

    const campoId =
        document.getElementById("lessonId");

    const campoMateria =
        document.getElementById("lessonSubject");

    const campoData =
        document.getElementById("lessonDate");

    const campoHora =
        document.getElementById("lessonTime");


    if (campoId) {

        campoId.value =
            aula.idAula || "";

    }


    if (campoMateria) {

        campoMateria.value =
            aula.materia || "";

    }


    if (campoData) {

        campoData.value =
            aula.data || "";

    }


    if (campoHora) {

        campoHora.value =
            aula.hora || "";

    }


    // ========================================
    // MOSTRAR OS ALUNOS DA AULA
    // ========================================

    atualizarListaDaAula();


    // ========================================
    // ABRIR PÁGINA DAS AULAS
    // ========================================

    document.getElementById("homePage").style.display =
        "none";

    document.getElementById("studentsPage").style.display =
        "none";

    document.getElementById("lessonsPage").style.display =
        "block";

    document.getElementById("calendarPage").style.display =
        "none";

    document.getElementById("reportsPage").style.display =
        "none";


    // ========================================
    // MENSAGEM
    // ========================================

    mostrarNotificacao(
        "Aula aberta. Podes adicionar alunos por número ou QR Code. ✅"
    );


    // ========================================
    // IR PARA A ZONA DA AULA
    // ========================================

    const formulario =
        document.getElementById("saveLesson");

    if (formulario) {

        setTimeout(function () {

            formulario.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }, 100);

    }

}
    // ========================================
    // PREENCHER FORMULÁRIO
    // ========================================

    const lessonId =
        document.getElementById(
            "lessonId"
        );


    const lessonSubject =
        document.getElementById(
            "lessonSubject"
        );


    const lessonDate =
        document.getElementById(
            "lessonDate"
        );


    const lessonTime =
        document.getElementById(
            "lessonTime"
        );


    if (lessonId) {

        lessonId.value =
            aula.idAula || "";

    }


    if (lessonSubject) {

        lessonSubject.value =
            aula.materia || "";

    }


    if (lessonDate) {

        lessonDate.value =
            aula.data || "";

    }


    if (lessonTime) {

        lessonTime.value =
            aula.hora || "";

    }


    atualizarListaDaAula();


    // ========================================
    // IR PARA PÁGINA DAS AULAS
    // ========================================

    mostrarPagina("lessonsPage");


    mostrarNotificacao(
        "Aula aberta. Podes adicionar os alunos."
    );


    // ========================================
    // IR PARA FORMULÁRIO
    // ========================================

    setTimeout(function () {

        const formulario =
            document.getElementById(
                "saveLesson"
            );


        if (formulario) {

            formulario.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }

    }, 100);

}


// ============================================
// ADICIONAR ALUNO MANUALMENTE À AULA
// ============================================

const addStudentToLesson =
    document.getElementById(
        "addStudentToLesson"
    );


if (addStudentToLesson) {

    addStudentToLesson.addEventListener(
        "click",
        function () {

            const campo =
                document.getElementById(
                    "lessonStudentNumber"
                );


            if (!campo) {
                return;
            }


            const numero =
                campo.value.trim();


            if (numero === "") {

                mostrarNotificacao(
                    "Introduz o número do aluno.",
                    "erro"
                );

                return;
            }


            const aluno =
                alunos.find(function (a) {

                    return (
                        String(a.numero) ===
                        String(numero)
                    );

                });


            if (!aluno) {

                mostrarNotificacao(
                    "Aluno não encontrado.",
                    "erro"
                );

                return;
            }


            const existe =
                alunosDaAula.find(function (a) {

                    return a.id === aluno.id;

                });


            if (existe) {

                mostrarNotificacao(
                    "Este aluno já está nesta aula.",
                    "erro"
                );

                return;
            }


            alunosDaAula.push(aluno);


            campo.value = "";


            atualizarListaDaAula();


            mostrarNotificacao(
                "Aluno adicionado: " +
                aluno.nome
            );

        }
    );
}


// ============================================
// SELECIONAR VÁRIOS ALUNOS
// ============================================

const selectMultipleStudents =
    document.getElementById(
        "selectMultipleStudents"
    );


if (selectMultipleStudents) {

    selectMultipleStudents.addEventListener(
        "click",
        function () {

            const caixa =
                document.getElementById(
                    "multipleStudentsBox"
                );


            const botao =
                document.getElementById(
                    "addSelectedStudents"
                );


            if (!caixa) {
                return;
            }


            caixa.innerHTML = "";


            [...alunos]

                .sort(function (a, b) {

                    return (
                        Number(a.numero) -
                        Number(b.numero)
                    );

                })

                .forEach(function (aluno) {

                    const marcado =
                        alunosDaAula.some(
                            function (a) {

                                return (
                                    a.id ===
                                    aluno.id
                                );

                            }
                        );


                    caixa.innerHTML += `

                        <label
                            style="
                                display:block;
                                margin-bottom:7px;
                                cursor:pointer;
                            "
                        >

                            <input
                                type="checkbox"
                                value="${aluno.numero}"
                                ${
                                    marcado
                                        ? "checked"
                                        : ""
                                }
                            >

                            ${aluno.numero}
                            -
                            ${aluno.nome}

                        </label>

                    `;

                });


            caixa.style.display =
                "block";


            if (botao) {

                botao.style.display =
                    "inline-block";

            }

        }
    );
}


// ============================================
// ADICIONAR ALUNOS SELECIONADOS
// ============================================

const addSelectedStudents =
    document.getElementById(
        "addSelectedStudents"
    );


if (addSelectedStudents) {

    addSelectedStudents.addEventListener(
        "click",
        function () {

            const selecionados =
                document.querySelectorAll(
                    "#multipleStudentsBox input:checked"
                );


            selecionados.forEach(
                function (checkbox) {

                    const numero =
                        checkbox.value;


                    const aluno =
                        alunos.find(function (a) {

                            return (
                                String(a.numero) ===
                                String(numero)
                            );

                        });


                    if (!aluno) {
                        return;
                    }


                    const existe =
                        alunosDaAula.some(
                            function (a) {

                                return (
                                    a.id ===
                                    aluno.id
                                );

                            }
                        );


                    if (!existe) {

                        alunosDaAula.push(
                            aluno
                        );

                    }

                }
            );


            atualizarListaDaAula();


            const caixa =
                document.getElementById(
                    "multipleStudentsBox"
                );


            const botao =
                document.getElementById(
                    "addSelectedStudents"
                );


            if (caixa) {

                caixa.style.display =
                    "none";

            }


            if (botao) {

                botao.style.display =
                    "none";

            }


            mostrarNotificacao(
                "Alunos adicionados à aula."
            );

        }
    );
}


// ============================================
// GUARDAR ALUNOS DA AULA
// ============================================

const saveLesson =
    document.getElementById(
        "saveLesson"
    );


if (saveLesson) {

    saveLesson.addEventListener(
        "click",
        async function () {

            // =================================
            // VERIFICAR SE EXISTE AULA
            // =================================

            if (!aulaEmEdicao) {

                mostrarNotificacao(
                    "Primeiro cria a aula através do calendário.",
                    "erro"
                );

                return;
            }


            // =================================
            // OBTER DADOS
            // =================================

            const idAula =
                document
                    .getElementById("lessonId")
                    .value
                    .trim();


            const materia =
                document
                    .getElementById("lessonSubject")
                    .value
                    .trim();


            const data =
                document
                    .getElementById("lessonDate")
                    .value;


            const hora =
                document
                    .getElementById("lessonTime")
                    .value;


            // =================================
            // VALIDAR
            // =================================

            if (
                idAula === "" ||
                materia === "" ||
                data === "" ||
                hora === ""
            ) {

                mostrarNotificacao(
                    "Preenche todos os dados da aula.",
                    "erro"
                );

                return;
            }


            // =================================
            // NÚMEROS DOS ALUNOS
            // =================================

            const numerosAlunos =
                alunosDaAula.map(
                    function (aluno) {

                        return aluno.numero;

                    }
                );


            try {

                // =================================
                // ALUNOS ANTIGOS
                // =================================

                const alunosAntigos =
                    aulaEmEdicao.alunos || [];


                // =================================
                // ATUALIZAR AULA
                // =================================

                await updateDoc(
                    doc(
                        db,
                        "aulas",
                        aulaEmEdicao.id
                    ),
                    {

                        idAula:
                            idAula,

                        materia:
                            materia,

                        data:
                            data,

                        hora:
                            hora,

                        alunos:
                            numerosAlunos

                    }
                );


                // =================================
                // DETERMINAR NOVOS ALUNOS
                // =================================

                const novosAlunos =
                    alunosDaAula.filter(
                        function (aluno) {

                            return (
                                !alunosAntigos.some(
                                    function (numero) {

                                        return (
                                            String(numero) ===
                                            String(aluno.numero)
                                        );

                                    }
                                )
                            );

                        }
                    );


                // =================================
                // ATUALIZAR CONTADORES
                // APENAS DOS NOVOS ALUNOS
                // =================================

                for (
                    const aluno of novosAlunos
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


                // =================================
                // FINALIZAR
                // =================================

                mostrarNotificacao(
                    "Alunos da aula guardados com sucesso ✅"
                );


                // Atualizar referência local

                aulaEmEdicao = {

                    ...aulaEmEdicao,

                    idAula:
                        idAula,

                    materia:
                        materia,

                    data:
                        data,

                    hora:
                        hora,

                    alunos:
                        numerosAlunos

                };


                renderizarCalendario();


                atualizarListaDaAula();


            }

            catch (erro) {

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

        }
    );
}


// ============================================
// MOSTRAR AULAS
// ============================================

function mostrarAulas() {

    const lista =
        document.getElementById(
            "lessonsList"
        );


    if (!lista) {
        return;
    }


    if (aulas.length === 0) {

        lista.innerHTML =
            "Ainda não existem aulas.";

        return;
    }


    lista.innerHTML = "";


    [...aulas]

        .sort(function (a, b) {

            return (
                new Date(b.data) -
                new Date(a.data)
            );

        })

        .forEach(function (aula) {

            let alunosTexto =
                "Nenhum aluno adicionado.";


            if (
                aula.alunos &&
                aula.alunos.length > 0
            ) {

                alunosTexto = "";


                aula.alunos.forEach(
                    function (numero) {

                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        String(a.numero) ===
                                        String(numero)
                                    );

                                }
                            );


                        if (aluno) {

                            alunosTexto +=
                                "• " +
                                aluno.numero +
                                " - " +
                                aluno.nome +
                                "<br>";

                        }

                        else {

                            alunosTexto +=
                                "• " +
                                numero +
                                "<br>";

                        }

                    }
                );

            }


            const cartao =
                document.createElement("div");


            cartao.className =
                "student-card";


            cartao.innerHTML = `

                <h3>
                    📚 ${aula.idAula || "-"}
                </h3>

                <p>
                    <strong>Matéria:</strong>
                    ${aula.materia || "-"}
                </p>

                <p>
                    <strong>Data:</strong>
                    ${formatarData(aula.data)}
                </p>

                <p>
                    <strong>Hora:</strong>
                    ${aula.hora || "-"}
                </p>

                <p>
                    <strong>Alunos:</strong>
                    ${
                        aula.alunos
                            ? aula.alunos.length
                            : 0
                    }
                </p>

                <p>
                    ${alunosTexto}
                </p>

                <button
                    class="editLessonButton"
                    data-id="${aula.id}"
                >
                    👨‍🎓 Abrir Aula / Alunos
                </button>

                <button
                    class="deleteLessonButton danger-button"
                    data-id="${aula.id}"
                >
                    🗑️ Apagar Aula
                </button>

            `;


            lista.appendChild(cartao);

        });


    adicionarEventosDasAulas();
}


// ============================================
// EVENTOS DAS AULAS
// ============================================

function adicionarEventosDasAulas() {

    // ========================================
    // APAGAR AULA
    // ========================================

    document
        .querySelectorAll(".deleteLessonButton")
        .forEach(function (botao) {

            botao.onclick =
                async function () {

                    const id =
                        this.getAttribute(
                            "data-id"
                        );


                    if (
                        !confirm(
                            "Pretendes apagar esta aula?"
                        )
                    ) {

                        return;

                    }


                    try {

                        const aula =
                            aulas.find(
                                function (a) {

                                    return (
                                        a.id === id
                                    );

                                }
                            );


                        // =================================
                        // DEVOLVER AULAS AOS ALUNOS
                        // =================================

                        if (aula) {

                            for (
                                const numero
                                of (aula.alunos || [])
                            ) {

                                const aluno =
                                    alunos.find(
                                        function (a) {

                                            return (
                                                String(a.numero) ===
                                                String(numero)
                                            );

                                        }
                                    );


                                if (!aluno) {
                                    continue;
                                }


                                const novoHistorico =
                                    (
                                        aluno.historicoAulas ||
                                        []
                                    ).filter(
                                        function (item) {

                                            return (
                                                item !==
                                                aula.idAula
                                            );

                                        }
                                    );


                                await updateDoc(
                                    doc(
                                        db,
                                        "alunos",
                                        aluno.id
                                    ),
                                    {

                                        aulasRealizadas:
                                            Math.max(
                                                (
                                                    aluno.aulasRealizadas ||
                                                    1
                                                ) - 1,
                                                0
                                            ),

                                        historicoAulas:
                                            novoHistorico

                                    }
                                );

                            }

                        }


                        await deleteDoc(
                            doc(
                                db,
                                "aulas",
                                id
                            )
                        );


                        mostrarNotificacao(
                            "Aula apagada com sucesso ✅"
                        );

                    }

                    catch (erro) {

                        mostrarNotificacao(
                            "Erro ao apagar aula: " +
                            erro.message,
                            "erro"
                        );

                    }

                };

        });


    // ========================================
    // ABRIR AULA
    // ========================================

    document
        .querySelectorAll(".editLessonButton")
        .forEach(function (botao) {

            botao.onclick =
                function () {

                    const id =
                        this.getAttribute(
                            "data-id"
                        );


                    const aula =
                        aulas.find(
                            function (a) {

                                return (
                                    a.id === id
                                );

                            }
                        );


                    abrirAula(aula);

                };

        });

}


// ============================================
// QR CODE
// ============================================

const scanButton =
    document.getElementById(
        "scanQRCodeButton"
    );


if (scanButton) {

    scanButton.addEventListener(
        "click",
        function () {

            const reader =
                document.getElementById(
                    "reader"
                );


            if (!reader) {
                return;
            }


            if (
                typeof Html5Qrcode ===
                "undefined"
            ) {

                mostrarNotificacao(
                    "O leitor QR Code não está disponível.",
                    "erro"
                );

                return;
            }


            reader.style.display =
                "block";


            const html5QrCode =
                new Html5Qrcode(
                    "reader"
                );


            html5QrCode.start(

                {
                    facingMode:
                        "environment"
                },

                {
                    fps: 10,
                    qrbox: 250
                },

                function (decodedText) {

                    html5QrCode.stop()
                        .then(function () {

                            reader.style.display =
                                "none";

                        })
                        .catch(function () {

                            reader.style.display =
                                "none";

                        });


                    decodedText =
                        decodedText.trim();


                    const aluno =
                        alunos.find(
                            function (a) {

                                return (

                                    a.idAluno ===
                                    decodedText ||

                                    a.id ===
                                    decodedText ||

                                    String(a.numero) ===
                                    String(decodedText) ||

                                    a.qrCode ===
                                    decodedText

                                );

                            }
                        );


                    if (!aluno) {

                        mostrarNotificacao(
                            "Aluno não encontrado.",
                            "erro"
                        );

                        return;
                    }


                    const existe =
                        alunosDaAula.some(
                            function (a) {

                                return (
                                    a.id ===
                                    aluno.id
                                );

                            }
                        );


                    if (existe) {

                        mostrarNotificacao(
                            "Este aluno já foi adicionado.",
                            "erro"
                        );

                        return;
                    }


                    alunosDaAula.push(
                        aluno
                    );


                    atualizarListaDaAula();


                    mostrarNotificacao(
                        "Aluno adicionado: " +
                        aluno.nome
                    );

                },

                function () {
                    // Ignorar erros de leitura
                }

            ).catch(function (erro) {

                console.error(erro);

                reader.style.display =
                    "none";


                mostrarNotificacao(
                    "Não foi possível abrir a câmara.",
                    "erro"
                );

            });

        }
    );
}


// ============================================
// MENU / PÁGINAS
// ============================================

function mostrarPagina(pagina) {

    const paginas = [

        "homePage",
        "studentsPage",
        "lessonsPage",
        "calendarPage",
        "reportsPage"

    ];


    paginas.forEach(function (id) {

        const elemento =
            document.getElementById(id);


        if (!elemento) {
            return;
        }


        elemento.style.display =
            id === pagina
                ? "block"
                : "none";

    });

}


// ============================================
// MENU INÍCIO
// ============================================

const homeMenu =
    document.getElementById(
        "homeMenu"
    );


if (homeMenu) {

    homeMenu.addEventListener(
        "click",
        function () {

            mostrarPagina(
                "homePage"
            );

        }
    );

}


// ============================================
// MENU ALUNOS
// ============================================

const studentsMenu =
    document.getElementById(
        "studentsMenu"
    );


if (studentsMenu) {

    studentsMenu.addEventListener(
        "click",
        function () {

            mostrarPagina(
                "studentsPage"
            );

            mostrarAlunos();

        }
    );

}


// ============================================
// MENU AULAS
// ============================================

const lessonsMenu =
    document.getElementById(
        "lessonsMenu"
    );


if (lessonsMenu) {

    lessonsMenu.addEventListener(
        "click",
        function () {

            mostrarPagina(
                "lessonsPage"
            );

            mostrarAulas();

        }
    );

}


// ============================================
// MENU CALENDÁRIO
// ============================================

const calendarMenu =
    document.getElementById(
        "calendarMenu"
    );


if (calendarMenu) {

    calendarMenu.addEventListener(
        "click",
        function () {

            mostrarPagina(
                "calendarPage"
            );

            renderizarCalendario();

        }
    );

}


// ============================================
// MENU RELATÓRIOS
// ============================================

const reportsMenu =
    document.getElementById(
        "reportsMenu"
    );


if (reportsMenu) {

    reportsMenu.addEventListener(
        "click",
        function () {

            mostrarPagina(
                "reportsPage"
            );

        }
    );

}


// ============================================
// ============================================
// CALENDÁRIO
// ============================================
// ============================================


// ============================================
// ADICIONAR NOVO MÊS
// ============================================

const addMonthButton =
    document.getElementById(
        "addMonthButton"
    );


if (addMonthButton) {

    addMonthButton.addEventListener(
        "click",
        async function () {

            const nomeMes =
                prompt(
                    "Introduz o mês e o ano.\n\nExemplo: Agosto 2026"
                );


            if (!nomeMes) {
                return;
            }


            try {

                await addDoc(
                    collection(
                        db,
                        "calendarioMeses"
                    ),
                    {

                        nome:
                            nomeMes,

                        criadoEm:
                            new Date()
                                .toISOString()

                    }
                );


                mostrarNotificacao(
                    "Mês adicionado com sucesso ✅"
                );

            }

            catch (erro) {

                mostrarNotificacao(
                    "Erro ao guardar mês: " +
                    erro.message,
                    "erro"
                );

            }

        }
    );
}


// ============================================
// LER MESES
// ============================================

onSnapshot(
    collection(
        db,
        "calendarioMeses"
    ),
    function (snapshot) {

        mesesCalendario = [];


        snapshot.forEach(
            function (documento) {

                mesesCalendario.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        renderizarCalendario();

    }
);


// ============================================
// LER DIAS FECHADOS
// ============================================

onSnapshot(
    collection(
        db,
        "diasFechados"
    ),
    function (snapshot) {

        diasFechados = [];


        snapshot.forEach(
            function (documento) {

                diasFechados.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        renderizarCalendario();

    }
);


// ============================================
// PÁSCOA
// ============================================

function calcularPascoa(ano) {

    const a = ano % 19;

    const b =
        Math.floor(ano / 100);

    const c =
        ano % 100;

    const d =
        Math.floor(b / 4);

    const e =
        b % 4;

    const f =
        Math.floor(
            (b + 8) / 25
        );

    const g =
        Math.floor(
            (b - f + 1) / 3
        );

    const h =
        (
            19 * a +
            b -
            d -
            g +
            15
        ) % 30;

    const i =
        Math.floor(c / 4);

    const k =
        c % 4;

    const l =
        (
            32 +
            2 * e +
            2 * i -
            h -
            k
        ) % 7;

    const m =
        Math.floor(
            (
                a +
                11 * h +
                22 * l
            ) / 451
        );

    const mes =
        Math.floor(
            (
                h +
                l -
                7 * m +
                114
            ) / 31
        );

    const dia =
        (
            (
                h +
                l -
                7 * m +
                114
            ) % 31
        ) + 1;


    return new Date(
        ano,
        mes - 1,
        dia
    );
}


// ============================================
// FERIADOS
// ============================================

function obterFeriados(ano) {

    const feriados = [];


    function adicionar(
        data,
        nome
    ) {

        feriados.push({

            data:
                data,

            nome:
                nome

        });

    }


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


    const pascoa =
        calcularPascoa(ano);


    const sexta =
        new Date(pascoa);


    sexta.setDate(
        pascoa.getDate() - 2
    );


    adicionar(
        sexta,
        "Sexta-feira Santa"
    );


    adicionar(
        new Date(pascoa),
        "Páscoa"
    );


    const corpo =
        new Date(pascoa);


    corpo.setDate(
        pascoa.getDate() + 60
    );


    adicionar(
        corpo,
        "Corpo de Deus"
    );


    return feriados;
}


// ============================================
// OBTER FERIADO
// ============================================

function obterFeriado(
    data,
    feriados
) {

    return feriados.find(
        function (feriado) {

            return (

                feriado.data.getFullYear() ===
                data.getFullYear() &&

                feriado.data.getMonth() ===
                data.getMonth() &&

                feriado.data.getDate() ===
                data.getDate()

            );

        }
    );
}


// ============================================
// DATA YYYY-MM-DD
// ============================================

function obterDataString(
    ano,
    mes,
    dia
) {

    return (

        ano +
        "-" +
        String(mes + 1).padStart(2, "0") +
        "-" +
        String(dia).padStart(2, "0")

    );
}


// ============================================
// DIA FECHADO
// ============================================

function obterDiaFechado(
    dataString
) {

    return diasFechados.find(
        function (dia) {

            return (
                dia.id ===
                dataString
            );

        }
    );
}


// ============================================
// MENU DO DIA
// ============================================

function mostrarMenuDoDia(
    cabecalho
) {

    const menuAnterior =
        document.querySelector(
            ".calendar-day-menu"
        );


    if (menuAnterior) {

        menuAnterior.remove();

    }


    const dataString =
        cabecalho.getAttribute(
            "data-date"
        );


    const feriado =
        cabecalho.getAttribute(
            "data-holiday"
        );


    if (feriado === "true") {

        mostrarNotificacao(
            "Este dia está bloqueado por ser feriado.",
            "erro"
        );

        return;
    }


    const diaFechado =
        obterDiaFechado(
            dataString
        );


    const menu =
        document.createElement(
            "div"
        );


    menu.className =
        "calendar-day-menu";


    menu.style.position =
        "fixed";

    menu.style.zIndex =
        "10000";

    menu.style.background =
        "#ffffff";

    menu.style.border =
        "2px solid #111111";

    menu.style.borderRadius =
        "10px";

    menu.style.padding =
        "10px";

    menu.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.25)";


    const botao =
        document.createElement(
            "button"
        );


    botao.innerHTML =
        diaFechado
            ? "🔓 Reabrir dia"
            : "🔒 Fechar dia inteiro";


    botao.style.display =
        "block";

    botao.style.width =
        "100%";

    botao.style.padding =
        "10px 14px";

    botao.style.border =
        "none";

    botao.style.borderRadius =
        "8px";

    botao.style.background =
        "#FFD500";

    botao.style.color =
        "#111111";

    botao.style.fontWeight =
        "bold";

    botao.style.cursor =
        "pointer";


    botao.onclick =
        async function () {

            menu.remove();


            if (diaFechado) {

                if (
                    !confirm(
                        "Queres reabrir este dia?"
                    )
                ) {

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

                }

                catch (erro) {

                    mostrarNotificacao(
                        "Erro ao reabrir o dia: " +
                        erro.message,
                        "erro"
                    );

                }


                return;
            }


            if (
                !confirm(
                    "Queres fechar este dia inteiro?\n\nNão será possível criar aulas neste dia."
                )
            ) {

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

                        data:
                            dataString,

                        tipo:
                            "FECHADO",

                        criadoEm:
                            new Date()
                                .toISOString()

                    }
                );


                mostrarNotificacao(
                    "Dia fechado com sucesso 🔒"
                );

            }

            catch (erro) {

                mostrarNotificacao(
                    "Erro ao fechar o dia: " +
                    erro.message,
                    "erro"
                );

            }

        };


    menu.appendChild(
        botao
    );


    document.body.appendChild(
        menu
    );


    const rect =
        cabecalho.getBoundingClientRect();


    let left =
        rect.left;


    let top =
        rect.bottom + 5;


    if (
        left + 220 >
        window.innerWidth
    ) {

        left =
            window.innerWidth - 230;

    }


    menu.style.left =
        Math.max(
            left,
            5
        ) + "px";


    menu.style.top =
        top + "px";


    setTimeout(
        function () {

            document.addEventListener(
                "click",
                function fecharMenu(event) {

                    if (
                        !menu.contains(
                            event.target
                        ) &&
                        event.target !==
                            cabecalho
                    ) {

                        menu.remove();

                        document.removeEventListener(
                            "click",
                            fecharMenu
                        );

                    }

                }
            );

        },
        0
    );
}


// ============================================
// CRIAR AULA DIRETAMENTE PELO CALENDÁRIO
// ============================================

async function criarAulaPeloCalendario(
    data,
    hora
) {

    // ========================================
    // PEDIR NÚMERO DA AULA
    // ========================================

    const idAula =
        prompt(
            "N.º da aula:\n\nExemplo: Aula 1"
        );


    if (!idAula) {
        return;
    }


    const idAulaLimpo =
        idAula.trim();


    if (idAulaLimpo === "") {
        return;
    }


    // ========================================
    // PEDIR MATÉRIA
    // ========================================

    const materia =
        prompt(
            "Matéria da aula:"
        );


    if (!materia) {
        return;
    }


    const materiaLimpa =
        materia.trim();


    if (materiaLimpa === "") {
        return;
    }


    // ========================================
    // VERIFICAR SE JÁ EXISTE AULA
    // ========================================

    const existe =
        aulas.find(function (aula) {

            return (
                aula.data === data &&
                aula.hora === hora
            );

        });


    if (existe) {

        abrirAula(existe);

        return;
    }


    // ========================================
    // CRIAR AULA SEM ALUNOS
    // ========================================

    try {

        const novaAula =
            await addDoc(
                collection(
                    db,
                    "aulas"
                ),
                {

                    idAula:
                        idAulaLimpo,

                    materia:
                        materiaLimpa,

                    data:
                        data,

                    hora:
                        hora,

                    alunos:
                        [],

                    criadaEm:
                        new Date()
                            .toISOString()

                }
            );


        mostrarNotificacao(
            "Aula criada no calendário ✅"
        );


        // =====================================
        // ABRIR AULA PARA ADICIONAR ALUNOS
        // =====================================

        const aulaCriada = {

            id:
                novaAula.id,

            idAula:
                idAulaLimpo,

            materia:
                materiaLimpa,

            data:
                data,

            hora:
                hora,

            alunos:
                []

        };


        abrirAula(
            aulaCriada
        );

    }

    catch (erro) {

        console.error(erro);

        mostrarNotificacao(
            "Erro ao criar aula: " +
            erro.message,
            "erro"
        );

    }
}


// ============================================
// RENDERIZAR CALENDÁRIO
// ============================================

function renderizarCalendario() {

    const monthsContainer =
        document.getElementById(
            "monthsContainer"
        );


    if (!monthsContainer) {
        return;
    }


    if (
        mesesCalendario.length === 0
    ) {

        monthsContainer.innerHTML = `

            <div class="calendar-empty">

                📅

                <p>
                    Ainda não existe nenhum mês.
                </p>

                <p>
                    Clica em
                    <strong>
                        ➕ Adicionar novo mês
                    </strong>
                    para começar.
                </p>

            </div>

        `;

        return;
    }


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


    mesesCalendario.forEach(
        function (mes) {

            const partes =
                mes.nome
                    .trim()
                    .split(/\s+/);


            const nomeMesTexto =
                partes[0];


            const ano =
                parseInt(
                    partes[1]
                );


            const mesNumero =
                nomesMeses.indexOf(
                    nomeMesTexto.toLowerCase()
                );


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


            const ultimoDia =
                new Date(
                    ano,
                    mesNumero + 1,
                    0
                ).getDate();


            const feriados =
                obterFeriados(ano);


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

                if (
                    diaSemana === 0
                ) {
                    continue;
                }


                diasUteis.push({

                    numero:
                        dia,

                    data:
                        data,

                    diaSemana:
                        diaSemana,

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

                            <div class="calendar-header">

                                <div class="calendar-time-header">
                                    HORÁRIO
                                </div>

            `;


            diasUteis.forEach(
                function (dia) {

                    let classe =
                        "calendar-day-header";


                    if (
                        dia.feriado
                    ) {

                        classe +=
                            " holiday";

                    }

                    else if (
                        obterDiaFechado(
                            dia.dataString
                        )
                    ) {

                        classe +=
                            " closed-day";

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
                                    ][
                                        dia.diaSemana
                                    ]
                                }

                            </span>

                            ${
                                dia.feriado
                                    ? `
                                        <small>
                                            ${dia.feriado.nome}
                                        </small>
                                      `
                                    :
                                obterDiaFechado(
                                    dia.dataString
                                )
                                    ? `
                                        <small>
                                            FECHADO
                                        </small>
                                      `
                                    :
                                      ""
                            }

                        </div>

                    `;

                }
            );


            html += `

                            </div>

            `;


            horarios.forEach(
                function (horario) {

                    if (
                        horario ===
                        "17:00"
                    ) {

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


                    diasUteis.forEach(
                        function (dia) {

                            const diaFechado =
                                obterDiaFechado(
                                    dia.dataString
                                );


                            // =================================
                            // FERIADO
                            // =================================

                            if (
                                dia.feriado
                            ) {

                                html += `

                                    <div
                                        class="calendar-cell holiday"
                                        data-date="${dia.dataString}"
                                        data-time="${horario}"
                                        data-blocked="holiday"
                                        title="${dia.feriado.nome}"
                                    >

                                        ⬛

                                    </div>

                                `;

                                return;
                            }


                            // =================================
                            // FECHADO
                            // =================================

                            if (
                                diaFechado
                            ) {

                                html += `

                                    <div
                                        class="calendar-cell closed-day"
                                        data-date="${dia.dataString}"
                                        data-time="${horario}"
                                        data-blocked="closed"
                                        title="Dia fechado"
                                    >

                                        🔒

                                    </div>

                                `;

                                return;
                            }


                            // =================================
                            // PROCURAR AULA
                            // =================================

                            const aulaEncontrada =
                                aulas.find(
                                    function (aula) {

                                        return (

                                            aula.data ===
                                            dia.dataString &&

                                            aula.hora ===
                                            horario

                                        );

                                    }
                                );


                            // =================================
                            // EXISTE AULA
                            // =================================

                            if (
                                aulaEncontrada
                            ) {

                                const numeroAlunos =
                                    (
                                        aulaEncontrada.alunos ||
                                        []
                                    ).length;


                                html += `

                                    <div
                                        class="
                                            calendar-cell
                                            lesson-cell
                                            lesson-verde
                                        "
                                        data-date="${dia.dataString}"
                                        data-time="${horario}"
                                        data-lesson-id="${aulaEncontrada.id}"
                                    >

                                        <div class="lesson-number">

                                            ${
                                                aulaEncontrada.idAula ||
                                                "Aula"
                                            }

                                        </div>

                                        <div class="lesson-subject">

                                            ${
                                                aulaEncontrada.materia ||
                                                ""
                                            }

                                        </div>

                                        <div
                                            style="
                                                font-size:11px;
                                                margin-top:4px;
                                            "
                                        >

                                            👨‍🎓
                                            ${numeroAlunos}
                                            ${
                                                numeroAlunos === 1
                                                    ? "aluno"
                                                    : "alunos"
                                            }

                                        </div>

                                    </div>

                                `;

                            }


                            // =================================
                            // CÉLULA VAZIA
                            // =================================

                            else {

                                html += `

                                    <div
                                        class="calendar-cell empty-lesson-cell"
                                        data-date="${dia.dataString}"
                                        data-time="${horario}"
                                    >

                                        <span>
                                            +
                                        </span>

                                    </div>

                                `;

                            }

                        }
                    );


                    html += `

                        </div>

                    `;

                }
            );


            html += `

                        </div>

                    </div>

                </div>

            `;

        }
    );


    monthsContainer.innerHTML =
        html;


    // ========================================
    // CABEÇALHOS DOS DIAS
    // ========================================

    document
        .querySelectorAll(
            ".calendar-day-header"
        )
        .forEach(
            function (cabecalho) {

                cabecalho.onclick =
                    function (event) {

                        event.stopPropagation();

                        mostrarMenuDoDia(
                            this
                        );

                    };

            }
        );


    // ========================================
    // CÉLULAS DO CALENDÁRIO
    // ========================================

    document
        .querySelectorAll(
            ".calendar-cell"
        )
        .forEach(
            function (celula) {

                celula.onclick =
                    async function () {

                        const bloqueado =
                            this.getAttribute(
                                "data-blocked"
                            );


                        // ==========================
                        // FERIADO
                        // ==========================

                        if (
                            bloqueado ===
                            "holiday"
                        ) {

                            mostrarNotificacao(
                                "Este dia está bloqueado por feriado.",
                                "erro"
                            );

                            return;
                        }


                        // ==========================
                        // FECHADO
                        // ==========================

                        if (
                            bloqueado ===
                            "closed"
                        ) {

                            mostrarNotificacao(
                                "Este dia está fechado. Reabre o dia para criares aulas.",
                                "erro"
                            );

                            return;
                        }


                        const data =
                            this.getAttribute(
                                "data-date"
                            );


                        const horario =
                            this.getAttribute(
                                "data-time"
                            );


                        const lessonId =
                            this.getAttribute(
                                "data-lesson-id"
                            );


                        // =================================
                        // EXISTE AULA
                        // =================================

                        if (
                            lessonId
                        ) {

                            const aula =
                                aulas.find(
                                    function (a) {

                                        return (
                                            a.id ===
                                            lessonId
                                        );

                                    }
                                );


                            abrirAula(
                                aula
                            );


                            return;
                        }


                        // =================================
                        // CÉLULA VAZIA
                        // =================================

                        await criarAulaPeloCalendario(
                            data,
                            horario
                        );

                    }
            }
        );

}


// ============================================
// ESTADO DE REPROVAÇÃO
// ============================================

function mostrarEstadoReprovacao(
    aluno
) {

    if (
        !aluno.ultimaReprovacao
    ) {

        return "";

    }


    let html = `

        <p>
            <strong>
                Última reprovação:
            </strong>

            ${formatarData(
                aluno.ultimaReprovacao
            )}

        </p>

    `;


    if (
        (aluno.aulasReprovacaoFeitas || 0) >=
        5
    ) {

        html += `

            <p
                style="
                    color:green;
                    font-weight:bold;
                "
            >

                ✅ Aulas de reprovação
                concluídas (5/5)

            </p>

        `;

    }

    else {

        html += `

            <p
                style="
                    color:#d97706;
                    font-weight:bold;
                "
            >

                📚 Aulas de reprovação:

                ${
                    aluno.aulasReprovacaoFeitas || 0
                }/5

            </p>

        `;

    }


    return html;
}


// ============================================
// MODAL EXAME
// ============================================

const cancelExamResult =
    document.getElementById(
        "cancelExamResult"
    );


if (cancelExamResult) {

    cancelExamResult.onclick =
        function () {

            document.getElementById(
                "examModal"
            ).style.display =
                "none";

        };

}


// ============================================
// GUARDAR RESULTADO EXAME
// ============================================

const saveExamResult =
    document.getElementById(
        "saveExamResult"
    );


if (saveExamResult) {

    saveExamResult.onclick =
        async function () {

            if (!alunoResultadoExame) {

                mostrarNotificacao(
                    "Nenhum aluno selecionado.",
                    "erro"
                );

                return;
            }


            const data =
                document.getElementById(
                    "examDate"
                ).value;


            const resultado =
                document.getElementById(
                    "examResult"
                ).value;


            if (data === "") {

                mostrarNotificacao(
                    "Seleciona a data do exame.",
                    "erro"
                );

                return;
            }


            try {

                const historico =
                    [
                        ...(
                            alunoResultadoExame
                                .historicoExames ||
                            []
                        )
                    ];


                historico.push({

                    data:
                        data,

                    resultado:
                        resultado

                });


                const dadosAtualizar = {

                    estadoExame:
                        resultado,

                    historicoExames:
                        historico

                };


                if (
                    resultado ===
                    "Reprovado"
                ) {

                    dadosAtualizar
                        .ultimaReprovacao =
                            data;


                    dadosAtualizar
                        .aulasNaUltimaReprovacao =
                            alunoResultadoExame
                                .aulasRealizadas ||
                            0;


                    dadosAtualizar
                        .aulasReprovacaoFeitas =
                            0;

                }


                await updateDoc(
                    doc(
                        db,
                        "alunos",
                        alunoResultadoExame.id
                    ),
                    dadosAtualizar
                );


                document.getElementById(
                    "examModal"
                ).style.display =
                    "none";


                mostrarNotificacao(
                    "Resultado do exame guardado com sucesso ✅"
                );

            }

            catch (erro) {

                mostrarNotificacao(
                    "Erro ao guardar: " +
                    erro.message,
                    "erro"
                );

            }

        };

}


// ============================================
// EXPORTAR RELATÓRIO
// ============================================

const exportReportButton =
    document.getElementById(
        "exportReportButton"
    );


if (exportReportButton) {

    exportReportButton.addEventListener(
        "click",
        function () {

            if (
                typeof XLSX ===
                "undefined"
            ) {

                mostrarNotificacao(
                    "A biblioteca Excel não está disponível.",
                    "erro"
                );

                return;
            }


            const livro =
                XLSX.utils.book_new();


            const dadosAlunos =
                alunos.map(
                    function (aluno) {

                        return {

                            "N.º":
                                aluno.numero,

                            "Nome":
                                aluno.nome,

                            "Estado":
                                aluno.estado,

                            "Aulas":
                                aluno.aulasRealizadas || 0,

                            "Exame":
                                aluno.estadoExame,

                            "Validade Licença":
                                aluno.validadeLicenca,

                            "Validade Código":
                                aluno.validadeCodigo

                        };

                    }
                );


            const folhaAlunos =
                XLSX.utils.json_to_sheet(
                    dadosAlunos
                );


            XLSX.utils.book_append_sheet(
                livro,
                folhaAlunos,
                "Alunos"
            );


            const dadosAulas =
                aulas.map(
                    function (aula) {

                        return {

                            "ID da Aula":
                                aula.idAula,

                            "Data":
                                aula.data,

                            "Hora":
                                aula.hora,

                            "Matéria":
                                aula.materia,

                            "Alunos":
                                (
                                    aula.alunos ||
                                    []
                                ).join(", ")

                        };

                    }
                );


            const folhaAulas =
                XLSX.utils.json_to_sheet(
                    dadosAulas
                );


            XLSX.utils.book_append_sheet(
                livro,
                folhaAulas,
                "Aulas"
            );


            XLSX.writeFile(
                livro,
                "Relatorio_English_Check.xlsx"
            );

        }
    );
}


// ============================================
// IMPRIMIR ALUNOS ATIVOS
// ============================================

const printActiveStudentsButton =
    document.getElementById(
        "printActiveStudentsButton"
    );


if (printActiveStudentsButton) {

    printActiveStudentsButton.addEventListener(
        "click",
        function () {

            if (
                !window.jspdf ||
                !window.jspdf.jsPDF
            ) {

                mostrarNotificacao(
                    "A biblioteca PDF não está disponível.",
                    "erro"
                );

                return;
            }


            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF();


            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.setFontSize(18);


            pdf.text(
                "English Check",
                20,
                20
            );


            pdf.setFontSize(14);


            pdf.text(
                "Lista de Alunos Ativos",
                20,
                30
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );


            pdf.setFontSize(10);


            pdf.text(
                "Data: " +
                new Date()
                    .toLocaleDateString("pt-PT"),
                20,
                38
            );


            let y = 50;


            const alunosAtivos =
                [...alunos]

                    .filter(
                        function (aluno) {

                            return (
                                aluno.estado ===
                                "Ativo"
                            );

                        }
                    )

                    .sort(
                        function (a, b) {

                            return (
                                Number(a.numero) -
                                Number(b.numero)
                            );

                        }
                    );


            alunosAtivos.forEach(
                function (aluno, index) {

                    if (
                        y > 275
                    ) {

                        pdf.addPage();

                        y = 20;

                    }


                    pdf.setFont(
                        "helvetica",
                        "bold"
                    );


                    pdf.text(
                        (
                            index + 1
                        ) +
                        ". " +
                        aluno.nome,
                        20,
                        y
                    );


                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );


                    pdf.text(
                        "N.º: " +
                        aluno.numero,
                        25,
                        y + 6
                    );


                    pdf.text(
                        "Aulas: " +
                        (
                            aluno.aulasRealizadas ||
                            0
                        ),
                        70,
                        y + 6
                    );


                    pdf.text(
                        "Exame: " +
                        (
                            aluno.estadoExame ||
                            "Sem exames"
                        ),
                        120,
                        y + 6
                    );


                    y += 18;

                }
            );


            pdf.save(
                "Alunos_Ativos.pdf"
            );

        }
    );
}
