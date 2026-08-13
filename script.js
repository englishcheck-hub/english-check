// ============================================================
// ENGLISH CHECK
// GESTÃO DE AULAS DE CÓDIGO DA ESTRADA
// SCRIPT COMPLETO
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    setDoc,
    doc,
    onSnapshot,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// ============================================================
// FIREBASE
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyDszFM_wU6LDvlsf1lXYzmInRnAgMEdp7w",

    authDomain:
        "english-check-a82ef.firebaseapp.com",

    projectId:
        "english-check-a82ef",

    storageBucket:
        "english-check-a82ef.firebasestorage.app",

    messagingSenderId:
        "524538268036",

    appId:
        "1:524538268036:web:0d8bd3e1cd81a910cbb5d1",

    measurementId:
        "G-F1WCZ9E7KR"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ============================================================
// DADOS
// ============================================================

let alunos = [];
let aulas = [];

let aulaEmEdicao = null;
let alunoResultadoExame = null;

let mesesCalendario = [];
let diasFechados = [];

let mesCalendarioAtual = new Date();


// ============================================================
// UTILITÁRIO
// ============================================================

function $(id) {
    return document.getElementById(id);
}


// ============================================================
// NOTIFICAÇÕES
// ============================================================

function mostrarNotificacao(
    mensagem,
    tipo = "sucesso"
) {

    let notificacao = $("notification");

    if (!notificacao) {

        notificacao =
            document.createElement("div");

        notificacao.id =
            "notification";

        notificacao.style.position =
            "fixed";

        notificacao.style.top =
            "20px";

        notificacao.style.right =
            "20px";

        notificacao.style.zIndex =
            "999999";

        notificacao.style.padding =
            "15px 20px";

        notificacao.style.borderRadius =
            "8px";

        notificacao.style.fontWeight =
            "bold";

        notificacao.style.color =
            "#fff";

        document.body.appendChild(
            notificacao
        );
    }

    notificacao.innerText =
        mensagem;

    notificacao.style.background =
        tipo === "erro"
            ? "#c62828"
            : "#2e7d32";

    notificacao.style.display =
        "block";

    clearTimeout(
        notificacao._timer
    );

    notificacao._timer =
        setTimeout(
            function () {

                notificacao.style.display =
                    "none";

            },
            3000
        );
}


// ============================================================
// UTILIZADORES
// ============================================================

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


// ============================================================
// MATÉRIAS
// ============================================================

const materias = {

    "01":
        "Driver Profile",

    "02":
        "Driver and Physical/Psychological Condition",

    "03":
        "The Driver and Other Road Users",

    "04":
        "Civic Behaviour and Road Safety",

    "05/06":
        "Driving Task, Reaction Time and Distances",

    "07":
        "Alternative Name Used for First Module Tests",

    "08":
        "Hierarchy of Instructions to Traffic Lights",

    "09":
        "Vertical Signs to Warning Signs",

    "10":
        "Regulatory Signs",

    "11":
        "Information Signs",

    "12":
        "Road Markings and Drivers' Signals",

    "13":
        "Starting and Resuming Movement to Reduced Visibility",

    "14":
        "Vehicle Lighting to the Prohibition of Certain Devices",

    "15":
        "Speeds",

    "16":
        "Priorities to Passing Oncoming Vehicles",

    "17":
        "Overtaking to Reversing",

    "18":
        "Stopping and Parking",

    "19":
        "Vehicle Weights, Dimensions and Systems",

    "20":
        "Periodic Inspections to Safety Equipment",

    "21":
        "Road Classification to Driving in Adverse Environmental Conditions",

    "22":
        "Legal Requirements for Driving",

    "23":
        "Liability for Offences to Behaviour in the Event of an Accident",

    "24":
        "Exam Preparation Assessment"

};


// ============================================================
// COR DAS AULAS
// ============================================================

function obterCorAula(numero) {

    if (
        numero === "24"
    ) {

        return "red";

    }

    if (
        [
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23"
        ].includes(numero)
    ) {

        return "yellow";

    }

    return "green";
}


// ============================================================
// LOGIN
// ============================================================

function iniciarLogin() {

    const button =
        $("loginButton");

    const username =
        $("username");

    const password =
        $("password");

    const message =
        $("loginMessage");


    if (!button) {

        console.error(
            "loginButton não encontrado."
        );

        return;

    }


    /*
     * Garante que a aplicação começa escondida.
     */

    if ($("app")) {

        $("app").style.display =
            "none";

    }


    button.onclick =
        function (event) {

            event.preventDefault();

            const user =
                username
                    ? username.value.trim()
                    : "";

            const pass =
                password
                    ? password.value.trim()
                    : "";


            if (message) {

                message.innerText = "";

            }


            if (!user || !pass) {

                if (message) {

                    message.innerText =
                        "Introduz o utilizador e a palavra-passe.";

                    message.style.color =
                        "red";

                }

                return;

            }


            const encontrado =
                utilizadores.find(
                    function (utilizador) {

                        return (
                            utilizador.username === user &&
                            utilizador.password === pass
                        );

                    }
                );


            if (!encontrado) {

                if (message) {

                    message.innerText =
                        "Utilizador ou palavra-passe incorretos.";

                    message.style.color =
                        "red";

                }

                return;

            }


            if ($("loginPage")) {

                $("loginPage").style.display =
                    "none";

            }


            if ($("app")) {

                $("app").style.display =
                    "block";

            }


            if (password) {

                password.value =
                    "";

            }


            if (message) {

                message.innerText =
                    "";

            }


            mostrarPagina(
                "homePage"
            );

            atualizarDashboard();

        };


    if (password) {

        password.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    button.click();

                }

            }
        );

    }

}


// ============================================================
// LOGOUT
// ============================================================

function iniciarLogout() {

    const button =
        $("logoutButton");

    if (!button) {
        return;
    }


    button.onclick =
        function () {

            if ($("app")) {

                $("app").style.display =
                    "none";

            }


            if ($("loginPage")) {

                $("loginPage").style.display =
                    "flex";

            }


            if ($("username")) {

                $("username").value =
                    "";

            }


            if ($("password")) {

                $("password").value =
                    "";

            }


            if ($("loginMessage")) {

                $("loginMessage").innerText =
                    "";

            }

        };

}


// ============================================================
// PÁGINAS
// ============================================================

function mostrarPagina(
    pagina
) {

    const paginas = [

        "homePage",
        "studentsPage",
        "lessonsPage",
        "calendarPage",
        "reportsPage"

    ];


    paginas.forEach(
        function (id) {

            const elemento =
                $(id);

            if (!elemento) {
                return;
            }


            elemento.style.display =
                id === pagina
                    ? "block"
                    : "none";

        }
    );

}


// ============================================================
// MENU
// ============================================================

function configurarMenu() {

    if ($("homeMenu")) {

        $("homeMenu").onclick =
            function () {

                mostrarPagina(
                    "homePage"
                );

                atualizarDashboard();

            };

    }


    if ($("studentsMenu")) {

        $("studentsMenu").onclick =
            function () {

                mostrarPagina(
                    "studentsPage"
                );

                mostrarAlunos();

            };

    }


    if ($("lessonsMenu")) {

        $("lessonsMenu").onclick =
            function () {

                mostrarPagina(
                    "lessonsPage"
                );

                mostrarAulas();

            };

    }


    if ($("calendarMenu")) {

        $("calendarMenu").onclick =
            function () {

                mostrarPagina(
                    "calendarPage"
                );

                renderizarCalendario();

            };

    }


    if ($("reportsMenu")) {

        $("reportsMenu").onclick =
            function () {

                mostrarPagina(
                    "reportsPage"
                );

            };

    }

}


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarData(data) {

    if (!data) {

        return "Not defined";

    }


    const d =
        new Date(
            data + "T00:00:00"
        );


    if (
        isNaN(d.getTime())
    ) {

        return "Invalid date";

    }


    return d.toLocaleDateString(
        "en-GB"
    );

}


// ============================================================
// ADICIONAR ALUNO
// ============================================================

function configurarAdicionarAluno() {

    const button =
        $("addStudentButton");

    if (!button) {
        return;
    }


    button.onclick =
        async function () {

            const numero =
                $("studentNumber")
                    ? $("studentNumber").value.trim()
                    : "";

            const nome =
                $("studentName")
                    ? $("studentName").value.trim()
                    : "";

            const validadeLicenca =
                $("licenceExpiry")
                    ? $("licenceExpiry").value
                    : "";

            const validadeCodigo =
                $("codeExpiry")
                    ? $("codeExpiry").value
                    : "";

            const qrCode =
                $("qrCode")
                    ? $("qrCode").value.trim()
                    : "";

            const estado =
                $("studentStatus")
                    ? $("studentStatus").value
                    : "Ativo";


            if (!numero || !nome) {

                mostrarNotificacao(
                    "Introduz o número e o nome do aluno.",
                    "erro"
                );

                return;

            }


            const numeroExiste =
                alunos.some(
                    function (aluno) {

                        return String(
                            aluno.numero || ""
                        ) === numero;

                    }
                );


            if (numeroExiste) {

                mostrarNotificacao(
                    "Já existe um aluno com esse número.",
                    "erro"
                );

                return;

            }


            try {

                await addDoc(
                    collection(
                        db,
                        "alunos"
                    ),
                    {

                        numero:
                            numero,

                        nome:
                            nome,

                        validadeLicenca:
                            validadeLicenca,

                        validadeCodigo:
                            validadeCodigo,

                        qrCode:
                            qrCode || numero,

                        estado:
                            estado,

                        estadoExame:
                            "",

                        dataExame:
                            "",

                        dataReprovacao:
                            "",

                        criadoEm:
                            new Date().toISOString()

                    }
                );


                if ($("studentNumber"))
                    $("studentNumber").value = "";

                if ($("studentName"))
                    $("studentName").value = "";

                if ($("licenceExpiry"))
                    $("licenceExpiry").value = "";

                if ($("codeExpiry"))
                    $("codeExpiry").value = "";

                if ($("qrCode"))
                    $("qrCode").value = "";

                if ($("studentStatus"))
                    $("studentStatus").value = "Ativo";


                mostrarNotificacao(
                    "Aluno adicionado com sucesso."
                );

            }
            catch (erro) {

                console.error(
                    erro
                );

                mostrarNotificacao(
                    "Erro ao adicionar o aluno.",
                    "erro"
                );

            }

        };

}


// ============================================================
// CONTAGEM DAS AULAS
// ============================================================

function obterContagemAulas(aluno) {

    const numero =
        String(
            aluno.numero || ""
        );


    let total =
        0;

    let posReprovacao =
        0;


    aulas.forEach(
        function (aula) {

            if (
                !Array.isArray(
                    aula.alunos
                )
            ) {

                return;

            }


            const presente =
                aula.alunos.some(
                    function (valor) {

                        return (
                            String(valor) ===
                            numero
                        );

                    }
                );


            if (!presente) {
                return;
            }


            /*
             * AULA REALIZADA TOTAL
             */

            total++;


            /*
             * AULAS DEPOIS DA REPROVAÇÃO
             */

            if (
                aluno.dataReprovacao &&
                aula.data &&
                aula.data >
                    aluno.dataReprovacao
            ) {

                posReprovacao++;

            }

        }
    );


    return {

        total:
            total,

        posReprovacao:
            posReprovacao,

        teoricaCompleta:
            total >= 28,

        posReprovacaoCompleta:
            aluno.dataReprovacao
                ? posReprovacao >= 5
                : false,

        faltamPosReprovacao:
            aluno.dataReprovacao
                ? Math.max(
                    0,
                    5 - posReprovacao
                )
                : 0

    };

}


// ============================================================
// MOSTRAR ALUNOS
// ============================================================

function mostrarAlunos() {

    const lista =
        $("studentsList");

    if (!lista) {
        return;
    }


    const pesquisa =
        $("searchStudent")
            ? $("searchStudent")
                .value
                .trim()
                .toLowerCase()
            : "";


    let resultado =
        alunos.filter(
            function (aluno) {

                const numero =
                    String(
                        aluno.numero || ""
                    ).toLowerCase();

                const nome =
                    String(
                        aluno.nome || ""
                    ).toLowerCase();


                return (
                    !pesquisa ||
                    numero.includes(pesquisa) ||
                    nome.includes(pesquisa)
                );

            }
        );


    resultado.sort(
        function (a, b) {

            return String(
                a.numero || ""
            ).localeCompare(
                String(
                    b.numero || ""
                ),
                undefined,
                {
                    numeric: true
                }
            );

        }
    );


    if (
        resultado.length === 0
    ) {

        lista.innerHTML =
            "<p>No students found.</p>";

        return;

    }


    lista.innerHTML =
        "";


    resultado.forEach(
        function (aluno) {

            const contagem =
                obterContagemAulas(
                    aluno
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "student-card";


            let aulasTexto =
                contagem.teoricaCompleta
                    ? "✅ Teórica completa — 28/28 aulas"
                    : `⏳ ${contagem.total}/28 aulas`;


            let posReprovacao =
                "";


            if (
                aluno.dataReprovacao
            ) {

                if (
                    contagem.posReprovacaoCompleta
                ) {

                    posReprovacao = `
                        <p>
                            <strong>
                                Pós-reprovação:
                            </strong>
                            ${contagem.posReprovacao}/5
                            ✅ Obrigatórias completas
                        </p>
                    `;

                }
                else {

                    posReprovacao = `
                        <p>
                            <strong>
                                Pós-reprovação:
                            </strong>
                            ${contagem.posReprovacao}/5
                            ⏳ Faltam
                            ${contagem.faltamPosReprovacao}
                        </p>
                    `;

                }

            }


            card.innerHTML = `

                <h3>
                    👨‍🎓
                    ${escapeHTML(aluno.numero || "-")}
                    -
                    ${escapeHTML(aluno.nome || "-")}
                </h3>

                <p>
                    <strong>Estado:</strong>
                    ${escapeHTML(aluno.estado || "-")}
                </p>

                <p>
                    <strong>Aulas realizadas:</strong>
                    ${aulasTexto}
                </p>

                ${posReprovacao}

                <p>
                    <strong>Exam:</strong>
                    ${escapeHTML(
                        aluno.estadoExame || "Sem exame"
                    )}
                </p>

                ${
                    aluno.dataExame
                        ? `
                            <p>
                                <strong>Exam date:</strong>
                                ${formatarData(
                                    aluno.dataExame
                                )}
                            </p>
                        `
                        : ""
                }

                ${
                    aluno.dataReprovacao
                        ? `
                            <p>
                                <strong>Failure date:</strong>
                                ${formatarData(
                                    aluno.dataReprovacao
                                )}
                            </p>
                        `
                        : ""
                }

                <p>
                    <strong>
                        License validity:
                    </strong>
                    ${formatarData(
                        aluno.validadeLicenca
                    )}
                </p>

                <p>
                    <strong>
                        Code validity:
                    </strong>
                    ${formatarData(
                        aluno.validadeCodigo
                    )}
                </p>

                <p>
                    <strong>
                        QR Code:
                    </strong>
                    ${escapeHTML(
                        aluno.qrCode ||
                        aluno.numero ||
                        ""
                    )}
                </p>

                <div class="student-actions">

                    <button
                        type="button"
                        class="editStudentButton"
                        data-id="${aluno.id}"
                    >
                        ✏️ Editar ficha
                    </button>

                    <button
                        type="button"
                        class="qrStudentButton"
                        data-id="${aluno.id}"
                    >
                        📱 QR Code
                    </button>

                    <button
                        type="button"
                        class="examStudentButton"
                        data-id="${aluno.id}"
                    >
                        📝 Resultado exame
                    </button>

                    <button
    type="button"
    class="registerLessonStudentButton"
    data-id="${aluno.id}"
>
    📚 Registar aula
</button>

                </div>

                <div
                    class="student-qr"
                    id="qr-${aluno.id}"
                    style="display:none;"
                ></div>

            `;


            lista.appendChild(
                card
            );

        }
    );


    configurarEventosAlunos();

}

// ============================================================
// REGISTAR AULA DIRETAMENTE NA FICHA DO ALUNO
// ============================================================

function abrirRegistoAulaAluno(aluno) {

    if (!aluno) {
        return;
    }

    const overlay =
        document.createElement("div");

    overlay.className =
        "lesson-editor-overlay";

    overlay.style.display =
        "flex";

    const modal =
        document.createElement("div");

    modal.className =
        "lesson-editor-modal";

    // --------------------------------------------------------
    // DATA ATUAL
    // --------------------------------------------------------

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    const dataHoje =
        `${ano}-${mes}-${dia}`;


    // --------------------------------------------------------
    // PRÓXIMA AULA
    // --------------------------------------------------------

    const contagem =
        obterContagemAulas(aluno);

    let proximaAula =
        "";

    if (contagem.total < 24) {

        proximaAula =
            String(
                contagem.total + 1
            ).padStart(
                2,
                "0"
            );

    }
    else {

        proximaAula =
            "24";

    }


    // --------------------------------------------------------
    // HTML
    // --------------------------------------------------------

    modal.innerHTML = `

        <button
            type="button"
            class="close-lesson-editor"
            id="closeRegisterStudentLesson"
        >
            ✕
        </button>

        <h2>
            📚 Registar aula
        </h2>

        <div
            style="
                background:#f5f5f5;
                padding:12px;
                border-radius:8px;
                margin-bottom:15px;
            "
        >

            <strong>
                👨‍🎓 ${escapeHTML(
                    aluno.nome || ""
                )}
            </strong>

            <br>

            Nº
            ${escapeHTML(
                aluno.numero || ""
            )}

            <br>

            Aulas realizadas:
            ${contagem.total}

        </div>


        <label>
            Lesson
        </label>

        <select
            id="registerStudentLesson"
        >

            ${Object.keys(materias)
                .map(
                    function (numero) {

                        return `

                            <option
                                value="${numero}"
                                ${
                                    numero === proximaAula
                                        ? "selected"
                                        : ""
                                }
                            >
                                Lesson ${numero}
                                -
                                ${escapeHTML(
                                    materias[numero]
                                )}
                            </option>

                        `;

                    }
                )
                .join("")
            }

        </select>


        <label>
            Data
        </label>

        <input
            id="registerStudentLessonDate"
            type="date"
            value="${dataHoje}"
        >


        <label>
            Hora
        </label>

        <input
            id="registerStudentLessonTime"
            type="time"
            value=""
        >


        <button
            type="button"
            id="saveStudentLesson"
            style="
                margin-top:15px;
                width:100%;
            "
        >
            💾 Guardar aula
        </button>

    `;


    overlay.appendChild(
        modal
    );

    document.body.appendChild(
        overlay
    );


    // --------------------------------------------------------
    // FECHAR
    // --------------------------------------------------------

    $("closeRegisterStudentLesson").onclick =
        function () {

            overlay.remove();

        };


    // --------------------------------------------------------
    // GUARDAR
    // --------------------------------------------------------

    $("saveStudentLesson").onclick =
        async function () {

            const numero =
                $("registerStudentLesson")
                    .value;

            const data =
                $("registerStudentLessonDate")
                    .value;

            const hora =
                $("registerStudentLessonTime")
                    .value;


            if (
                !numero ||
                !data ||
                !hora
            ) {

                mostrarNotificacao(
                    "Seleciona a Lesson, a data e a hora.",
                    "erro"
                );

                return;

            }


            // ------------------------------------------------
            // VERIFICAR SE JÁ EXISTE UMA AULA IGUAL
            // ------------------------------------------------

            const aulaExistente =
                aulas.some(
                    function (aula) {

                        return (

                            aula.numero ===
                                numero &&

                            aula.data ===
                                data &&

                            aula.hora ===
                                hora &&

                            Array.isArray(
                                aula.alunos
                            ) &&

                            aula.alunos.some(
                                function (n) {

                                    return (
                                        String(n) ===
                                        String(aluno.numero)
                                    );

                                }
                            )

                        );

                    }
                );


            if (aulaExistente) {

                mostrarNotificacao(
                    "Este aluno já está registado nessa aula.",
                    "erro"
                );

                return;

            }


            // ------------------------------------------------
            // DADOS DA AULA
            // ------------------------------------------------

            const dados = {

                numero:
                    numero,

                materia:
                    materias[numero] ||
                    "",

                data:
                    data,

                hora:
                    hora,

                cor:
                    obterCorAula(
                        numero
                    ),

                alunos:
                    [
                        String(
                            aluno.numero
                        )
                    ],

                criadaEm:
                    new Date()
                        .toISOString()

            };


            try {

                await addDoc(
                    collection(
                        db,
                        "aulas"
                    ),
                    dados
                );


                overlay.remove();


                mostrarNotificacao(
                    `Lesson ${numero} registada para ${aluno.nome}.`
                );


                // Atualizar imediatamente
                mostrarAlunos();

                mostrarAulas();

                renderizarCalendario();

                atualizarDashboard();

            }
            catch (erro) {

                console.error(
                    erro
                );

                mostrarNotificacao(
                    "Erro ao registar a aula.",
                    "erro"
                );

            }

        };

}

// ============================================================
// ESCAPAR HTML
// ============================================================

function escapeHTML(valor) {

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================================================
// EVENTOS DOS ALUNOS
// ============================================================

function configurarEventosAlunos() {

    document
        .querySelectorAll(
            ".editStudentButton"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        a.id ===
                                        button.dataset.id
                                    );

                                }
                            );


                        if (aluno) {

                            editarAluno(
                                aluno
                            );

                        }

                    };

            }
        );


    document
        .querySelectorAll(
            ".qrStudentButton"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        a.id ===
                                        button.dataset.id
                                    );

                                }
                            );


                        if (aluno) {

                            mostrarQRCodeAluno(
                                aluno
                            );

                        }

                    };

            }
        );


    document
        .querySelectorAll(
            ".examStudentButton"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        a.id ===
                                        button.dataset.id
                                    );

                                }
                            );


                        if (aluno) {

                            abrirModalExame(
                                aluno
                            );

                        }

                    };

            }
        );

}

document
    .querySelectorAll(
        ".registerLessonStudentButton"
    )
    .forEach(
        function (button) {

            button.onclick =
                function () {

                    const aluno =
                        alunos.find(
                            function (a) {

                                return (
                                    a.id ===
                                    button.dataset.id
                                );

                            }
                        );


                    if (aluno) {

                        abrirRegistoAulaAluno(
                            aluno
                        );

                    }

                };

        }
    );

// ============================================================
// QR CODE DO ALUNO
// ============================================================

function mostrarQRCodeAluno(
    aluno
) {

    const caixa =
        $("qr-" + aluno.id);

    if (!caixa) {
        return;
    }


    if (
        typeof QRCode ===
        "undefined"
    ) {

        caixa.style.display =
            "block";

        caixa.innerHTML =
            "<p>QR Code library not loaded.</p>";

        return;

    }


    if (
        caixa.style.display ===
        "block"
    ) {

        caixa.style.display =
            "none";

        caixa.innerHTML =
            "";

        return;

    }


    caixa.innerHTML =
        "";


    const codigo =
        aluno.qrCode ||
        aluno.numero;


    new QRCode(
        caixa,
        {

            text:
                String(codigo),

            width:
                180,

            height:
                180

        }
    );


    const legenda =
        document.createElement(
            "p"
        );


    legenda.innerHTML = `

        <strong>
            ${escapeHTML(
                aluno.nome || ""
            )}
        </strong>

        <br>

        Nº ${escapeHTML(
            aluno.numero || ""
        )}

    `;


    caixa.appendChild(
        legenda
    );


    caixa.style.display =
        "block";

}


// ============================================================
// PESQUISA
// ============================================================

function configurarPesquisa() {

    const campo =
        $("searchStudent");

    if (!campo) {
        return;
    }


    campo.addEventListener(
        "input",
        function () {

            mostrarAlunos();

        }
    );

}


// ============================================================
// EDITAR ALUNO
// ============================================================

function editarAluno(
    aluno
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "lesson-editor-overlay";


    overlay.style.display =
        "flex";


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "lesson-editor-modal";


    modal.innerHTML = `

        <button
            type="button"
            class="close-lesson-editor"
            id="closeStudentEditor"
        >
            ✕
        </button>

        <h2>
            ✏️ Editar ficha do aluno
        </h2>

        <label>
            N.º de aluno
        </label>

        <input
            id="editStudentNumber"
            type="text"
        >

        <label>
            Nome
        </label>

        <input
            id="editStudentName"
            type="text"
        >

        <label>
            Estado
        </label>

        <select id="editStudentState">

            <option value="Ativo">
                Ativo
            </option>

            <option value="Inativo">
                Inativo
            </option>

        </select>

        <label>
            QR Code / Código do aluno
        </label>

        <input
            id="editStudentQR"
            type="text"
        >

        <label>
            Validade da licença
        </label>

        <input
            id="editLicenseValidity"
            type="date"
        >

        <label>
            Validade do código
        </label>

        <input
            id="editCodeValidity"
            type="date"
        >

        <label>
            Resultado do exame
        </label>

        <select id="editExamResult">

            <option value="">
                Sem exame
            </option>

            <option value="Aprovado">
                Aprovado
            </option>

            <option value="Reprovado">
                Reprovado
            </option>

        </select>

        <label>
            Data do exame
        </label>

        <input
            id="editExamDate"
            type="date"
        >

        <label>
            Data da reprovação
        </label>

        <input
            id="editFailureDate"
            type="date"
        >

        <button
            type="button"
            id="saveStudentChanges"
        >
            💾 Guardar alterações
        </button>

    `;


    overlay.appendChild(
        modal
    );

    document.body.appendChild(
        overlay
    );


    $("editStudentNumber").value =
        aluno.numero || "";

    $("editStudentName").value =
        aluno.nome || "";

    $("editStudentState").value =
        aluno.estado || "Ativo";

    $("editStudentQR").value =
        aluno.qrCode ||
        aluno.numero ||
        "";

    $("editLicenseValidity").value =
        aluno.validadeLicenca || "";

    $("editCodeValidity").value =
        aluno.validadeCodigo || "";

    $("editExamResult").value =
        aluno.estadoExame || "";

    $("editExamDate").value =
        aluno.dataExame || "";

    $("editFailureDate").value =
        aluno.dataReprovacao || "";


    $("closeStudentEditor").onclick =
        function () {

            overlay.remove();

        };


    $("saveStudentChanges").onclick =
        async function () {

            const dados = {

                numero:
                    $("editStudentNumber")
                        .value
                        .trim(),

                nome:
                    $("editStudentName")
                        .value
                        .trim(),

                estado:
                    $("editStudentState")
                        .value,

                qrCode:
                    $("editStudentQR")
                        .value
                        .trim(),

                validadeLicenca:
                    $("editLicenseValidity")
                        .value,

                validadeCodigo:
                    $("editCodeValidity")
                        .value,

                estadoExame:
                    $("editExamResult")
                        .value,

                dataExame:
                    $("editExamDate")
                        .value,

                dataReprovacao:
                    $("editFailureDate")
                        .value

            };


            if (
                !dados.numero ||
                !dados.nome
            ) {

                mostrarNotificacao(
                    "O número e o nome são obrigatórios.",
                    "erro"
                );

                return;

            }


            /*
             * Se o exame for reprovado e existir
             * data de exame, usa essa data como
             * data de reprovação, caso esteja vazia.
             */

            if (
                dados.estadoExame ===
                "Reprovado" &&
                !dados.dataReprovacao &&
                dados.dataExame
            ) {

                dados.dataReprovacao =
                    dados.dataExame;

            }


            /*
             * Se alterar para aprovado,
             * não mantemos uma reprovação antiga.
             */

            if (
                dados.estadoExame ===
                "Aprovado"
            ) {

                dados.dataReprovacao =
                    "";

            }


            try {

                await updateDoc(
                    doc(
                        db,
                        "alunos",
                        aluno.id
                    ),
                    dados
                );


                Object.assign(
                    aluno,
                    dados
                );


                overlay.remove();


                mostrarAlunos();

                atualizarDashboard();


                mostrarNotificacao(
                    "Ficha do aluno atualizada."
                );

            }
            catch (erro) {

                console.error(
                    erro
                );

                mostrarNotificacao(
                    "Erro ao guardar a ficha.",
                    "erro"
                );

            }

        };

}


// ============================================================
// MODAL DE EXAME
// ============================================================

function abrirModalExame(
    aluno
) {

    alunoResultadoExame =
        aluno;


    if (!$("examModal")) {
        return;
    }


    $("examModal").style.display =
        "flex";


    $("examDate").value =
        aluno.dataExame || "";


    $("examResult").value =
        aluno.estadoExame ||
        "Aprovado";

}


// ============================================================
// GUARDAR RESULTADO EXAME
// ============================================================

function configurarExame() {

    if ($("cancelExamResult")) {

        $("cancelExamResult").onclick =
            function () {

                $("examModal").style.display =
                    "none";

                alunoResultadoExame =
                    null;

            };

    }


    if ($("saveExamResult")) {

        $("saveExamResult").onclick =
            async function () {

                if (!alunoResultadoExame) {
                    return;
                }


                const data =
                    $("examDate")
                        ? $("examDate").value
                        : "";

                const resultado =
                    $("examResult")
                        ? $("examResult").value
                        : "";


                if (!data || !resultado) {

                    mostrarNotificacao(
                        "Preenche a data e o resultado.",
                        "erro"
                    );

                    return;

                }


                const dados = {

                    estadoExame:
                        resultado,

                    dataExame:
                        data,

                    dataReprovacao:
                        resultado ===
                        "Reprovado"
                            ? data
                            : ""

                };


                try {

                    await updateDoc(
                        doc(
                            db,
                            "alunos",
                            alunoResultadoExame.id
                        ),
                        dados
                    );


                    Object.assign(
                        alunoResultadoExame,
                        dados
                    );


                    $("examModal").style.display =
                        "none";


                    mostrarAlunos();

                    atualizarDashboard();


                    mostrarNotificacao(
                        "Resultado do exame guardado."
                    );


                    alunoResultadoExame =
                        null;

                }
                catch (erro) {

                    console.error(
                        erro
                    );

                    mostrarNotificacao(
                        "Erro ao guardar o resultado.",
                        "erro"
                    );

                }

            };

    }

}


// ============================================================
// CRIAR / EDITAR AULA
// ============================================================

function abrirEditorAula(
    aula = null
) {

    aulaEmEdicao =
        aula;


    if (!$("lessonEditorOverlay")) {
        return;
    }


    $("lessonEditorOverlay").style.display =
        "flex";


    $("lessonEditorTitle").innerText =
        aula
            ? "✏️ Editar Aula"
            : "📚 Nova Aula";


    $("lessonId").value =
        aula
            ? aula.numero || ""
            : "";


    $("lessonSubject").value =
        aula
            ? aula.materia || ""
            : "";


    $("lessonDate").value =
        aula
            ? aula.data || ""
            : "";


    $("lessonTime").value =
        aula
            ? aula.hora || ""
            : "";


    if (aula) {

        window.alunosDaAula =
            Array.isArray(
                aula.alunos
            )
                ? [...aula.alunos]
                : [];

    }
    else {

        window.alunosDaAula =
            [];

    }


    mostrarAlunosDaAula();

}


// ============================================================
// FECHAR EDITOR
// ============================================================

function fecharEditorAula() {

    if ($("lessonEditorOverlay")) {

        $("lessonEditorOverlay").style.display =
            "none";

    }


    aulaEmEdicao =
        null;


    window.alunosDaAula =
        [];

}


// ============================================================
// MATÉRIA AUTOMÁTICA
// ============================================================

function configurarMaterias() {

    if (!$("lessonId")) {
        return;
    }


    $("lessonId").addEventListener(
        "change",
        function () {

            const numero =
                this.value;


            $("lessonSubject").value =
                materias[numero] ||
                "";

        }
    );

}


// ============================================================
// ADICIONAR ALUNO À AULA
// ============================================================

function adicionarAlunoAula(
    numero
) {

    numero =
        String(
            numero || ""
        ).trim();


    if (!numero) {

        mostrarNotificacao(
            "Introduz o número do aluno.",
            "erro"
        );

        return;

    }


    const aluno =
        alunos.find(
            function (a) {

                return (
                    String(
                        a.numero || ""
                    ) === numero
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


    if (
        !Array.isArray(
            window.alunosDaAula
        )
    ) {

        window.alunosDaAula =
            [];

    }


    if (
        window.alunosDaAula
            .some(
                function (n) {

                    return String(n) ===
                        numero;

                }
            )
    ) {

        mostrarNotificacao(
            "Esse aluno já está na aula.",
            "erro"
        );

        return;

    }


    window.alunosDaAula.push(
        numero
    );


    mostrarAlunosDaAula();


    if ($("lessonStudentNumber")) {

        $("lessonStudentNumber").value =
            "";

    }

}


// ============================================================
// MOSTRAR ALUNOS DA AULA
// ============================================================

function mostrarAlunosDaAula() {

    const lista =
        $("lessonStudents");

    if (!lista) {
        return;
    }


    if (
        !Array.isArray(
            window.alunosDaAula
        ) ||
        window.alunosDaAula.length === 0
    ) {

        lista.innerHTML =
            "Nenhum aluno adicionado.";

        return;

    }


    lista.innerHTML =
        "";


    window.alunosDaAula.forEach(
        function (numero) {

            const aluno =
                alunos.find(
                    function (a) {

                        return String(
                            a.numero || ""
                        ) ===
                            String(numero);

                    }
                );


            const linha =
                document.createElement(
                    "div"
                );


            linha.style.display =
                "flex";

            linha.style.justifyContent =
                "space-between";

            linha.style.alignItems =
                "center";

            linha.style.padding =
                "8px";

            linha.style.marginBottom =
                "5px";

            linha.style.border =
                "1px solid #ddd";

            linha.style.borderRadius =
                "6px";


            linha.innerHTML = `

                <span>
                    👨‍🎓
                    ${escapeHTML(
                        numero
                    )}
                    -
                    ${escapeHTML(
                        aluno
                            ? aluno.nome
                            : "Aluno não encontrado"
                    )}
                </span>

                <button
                    type="button"
                    class="removeLessonStudent"
                    data-number="${escapeHTML(
                        numero
                    )}"
                    style="
                        background:#c62828;
                        color:white;
                        border:none;
                        border-radius:5px;
                        padding:5px 9px;
                        cursor:pointer;
                    "
                    title="Retirar aluno da aula"
                >
                    ✕
                </button>

            `;


            lista.appendChild(
                linha
            );

        }
    );


    lista
        .querySelectorAll(
            ".removeLessonStudent"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        const numero =
                            this.dataset.number;


                        window.alunosDaAula =
                            window.alunosDaAula.filter(
                                function (n) {

                                    return String(n) !==
                                        String(numero);

                                }
                            );


                        mostrarAlunosDaAula();

                    };

            }
        );

}


// ============================================================
// SELECIONAR VÁRIOS ALUNOS
// ============================================================

function abrirSelecaoMultipla() {

    const box =
        $("multipleStudentsBox");

    const button =
        $("addSelectedStudents");

    if (!box || !button) {
        return;
    }


    if (
        box.style.display ===
        "block"
    ) {

        box.style.display =
            "none";

        button.style.display =
            "none";

        return;

    }


    box.innerHTML =
        "";


    alunos
        .filter(
            function (aluno) {

                return aluno.estado !==
                    "Inativo";

            }
        )
        .sort(
            function (a, b) {

                return String(
                    a.numero || ""
                ).localeCompare(
                    String(
                        b.numero || ""
                    ),
                    undefined,
                    {
                        numeric: true
                    }
                );

            }
        )
        .forEach(
            function (aluno) {

                const label =
                    document.createElement(
                        "label"
                    );


                label.style.display =
                    "block";

                label.style.padding =
                    "5px";


                const checked =
                    Array.isArray(
                        window.alunosDaAula
                    ) &&
                    window.alunosDaAula
                        .some(
                            function (n) {

                                return String(n) ===
                                    String(aluno.numero);

                            }
                        );


                label.innerHTML = `

                    <input
                        type="checkbox"
                        class="multipleStudentCheck"
                        value="${escapeHTML(
                            aluno.numero
                        )}"
                        ${checked ? "checked" : ""}
                    >

                    ${escapeHTML(
                        aluno.numero
                    )}
                    -
                    ${escapeHTML(
                        aluno.nome
                    )}

                `;


                box.appendChild(
                    label
                );

            }
        );


    box.style.display =
        "block";

    button.style.display =
        "inline-block";

}


// ============================================================
// ADICIONAR SELECIONADOS
// ============================================================

function adicionarSelecionados() {

    document
        .querySelectorAll(
            ".multipleStudentCheck:checked"
        )
        .forEach(
            function (checkbox) {

                const numero =
                    checkbox.value;


                if (
                    !window.alunosDaAula
                        .some(
                            function (n) {

                                return String(n) ===
                                    String(numero);

                            }
                        )
                ) {

                    window.alunosDaAula.push(
                        numero
                    );

                }

            }
        );


    mostrarAlunosDaAula();


    if ($("multipleStudentsBox")) {

        $("multipleStudentsBox").style.display =
            "none";

    }


    if ($("addSelectedStudents")) {

        $("addSelectedStudents").style.display =
            "none";

    }

}


// ============================================================
// GUARDAR AULA
// ============================================================

async function guardarAula() {

    const numero =
        $("lessonId")
            ? $("lessonId").value
            : "";

    const materia =
        $("lessonSubject")
            ? $("lessonSubject").value
            : "";

    const data =
        $("lessonDate")
            ? $("lessonDate").value
            : "";

    const hora =
        $("lessonTime")
            ? $("lessonTime").value
            : "";


    // --------------------------------------------------------
    // VERIFICAR DADOS DA AULA
    // --------------------------------------------------------

    if (
        !numero ||
        !data ||
        !hora
    ) {

        mostrarNotificacao(
            "Seleciona a aula, a data e a hora.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // ALUNOS
    //
    // A aula pode ser guardada sem alunos.
    // Os alunos podem ser adicionados mais tarde.
    // --------------------------------------------------------

    const alunosDaAula =
        Array.isArray(
            window.alunosDaAula
        )
            ? [...window.alunosDaAula]
            : [];


    // --------------------------------------------------------
    // DADOS DA AULA
    // --------------------------------------------------------

    const dados = {

        numero:
            numero,

        materia:
            materia ||
            materias[numero] ||
            "",

        data:
            data,

        hora:
            hora,

        cor:
            obterCorAula(
                numero
            ),

        alunos:
            alunosDaAula

    };


    // --------------------------------------------------------
    // GUARDAR NO FIREBASE
    // --------------------------------------------------------

    try {

        if (aulaEmEdicao) {

            await updateDoc(
                doc(
                    db,
                    "aulas",
                    aulaEmEdicao.id
                ),
                dados
            );


            mostrarNotificacao(
                "Aula atualizada com sucesso."
            );

        }
        else {

            await addDoc(
                collection(
                    db,
                    "aulas"
                ),
                {

                    ...dados,

                    criadaEm:
                        new Date().toISOString()

                }
            );


            mostrarNotificacao(
                alunosDaAula.length === 0
                    ? "Aula criada sem alunos. Podes adicioná-los mais tarde."
                    : "Aula guardada com sucesso."

            );

        }


        // ----------------------------------------------------
        // FECHAR EDITOR
        // ----------------------------------------------------

        fecharEditorAula();


        // ----------------------------------------------------
        // ATUALIZAR APLICAÇÃO
        // ----------------------------------------------------

        mostrarAulas();

        renderizarCalendario();

        atualizarDashboard();

    }
    catch (erro) {

        console.error(
            erro
        );

        mostrarNotificacao(
            "Erro ao guardar a aula.",
            "erro"
        );

    }

}

// ============================================================
// MOSTRAR AULAS
// ============================================================

function mostrarAulas() {

    const lista =
        $("lessonsList");

    if (!lista) {
        return;
    }


    if (
        aulas.length === 0
    ) {

        lista.innerHTML =
            "Ainda não existem aulas.";

        return;

    }


    const ordenadas =
        [...aulas].sort(
            function (a, b) {

                const dataA =
                    String(
                        a.data || ""
                    ) +
                    String(
                        a.hora || ""
                    );

                const dataB =
                    String(
                        b.data || ""
                    ) +
                    String(
                        b.hora || ""
                    );


                return dataB.localeCompare(
                    dataA
                );

            }
        );


    lista.innerHTML =
        "";


    ordenadas.forEach(
        function (aula) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "lesson-card";


            const cor =
                aula.cor ||
                obterCorAula(
                    aula.numero
                );


            card.style.borderLeft =
                cor === "green"
                    ? "8px solid #2e7d32"
                    : cor === "yellow"
                        ? "8px solid #f9a825"
                        : "8px solid #c62828";


            const alunosTexto =
                Array.isArray(
                    aula.alunos
                )
                    ? aula.alunos.length
                    : 0;


            card.innerHTML = `

                <h3>
                    📚 Lesson ${escapeHTML(
                        aula.numero || ""
                    )}
                </h3>

                <p>
                    <strong>
                        ${escapeHTML(
                            aula.materia || ""
                        )}
                    </strong>
                </p>

                <p>
                    📅 ${formatarData(
                        aula.data
                    )}
                    &nbsp;
                    ⏰ ${escapeHTML(
                        aula.hora || ""
                    )}
                </p>

                <p>
                    👨‍🎓
                    ${alunosTexto}
                    aluno(s)
                </p>

                <div>

                    <button
                        type="button"
                        class="openLessonButton"
                        data-id="${aula.id}"
                    >
                        👁️ Abrir aula
                    </button>

                    <button
                        type="button"
                        class="editLessonButton"
                        data-id="${aula.id}"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        type="button"
                        class="deleteLessonButton"
                        data-id="${aula.id}"
                    >
                        🗑️ Apagar
                    </button>

                </div>

            `;


            lista.appendChild(
                card
            );

        }
    );


    configurarEventosAulas();

}


// ============================================================
// EVENTOS DAS AULAS
// ============================================================

function configurarEventosAulas() {

    document
        .querySelectorAll(
            ".openLessonButton, .editLessonButton"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        const aula =
                            aulas.find(
                                function (a) {

                                    return (
                                        a.id ===
                                        button.dataset.id
                                    );

                                }
                            );


                        if (aula) {

                            abrirEditorAula(
                                aula
                            );

                        }

                    };

            }
        );


    document
        .querySelectorAll(
            ".deleteLessonButton"
        )
        .forEach(
            function (button) {

                button.onclick =
                    async function () {

                        const aula =
                            aulas.find(
                                function (a) {

                                    return (
                                        a.id ===
                                        button.dataset.id
                                    );

                                }
                            );


                        if (!aula) {
                            return;
                        }


                        const confirmar =
                            confirm(
                                "Queres apagar esta aula?"
                            );


                        if (!confirmar) {
                            return;
                        }


                        try {

                            await deleteDoc(
                                doc(
                                    db,
                                    "aulas",
                                    aula.id
                                )
                            );


                            mostrarNotificacao(
                                "Aula apagada."
                            );

                        }
                        catch (erro) {

                            console.error(
                                erro
                            );

                            mostrarNotificacao(
                                "Erro ao apagar a aula.",
                                "erro"
                            );

                        }

                    };

            }
        );

}


// ============================================================
// LEITOR QR CODE
// ============================================================

let scannerQR = null;


async function iniciarScannerQR() {

    const reader =
        $("reader");

    if (!reader) {
        return;
    }


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        mostrarNotificacao(
            "Biblioteca de QR Code não carregada.",
            "erro"
        );

        return;

    }


    reader.style.display =
        "block";


    reader.innerHTML =
        "";


    try {

        scannerQR =
            new Html5Qrcode(
                "reader"
            );


        await scannerQR.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps:
                    10,

                qrbox:
                    250

            },

            function (codigo) {

                codigo =
                    String(
                        codigo || ""
                    ).trim();


                const aluno =
                    alunos.find(
                        function (a) {

                            return (
                                String(
                                    a.qrCode || ""
                                ) === codigo ||
                                String(
                                    a.numero || ""
                                ) === codigo
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


                adicionarAlunoAula(
                    aluno.numero
                );


                pararScannerQR();

            },

            function () {

                // Erros de leitura contínua
                // não precisam de mensagem.

            }

        );

    }
    catch (erro) {

        console.error(
            erro
        );

        mostrarNotificacao(
            "Não foi possível abrir a câmara.",
            "erro"
        );

        pararScannerQR();

    }

}


// ============================================================
// PARAR QR
// ============================================================

async function pararScannerQR() {

    if (scannerQR) {

        try {

            await scannerQR.stop();

        }
        catch (erro) {

            console.warn(
                erro
            );

        }


        try {

            scannerQR.clear();

        }
        catch (erro) {

            console.warn(
                erro
            );

        }


        scannerQR =
            null;

    }


    if ($("reader")) {

        $("reader").style.display =
            "none";

    }

}


// ============================================================
// CONFIGURAR EDITOR DE AULA
// ============================================================

function configurarEditorAula() {

    if ($("closeLessonEditor")) {

        $("closeLessonEditor").onclick =
            function () {

                pararScannerQR();

                fecharEditorAula();

            };

    }


    if ($("addStudentToLesson")) {

        $("addStudentToLesson").onclick =
            function () {

                adicionarAlunoAula(
                    $("lessonStudentNumber")
                        ? $("lessonStudentNumber").value
                        : ""
                );

            };

    }


    if ($("lessonStudentNumber")) {

        $("lessonStudentNumber")
            .addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        $("addStudentToLesson")
                            .click();

                    }

                }
            );

    }


    if ($("selectMultipleStudents")) {

        $("selectMultipleStudents").onclick =
            abrirSelecaoMultipla;

    }


    if ($("addSelectedStudents")) {

        $("addSelectedStudents").onclick =
            adicionarSelecionados;

    }


    if ($("scanQRCodeButton")) {

        $("scanQRCodeButton").onclick =
            function () {

                if (scannerQR) {

                    pararScannerQR();

                }
                else {

                    iniciarScannerQR();

                }

            };

    }


    if ($("saveLesson")) {

        $("saveLesson").onclick =
            guardarAula;

    }


    configurarMaterias();

}

// ============================================================
// CALENDÁRIO MENSAL EM GRELHA
// DIAS NA HORIZONTAL
// HORAS NA VERTICAL
// CLIQUE NUMA CÉLULA = NOVA AULA
// ============================================================

function renderizarCalendario() {

    const container = $("monthsContainer");

    if (!container) {
        return;
    }

    if (aulas.length === 0) {

        container.innerHTML = `
            <div class="calendar-empty">
                📅
                <p>Ainda não existem aulas.</p>
            </div>
        `;

        return;
    }


    // --------------------------------------------------------
    // Agrupar aulas por mês
    // --------------------------------------------------------

    const meses = {};

    aulas.forEach(function (aula) {

        if (!aula.data) {
            return;
        }

        const chave = aula.data.substring(0, 7);

        if (!meses[chave]) {
            meses[chave] = [];
        }

        meses[chave].push(aula);

    });


    const mesesOrdenados =
        Object.keys(meses)
            .sort()
            .reverse();


    container.innerHTML = "";


    // --------------------------------------------------------
    // Criar cada mês
    // --------------------------------------------------------

    mesesOrdenados.forEach(function (chave) {

        const partes = chave.split("-");

        const ano = Number(partes[0]);
        const mes = Number(partes[1]);

        const diasNoMes =
            new Date(
                ano,
                mes,
                0
            ).getDate();


        const nomeMes =
            new Date(
                ano,
                mes - 1,
                1
            ).toLocaleDateString(
                "en-GB",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        // ----------------------------------------------------
// TÍTULO + BOTÃO DE IMPRESSÃO
// ----------------------------------------------------

const tituloLinha =
    document.createElement("div");

tituloLinha.className =
    "calendar-month-title-row";


const titulo =
    document.createElement("h2");

titulo.className =
    "calendar-month-title";

titulo.innerHTML =
    `📅 ${nomeMes}`;


// ----------------------------------------------------
// BOTÃO "IMPRIMIR HORÁRIO"
// ----------------------------------------------------

const botaoImprimir =
    document.createElement("button");

botaoImprimir.type =
    "button";

botaoImprimir.className =
    "print-schedule-button";

botaoImprimir.innerHTML =
    "🖨️ Imprimir horário";


botaoImprimir.onclick =
    function () {

        imprimirHorario(
            wrapper
        );

    };


tituloLinha.appendChild(
    titulo
);

tituloLinha.appendChild(
    botaoImprimir
);

container.appendChild(
    tituloLinha
);

        // ----------------------------------------------------
        // WRAPPER
        // ----------------------------------------------------

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "calendar-table-wrapper";


        // ----------------------------------------------------
        // TABELA
        // ----------------------------------------------------

        const tabela =
            document.createElement("table");

        tabela.className =
            "monthly-schedule";


        // ----------------------------------------------------
        // CABEÇALHO
        // ----------------------------------------------------

        const thead =
            document.createElement("thead");

        const header =
            document.createElement("tr");


        const thHora =
            document.createElement("th");

        thHora.className =
            "schedule-time-header";

        thHora.innerText =
            "TIME";

        header.appendChild(
            thHora
        );


        for (
            let dia = 1;
            dia <= diasNoMes;
            dia++
        ) {

            const th =
                document.createElement("th");

            th.className =
                "schedule-day-header";


            const dataDia =
                new Date(
                    ano,
                    mes - 1,
                    dia
                );


            const diaSemana =
                dataDia.toLocaleDateString(
                    "en-GB",
                    {
                        weekday: "short"
                    }
                );


            th.innerHTML = `

                <strong>
                    ${String(dia).padStart(2, "0")}
                </strong>

                <small>
                    ${diaSemana}
                </small>

            `;


            header.appendChild(
                th
            );

        }


        thead.appendChild(
            header
        );

        tabela.appendChild(
            thead
        );


        // ----------------------------------------------------
        // CORPO DA GRELHA
        // ----------------------------------------------------

        const tbody =
            document.createElement("tbody");


        /*
         * Horário da escala.
         *
         * Das 09:00 às 20:00.
         */

        const horaInicio = 9;
        const horaFim = 20;


        for (
            let hora = horaInicio;
            hora <= horaFim;
            hora++
        ) {

            const tr =
                document.createElement("tr");


            // ------------------------------------------------
            // HORA
            // ------------------------------------------------

            const tdHora =
                document.createElement("td");

            tdHora.className =
                "schedule-time";

            tdHora.innerText =
                String(hora).padStart(2, "0") +
                ":00";

            tr.appendChild(
                tdHora
            );


            // ------------------------------------------------
            // DIAS
            // ------------------------------------------------

            for (
                let dia = 1;
                dia <= diasNoMes;
                dia++
            ) {

                const td =
                    document.createElement("td");

                td.className =
                    "schedule-cell";


                const dataString =
                    ano +
                    "-" +
                    String(mes).padStart(2, "0") +
                    "-" +
                    String(dia).padStart(2, "0");


                // ------------------------------------------------
                // TODAS AS AULAS DESTE DIA/HORA
                // ------------------------------------------------

                const aulasDoHorario =
                    meses[chave].filter(
                        function (aula) {

                            if (
                                aula.data !==
                                dataString
                            ) {
                                return false;
                            }


                            if (!aula.hora) {
                                return false;
                            }


                            const horaAula =
                                parseInt(
                                    String(
                                        aula.hora
                                    ).substring(
                                        0,
                                        2
                                    ),
                                    10
                                );


                            return (
                                horaAula ===
                                hora
                            );

                        }
                    );


                // ------------------------------------------------
                // CÉLULA VAZIA
                // ------------------------------------------------

                if (
                    aulasDoHorario.length === 0
                ) {

                    td.classList.add(
                        "empty-schedule-cell"
                    );


                    td.title =
                        "Clique para adicionar uma aula";


                    /*
                     * CLIQUE NA CÉLULA
                     */

                    td.onclick =
                        function () {

                            abrirNovaAulaPeloCalendario(
                                dataString,
                                hora
                            );

                        };


                    /*
                     * Sinal visual "+"
                     */

                    td.innerHTML = `
                        <span class="add-hour-symbol">
                            +
                        </span>
                    `;

                }


                // ------------------------------------------------
                // AULAS EXISTENTES
                // ------------------------------------------------

                aulasDoHorario.forEach(
                    function (aula) {

                        const aulaDiv =
                            document.createElement(
                                "div"
                            );


                        aulaDiv.className =
                            "schedule-lesson";


                        const cor =
                            aula.cor ||
                            obterCorAula(
                                aula.numero
                            );


                        if (
                            cor === "green"
                        ) {

                            aulaDiv.classList.add(
                                "lesson-green"
                            );

                        }
                        else if (
                            cor === "yellow"
                        ) {

                            aulaDiv.classList.add(
                                "lesson-yellow"
                            );

                        }
                        else if (
                            cor === "red"
                        ) {

                            aulaDiv.classList.add(
                                "lesson-red"
                            );

                        }


                        const quantidade =
                            Array.isArray(
                                aula.alunos
                            )
                                ? aula.alunos.length
                                : 0;


                        aulaDiv.innerHTML = `

                            <strong>
                                Lesson
                                ${escapeHTML(
                                    aula.numero || ""
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    aula.hora || ""
                                )}
                            </span>

                            <small>
                                ${escapeHTML(
                                    aula.materia || ""
                                )}
                            </small>

                            <small>
                                👨‍🎓
                                ${quantidade}
                            </small>

                        `;


                        /*
                         * Clicar na aula existente
                         * abre para edição.
                         */

                        aulaDiv.onclick =
                            function (event) {

                                event.stopPropagation();

                                abrirEditorAula(
                                    aula
                                );

                            };


                        td.appendChild(
                            aulaDiv
                        );

                    }
                );


                tr.appendChild(
                    td
                );

            }


            tbody.appendChild(
                tr
            );

        }


        tabela.appendChild(
            tbody
        );


        wrapper.appendChild(
            tabela
        );


        container.appendChild(
            wrapper
        );

    });

}

// ============================================================
// IMPRIMIR HORÁRIO
// ============================================================

function imprimirHorario(wrapper) {

    const tabela =
        wrapper.querySelector(".monthly-schedule");

    if (!tabela) {
        return;
    }


    const janela =
        window.open(
            "",
            "_blank"
        );

    if (!janela) {
        alert(
            "Não foi possível abrir a janela de impressão."
        );
        return;
    }


    janela.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>Horário</title>

            <style>

                @page {
                    size: A4 landscape;
                    margin: 8mm;
                }


                * {
                    box-sizing: border-box;
                }


                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                    font-family: Arial, sans-serif;
                }


                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }


                th,
                td {
                    border: 1px solid #000;
                    text-align: center;
                    vertical-align: middle;
                }


                th {
                    background: #111;
                    color: white;
                    height: 35px;
                    font-size: 9px;
                }


                td {
                    height: 45px;
                    font-size: 8px;
                }


                .schedule-time-header,
                .schedule-time {
                    width: 45px;
                }


                .schedule-lesson {
                    padding: 2px;
                    font-size: 7px;
                }


                .schedule-lesson strong,
                .schedule-lesson span,
                .schedule-lesson small {
                    display: block;
                }


                .schedule-lesson strong {
                    font-size: 8px;
                }


                .schedule-lesson span {
                    font-size: 7px;
                }


                .schedule-lesson small {
                    font-size: 6px;
                }


                .empty-schedule-cell {
                    background: white !important;
                }


                .add-hour-symbol {
                    display: none;
                }


                .lesson-green {
                    background: #b7e1b0 !important;
                }


                .lesson-yellow {
                    background: #ffe680 !important;
                }


                .lesson-red {
                    background: #ff9999 !important;
                }

            </style>

        </head>


        <body>

            ${tabela.outerHTML}

        </body>

        </html>
    `);


    janela.document.close();


    janela.onload =
        function () {

            janela.focus();

            janela.print();

            janela.close();

        };

}

// ============================================================
// NOVA AULA A PARTIR DO CALENDÁRIO
// ============================================================

function abrirNovaAulaPeloCalendario(
    data,
    hora
) {

    /*
     * Abrir o editor normal
     */

    abrirEditorAula();


    /*
     * Preencher automaticamente a data
     */

    if ($("lessonDate")) {

        $("lessonDate").value =
            data;

    }


    /*
     * Preencher automaticamente a hora
     */

    if ($("lessonTime")) {

        $("lessonTime").value =
            String(hora).padStart(2, "0") +
            ":00";

    }


    /*
     * Garantir que começa sem alunos
     */

    window.alunosDaAula =
        [];


    mostrarAlunosDaAula();

}

// ============================================================
// DASHBOARD
// ============================================================

function atualizarDashboard() {

    const ativos =
        alunos.filter(
            function (aluno) {

                return (
                    aluno.estado ===
                    "Ativo"
                );

            }
        );


    const aprovados =
        alunos.filter(
            function (aluno) {

                return (
                    aluno.estadoExame ===
                    "Aprovado"
                );

            }
        );


    if ($("totalStudents")) {

        $("totalStudents").innerText =
            ativos.length;

    }


    if ($("totalApproved")) {

        $("totalApproved").innerText =
            aprovados.length;

    }


    mostrarAlertas();

}


// ============================================================
// ALERTAS
// ============================================================

function mostrarAlertas() {

    const lista =
        $("alertsList");

    if (!lista) {
        return;
    }


    const hoje =
        new Date();


    hoje.setHours(
        0,
        0,
        0,
        0
    );


    const limite =
        new Date(
            hoje
        );


    limite.setMonth(
        limite.getMonth() + 3
    );


    const alertas =
        [];


    alunos.forEach(
        function (aluno) {

            verificarValidade(
                aluno,
                aluno.validadeLicenca,
                "License validity"
            );


            verificarValidade(
                aluno,
                aluno.validadeCodigo,
                "Code validity"
            );

        }
    );


    function verificarValidade(
        aluno,
        data,
        tipo
    ) {

        if (!data) {
            return;
        }


        const validade =
            new Date(
                data + "T00:00:00"
            );


        if (
            isNaN(
                validade.getTime()
            )
        ) {

            return;

        }


        if (
            validade < hoje
        ) {

            alertas.push(`

                <div class="alert expired">

                    🔴

                    <strong>
                        ${escapeHTML(
                            aluno.nome || "Aluno"
                        )}
                    </strong>

                    <br>

                    ${tipo}
                    expired.

                </div>

            `);

        }
        else if (
            validade <= limite
        ) {

            alertas.push(`

                <div class="alert">

                    ⚠️

                    <strong>
                        ${escapeHTML(
                            aluno.nome || "Aluno"
                        )}
                    </strong>

                    <br>

                    ${tipo}
                    expires on
                    ${formatarData(data)}.

                </div>

            `);

        }

    }


    if (
        alertas.length === 0
    ) {

        lista.innerHTML = `

            <div class="alert good">

                ✅
                No license or code
                validity alerts.

            </div>

        `;

    }
    else {

        lista.innerHTML =
            alertas.join("");

    }


    if ($("totalAlerts")) {

        $("totalAlerts").innerText =
            alertas.length;

    }

}


// ============================================================
// RELATÓRIOS
// ============================================================

function configurarRelatorios() {

    if ($("exportReportButton")) {

        $("exportReportButton").onclick =
            exportarRelatorio;

    }


    if ($("printActiveStudentsButton")) {

        $("printActiveStudentsButton").onclick =
            imprimirAlunosAtivos;

    }

}


// ============================================================
// EXPORTAR EXCEL
// ============================================================

function exportarRelatorio() {

    if (
        typeof XLSX ===
        "undefined"
    ) {

        mostrarNotificacao(
            "Biblioteca Excel não carregada.",
            "erro"
        );

        return;

    }


    const dados =
        alunos.map(
            function (aluno) {

                const contagem =
                    obterContagemAulas(
                        aluno
                    );


                return {

                    "Student Number":
                        aluno.numero || "",

                    "Name":
                        aluno.nome || "",

                    "Status":
                        aluno.estado || "",

                    "License Validity":
                        aluno.validadeLicenca || "",

                    "Code Validity":
                        aluno.validadeCodigo || "",

                    "Exam Result":
                        aluno.estadoExame || "",

                    "Exam Date":
                        aluno.dataExame || "",

                    "Failure Date":
                        aluno.dataReprovacao || "",

                    "Lessons Completed":
                        contagem.total,

                    "Theory Complete":
                        contagem.teoricaCompleta
                            ? "YES"
                            : "NO",

                    "Lessons After Failure":
                        contagem.posReprovacao,

                    "Mandatory After Failure":
                        aluno.dataReprovacao
                            ? 5
                            : 0,

                    "Remaining After Failure":
                        contagem.faltamPosReprovacao

                };

            }
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            dados
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Students"
    );


    XLSX.writeFile(
        workbook,
        "english-check-report.xlsx"
    );


    mostrarNotificacao(
        "Relatório exportado."
    );

}


// ============================================================
// IMPRIMIR ALUNOS ATIVOS
// ============================================================

function imprimirAlunosAtivos() {

    const ativos =
        alunos.filter(
            function (aluno) {

                return (
                    aluno.estado ===
                    "Ativo"
                );

            }
        );


    let html = `

        <html>

        <head>

            <title>
                English Check - Active Students
            </title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    border: 1px solid #333;
                    padding: 8px;
                }

                th {
                    background: #eee;
                }

            </style>

        </head>

        <body>

            <h1>
                English Check
            </h1>

            <h2>
                Active Students
            </h2>

            <table>

                <tr>

                    <th>
                        Number
                    </th>

                    <th>
                        Name
                    </th>

                    <th>
                        Lessons
                    </th>

                    <th>
                        Theory
                    </th>

                </tr>

    `;


    ativos.forEach(
        function (aluno) {

            const contagem =
                obterContagemAulas(
                    aluno
                );


            html += `

                <tr>

                    <td>
                        ${escapeHTML(
                            aluno.numero || ""
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            aluno.nome || ""
                        )}
                    </td>

                    <td>
                        ${contagem.total}/28
                    </td>

                    <td>
                        ${
                            contagem.teoricaCompleta
                                ? "Complete"
                                : "Incomplete"
                        }
                    </td>

                </tr>

            `;

        }
    );


    html += `

            </table>

        </body>

        </html>

    `;


    const janela =
        window.open(
            "",
            "_blank"
        );


    if (!janela) {

        mostrarNotificacao(
            "O navegador bloqueou a janela de impressão.",
            "erro"
        );

        return;

    }


    janela.document.write(
        html
    );

    janela.document.close();

    janela.focus();

    setTimeout(
        function () {

            janela.print();

        },
        500
    );

}


// ============================================================
// FIREBASE - ALUNOS
// ============================================================

onSnapshot(

    collection(
        db,
        "alunos"
    ),

    function (snapshot) {

        alunos =
            [];


        snapshot.forEach(
            function (documento) {

                alunos.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        atualizarDashboard();

        mostrarAlunos();

        mostrarAulas();

        renderizarCalendario();

    },

    function (erro) {

        console.error(
            "Erro ao carregar alunos:",
            erro
        );


        mostrarNotificacao(
            "Erro ao carregar os alunos do Firebase.",
            "erro"
        );

    }

);


// ============================================================
// FIREBASE - AULAS
// ============================================================

onSnapshot(

    collection(
        db,
        "aulas"
    ),

    function (snapshot) {

        aulas =
            [];


        snapshot.forEach(
            function (documento) {

                aulas.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        mostrarAulas();

        renderizarCalendario();

        atualizarDashboard();

    },

    function (erro) {

        console.error(
            "Erro ao carregar aulas:",
            erro
        );


        mostrarNotificacao(
            "Erro ao carregar as aulas do Firebase.",
            "erro"
        );

    }

);


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Muito importante:
         * começa sempre no login.
         */

        if ($("loginPage")) {

            $("loginPage").style.display =
                "flex";

        }


        if ($("app")) {

            $("app").style.display =
                "none";

        }


        iniciarLogin();

        iniciarLogout();

        configurarMenu();

        configurarAdicionarAluno();

        configurarPesquisa();

        configurarEditorAula();

        configurarExame();

        configurarRelatorios();

        configurarAdicionarMes();


        mostrarPagina(
            "homePage"
        );


        console.log(
            "English Check iniciado corretamente."
        );

    }
);
