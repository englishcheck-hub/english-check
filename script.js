// ============================================================
// ENGLISH CHECK
// GESTÃO DE AULAS DE CÓDIGO DA ESTRADA
// SCRIPT COMPLETO
// ============================================================


// ============================================================
// FIREBASE
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
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// ============================================================
// CONFIGURAÇÃO FIREBASE
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
let alunosDaAula = [];
let aulaEmEdicao = null;

let mesesCalendario = [];
let diasFechados = [];

let mesCalendarioAtual = new Date();

let alunoResultadoExame = null;


// ============================================================
// FUNÇÃO $
// ============================================================

function $(id) {
    return document.getElementById(id);
}


// ============================================================
// NOTIFICAÇÃO
// ============================================================

function mostrarNotificacao(
    mensagem,
    tipo = "sucesso"
) {

    let notificacao =
        document.getElementById(
            "notification"
        );

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
            "99999";

        notificacao.style.padding =
            "15px 20px";

        notificacao.style.borderRadius =
            "8px";

        notificacao.style.fontWeight =
            "bold";

        notificacao.style.background =
            "#222";

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


    if (
        !button ||
        !username ||
        !password
    ) {

        console.error(
            "Elementos do login não encontrados."
        );

        return;
    }


    button.onclick =
        function (event) {

            event.preventDefault();


            const user =
                username.value
                    .trim();

            const pass =
                password.value
                    .trim();


            if (message) {
                message.innerHTML = "";
            }


            if (
                !user ||
                !pass
            ) {

                if (message) {

                    message.innerHTML =
                        "Introduz o utilizador e a palavra-passe.";

                    message.style.color =
                        "red";
                }

                return;
            }


            const encontrado =
                utilizadores.find(
                    function (u) {

                        return (
                            u.username === user &&
                            u.password === pass
                        );

                    }
                );


            if (!encontrado) {

                if (message) {

                    message.innerHTML =
                        "Utilizador ou palavra-passe incorretos.";

                    message.style.color =
                        "red";
                }

                return;
            }


            const loginPage =
                $("loginPage");

            const appPage =
                $("app");


            if (loginPage) {
                loginPage.style.display =
                    "none";
            }


            if (appPage) {
                appPage.style.display =
                    "block";
            }


            password.value = "";


            if (message) {
                message.innerHTML = "";
            }


            mostrarPagina(
                "homePage"
            );

            atualizarDashboard();

        };


    password.onkeydown =
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                button.click();

            }

        };

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
                $("username").value = "";
            }


            if ($("password")) {
                $("password").value = "";
            }


            if ($("loginMessage")) {
                $("loginMessage").innerHTML =
                    "";
            }

        };

}


// ============================================================
// MENU
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
// CONFIGURAR MENU
// ============================================================

function configurarMenu() {

    const menus = {

        homeMenu:
            function () {

                mostrarPagina(
                    "homePage"
                );

                atualizarDashboard();

            },


        studentsMenu:
            function () {

                mostrarPagina(
                    "studentsPage"
                );

                mostrarAlunos();

            },


        lessonsMenu:
            function () {

                mostrarPagina(
                    "lessonsPage"
                );

                mostrarAulas();

            },


        calendarMenu:
            function () {

                mostrarPagina(
                    "calendarPage"
                );

                renderizarCalendario();

            },


        reportsMenu:
            function () {

                mostrarPagina(
                    "reportsPage"
                );

            }

    };


    Object.keys(menus)
        .forEach(
            function (id) {

                const button =
                    $(id);

                if (!button) {
                    return;
                }


                button.onclick =
                    menus[id];

            }
        );

}


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarData(
    data
) {

    if (!data) {
        return "Não definida";
    }


    const d =
        new Date(
            data + "T00:00:00"
        );


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return "Data inválida";
    }


    return d.toLocaleDateString(
        "pt-PT"
    );

}


// ============================================================
// LER ALUNOS DO FIREBASE
// ============================================================

onSnapshot(

    collection(
        db,
        "alunos"
    ),

    function (snapshot) {

        alunos = [];


        snapshot.forEach(
            function (documento) {

                alunos.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        console.log(
            "Alunos carregados:",
            alunos
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

    }

);


// ============================================================
// LER AULAS DO FIREBASE
// ============================================================

onSnapshot(

    collection(
        db,
        "aulas"
    ),

    function (snapshot) {

        aulas = [];


        snapshot.forEach(
            function (documento) {

                aulas.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        console.log(
            "Aulas carregadas:",
            aulas
        );


        mostrarAulas();
        renderizarCalendario();

    },

    function (erro) {

        console.error(
            "Erro ao carregar aulas:",
            erro
        );

    }

);


// ============================================================
// DASHBOARD
// ============================================================

function atualizarDashboard() {

    if (
        !Array.isArray(alunos)
    ) {
        return;
    }


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

        $("totalStudents")
            .innerText =
            ativos.length;

    }


    if ($("totalApproved")) {

        $("totalApproved")
            .innerText =
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


    if (
        !lista ||
        !Array.isArray(alunos)
    ) {
        return;
    }


    const hoje =
        new Date();


    const limite =
        new Date();


    limite.setMonth(
        limite.getMonth() + 3
    );


    const alertas = [];


    alunos.forEach(
        function (aluno) {

            verificar(
                aluno,
                aluno.validadeLicenca,
                "Licença de aprendizagem"
            );


            verificar(
                aluno,
                aluno.validadeCodigo,
                "Validade do código"
            );

        }
    );


    function verificar(
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
                        ${aluno.nome || "Aluno"}
                    </strong>

                    <br>

                    ${tipo} já expirou.

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
                        ${aluno.nome || "Aluno"}
                    </strong>

                    <br>

                    ${tipo} termina em breve:
                    ${formatarData(data)}

                </div>

            `);

        }

    }


    if (
        alertas.length === 0
    ) {

        lista.innerHTML = `

            <div class="alert good">

                ✅ Não existem validades
                a terminar nos próximos 3 meses.

            </div>

        `;

    }
    else {

        lista.innerHTML =
            alertas.join("");

    }


    if ($("totalAlerts")) {

        $("totalAlerts")
            .innerText =
            alertas.length;

    }

}


// ============================================================
// CONTAGEM DAS AULAS
// ============================================================

function obterAulasRealizadas(
    aluno
) {

    if (!aluno) {
        return 0;
    }


    const numero =
        String(
            aluno.numero || ""
        );


    let total = 0;


    aulas.forEach(
        function (aula) {

            if (
                !Array.isArray(
                    aula.alunos
                )
            ) {
                return;
            }


            const esteve =
                aula.alunos.some(
                    function (n) {

                        return String(n) ===
                            numero;

                    }
                );


            if (!esteve) {
                return;
            }


            /*
             * Se houver data de reprovação,
             * só contamos as aulas posteriores.
             */

            if (
                aluno.dataReprovacao
            ) {

                if (
                    !aula.data ||
                    aula.data <=
                    aluno.dataReprovacao
                ) {

                    return;
                }

            }


            total++;

        }
    );


    return total;

}


// ============================================================
// TOTAL DE AULAS
// ============================================================

function atualizarContagemAulasAluno(
    aluno
) {

    const total =
        obterAulasRealizadas(
            aluno
        );


    aluno.aulasRealizadas =
        total;


    /*
     * Depois de 28 aulas,
     * a formação teórica fica completa.
     */

    if (
        total >= 28
    ) {

        aluno.teoricaCompleta =
            true;

    }
    else {

        aluno.teoricaCompleta =
            false;

    }


    /*
     * Após reprovação:
     * são obrigatórias 5 aulas.
     */

    if (
        aluno.dataReprovacao
    ) {

        aluno.aulasPosReprovacao =
            total;

        aluno.aulasObrigatoriasPosReprovacao =
            Math.max(
                0,
                5 - total
            );

        aluno.posReprovacaoCompleta =
            total >= 5;

    }
    else {

        aluno.aulasPosReprovacao =
            0;

        aluno.aulasObrigatoriasPosReprovacao =
            0;

        aluno.posReprovacaoCompleta =
            false;

    }

}


// ============================================================
// MOSTRAR ALUNOS
// ============================================================

function mostrarAlunos() {

    const lista =
        $("studentsList");


    if (
        !lista ||
        !Array.isArray(alunos)
    ) {
        return;
    }


    alunos.forEach(
        function (aluno) {

            atualizarContagemAulasAluno(
                aluno
            );

        }
    );


    const pesquisa =
        $("searchStudent")
            ? $("searchStudent")
                .value
                .trim()
                .toLowerCase()
            : "";


    const resultado =
        [...alunos]
            .filter(
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
                        pesquisa === "" ||
                        numero.includes(
                            pesquisa
                        ) ||
                        nome.includes(
                            pesquisa
                        )
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        Number(
                            a.numero || 0
                        ) -
                        Number(
                            b.numero || 0
                        )
                    );

                }
            );


    if (
        resultado.length === 0
    ) {

        lista.innerHTML =
            "<p>Nenhum aluno encontrado.</p>";

        return;
    }


    lista.innerHTML = "";


    resultado.forEach(
        function (aluno) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "student-card";


            const teorica =
                aluno.teoricaCompleta
                    ? "✅ Teórica completa"
                    : (
                        "⏳ " +
                        (
                            aluno.aulasRealizadas ||
                            0
                        ) +
                        "/28 aulas"
                    );


            let posReprovacao =
                "";


            if (
                aluno.dataReprovacao
            ) {

                posReprovacao = `

                    <p>
                        <strong>
                            Pós-reprovação:
                        </strong>

                        ${
                            aluno.aulasPosReprovacao ||
                            0
                        }/5 aulas

                        ${
                            aluno.posReprovacaoCompleta
                                ? "✅"
                                : "⏳"
                        }

                    </p>

                `;

            }


            card.innerHTML = `

                <h3>

                    👨‍🎓
                    ${aluno.numero || "-"}
                    -
                    ${aluno.nome || "-"}

                </h3>


                <p>

                    <strong>
                        Estado:
                    </strong>

                    ${aluno.estado || "-"}

                </p>


                <p>

                    <strong>
                        Aulas:
                    </strong>

                    ${teorica}

                </p>


                ${posReprovacao}


                <p>

                    <strong>
                        Exame:
                    </strong>

                    ${aluno.estadoExame || "Sem exame"}

                </p>


                <p>

                    <strong>
                        Validade Licença:
                    </strong>

                    ${formatarData(
                        aluno.validadeLicenca
                    )}

                </p>


                <p>

                    <strong>
                        Validade Código:
                    </strong>

                    ${formatarData(
                        aluno.validadeCodigo
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

                        const id =
                            this.dataset.id;


                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        a.id === id
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

                        const id =
                            this.dataset.id;


                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        a.id === id
                                    );

                                }
                            );


                        if (!aluno) {
                            return;
                        }


                        mostrarQRCodeAluno(
                            aluno
                        );

                    };

            }
        );

}


// ============================================================
// QR CODE
// ============================================================

function mostrarQRCodeAluno(
    aluno
) {

    const caixa =
        document.getElementById(
            "qr-" + aluno.id
        );


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
            "<p>Biblioteca QR Code não carregada.</p>";

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


    new QRCode(
        caixa,
        {
            text:
                String(
                    aluno.numero
                ),

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
            Aluno ${aluno.numero}
        </strong>

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


    campo.oninput =
        function () {

            mostrarAlunos();

        };

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
            ×
        </button>


        <h2>
            ✏️ Editar Aluno
        </h2>


        <label>
            Número do aluno
        </label>

        <input
            id="editStudentNumber"
            type="text"
            value="${aluno.numero || ""}"
        >


        <label>
            Nome
        </label>

        <input
            id="editStudentName"
            type="text"
            value="${aluno.nome || ""}"
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
            Validade da licença
        </label>

        <input
            id="editLicenseValidity"
            type="date"
            value="${aluno.validadeLicenca || ""}"
        >


        <label>
            Validade do código
        </label>

        <input
            id="editCodeValidity"
            type="date"
            value="${aluno.validadeCodigo || ""}"
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
            Data da reprovação
        </label>

        <input
            id="editFailureDate"
            type="date"
            value="${aluno.dataReprovacao || ""}"
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


    const estado =
        modal.querySelector(
            "#editStudentState"
        );


    const exame =
        modal.querySelector(
            "#editExamResult"
        );


    if (estado) {
        estado.value =
            aluno.estado ||
            "Ativo";
    }


    if (exame) {
        exame.value =
            aluno.estadoExame ||
            "";
    }


    modal.querySelector(
        "#closeStudentEditor"
    ).onclick =
        function () {

            overlay.remove();

        };


    modal.querySelector(
        "#saveStudentChanges"
    ).onclick =
        async function () {

            const dados = {

                numero:
                    modal.querySelector(
                        "#editStudentNumber"
                    ).value.trim(),

                nome:
                    modal.querySelector(
                        "#editStudentName"
                    ).value.trim(),

                estado:
                    modal.querySelector(
                        "#editStudentState"
                    ).value,

                validadeLicenca:
                    modal.querySelector(
                        "#editLicenseValidity"
                    ).value,

                validadeCodigo:
                    modal.querySelector(
                        "#editCodeValidity"
                    ).value,

                estadoExame:
                    modal.querySelector(
                        "#editExamResult"
                    ).value,

                dataReprovacao:
                    modal.querySelector(
                        "#editFailureDate"
                    ).value

            };


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


                atualizarContagemAulasAluno(
                    aluno
                );


                overlay.remove();

                mostrarAlunos();

                atualizarDashboard();


                mostrarNotificacao(
                    "Ficha
