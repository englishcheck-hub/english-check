// ======================================================
// ENGLISH CHECK
// GESTÃO DE AULAS DE CÓDIGO DA ESTRADA
// SCRIPT PRINCIPAL
// ======================================================


// ======================================================
// FIREBASE
// ======================================================

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


// ======================================================
// CONFIGURAÇÃO FIREBASE
// ======================================================

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


// ======================================================
// INICIAR FIREBASE
// ======================================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// ======================================================
// DADOS DA APLICAÇÃO
// ======================================================

let alunos = [];

let aulas = [];

let alunosDaAula = [];

let aulaEmEdicao = null;


// ======================================================
// CALENDÁRIO
// IMPORTANTE:
// Estas variáveis são declaradas APENAS UMA VEZ.
// ======================================================

let mesCalendarioAtual = new Date();

let mesesCalendario = [];

let diasFechados = [];


// ======================================================
// RESULTADO DO EXAME
// ======================================================

let alunoResultadoExame = null;


// ======================================================
// UTILIZADORES
// ======================================================

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


// ======================================================
// MATÉRIAS DAS LESSONS
// ======================================================

const materiasCalendario = {

    "01":
        "Driver Profile",

    "02":
        "Driver and Physical/Psychological Fitness",

    "03":
        "Road Safety and Defensive Driving",

    "04":
        "Traffic Rules and Road Signs",

    "05/06":
        "Vehicle and Driver Responsibilities",

    "07":
        "Driving Licence and Legal Requirements",

    "08":
        "Road Users",

    "09":
        "Speed",

    "10":
        "Safety Distance",

    "11":
        "Overtaking",

    "12":
        "Stopping and Parking",

    "13":
        "Changing Direction",

    "14":
        "Intersections",

    "15":
        "Traffic Lights and Signals",

    "16":
        "Road Signs",

    "17":
        "Special Manoeuvres",

    "18":
        "Motorways and Expressways",

    "19":
        "Night Driving and Adverse Conditions",

    "20":
        "Pedestrians and Vulnerable Road Users",

    "21":
        "Emergency Situations",

    "22":
        "Vehicle Safety",

    "23":
        "Environmental and Economic Driving",

    "24":
        "Final Review"

};


// ======================================================
// FUNÇÃO AUXILIAR
// ======================================================

function $(id) {

    return document.getElementById(id);

}


// ======================================================
// NOTIFICAÇÕES
// ======================================================

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

        notificacao.style.bottom =
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

    notificacao.innerHTML =
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


// ======================================================
// FIREBASE - ALUNOS
// ======================================================

function carregarAlunos() {

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

}


// ======================================================
// FIREBASE - AULAS
// ======================================================

function carregarAulas() {

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

}


// ======================================================
// FIREBASE - MESES DO CALENDÁRIO
// ======================================================

function carregarMesesCalendario() {

    onSnapshot(

        collection(
            db,
            "mesesCalendario"
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


            console.log(
                "Meses do calendário:",
                mesesCalendario
            );


            renderizarCalendario();

        },

        function (erro) {

            console.error(
                "Erro ao carregar meses:",
                erro
            );

        }

    );

}


// ======================================================
// LOGIN
// ======================================================

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

                message.innerHTML =
                    "";

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


            password.value =
                "";


            if (message) {

                message.innerHTML =
                    "";

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


// ======================================================
// LOGOUT
// ======================================================

function iniciarLogout() {

    const button =
        $("logoutButton");


    if (!button) {
        return;
    }


    button.onclick =
        function () {

            const appPage =
                $("app");

            const loginPage =
                $("loginPage");


            if (appPage) {

                appPage.style.display =
                    "none";

            }


            if (loginPage) {

                loginPage.style.display =
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

                $("loginMessage").innerHTML =
                    "";

            }

        };

}


// ======================================================
// MENU
// ======================================================

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


// ======================================================
// CONFIGURAR MENU
// ======================================================

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


// ======================================================
// DASHBOARD
// ======================================================

function atualizarDashboard() {

    if (!Array.isArray(alunos)) {
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

        $("totalStudents").innerText =
            ativos.length;

    }


    if ($("totalApproved")) {

        $("totalApproved").innerText =
            aprovados.length;

    }


    mostrarAlertas();

}


// ======================================================
// ALERTAS
// ======================================================

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

        $("totalAlerts").innerText =
            alertas.length;

    }

}


// ======================================================
// FORMATAR DATA
// ======================================================

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


// ======================================================
// ALUNOS
// ======================================================

function mostrarAlunos() {

    const lista =
        $("studentsList");


    if (
        !lista ||
        !Array.isArray(alunos)
    ) {

        return;

    }


    const campoPesquisa =
        $("searchStudent");


    const pesquisa =
        campoPesquisa
            ? campoPesquisa.value
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
                        numero.includes(pesquisa) ||
                        nome.includes(pesquisa)
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


    lista.innerHTML =
        "";


    resultado.forEach(
        function (aluno) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "student-card";


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

                    ${aluno.aulasRealizadas || 0}

                </p>


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

            `;


            lista.appendChild(
                card
            );

        }
    );

}


// ======================================================
// PESQUISA
// ======================================================

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


// ======================================================
// AULAS
// ======================================================

function mostrarAulas() {

    const lista =
        $("lessonsList");


    if (!lista) {
        return;
    }


    if (
        !Array.isArray(aulas) ||
        aulas.length === 0
    ) {

        lista.innerHTML =
            "Ainda não existem aulas.";

        return;

    }


    lista.innerHTML =
        "";


    [...aulas]
        .sort(
            function (a, b) {

                return (
                    new Date(
                        b.data +
                        "T" +
                        (b.hora || "00:00")
                    ) -
                    new Date(
                        a.data +
                        "T" +
                        (a.hora || "00:00")
                    )
                );

            }
        )
        .forEach(
            function (aula) {

                let alunosTexto =
                    "Nenhum aluno adicionado.";


                if (
                    Array.isArray(
                        aula.alunos
                    ) &&
                    aula.alunos.length
                ) {

                    alunosTexto =
                        aula.alunos
                            .map(
                                function (numero) {

                                    const aluno =
                                        alunos.find(
                                            function (a) {

                                                return (
                                                    String(
                                                        a.numero
                                                    ) ===
                                                    String(
                                                        numero
                                                    )
                                                );

                                            }
                                        );


                                    return (
                                        "• " +
                                        numero +
                                        (
                                            aluno
                                                ? " - " +
                                                  aluno.nome
                                                : ""
                                        )
                                    );

                                }
                            )
                            .join("<br>");

                }


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "student-card";


                card.innerHTML = `

                    <h3>

                        📚
                        ${aula.idAula || "-"}

                    </h3>


                    <p>

                        <strong>
                            Matéria:
                        </strong>

                        ${aula.materia || "-"}

                    </p>


                    <p>

                        <strong>
                            Data:
                        </strong>

                        ${formatarData(
                            aula.data
                        )}

                    </p>


                    <p>

                        <strong>
                            Hora:
                        </strong>

                        ${aula.hora || "-"}

                    </p>


                    <p>

                        <strong>
                            Alunos:
                        </strong>

                        ${
                            Array.isArray(
                                aula.alunos
                            )
                                ? aula.alunos.length
                                : 0
                        }

                    </p>


                    <p>
                        ${alunosTexto}
                    </p>


                    <button
                        type="button"
                        class="editLessonButton"
                        data-id="${aula.id}"
                    >
                        👨‍🎓 Abrir Aula / Alunos
                    </button>


                    <button
                        type="button"
                        class="deleteLessonButton danger-button"
                        data-id="${aula.id}"
                    >
                        🗑️ Apagar Aula
                    </button>

                `;


                lista.appendChild(
                    card
                );

            }
        );


    adicionarEventosDasAulas();

}


// ======================================================
// EVENTOS DAS AULAS
// ======================================================

function adicionarEventosDasAulas() {

    document
        .querySelectorAll(
            ".editLessonButton"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        const id =
                            this.dataset.id;


                        const aula =
                            aulas.find(
                                function (a) {

                                    return (
                                        a.id === id
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

                        const id =
                            this.dataset.id;


                        const aula =
                            aulas.find(
                                function (a) {

                                    return (
                                        a.id === id
                                    );

                                }
                            );


                        if (!aula) {
                            return;
                        }


                        if (
                            !confirm(
                                "Pretendes apagar esta aula?"
                            )
                        ) {

                            return;

                        }


                        try {

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

                            console.error(
                                "Erro ao apagar aula:",
                                erro
                            );


                            mostrarNotificacao(
                                "Erro ao apagar aula.",
                                "erro"
                            );

                        }

                    };

            }
        );

}


// ======================================================
// OBTER LESSON
// ======================================================

function obterNumeroLesson(
    aula
) {

    if (!aula) {
        return "";
    }


    let valor =
        aula.idAula ||
        aula.lesson ||
        aula.numeroLesson ||
        "";


    valor =
        String(
            valor
        ).trim();


    valor =
        valor.replace(
            /^lesson\s*/i,
            ""
        );


    if (
        valor === "5" ||
        valor === "6" ||
        valor === "05" ||
        valor === "06" ||
        valor === "5/6" ||
        valor === "05/06"
    ) {

        return "05/06";

    }


    const numero =
        parseInt(
            valor,
            10
        );


    if (
        !isNaN(numero) &&
        numero >= 1 &&
        numero <= 24
    ) {

        return String(
            numero
        ).padStart(
            2,
            "0"
        );

    }


    return valor;

}


// ======================================================
// COR DA LESSON
// ======================================================

function obterClasseLesson(
    lesson
) {

    if (
        lesson === "24"
    ) {

        return "lesson-vermelho";

    }


    if (
        lesson === "05/06"
    ) {

        return "lesson-verde";

    }


    const numero =
        parseInt(
            lesson,
            10
        );


    if (
        !isNaN(numero) &&
        numero >= 1 &&
        numero <= 7
    ) {

        return "lesson-verde";

    }


    if (
        !isNaN(numero) &&
        numero >= 8 &&
        numero <= 23
    ) {

        return "lesson-amarelo";

    }


    return "";

}


// ======================================================
// MATÉRIA
// ======================================================

function obterMateriaLesson(
    lesson,
    aula
) {

    if (
        materiasCalendario[
            lesson
        ]
    ) {

        return materiasCalendario[
            lesson
        ];

    }


    if (
        aula &&
        aula.materia
    ) {

        return aula.materia;

    }


    return (
        "Lesson " +
        lesson
    );

}


// ======================================================
// ABRIR AULA EXISTENTE
// ======================================================

function abrirAula(
    aula
) {

    if (!aula) {
        return;
    }


    aulaEmEdicao =
        aula;


    alunosDaAula =
        [];


    (
        aula.alunos || []
    ).forEach(
        function (numero) {

            const aluno =
                alunos.find(
                    function (a) {

                        return (
                            String(
                                a.numero
                            ) ===
                            String(
                                numero
                            )
                        );

                    }
                );


            if (aluno) {

                alunosDaAula.push(
                    aluno
                );

            }

        }
    );


    const original =
        $("lessonEditorOverlay");


    if (original) {

        preencherFormularioEditor(
            original,
            aula
        );


        original.style.display =
            "flex";


        configurarEditorExistente(
            original
        );


        return;

    }


    // --------------------------------------------------
    // Caso o HTML não tenha o overlay,
    // criamos um editor automaticamente.
    // --------------------------------------------------

    criarEditorAutomatico(
        aula
    );

}


// ======================================================
// CRIAR EDITOR AUTOMÁTICO
// ======================================================

function criarEditorAutomatico(
    aula = null,
    data = "",
    hora = ""
) {

    let overlay =
        $("lessonEditorOverlay");


    if (overlay) {

        overlay.remove();

    }


    overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "lessonEditorOverlay";


    overlay.className =
        "lesson-editor-overlay";


    overlay.style.position =
        "fixed";

    overlay.style.inset =
        "0";

    overlay.style.background =
        "rgba(0,0,0,0.6)";

    overlay.style.display =
        "flex";

    overlay.style.alignItems =
        "center";

    overlay.style.justifyContent =
        "center";

    overlay.style.zIndex =
        "9999";


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "lesson-editor-modal";


    modal.style.background =
        "#fff";

    modal.style.padding =
        "25px";

    modal.style.borderRadius =
        "12px";

    modal.style.width =
        "min(600px, 92%)";

    modal.style.maxHeight =
        "90vh";

    modal.style.overflowY =
        "auto";


    modal.innerHTML = `

        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:center;
            "
        >

            <h2 id="lessonEditorTitle">
                ${aula
                    ? "📚 Editar Aula"
                    : "📚 Nova Aula"}
            </h2>


            <button
                type="button"
                id="closeLessonEditor"
            >
                ✕
            </button>

        </div>


        <label>
            Lesson
        </label>


        <select
            id="lessonId"
            style="width:100%;margin-bottom:12px;"
        >

            <option value="">
                Selecionar Lesson
            </option>

            <option value="01">
                Lesson 01
            </option>

            <option value="02">
                Lesson 02
            </option>

            <option value="03">
                Lesson 03
            </option>

            <option value="04">
                Lesson 04
            </option>

            <option value="05/06">
                Lesson 05/06
            </option>

            <option value="07">
                Lesson 07
            </option>

            <option value="08">
                Lesson 08
            </option>

            <option value="09">
                Lesson 09
            </option>

            <option value="10">
                Lesson 10
            </option>

            <option value="11">
                Lesson 11
            </option>

            <option value="12">
                Lesson 12
            </option>

            <option value="13">
                Lesson 13
            </option>

            <option value="14">
                Lesson 14
            </option>

            <option value="15">
                Lesson 15
            </option>

            <option value="16">
                Lesson 16
            </option>

            <option value="17">
                Lesson 17
            </option>

            <option value="18">
                Lesson 18
            </option>

            <option value="19">
                Lesson 19
            </option>

            <option value="20">
                Lesson 20
            </option>

            <option value="21">
                Lesson 21
            </option>

            <option value="22">
                Lesson 22
            </option>

            <option value="23">
                Lesson 23
            </option>

            <option value="24">
                Lesson 24
            </option>

        </select>


        <label>
            Matéria
        </label>


        <input
            id="lessonSubject"
            type="text"
            readonly
            style="width:100%;margin-bottom:12px;"
        >


        <label>
            Data
        </label>


        <input
            id="lessonDate"
            type="date"
            style="width:100%;margin-bottom:12px;"
        >


        <label>
            Hora
        </label>


        <input
            id="lessonTime"
            type="time"
            style="width:100%;margin-bottom:12px;"
        >


        <hr>


        <h3>
            👨‍🎓 Alunos da Aula
        </h3>


        <input
            id="lessonStudentNumber"
            type="text"
            placeholder="Número do aluno"
            style="width:100%;margin-bottom:8px;"
        >


        <button
            type="button"
            id="addStudentToLesson"
        >
            ➕ Adicionar aluno
        </button>


        <button
            type="button"
            id="selectMultipleStudents"
        >
            ☑️ Selecionar vários
        </button>


        <div
            id="multipleStudentsBox"
            style="display:none;margin-top:10px;"
        ></div>


        <button
            type="button"
            id="addSelectedStudents"
            style="display:none;"
        >
            ➕ Adicionar selecionados
        </button>


        <div
            id="lessonStudents"
            style="margin-top:15px;"
        ></div>


        <hr>


        <button
            type="button"
            id="saveLesson"
        >
            💾 Guardar Aula
        </button>

    `;


    modal.appendChild(
        modal.querySelector("#lessonEditorTitle")
    );


    // reconstruir corretamente
    const conteudo =
        modal.innerHTML;

    modal.innerHTML =
        conteudo;


    overlay.appendChild(
        modal
    );


    document.body.appendChild(
        overlay
    );


    if (aula) {

        aulaEmEdicao =
            aula;

        preencherFormularioEditor(
            overlay,
            aula
        );

        configurarEditorExistente(
            overlay
        );

    }

    else {

        aulaEmEdicao =
            null;

        alunosDaAula =
            [];

        const dataInput =
            overlay.querySelector(
                "#lessonDate"
            );

        const horaInput =
            overlay.querySelector(
                "#lessonTime"
            );


        if (dataInput) {
            dataInput.value =
                data;
        }


        if (horaInput) {
            horaInput.value =
                hora;
        }


        configurarEditorNovaAula(
            overlay
        );

    }


    configurarMateriasDoEditor(
        overlay
    );


    configurarFechoEditor(
        overlay
    );


    atualizarListaDaAulaNoEditor(
        overlay
    );

}


// ======================================================
// PREENCHER EDITOR
// ======================================================

function preencherFormularioEditor(
    overlay,
    aula
) {

    const id =
        overlay.querySelector(
            "#lessonId"
        );


    const materia =
        overlay.querySelector(
            "#lessonSubject"
        );


    const data =
        overlay.querySelector(
            "#lessonDate"
        );


    const hora =
        overlay.querySelector(
            "#lessonTime"
        );


    if (id) {

        id.value =
            obterNumeroLesson(
                aula
            );

    }


    if (materia) {

        materia.value =
            aula.materia ||
            obterMateriaLesson(
                obterNumeroLesson(aula)
            );

    }


    if (data) {

        data.value =
            aula.data ||
            "";

    }


    if (hora) {

        hora.value =
            aula.hora ||
            "";

    }


    atualizarListaDaAulaNoEditor(
        overlay
    );

}


// ======================================================
// EDITOR DE AULA EXISTENTE
// ======================================================

function configurarEditorExistente(
    overlay
) {

    configurarBotaoAdicionarAluno(
        overlay
    );

    configurarBotaoSelecionarAlunos(
        overlay
    );

    configurarBotaoAdicionarSelecionados(
        overlay
    );


    const button =
        overlay.querySelector(
            "#saveLesson"
        );


    if (!button) {
        return;
    }


    button.onclick =
        async function (event) {

            event.preventDefault();


            if (!aulaEmEdicao) {
                return;
            }


            const id =
                overlay.querySelector(
                    "#lessonId"
                );


            const materia =
                overlay.querySelector(
                    "#lessonSubject"
                );


            const data =
                overlay.querySelector(
                    "#lessonDate"
                );


            const hora =
                overlay.querySelector(
                    "#lessonTime"
                );


            if (
                !id ||
                !materia ||
                !data ||
                !hora
            ) {

                mostrarNotificacao(
                    "Campos da aula não encontrados.",
                    "erro"
                );

                return;

            }


            if (
                !id.value ||
                !data.value ||
                !hora.value
            ) {

                mostrarNotificacao(
                    "Preenche a Lesson, a data e a hora.",
                    "erro"
                );

                return;

            }


            const numeros =
                alunosDaAula.map(
                    function (aluno) {

                        return aluno.numero;

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

                        idAula:
                            id.value,

                        materia:
                            obterMateriaLesson(
                                obterNumeroLesson({
                                    idAula:
                                        id.value
                                })
                            ),

                        data:
                            data.value,

                        hora:
                            hora.value,

                        alunos:
                            numeros

                    }

                );


                overlay.style.display =
                    "none";


                aulaEmEdicao =
                    null;


                alunosDaAula =
                    [];


                mostrarNotificacao(
                    "Aula guardada com sucesso ✅"
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao guardar aula:",
                    erro
                );


                mostrarNotificacao(
                    "Erro ao guardar aula.",
                    "erro"
                );

            }

        };

}


// ======================================================
// EDITOR - NOVA AULA
// ======================================================

function configurarEditorNovaAula(
    overlay
) {

    configurarBotaoAdicionarAluno(
        overlay
    );

    configurarBotaoSelecionarAlunos(
        overlay
    );

    configurarBotaoAdicionarSelecionados(
        overlay
    );


    const button =
        overlay.querySelector(
            "#saveLesson"
        );


    if (!button) {
        return;
    }


    button.onclick =
        async function (event) {

            event.preventDefault();


            const id =
                overlay.querySelector(
                    "#lessonId"
                );


            const materia =
                overlay.querySelector(
                    "#lessonSubject"
                );


            const data =
                overlay.querySelector(
                    "#lessonDate"
                );


            const hora =
                overlay.querySelector(
                    "#lessonTime"
                );


            if (
                !id ||
                !materia ||
                !data ||
                !hora
            ) {

                mostrarNotificacao(
                    "Campos da aula não encontrados.",
                    "erro"
                );

                return;

            }


            if (
                !id.value ||
                !data.value ||
                !hora.value
            ) {

                mostrarNotificacao(
                    "Seleciona a Lesson, a data e a hora.",
                    "erro"
                );

                return;

            }


            const existe =
                aulas.some(
                    function (aula) {

                        return (
                            aula.data ===
                            data.value &&
                            aula.hora ===
                            hora.value
                        );

                    }
                );


            if (existe) {

                mostrarNotificacao(
                    "Já existe uma aula nesse horário.",
                    "erro"
                );

                return;

            }


            const lesson =
                obterNumeroLesson({
                    idAula:
                        id.value
                });


            const nomeMateria =
                obterMateriaLesson(
                    lesson
                );


            const numeros =
                alunosDaAula.map(
                    function (aluno) {

                        return aluno.numero;

                    }
                );


            try {

                await addDoc(

                    collection(
                        db,
                        "aulas"
                    ),

                    {

                        idAula:
                            id.value,

                        materia:
                            nomeMateria,

                        data:
                            data.value,

                        hora:
                            hora.value,

                        alunos:
                            numeros

                    }

                );


                overlay.style.display =
                    "none";


                aulaEmEdicao =
                    null;


                alunosDaAula =
                    [];


                mostrarNotificacao(
                    "Aula criada com sucesso ✅"
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao criar aula:",
                    erro
                );


                mostrarNotificacao(
                    "Erro ao criar aula.",
                    "erro"
                );

            }

        };

}


// ======================================================
// MATÉRIA AUTOMÁTICA
// ======================================================

function configurarMateriasDoEditor(
    overlay
) {

    const select =
        overlay.querySelector(
            "#lessonId"
        );


    const campoMateria =
        overlay.querySelector(
            "#lessonSubject"
        );


    if (
        !select ||
        !campoMateria
    ) {

        return;

    }


    select.onchange =
        function () {

            const lesson =
                obterNumeroLesson({
                    idAula:
                        this.value
                });


            campoMateria.value =
                obterMateriaLesson(
                    lesson
                );

        };


    if (select.value) {

        const lesson =
            obterNumeroLesson({
                idAula:
                    select.value
            });


        campoMateria.value =
            obterMateriaLesson(
                lesson
            );

    }

}


// ======================================================
// FECHAR EDITOR
// ======================================================

function configurarFechoEditor(
    overlay
) {

    const fechar =
        overlay.querySelector(
            "#closeLessonEditor"
        );


    if (fechar) {

        fechar.onclick =
            function () {

                overlay.style.display =
                    "none";

                aulaEmEdicao =
                    null;

                alunosDaAula =
                    [];

            };

    }


    overlay.onclick =
        function (event) {

            if (
                event.target ===
                overlay
            ) {

                overlay.style.display =
                    "none";

                aulaEmEdicao =
                    null;

                alunosDaAula =
                    [];

            }

        };

}


// ======================================================
// LISTA DE ALUNOS DA AULA
// ======================================================

function atualizarListaDaAulaNoEditor(
    overlay
) {

    const lista =
        overlay.querySelector(
            "#lessonStudents"
        );


    if (!lista) {
        return;
    }


    if (
        !Array.isArray(
            alunosDaAula
        ) ||
        alunosDaAula.length === 0
    ) {

        lista.innerHTML =
            "Ainda não existem alunos nesta aula.";

        return;

    }


    lista.innerHTML =
        "";


    alunosDaAula.forEach(
        function (aluno) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "student-card";


            div.innerHTML =
                `
                    <strong>
                        ${aluno.numero}
                    </strong>

                    -
                    ${aluno.nome}
                `;


            lista.appendChild(
                div
            );

        }
    );

}


// ======================================================
// ADICIONAR UM ALUNO
// ======================================================

function configurarBotaoAdicionarAluno(
    overlay
) {

    const button =
        overlay.querySelector(
            "#addStudentToLesson"
        );


    if (!button) {
        return;
    }


    button.onclick =
        function (event) {

            event.preventDefault();


            const input =
                overlay.querySelector(
                    "#lessonStudentNumber"
                );


            if (!input) {
                return;
            }


            const numero =
                input.value.trim();


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
                                a.numero
                            ) ===
                            String(
                                numero
                            )
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
                            String(
                                a.id
                            ) ===
                            String(
                                aluno.id
                            )
                        );

                    }
                );


            if (existe) {

                mostrarNotificacao(
                    "Este aluno já está nesta aula.",
                    "erro"
                );

                return;

            }


            alunosDaAula.push(
                aluno
            );


            input.value =
                "";


            atualizarListaDaAulaNoEditor(
                overlay
            );


            mostrarNotificacao(
                "Aluno adicionado: " +
                aluno.nome
            );

        };

}


// ======================================================
// SELECIONAR VÁRIOS ALUNOS
// ======================================================

function configurarBotaoSelecionarAlunos(
    overlay
) {

    const button =
        overlay.querySelector(
            "#selectMultipleStudents"
        );


    if (!button) {
        return;
    }


    button.onclick =
        function (event) {

            event.preventDefault();


            const caixa =
                overlay.querySelector(
                    "#multipleStudentsBox"
                );


            if (!caixa) {
                return;
            }


            caixa.innerHTML =
                "";


            alunos.forEach(
                function (aluno) {

                    const label =
                        document.createElement(
                            "label"
                        );


                    label.style.display =
                        "block";


                    label.style.padding =
                        "8px";


                    const checkbox =
                        document.createElement(
                            "input"
                        );


                    checkbox.type =
                        "checkbox";


                    checkbox.value =
                        aluno.numero;


                    checkbox.checked =
                        alunosDaAula.some(
                            function (a) {

                                return (
                                    String(
                                        a.id
                                    ) ===
                                    String(
                                        aluno.id
                                    )
                                );

                            }
                        );


                    label.appendChild(
                        checkbox
                    );


                    label.appendChild(
                        document.createTextNode(
                            " " +
                            aluno.numero +
                            " - " +
                            aluno.nome
                        )
                    );


                    caixa.appendChild(
                        label
                    );

                }
            );


            caixa.style.display =
                "block";


            const add =
                overlay.querySelector(
                    "#addSelectedStudents"
                );


            if (add) {

                add.style.display =
                    "inline-block";

            }

        };

}


// ======================================================
// ADICIONAR SELECIONADOS
// ======================================================

function configurarBotaoAdicionarSelecionados(
    overlay
) {

    const button =
        overlay.querySelector(
            "#addSelectedStudents"
        );


    if (!button) {
        return;
    }


    button.onclick =
        function (event) {

            event.preventDefault();


            const caixa =
                overlay.querySelector(
                    "#multipleStudentsBox"
                );


            if (!caixa) {
                return;
            }


            caixa
                .querySelectorAll(
                    'input[type="checkbox"]:checked'
                )
                .forEach(
                    function (checkbox) {

                        const aluno =
                            alunos.find(
                                function (a) {

                                    return (
                                        String(
                                            a.numero
                                        ) ===
                                        String(
                                            checkbox.value
                                        )
                                    );

                                }
                            );


                        if (!aluno) {
                            return;
                        }


                        const existe =
                            alunosDaAula.some(
                                function (a) {

                                    return (
                                        String(
                                            a.id
                                        ) ===
                                        String(
                                            aluno.id
                                        )
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


            atualizarListaDaAulaNoEditor(
                overlay
            );


            caixa.style.display =
                "none";


            button.style.display =
                "none";

        };

}


// ======================================================
// CALENDÁRIO
// ======================================================

function renderizarCalendario() {

    const container =
        $("monthsContainer");


    if (!container) {

        console.warn(
            "Elemento #monthsContainer não encontrado."
        );

        return;

    }


    const ano =
        mesCalendarioAtual.getFullYear();


    const mes =
        mesCalendarioAtual.getMonth();


    const primeiroDia =
        new Date(
            ano,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        );


    const totalDias =
        ultimoDia.getDate();


    const nomeMes =
        primeiroDia.toLocaleDateString(
            "pt-PT",
            {
                month:
                    "long",
                year:
                    "numeric"
            }
        );


    container.innerHTML = `

        <div class="calendar-month">

            <h3>

                📅

                ${
                    nomeMes
                        .charAt(0)
                        .toUpperCase() +
                    nomeMes.slice(1)
                }

            </h3>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-bottom:15px;
                "
            >

                <button
                    type="button"
                    id="previousMonth"
                    style="width:auto;"
                >
                    ◀ Mês anterior
                </button>


                <button
                    type="button"
                    id="nextMonth"
                    style="width:auto;"
                >
                    Próximo mês ▶
                </button>

            </div>


            <div class="calendar-table">

                <div class="calendar-header">

                    <div class="calendar-time-header">
                        Dia
                    </div>

                    ${criarCabecalhoDias(
                        ano,
                        mes,
                        totalDias
                    )}

                </div>


                ${criarLinhasHorarias(
                    ano,
                    mes,
                    totalDias
                )}

            </div>

        </div>

    `;


    configurarNavegacaoCalendario();

    configurarCliquesCalendario();

}


// ======================================================
// CABEÇALHO DOS DIAS
// ======================================================

function criarCabecalhoDias(
    ano,
    mes,
    totalDias
) {

    let html =
        "";


    for (
        let dia = 1;
        dia <= totalDias;
        dia++
    ) {

        const data =
            criarDataString(
                ano,
                mes,
                dia
            );


        const dataObj =
            new Date(
                ano,
                mes,
                dia
            );


        const semana =
            dataObj.toLocaleDateString(
                "pt-PT",
                {
                    weekday:
                        "short"
                }
            );


        const fechado =
            diasFechados.includes(
                data
            );


        html += `

            <div
                class="
                    calendar-day-header
                    ${fechado
                        ? "closed-day"
                        : ""}
                "
                data-date="${data}"
            >

                <strong>
                    ${semana.toUpperCase()}
                </strong>


                <span>
                    ${dia}
                </span>

            </div>

        `;

    }


    return html;

}


// ======================================================
// LINHAS HORÁRIAS
// ======================================================

function criarLinhasHorarias(
    ano,
    mes,
    totalDias
) {

    const horas = [

        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00"

    ];


    let html =
        "";


    horas.forEach(
        function (hora) {

            html += `

                <div class="calendar-row">

                    <div class="calendar-time">
                        ${hora}
                    </div>

                    ${criarCelulasHora(
                        ano,
                        mes,
                        totalDias,
                        hora
                    )}

                </div>

            `;

        }
    );


    return html;

}


// ======================================================
// CÉLULAS DAS HORAS
// ======================================================

function criarCelulasHora(
    ano,
    mes,
    totalDias,
    hora
) {

    let html =
        "";


    for (
        let dia = 1;
        dia <= totalDias;
        dia++
    ) {

        const data =
            criarDataString(
                ano,
                mes,
                dia
            );


        const aulasDaCelula =
            aulas.filter(
                function (aula) {

                    return (
                        String(
                            aula.data || ""
                        ) === data &&
                        String(
                            aula.hora || ""
                        ) === hora
                    );

                }
            );


        const fechado =
            diasFechados.includes(
                data
            );


        html += `

            <div
                class="
                    calendar-cell
                    ${fechado
                        ? "closed-day"
                        : ""}
                "
                data-date="${data}"
                data-time="${hora}"
            >

                ${criarAulasDaCelula(
                    aulasDaCelula
                )}

            </div>

        `;

    }


    return html;

}


// ======================================================
// AULAS DENTRO DO CALENDÁRIO
// ======================================================

function criarAulasDaCelula(
    lista
) {

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        return "";

    }


    let html =
        "";


    lista.forEach(
        function (aula) {

            const lesson =
                obterNumeroLesson(
                    aula
                );


            const materia =
                obterMateriaLesson(
                    lesson,
                    aula
                );


            const classe =
                obterClasseLesson(
                    lesson
                );


            html += `

                <div
                    class="
                        lesson-cell
                        ${classe}
                    "
                    data-lesson-id="${aula.id}"
                    title="${materia}"
                >

                    <div class="lesson-number">

                        Lesson ${lesson}

                    </div>


                    <div class="lesson-subject">

                        ${materia}

                    </div>

                </div>

            `;

        }
    );


    return html;

}


// ======================================================
// DATA STRING
// ======================================================

function criarDataString(
    ano,
    mes,
    dia
) {

    return (

        ano +
        "-" +
        String(
            mes + 1
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            dia
        ).padStart(
            2,
            "0"
        )

    );

}


// ======================================================
// NAVEGAÇÃO DO CALENDÁRIO
// ======================================================

function configurarNavegacaoCalendario() {

    const anterior =
        $("previousMonth");


    const seguinte =
        $("nextMonth");


    if (anterior) {

        anterior.onclick =
            function () {

                mesCalendarioAtual.setMonth(
                    mesCalendarioAtual.getMonth() - 1
                );


                renderizarCalendario();

            };

    }


    if (seguinte) {

        seguinte.onclick =
            function () {

                mesCalendarioAtual.setMonth(
                    mesCalendarioAtual.getMonth() + 1
                );


                renderizarCalendario();

            };

    }

}


// ======================================================
// CLIQUES NO CALENDÁRIO
// ======================================================

function configurarCliquesCalendario() {

    document
        .querySelectorAll(
            ".calendar-cell"
        )
        .forEach(
            function (celula) {

                celula.onclick =
                    function () {

                        const data =
                            this.dataset.date;


                        const hora =
                            this.dataset.time;


                        const aulaExistente =
                            aulas.find(
                                function (aula) {

                                    return (
                                        String(
                                            aula.data
                                        ) === data &&
                                        String(
                                            aula.hora
                                        ) === hora
                                    );

                                }
                            );


                        if (
                            aulaExistente
                        ) {

                            abrirAula(
                                aulaExistente
                            );

                            return;

                        }


                        if (
                            diasFechados.includes(
                                data
                            )
                        ) {

                            mostrarNotificacao(
                                "Este dia está fechado.",
                                "erro"
                            );

                            return;

                        }


                        abrirNovaAulaCalendario(
                            data,
                            hora
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            ".lesson-cell"
        )
        .forEach(
            function (elemento) {

                elemento.onclick =
                    function (event) {

                        event.stopPropagation();


                        const id =
                            this.dataset.lessonId;


                        const aula =
                            aulas.find(
                                function (a) {

                                    return (
                                        a.id === id
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

}


// ======================================================
// NOVA AULA PELO CALENDÁRIO
// ======================================================

function abrirNovaAulaCalendario(
    data,
    hora
) {

    aulaEmEdicao =
        null;


    alunosDaAula =
        [];


    criarEditorAutomatico(
        null,
        data,
        hora
    );

}


// ======================================================
// ADICIONAR NOVO MÊS
// ======================================================

function configurarAdicionarMes() {

    const button =
        $("addMonthButton");


    if (!button) {

        console.warn(
            "Botão addMonthButton não encontrado."
        );

        return;

    }


    button.onclick =
        async function () {

            const atual =
                new Date(
                    mesCalendarioAtual
                );


            const mes =
                atual.getMonth();


            const ano =
                atual.getFullYear();


            const id =
                ano +
                "-" +
                String(
                    mes + 1
                ).padStart(
                    2,
                    "0"
                );


            const nome =
                atual.toLocaleDateString(
                    "pt-PT",
                    {
                        month:
                            "long",
                        year:
                            "numeric"
                    }
                );


            try {

                await setDoc(

                    doc(
                        db,
                        "mesesCalendario",
                        id
                    ),

                    {

                        ano:
                            ano,

                        mes:
                            mes + 1,

                        nome:
                            nome,

                        criadoEm:
                            new Date()

                    }

                );


                mostrarNotificacao(
                    "Mês adicionado com sucesso ✅"
                );


                renderizarCalendario();

            }

            catch (erro) {

                console.error(
                    "Erro ao adicionar mês:",
                    erro
                );


                mostrarNotificacao(
                    "Erro ao adicionar mês.",
                    "erro"
                );

            }

        };

}


// ======================================================
// CONFIGURAR CALENDÁRIO
// ======================================================

function iniciarCalendario() {

    configurarAdicionarMes();

    carregarMesesCalendario();

    renderizarCalendario();

}


// ======================================================
// PESQUISA
// ======================================================

function iniciarPesquisa() {

    configurarPesquisa();

}


// ======================================================
// EXPORTAR EXCEL
// ======================================================

function configurarExportacaoExcel() {

    const button =
        $("exportReportButton");


    if (!button) {
        return;
    }


    button.onclick =
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


            try {

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
                                    aluno.aulasRealizadas ||
                                    0,

                                "Exame":
                                    aluno.estadoExame ||
                                    "Sem exames",

                                "Validade Licença":
                                    aluno.validadeLicenca ||
                                    "",

                                "Validade Código":
                                    aluno.validadeCodigo ||
                                    ""

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
                                    aula.idAula ||
                                    "",

                                "Data":
                                    aula.data ||
                                    "",

                                "Hora":
                                    aula.hora ||
                                    "",

                                "Matéria":
                                    aula.materia ||
                                    "",

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


                mostrarNotificacao(
                    "Relatório Excel criado com sucesso ✅"
                );

            }

            catch (erro) {

                console.error(
                    erro
                );


                mostrarNotificacao(
                    "Erro ao exportar relatório.",
                    "erro"
                );

            }

        };

}


// ======================================================
// PDF - ALUNOS ATIVOS
// ======================================================

function configurarPDF() {

    const button =
        $("printActiveStudentsButton");


    if (!button) {
        return;
    }


    button.onclick =
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


            try {

                const {
                    jsPDF
                } =
                    window.jspdf;


                const pdf =
                    new jsPDF();


                pdf.setFont(
                    "helvetica",
                    "bold"
                );


                pdf.setFontSize(
                    18
                );


                pdf.text(
                    "English Check",
                    20,
                    20
                );


                pdf.setFontSize(
                    14
                );


                pdf.text(
                    "Lista de Alunos Ativos",
                    20,
                    30
                );


                pdf.setFont(
                    "helvetica",
                    "normal"
                );


                pdf.setFontSize(
                    10
                );


                pdf.text(
                    "Data: " +
                    new Date()
                        .toLocaleDateString(
                            "pt-PT"
                        ),
                    20,
                    38
                );


                let y =
                    50;


                const ativos =
                    alunos
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
                    ativos.length === 0
                ) {

                    pdf.text(
                        "Não existem alunos ativos.",
                        20,
                        y
                    );

                }


                ativos.forEach(
                    function (
                        aluno,
                        index
                    ) {

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
                            (
                                aluno.nome ||
                                "Sem nome"
                            ),
                            20,
                            y
                        );


                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );


                        pdf.text(
                            "N.º: " +
                            (
                                aluno.numero ||
                                "-"
                            ),
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


                        y +=
                            18;

                    }
                );


                pdf.save(
                    "Alunos_Ativos.pdf"
                );


                mostrarNotificacao(
                    "PDF criado com sucesso ✅"
                );

            }

            catch (erro) {

                console.error(
                    erro
                );


                mostrarNotificacao(
                    "Erro ao criar PDF.",
                    "erro"
                );

            }

        };

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

function iniciarAplicacao() {

    console.log(
        "ENGLISH CHECK iniciado."
    );


    iniciarLogin();

    iniciarLogout();

    configurarMenu();

    iniciarPesquisa();

    iniciarCalendario();

    configurarExportacaoExcel();

    configurarPDF();


    if ($("app")) {

        $("app").style.display =
            "none";

    }


    carregarAlunos();

    carregarAulas();

}


// ======================================================
// ARRANCAR
// ======================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao
    );

}

else {

    iniciarAplicacao();

}
