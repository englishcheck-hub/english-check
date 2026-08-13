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
    onSnapshot,
    getDoc,
    serverTimestamp
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
        $("notification");

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

        notificacao.style.boxShadow =
            "0 4px 15px rgba(0,0,0,.25)";

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
                username.value.trim();

            const pass =
                password.value.trim();


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


            if ($("loginPage")) {

                $("loginPage").style.display =
                    "none";
            }


            if ($("app")) {

                $("app").style.display =
                    "block";
            }


            password.value = "";

            if (message) {
                message.innerHTML = "";
            }


            mostrarPagina("homePage");

            atualizarDashboard();

        };


    password.onkeydown =
        function (event) {

            if (
                event.key === "Enter"
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
                $("loginMessage").innerHTML = "";
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

                mostrarPagina("homePage");

                atualizarDashboard();

            },


        studentsMenu:
            function () {

                mostrarPagina("studentsPage");

                mostrarAlunos();

            },


        lessonsMenu:
            function () {

                mostrarPagina("lessonsPage");

                mostrarAulas();

            },


        calendarMenu:
            function () {

                mostrarPagina("calendarPage");

                renderizarCalendario();

            },


        reportsMenu:
            function () {

                mostrarPagina("reportsPage");

                atualizarRelatorios();

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
        isNaN(d.getTime())
    ) {

        return "Data inválida";
    }


    return d.toLocaleDateString(
        "pt-PT"
    );

}


// ============================================================
// NORMALIZAR DATA
// ============================================================

function normalizarData(
    data
) {

    if (!data) {
        return "";
    }


    if (
        typeof data === "string"
    ) {

        return data.substring(
            0,
            10
        );

    }


    if (
        data.toDate
    ) {

        const d =
            data.toDate();

        return
            d.getFullYear() +
            "-" +
            String(
                d.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                d.getDate()
            ).padStart(2, "0");

    }


    return "";

}


// ============================================================
// COMPARAR DATAS
// ============================================================

function dataDepois(
    dataAula,
    dataLimite
) {

    if (
        !dataAula ||
        !dataLimite
    ) {
        return false;
    }


    return (
        normalizarData(dataAula) >
        normalizarData(dataLimite)
    );

}


// ============================================================
// LER ALUNOS
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


        atualizarDashboard();

        mostrarAlunos();

        mostrarAulas();

        renderizarCalendario();

        atualizarRelatorios();

    },

    function (erro) {

        console.error(
            "Erro ao carregar alunos:",
            erro
        );

        mostrarNotificacao(
            "Erro ao carregar alunos.",
            "erro"
        );

    }

);


// ============================================================
// LER AULAS
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


        mostrarAulas();

        renderizarCalendario();

        atualizarRelatorios();

    },

    function (erro) {

        console.error(
            "Erro ao carregar aulas:",
            erro
        );

        mostrarNotificacao(
            "Erro ao carregar aulas.",
            "erro"
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
                    aluno.estado === "Ativo"
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


    if ($("totalLessons")) {

        $("totalLessons").innerText =
            aulas.length;

    }


    mostrarAlertas();

}


// ============================================================
// ALERTAS DE VALIDADE
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


    hoje.setHours(
        0, 0, 0, 0
    );


    const limite =
        new Date(hoje);


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
                normalizarData(data) +
                "T00:00:00"
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
                        ${escaparHTML(aluno.nome || "Aluno")}
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
                        ${escaparHTML(aluno.nome || "Aluno")}
                    </strong>

                    <br>

                    ${tipo} termina em:
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

        $("totalAlerts").innerText =
            alertas.length;

    }

}


// ============================================================
// CONTAGEM DAS AULAS DO ALUNO
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
        ).trim();


    if (!numero) {
        return 0;
    }


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
                    function (valor) {

                        return (
                            String(valor).trim() ===
                            numero
                        );

                    }
                );


            if (!esteve) {
                return;
            }


            /*
             * SEM REPROVAÇÃO:
             * contam todas as aulas.
             */

            if (
                !aluno.dataReprovacao
            ) {

                total++;

                return;
            }


            /*
             * COM REPROVAÇÃO:
             * as aulas anteriores ou iguais
             * à data de reprovação NÃO contam
             * para as 5 obrigatórias.
             */

            if (
                dataDepois(
                    aula.data,
                    aluno.dataReprovacao
                )
            ) {

                total++;

            }

        }
    );


    return total;

}


// ============================================================
// CONTAGEM TOTAL DE AULAS ANTES DA REPROVAÇÃO
// ============================================================

function obterTotalAulasAntesDaReprovacao(
    aluno
) {

    if (!aluno) {
        return 0;
    }


    const numero =
        String(
            aluno.numero || ""
        ).trim();


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
                    function (valor) {

                        return (
                            String(valor).trim() ===
                            numero
                        );

                    }
                );


            if (!esteve) {
                return;
            }


            if (
                aluno.dataReprovacao
            ) {

                if (
                    normalizarData(aula.data) <=
                    normalizarData(
                        aluno.dataReprovacao
                    )
                ) {

                    total++;

                }

            }

        }
    );


    return total;

}


// ============================================================
// ATUALIZAR CONTAGEM DO ALUNO
// ============================================================

function atualizarContagemAulasAluno(
    aluno
) {

    const total =
        obterAulasRealizadas(
            aluno
        );


    /*
     * Guardamos sempre o valor atual.
     */

    aluno.aulasRealizadas =
        total;


    /*
     * TEÓRICA:
     *
     * 28 aulas = completa.
     *
     * Quando existe reprovação, o contador
     * de pós-reprovação é separado.
     */

    if (
        !aluno.dataReprovacao
    ) {

        aluno.teoricaCompleta =
            total >= 28;

        aluno.aulasPosReprovacao =
            0;

        aluno.aulasObrigatoriasPosReprovacao =
            0;

        aluno.posReprovacaoCompleta =
            false;

    }
    else {

        /*
         * O aluno mantém a indicação de que
         * já fez as 28 aulas teóricas originais.
         */

        const totalAntes =
            obterTotalAulasAntesDaReprovacao(
                aluno
            );


        aluno.teoricaCompleta =
            totalAntes >= 28;


        /*
         * Depois da reprovação:
         * são obrigatórias 5 aulas.
         */

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

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

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


            let teorica;


            if (
                aluno.dataReprovacao
            ) {

                const totalAntes =
                    obterTotalAulasAntesDaReprovacao(
                        aluno
                    );


                if (
                    totalAntes >= 28
                ) {

                    teorica =
                        "✅ Teórica completa";

                }
                else {

                    teorica =
                        "⏳ " +
                        totalAntes +
                        "/28 aulas";

                }

            }
            else {

                teorica =
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

            }


            let posReprovacao = "";


            if (
                aluno.dataReprovacao
            ) {

                posReprovacao = `

                    <p>

                        <strong>
                            Aulas após reprovação:
                        </strong>

                        ${
                            aluno.aulasPosReprovacao ||
                            0
                        }/5

                        ${
                            aluno.posReprovacaoCompleta
                                ? " ✅ Obrigatórias completas"
                                : " ⏳ Faltam " +
                                  (
                                    aluno.aulasObrigatoriasPosReprovacao ||
                                    0
                                  )
                        }

                    </p>

                    <p>

                        <strong>
                            Data da reprovação:
                        </strong>

                        ${formatarData(
                            aluno.dataReprovacao
                        )}

                    </p>

                `;

            }


            card.innerHTML = `

                <h3>

                    👨‍🎓
                    ${escaparHTML(aluno.numero || "-")}
                    -
                    ${escaparHTML(aluno.nome || "-")}

                </h3>


                <p>

                    <strong>
                        Estado:
                    </strong>

                    ${escaparHTML(
                        aluno.estado || "-"
                    )}

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

                    ${escaparHTML(
                        aluno.estadoExame ||
                        "Sem exame"
                    )}

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


                        if (aluno) {

                            mostrarQRCodeAluno(
                                aluno
                            );

                        }

                    };

            }
        );

}


// ============================================================
// CARREGAR BIBLIOTECA QR CODE AUTOMATICAMENTE
// ============================================================

function carregarQRCode() {

    return new Promise(
        function (resolve, reject) {

            if (
                typeof QRCode !==
                "undefined"
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";


            script.onload =
                function () {

                    resolve();

                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Não foi possível carregar a biblioteca QR Code."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


// ============================================================
// MOSTRAR QR CODE
// ============================================================

async function mostrarQRCodeAluno(
    aluno
) {

    const caixa =
        $("qr-" + aluno.id);


    if (!caixa) {
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


    try {

        await carregarQRCode();

    }
    catch (erro) {

        console.error(
            erro
        );

        caixa.style.display =
            "block";

        caixa.innerHTML =
            "<p>Não foi possível carregar o QR Code.</p>";

        return;

    }


    caixa.innerHTML =
        "";


    new QRCode(
        caixa,
        {

            text:
                String(
                    aluno.numero || ""
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
            Aluno ${escaparHTML(
                aluno.numero || ""
            )}
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
            ✏️ Editar ficha do aluno
        </h2>


        <label>
            Número do aluno
        </label>

        <input
            id="editStudentNumber"
            type="text"
            value="${escaparHTML(
                aluno.numero || ""
            )}"
        >


        <label>
            Nome
        </label>

        <input
            id="editStudentName"
            type="text"
            value="${escaparHTML(
                aluno.nome || ""
            )}"
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
            value="${normalizarData(
                aluno.validadeLicenca
            )}"
        >


        <label>
            Validade do código
        </label>

        <input
            id="editCodeValidity"
            type="date"
            value="${normalizarData(
                aluno.validadeCodigo
            )}"
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
            value="${normalizarData(
                aluno.dataReprovacao
            )}"
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


    estado.value =
        aluno.estado ||
        "Ativo";


    exame.value =
        aluno.estadoExame ||
        "";


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

            const numero =
                modal.querySelector(
                    "#editStudentNumber"
                ).value.trim();


            const nome =
                modal.querySelector(
                    "#editStudentName"
                ).value.trim();


            if (!numero) {

                mostrarNotificacao(
                    "Introduz o número do aluno.",
                    "erro"
                );

                return;

            }


            if (!nome) {

                mostrarNotificacao(
                    "Introduz o nome do aluno.",
                    "erro"
                );

                return;

            }


            const dados = {

                numero:

                    numero,

                nome:

                    nome,

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


            /*
             * Se o resultado voltar a ser
             * diferente de reprovado,
             * limpamos a data de reprovação.
             */

            if (
                dados.estadoExame !==
                "Reprovado"
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


                atualizarContagemAulasAluno(
                    aluno
                );


                overlay.remove();


                mostrarAlunos();

                atualizarDashboard();

                atualizarRelatorios();


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

            const numeroInput =
                $("studentNumber");


            const nomeInput =
                $("studentName");


            const numero =
                numeroInput
                    ? numeroInput.value.trim()
                    : "";


            const nome =
                nomeInput
                    ? nomeInput.value.trim()
                    : "";


            if (!numero || !nome) {

                mostrarNotificacao(
                    "Preenche o número e o nome do aluno.",
                    "erro"
                );

                return;

            }


            const existente =
                alunos.some(
                    function (aluno) {

                        return (
                            String(
                                aluno.numero
                            ).trim() === numero
                        );

                    }
                );


            if (existente) {

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

                        estado:
                            "Ativo",

                        validadeLicenca:
                            "",

                        validadeCodigo:
                            "",

                        estadoExame:
                            "",

                        dataReprovacao:
                            "",

                        criadoEm:
                            serverTimestamp()

                    }
                );


                if (numeroInput) {
                    numeroInput.value = "";
                }


                if (nomeInput) {
                    nomeInput.value = "";
                }


                mostrarNotificacao(
                    "Aluno adicionado com sucesso."
                );

            }
            catch (erro) {

                console.error(
                    erro
                );

                mostrarNotificacao(
                    "Erro ao adicionar aluno.",
                    "erro"
                );

            }

        };

}


// ============================================================
// MATÉRIAS / LESSONS
// ============================================================

const materias = {

    1:
        "Driver Profile",

    2:
        "Driver and Physical/Psychological Fitness",

    3:
        "Road Safety",

    4:
        "Traffic Signs",

    "5/6":
        "Road Rules and Traffic",

    7:
        "Manoeuvres",

    8:
        "Road Users",

    9:
        "Vehicle",

    10:
        "Driver Behaviour",

    11:
        "Speed",

    12:
        "Safety Distance",

    13:
        "Overtaking",

    14:
        "Changing Direction",

    15:
        "Stopping and Parking",

    16:
        "Intersections",

    17:
        "Motorways",

    18:
        "Night Driving",

    19:
        "Adverse Weather",

    20:
        "Emergency Situations",

    21:
        "Eco Driving",

    22:
        "Legal Responsibilities",

    23:
        "Revision",

    24:
        "Final Revision"

};


// ============================================================
// NOME DA LESSON
// ============================================================

function obterNomeLesson(
    lesson
) {

    const chave =
        String(lesson || "")
            .trim();


    return (
        materias[chave] ||
        "Lesson " + chave
    );

}


// ============================================================
// COR DA LESSON
// ============================================================

function obterCorLesson(
    lesson
) {

    const numero =
        String(lesson || "")
            .trim();


    if (
        numero === "5/6"
    ) {

        return "verde";

    }


    const n =
        Number(numero);


    if (
        n >= 1 &&
        n <= 7
    ) {

        return "verde";

    }


    if (
        n >= 8 &&
        n <= 23
    ) {

        return "amarelo";

    }


    if (
        n === 24
    ) {

        return "vermelho";

    }


    return "";

}


// ============================================================
// LISTA DE LESSONS
// ============================================================

function obterLessons() {

    return [

        "1",
        "2",
        "3",
        "4",
        "5/6",
        "7",
        "8",
        "9",
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
        "23",
        "24"

    ];

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


    const ordenadas =
        [...aulas]
            .sort(
                function (a, b) {

                    return (
                        normalizarData(b.data)
                            .localeCompare(
                                normalizarData(a.data)
                            )
                    );

                }
            );


    if (
        ordenadas.length === 0
    ) {

        lista.innerHTML =
            "<p>Ainda não existem aulas registadas.</p>";

        return;

    }


    lista.innerHTML =
        "";


    ordenadas.forEach(
        function (aula) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "lesson-card";


            const lesson =
                aula.lesson ||
                aula.materia ||
                "";


            const cor =
                obterCorLesson(
                    lesson
                );


            if (cor) {

                div.classList.add(
                    "lesson-" + cor
                );

            }


            const total =
                Array.isArray(aula.alunos)
                    ? aula.alunos.length
                    : 0;


            div.innerHTML = `

                <h3>

                    Lesson ${escaparHTML(
                        lesson || "-"
                    )}

                    ${
                        lesson
                            ? " - " +
                              escaparHTML(
                                  obterNomeLesson(
                                      lesson
                                  )
                              )
                            : ""
                    }

                </h3>


                <p>

                    📅
                    ${formatarData(
                        aula.data
                    )}

                </p>


                <p>

                    🕐
                    ${escaparHTML(
                        aula.hora || ""
                    )}

                </p>


                <p>

                    👨‍🎓
                    ${total}
                    aluno(s)

                </p>


                <div>

                    <button
                        type="button"
                        class="openLessonButton"
                        data-id="${aula.id}"
                    >
                        📖 Abrir aula
                    </button>


                    <button
                        type="button"
                        class="deleteLessonButton"
                        data-id="${aula.id}"
                    >
                        🗑️ Eliminar
                    </button>

                </div>

            `;


            lista.appendChild(
                div
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
            ".openLessonButton"
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

                            abrirAula(
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

                        const confirmar =
                            confirm(
                                "Queres mesmo eliminar esta aula?"
                            );


                        if (!confirmar) {
                            return;
                        }


                        try {

                            await deleteDoc(
                                doc(
                                    db,
                                    "aulas",
                                    button.dataset.id
                                )
                            );


                            mostrarNotificacao(
                                "Aula eliminada."
                            );

                        }
                        catch (erro) {

                            console.error(
                                erro
                            );

                            mostrarNotificacao(
                                "Erro ao eliminar a aula.",
                                "erro"
                            );

                        }

                    };

            }
        );

}


// ============================================================
// CONFIGURAR CRIAÇÃO DE AULA
// ============================================================

function configurarCriarAula() {

    const button =
        $("addLessonButton");


    if (!button) {
        return;
    }


    button.onclick =
        async function () {

            const lesson =
                $("lessonNumber")
                    ? $("lessonNumber").value
                    : "";


            const data =
                $("lessonDate")
                    ? $("lessonDate").value
                    : "";


            const hora =
                $("lessonTime")
                    ? $("lessonTime").value
                    : "";


            if (
                !lesson ||
                !data
            ) {

                mostrarNotificacao(
                    "Seleciona a Lesson e a data.",
                    "erro"
                );

                return;

            }


            try {

                await addDoc(
                    collection(
                        db,
                        "aulas"
                    ),
                    {

                        lesson:
                            lesson,

                        materia:
                            obterNomeLesson(
                                lesson
                            ),

                        data:
                            data,

                        hora:
                            hora,

                        alunos:
                            [],

                        criadoEm:
                            serverTimestamp()

                    }
                );


                mostrarNotificacao(
                    "Aula criada com sucesso."
                );


                if ($("lessonNumber")) {
                    $("lessonNumber").value = "";
                }


                if ($("lessonDate")) {
                    $("lessonDate").value = "";
                }


                if ($("lessonTime")) {
                    $("lessonTime").value = "";
                }

            }
            catch (erro) {

                console.error(
                    erro
                );

                mostrarNotificacao(
                    "Erro ao criar a aula.",
                    "erro"
                );

            }

        };

}


// ============================================================
// ABRIR AULA
// ============================================================

function abrirAula(
    aula
) {

    aulaEmEdicao =
        aula;


    alunosDaAula =
        Array.isArray(
            aula.alunos
        )
            ? [...aula.alunos]
            : [];


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


    modal.style.maxWidth =
        "700px";


    modal.innerHTML = `

        <button
            type="button"
            class="close-lesson-editor"
            id="closeLessonModal"
        >
            ×
        </button>


        <h2>

            Lesson ${escaparHTML(
                aula.lesson ||
                aula.materia ||
                "-"
            )}

        </h2>


        <p>

            <strong>
                ${escaparHTML(
                    obterNomeLesson(
                        aula.lesson
                    )
                )}
            </strong>

        </p>


        <p>

            📅
            ${formatarData(
                aula.data
            )}

            ${
                aula.hora
                    ? " — 🕐 " +
                      escaparHTML(
                          aula.hora
                      )
                    : ""
            }

        </p>


        <hr>


        <h3>
            👨‍🎓 Alunos da aula
        </h3>


        <div id="lessonStudents">

        </div>


        <hr>


        <h3>
            Adicionar aluno
        </h3>


        <input
            id="lessonStudentSearch"
            type="text"
            placeholder="Número ou nome do aluno"
        >


        <div id="lessonStudentResults">
        </div>

    `;


    overlay.appendChild(
        modal
    );


    document.body.appendChild(
        overlay
    );


    modal.querySelector(
        "#closeLessonModal"
    ).onclick =
        function () {

            overlay.remove();

            aulaEmEdicao =
                null;

        };


    mostrarAlunosDaAula(
        modal
    );


    configurarPesquisaAlunosDaAula(
        modal
    );

}


// ============================================================
// MOSTRAR ALUNOS DA AULA
// ============================================================

function mostrarAlunosDaAula(
    modal
) {

    const lista =
        modal.querySelector(
            "#lessonStudents"
        );


    if (!lista) {
        return;
    }


    if (
        alunosDaAula.length === 0
    ) {

        lista.innerHTML = `

            <p>
                Ainda não existem alunos nesta aula.
            </p>

        `;

        return;

    }


    lista.innerHTML =
        "";


    alunosDaAula.forEach(
        function (numero) {

            const aluno =
                alunos.find(
                    function (a) {

                        return (
                            String(
                                a.numero
                            ) ===
                            String(numero)
                        );

                    }
                );


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "lesson-student-row";


            div.style.display =
                "flex";

            div.style.alignItems =
                "center";

            div.style.justifyContent =
                "space-between";

            div.style.gap =
                "10px";

            div.style.padding =
                "8px";

            div.innerHTML = `

                <span>

                    👨‍🎓

                    <strong>
                        ${escaparHTML(
                            numero
                        )}
                    </strong>

                    ${
                        aluno
                            ? " - " +
                              escaparHTML(
                                  aluno.nome
                              )
                            : ""
                    }

                </span>


                <button
                    type="button"
                    class="removeStudentFromLesson"
                    data-numero="${escaparHTML(
                        numero
                    )}"
                    title="Remover aluno da aula"
                >
                    ❌
                </button>

            `;


            lista.appendChild(
                div
            );

        }
    );


    lista
        .querySelectorAll(
            ".removeStudentFromLesson"
        )
        .forEach(
            function (button) {

                button.onclick =
                    async function () {

                        await removerAlunoDaAula(
                            button.dataset.numero,
                            modal
                        );

                    };

            }
        );

}


// ============================================================
// REMOVER ALUNO DA AULA
// ============================================================

async function removerAlunoDaAula(
    numero,
    modal
) {

    if (!aulaEmEdicao) {
        return;
    }


    const confirmar =
        confirm(
            "Remover este aluno desta aula?"
        );


    if (!confirmar) {
        return;
    }


    alunosDaAula =
        alunosDaAula.filter(
            function (n) {

                return (
                    String(n) !==
                    String(numero)
                );

            }
        );


    try {

        await updateDoc(
            doc(
                db,
                "aulas",
                aulaEmEdicao.id
            ),
            {

                alunos:
                    alunosDaAula

            }
        );


        aulaEmEdicao.alunos =
            [...alunosDaAula];


        mostrarAlunosDaAula(
            modal
        );


        mostrarNotificacao(
            "Aluno removido da aula."
        );

    }
    catch (erro) {

        console.error(
            erro
        );

        mostrarNotificacao(
            "Erro ao remover o aluno.",
            "erro"
        );

    }

}


// ============================================================
// PESQUISA DE ALUNOS PARA ADICIONAR À AULA
// ============================================================

function configurarPesquisaAlunosDaAula(
    modal
) {

    const campo =
        modal.querySelector(
            "#lessonStudentSearch"
        );


    if (!campo) {
        return;
    }


    campo.oninput =
        function () {

            const texto =
                campo.value
                    .trim()
                    .toLowerCase();


            const resultados =
                alunos
                    .filter(
                        function (aluno) {

                            if (!texto) {
                                return false;
                            }


                            const numero =
                                String(
                                    aluno.numero || ""
                                ).toLowerCase();


                            const nome =
                                String(
                                    aluno.nome || ""
                                ).toLowerCase();


                            return (
                                numero.includes(texto) ||
                                nome.includes(texto)
                            );

                        }
                    )
                    .slice(
                        0,
                        10
                    );


            const container =
                modal.querySelector(
                    "#lessonStudentResults"
                );


            if (!container) {
                return;
            }


            container.innerHTML =
                "";


            resultados.forEach(
                function (aluno) {

                    const jaExiste =
                        alunosDaAula.some(
                            function (n) {

                                return (
                                    String(n) ===
                                    String(
                                        aluno.numero
                                    )
                                );

                            }
                        );


                    const div =
                        document.createElement(
                            "div"
                        );


                    div.style.display =
                        "flex";

                    div.style.justifyContent =
                        "space-between";

                    div.style.alignItems =
                        "center";

                    div.style.padding =
                        "8px";


                    div.innerHTML = `

                        <span>

                            ${escaparHTML(
                                aluno.numero
                            )}
                            -
                            ${escaparHTML(
                                aluno.nome
                            )}

                        </span>


                        <button
                            type="button"
                            class="addStudentToLesson"
                            data-numero="${escaparHTML(
                                aluno.numero
                            )}"
                            ${jaExiste ? "disabled" : ""}
                        >

                            ${
                                jaExiste
                                    ? "✓ Já está na aula"
                                    : "➕ Adicionar"
                            }

                        </button>

                    `;


                    container.appendChild(
                        div
                    );

                }
            );


            container
                .querySelectorAll(
                    ".addStudentToLesson"
                )
                .forEach(
                    function (button) {

                        button.onclick =
                            async function () {

                                await adicionarAlunoNaAula(
                                    button.dataset.numero,
                                    modal
                                );

                                campo.value =
                                    "";

                                container.innerHTML =
                                    "";

                            };

                    }
                );

        };

}


// ============================================================
// ADICIONAR ALUNO À AULA
// ============================================================

async function adicionarAlunoNaAula(
    numero,
    modal
) {

    if (!aulaEmEdicao) {
        return;
    }


    const jaExiste =
        alunosDaAula.some(
            function (n) {

                return (
                    String(n) ===
                    String(numero)
                );

            }
        );


    if (jaExiste) {

        mostrarNotificacao(
            "O aluno já está nesta aula.",
            "erro"
        );

        return;

    }


    alunosDaAula.push(
        String(numero)
    );


    try {

        await updateDoc(
            doc(
                db,
                "aulas",
                aulaEmEdicao.id
            ),
            {

                alunos:
                    alunosDaAula

            }
        );


        aulaEmEdicao.alunos =
            [...alunosDaAula];


        mostrarAlunosDaAula(
            modal
        );


        mostrarNotificacao(
            "Aluno adicionado à aula."
        );

    }
    catch (erro) {

        console.error(
            erro
        );


        alunosDaAula =
            alunosDaAula.filter(
                function (n) {

                    return (
                        String(n) !==
                        String(numero)
                    );

                }
            );


        mostrarNotificacao(
            "Erro ao adicionar o aluno.",
            "erro"
        );

    }

}


// ============================================================
// CALENDÁRIO
// ============================================================

function renderizarCalendario() {

    const calendario =
        $("calendar");


    if (!calendario) {
        return;
    }


    const ano =
        mesCalendarioAtual.getFullYear();


    const mes =
        mesCalendarioAtual.getMonth();


    const primeiro =
        new Date(
            ano,
            mes,
            1
        );


    const ultimo =
        new Date(
            ano,
            mes + 1,
            0
        );


    const inicioSemana =
        primeiro.getDay() === 0
            ? 6
            : primeiro.getDay() - 1;


    let html = `

        <div class="calendar-header">

            <button
                type="button"
                id="previousMonth"
            >
                ◀
            </button>


            <strong>

                ${primeiro.toLocaleDateString(
                    "pt-PT",
                    {
                        month: "long",
                        year: "numeric"
                    }
                )}

            </strong>


            <button
                type="button"
                id="nextMonth"
            >
                ▶
            </button>

        </div>


        <div class="calendar-weekdays">

            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
            <div>Dom</div>

        </div>


        <div class="calendar-grid">

    `;


    for (
        let i = 0;
        i < inicioSemana;
        i++
    ) {

        html +=
            `<div class="calendar-day empty"></div>`;

    }


    for (
        let dia = 1;
        dia <= ultimo.getDate();
        dia++
    ) {

        const data =
            ano +
            "-" +
            String(
                mes + 1
            ).padStart(2, "0") +
            "-" +
            String(
                dia
            ).padStart(2, "0");


        const aulasDoDia =
            aulas.filter(
                function (aula) {

                    return (
                        normalizarData(
                            aula.data
                        ) === data
                    );

                }
            );


        html += `

            <div
                class="calendar-day"
                data-date="${data}"
            >

                <div class="calendar-number">
                    ${dia}
                </div>

        `;


        aulasDoDia.forEach(
            function (aula) {

                const lesson =
                    aula.lesson ||
                    aula.materia ||
                    "";


                const cor =
                    obterCorLesson(
                        lesson
                    );


                html += `

                    <div
                        class="calendar-lesson ${cor}"
                        title="${escaparHTML(
                            obterNomeLesson(
                                lesson
                            )
                        )}"
                    >

                        Lesson
                        ${escaparHTML(
                            lesson
                        )}

                    </div>

                `;

            }
        );


        html +=
            "</div>";

    }


    html +=
        "</div>";


    calendario.innerHTML =
        html;


    const anterior =
        $("previousMonth");


    const seguinte =
        $("nextMonth");


    if (anterior) {

        anterior.onclick =
            function () {

                mesCalendarioAtual =
                    new Date(
                        ano,
                        mes - 1,
                        1
                    );

                renderizarCalendario();

            };

    }


    if (seguinte) {

        seguinte.onclick =
            function () {

                mesCalendarioAtual =
                    new Date(
                        ano,
                        mes + 1,
                        1
                    );

                renderizarCalendario();

            };

    }

}


// ============================================================
// RELATÓRIOS
// ============================================================

function atualizarRelatorios() {

    const lista =
        $("reportsList");


    if (!lista) {
        return;
    }


    const totalAlunos =
        alunos.length;


    const ativos =
        alunos.filter(
            function (a) {

                return a.estado === "Ativo";

            }
        ).length;


    const teoricasCompletas =
        alunos.filter(
            function (aluno) {

                atualizarContagemAulasAluno(
                    aluno
                );

                return (
                    aluno.teoricaCompleta
                );

            }
        ).length;


    const posReprovacao =
        alunos.filter(
            function (aluno) {

                return (
                    aluno.posReprovacaoCompleta
                );

            }
        ).length;


    lista.innerHTML = `

        <div class="report-card">

            <h3>
                📊 Resumo
            </h3>


            <p>
                Total de alunos:
                <strong>
                    ${totalAlunos}
                </strong>
            </p>


            <p>
                Alunos ativos:
                <strong>
                    ${ativos}
                </strong>
            </p>


            <p>
                Teóricas completas:
                <strong>
                    ${teoricasCompletas}
                </strong>
            </p>


            <p>
                5 aulas pós-reprovação completas:
                <strong>
                    ${posReprovacao}
                </strong>
            </p>


            <p>
                Total de aulas realizadas:
                <strong>
                    ${aulas.length}
                </strong>
            </p>

        </div>

    `;

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        iniciarLogin();

        iniciarLogout();

        configurarMenu();

        configurarPesquisa();

        configurarAdicionarAluno();

        configurarCriarAula();

        mostrarPagina(
            "homePage"
        );

        atualizarDashboard();

        mostrarAlunos();

        mostrarAulas();

        renderizarCalendario();

        atualizarRelatorios();

    }
);


// ============================================================
// EXPOR FUNÇÕES
// ============================================================

window.mostrarPagina =
    mostrarPagina;

window.mostrarAlunos =
    mostrarAlunos;

window.mostrarAulas =
    mostrarAulas;

window.renderizarCalendario =
    renderizarCalendario;

window.editarAluno =
    editarAluno;

window.abrirAula =
    abrirAula;

window.mostrarQRCodeAluno =
    mostrarQRCodeAluno;

window.atualizarDashboard =
    atualizarDashboard;

window.atualizarRelatorios =
    atualizarRelatorios;


// ============================================================
// FIM DO SCRIPT
// ============================================================
