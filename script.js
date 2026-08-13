// ============================================
// ENGLISH CHECK
// GESTÃO DE AULAS DE CÓDIGO DA ESTRADA
// ============================================


// ============================================
// FIREBASE
// ============================================

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
    arrayUnion
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// ============================================
// CONFIGURAÇÃO FIREBASE
// ============================================

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


// ============================================
// INICIAR FIREBASE
// ============================================

const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(
        app
    );


// ============================================
// DADOS
// ============================================

let alunos = [];

let aulas = [];


// ============================================
// ALUNOS DA AULA
// ============================================

let alunosDaAula = [];


// ============================================
// AULA EM EDIÇÃO
// ============================================

let aulaEmEdicao = null;


// ============================================
// MESES DO CALENDÁRIO
// ============================================

let mesesCalendario = [];


// ============================================
// DIAS FECHADOS
// ============================================

let diasFechados = [];


// ============================================
// ALUNO DO RESULTADO DO EXAME
// ============================================

let alunoResultadoExame = null;


// ============================================
// LER ALUNOS DO FIREBASE
// ============================================

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


        if (
            typeof atualizarDashboard ===
            "function"
        ) {

            atualizarDashboard();

        }


        if (
            typeof mostrarAlunos ===
            "function"
        ) {

            mostrarAlunos();

        }


        if (
            typeof mostrarAulas ===
            "function"
        ) {

            mostrarAulas();

        }

    },

    function (erro) {

        console.error(
            "Erro ao carregar alunos:",
            erro
        );

    }

);


// ============================================
// LER AULAS DO FIREBASE
// ============================================

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


        if (
            typeof mostrarAulas ===
            "function"
        ) {

            mostrarAulas();

        }


        if (
            typeof renderizarCalendario ===
            "function"
        ) {

            renderizarCalendario();

        }

    },

    function (erro) {

        console.error(
            "Erro ao carregar aulas:",
            erro
        );

    }

);

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
// FUNÇÃO AUXILIAR
// ======================================================

function $(id) {
    return document.getElementById(id);
}


// ======================================================
// LOGIN
// ======================================================

function iniciarLogin() {

    const button = $("loginButton");
    const username = $("username");
    const password = $("password");
    const message = $("loginMessage");

    if (!button || !username || !password) {
        console.error("Elementos do login não encontrados.");
        return;
    }

    button.onclick = function (event) {

        event.preventDefault();

        const user = username.value.trim();
        const pass = password.value.trim();

        if (message) {
            message.innerHTML = "";
        }

        if (!user || !pass) {

            if (message) {
                message.innerHTML =
                    "Introduz o utilizador e a palavra-passe.";
                message.style.color = "red";
            }

            return;
        }

        const encontrado = utilizadores.find(function (u) {

            return (
                u.username === user &&
                u.password === pass
            );

        });

        if (!encontrado) {

            if (message) {
                message.innerHTML =
                    "Utilizador ou palavra-passe incorretos.";
                message.style.color = "red";
            }

            return;
        }

        $("loginPage").style.display = "none";

        $("app").style.display = "block";

        password.value = "";

        if (message) {
            message.innerHTML = "";
        }

        mostrarPagina("homePage");
        atualizarDashboard();

    };


    password.onkeydown = function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            button.click();

        }

    };

}


// ======================================================
// LOGOUT
// ======================================================

function iniciarLogout() {

    const button = $("logoutButton");

    if (!button) {
        return;
    }

    button.onclick = function () {

        if ($("app")) {
            $("app").style.display = "none";
        }

        if ($("loginPage")) {
            $("loginPage").style.display = "flex";
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


// ======================================================
// MENU
// ======================================================

function mostrarPagina(pagina) {

    const paginas = [
        "homePage",
        "studentsPage",
        "lessonsPage",
        "calendarPage",
        "reportsPage"
    ];

    paginas.forEach(function (id) {

        const paginaElemento = $(id);

        if (!paginaElemento) {
            return;
        }

        paginaElemento.style.display =
            id === pagina ? "block" : "none";

    });

}


function configurarMenu() {

    const menus = {

        homeMenu: function () {

            mostrarPagina("homePage");
            atualizarDashboard();

        },

        studentsMenu: function () {

            mostrarPagina("studentsPage");
            mostrarAlunos();

        },

        lessonsMenu: function () {

            mostrarPagina("lessonsPage");
            mostrarAulas();

        },

        calendarMenu: function () {

            mostrarPagina("calendarPage");
            renderizarCalendario();

        },

        reportsMenu: function () {

            mostrarPagina("reportsPage");

        }

    };


    Object.keys(menus).forEach(function (id) {

        const button = $(id);

        if (!button) {
            return;
        }

        button.onclick = menus[id];

    });

}


// ======================================================
// DASHBOARD
// ======================================================

function atualizarDashboard() {

    if (!Array.isArray(alunos)) {
        return;
    }

    const ativos = alunos.filter(function (aluno) {

        return aluno.estado === "Ativo";

    });

    const aprovados = alunos.filter(function (aluno) {

        return aluno.estadoExame === "Aprovado";

    });

    if ($("totalStudents")) {
        $("totalStudents").innerText = ativos.length;
    }

    if ($("totalApproved")) {
        $("totalApproved").innerText = aprovados.length;
    }

    mostrarAlertas();

}


// ======================================================
// ALERTAS
// ======================================================

function mostrarAlertas() {

    const lista = $("alertsList");

    if (!lista || !Array.isArray(alunos)) {
        return;
    }

    const hoje = new Date();

    const limite = new Date();

    limite.setMonth(
        limite.getMonth() + 3
    );

    const alertas = [];

    alunos.forEach(function (aluno) {

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

    });


    function verificar(aluno, data, tipo) {

        if (!data) {
            return;
        }

        const validade =
            new Date(data + "T00:00:00");

        if (isNaN(validade.getTime())) {
            return;
        }

        if (validade < hoje) {

            alertas.push(`
                <div class="alert expired">
                    🔴 <strong>${aluno.nome || "Aluno"}</strong>
                    <br>
                    ${tipo} já expirou.
                </div>
            `);

        }

        else if (validade <= limite) {

            alertas.push(`
                <div class="alert">
                    ⚠️ <strong>${aluno.nome || "Aluno"}</strong>
                    <br>
                    ${tipo} termina em breve:
                    ${formatarData(data)}
                </div>
            `);

        }

    }


    if (alertas.length === 0) {

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
// DATA
// ======================================================

function formatarData(data) {

    if (!data) {
        return "Não definida";
    }

    const d =
        new Date(data + "T00:00:00");

    if (isNaN(d.getTime())) {
        return "Data inválida";
    }

    return d.toLocaleDateString("pt-PT");

}


// ======================================================
// ALUNOS
// ======================================================

function mostrarAlunos() {

    const lista = $("studentsList");

    if (!lista || !Array.isArray(alunos)) {
        return;
    }

    const pesquisa =
        $("searchStudent")
            ? $("searchStudent").value
                .trim()
                .toLowerCase()
            : "";


    const resultado = [...alunos]
        .filter(function (aluno) {

            const numero =
                String(aluno.numero || "")
                    .toLowerCase();

            const nome =
                String(aluno.nome || "")
                    .toLowerCase();

            return (
                pesquisa === "" ||
                numero.includes(pesquisa) ||
                nome.includes(pesquisa)
            );

        })
        .sort(function (a, b) {

            return Number(a.numero || 0) -
                   Number(b.numero || 0);

        });


    if (resultado.length === 0) {

        lista.innerHTML =
            "<p>Nenhum aluno encontrado.</p>";

        return;
    }


    lista.innerHTML = "";


    resultado.forEach(function (aluno) {

        const card =
            document.createElement("div");

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
                <strong>Estado:</strong>
                ${aluno.estado || "-"}
            </p>

            <p>
                <strong>Aulas:</strong>
                ${aluno.aulasRealizadas || 0}
            </p>

            <p>
                <strong>Exame:</strong>
                ${aluno.estadoExame || "Sem exame"}
            </p>

            <p>
                <strong>Validade Licença:</strong>
                ${formatarData(aluno.validadeLicenca)}
            </p>

            <p>
                <strong>Validade Código:</strong>
                ${formatarData(aluno.validadeCodigo)}
            </p>

        `;

        lista.appendChild(card);

    });

}


// ======================================================
// PESQUISA
// ======================================================

function configurarPesquisa() {

    const campo = $("searchStudent");

    if (!campo) {
        return;
    }

    campo.oninput = function () {

        mostrarAlunos();

    };

}


// ======================================================
// AULAS
// ======================================================

function mostrarAulas() {

    const lista = $("lessonsList");

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


    lista.innerHTML = "";


    [...aulas]
        .sort(function (a, b) {

            return new Date(b.data) -
                   new Date(a.data);

        })
        .forEach(function (aula) {

            let alunosTexto =
                "Nenhum aluno adicionado.";


            if (
                Array.isArray(aula.alunos) &&
                aula.alunos.length
            ) {

                alunosTexto =
                    aula.alunos.map(function (numero) {

                        const aluno =
                            alunos.find(function (a) {

                                return String(a.numero) ===
                                       String(numero);

                            });

                        return "• " +
                            numero +
                            (
                                aluno
                                    ? " - " + aluno.nome
                                    : ""
                            );

                    }).join("<br>");

            }


            const card =
                document.createElement("div");

            card.className =
                "student-card";


            card.innerHTML = `

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
                        Array.isArray(aula.alunos)
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


            lista.appendChild(card);

        });


    adicionarEventosDasAulas();

}


// ======================================================
// EVENTOS DAS AULAS
// ======================================================

function adicionarEventosDasAulas() {

    document
        .querySelectorAll(".editLessonButton")
        .forEach(function (button) {

            button.onclick = function () {

                const id =
                    this.dataset.id;

                const aula =
                    aulas.find(function (a) {

                        return a.id === id;

                    });

                if (aula) {
                    abrirAula(aula);
                }

            };

        });


    document
        .querySelectorAll(".deleteLessonButton")
        .forEach(function (button) {

            button.onclick = async function () {

                const id =
                    this.dataset.id;

                const aula =
                    aulas.find(function (a) {

                        return a.id === id;

                    });

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
                        doc(db, "aulas", id)
                    );

                    const indice =
                        aulas.findIndex(function (a) {

                            return a.id === id;

                        });

                    if (indice !== -1) {
                        aulas.splice(indice, 1);
                    }

                    mostrarAulas();
                    renderizarCalendario();
                    atualizarDashboard();

                    mostrarNotificacao(
                        "Aula apagada com sucesso ✅"
                    );

                }

                catch (erro) {

                    console.error(erro);

                    mostrarNotificacao(
                        "Erro ao apagar aula.",
                        "erro"
                    );

                }

            };

        });

}


// ======================================================
// ABRIR AULA
// ======================================================

function abrirAula(aula) {

    if (!aula) {
        return;
    }


    aulaEmEdicao = aula;

    alunosDaAula = [];


    (aula.alunos || []).forEach(function (numero) {

        const aluno =
            alunos.find(function (a) {

                return String(a.numero) ===
                       String(numero);

            });

        if (aluno) {
            alunosDaAula.push(aluno);
        }

    });


    const original =
        $("saveLesson");

    if (!original) {

        mostrarNotificacao(
            "Formulário da aula não encontrado.",
            "erro"
        );

        return;
    }


    const section =
        original.closest(".section");

    if (!section) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "lesson-editor-overlay";


    const modal =
        document.createElement("div");

    modal.className =
        "lesson-editor-modal";


    const close =
        document.createElement("button");

    close.type = "button";
    close.innerHTML = "×";
    close.className = "close-lesson-editor";


    const content =
        section.cloneNode(true);


    /*
     * IMPORTANTE:
     * NÃO removemos os IDs.
     * Os botões precisam deles.
     */


    const title =
        content.querySelector("h2");

    if (title) {
        title.innerHTML =
            "📚 Editar Aula";
    }


    modal.appendChild(close);
    modal.appendChild(content);

    overlay.appendChild(modal);

    document.body.appendChild(overlay);


    preencherEditorAula(
        overlay,
        aula
    );


    close.onclick =
        function () {

            overlay.remove();

            aulaEmEdicao = null;
            alunosDaAula = [];

        };


    overlay.onclick =
        function (event) {

            if (event.target === overlay) {

                overlay.remove();

                aulaEmEdicao = null;
                alunosDaAula = [];

            }

        };

}


// ======================================================
// PREENCHER EDITOR DA AULA
// ======================================================

function preencherEditorAula(
    overlay,
    aula
) {

    const id =
        overlay.querySelector("#lessonId");

    const materia =
        overlay.querySelector("#lessonSubject");

    const data =
        overlay.querySelector("#lessonDate");

    const hora =
        overlay.querySelector("#lessonTime");


    if (id) {
        id.value = aula.idAula || "";
    }

    if (materia) {
        materia.value = aula.materia || "";
    }

    if (data) {
        data.value = aula.data || "";
    }

    if (hora) {
        hora.value = aula.hora || "";
    }


    atualizarListaDaAulaNoEditor(
        overlay
    );


    configurarBotaoAdicionarAluno(
        overlay
    );


    configurarBotaoSelecionarAlunos(
        overlay
    );


    configurarBotaoAdicionarSelecionados(
        overlay
    );


    configurarBotaoGuardar(
        overlay
    );

}


// ======================================================
// LISTA DE ALUNOS DA AULA
// ======================================================

function atualizarListaDaAulaNoEditor(overlay) {

    const lista =
        overlay.querySelector("#lessonStudents");

    if (!lista) {
        return;
    }


    if (
        !Array.isArray(alunosDaAula) ||
        alunosDaAula.length === 0
    ) {

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

        div.innerHTML =
            `<strong>${aluno.numero}</strong> - ${aluno.nome}`;

        lista.appendChild(div);

    });

}


// ======================================================
// ADICIONAR UM ALUNO
// ======================================================

function configurarBotaoAdicionarAluno(overlay) {

    const button =
        overlay.querySelector(
            "#addStudentToLesson"
        );

    if (!button) {
        return;
    }


    button.onclick = function (event) {

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
            alunos.find(function (a) {

                return String(a.numero) ===
                       String(numero);

            });


        if (!aluno) {

            mostrarNotificacao(
                "Aluno não encontrado.",
                "erro"
            );

            return;
        }


        const existe =
            alunosDaAula.some(function (a) {

                return String(a.id) ===
                       String(aluno.id);

            });


        if (existe) {

            mostrarNotificacao(
                "Este aluno já está nesta aula.",
                "erro"
            );

            return;
        }


        alunosDaAula.push(aluno);

        input.value = "";


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

function configurarBotaoSelecionarAlunos(overlay) {

    const button =
        overlay.querySelector(
            "#selectMultipleStudents"
        );

    if (!button) {
        return;
    }


    button.onclick = function (event) {

        event.preventDefault();


        const caixa =
            overlay.querySelector(
                "#multipleStudentsBox"
            );

        if (!caixa) {
            return;
        }


        caixa.innerHTML = "";


        alunos.forEach(function (aluno) {

            const label =
                document.createElement("label");

            label.style.display = "block";
            label.style.padding = "8px";


            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.value = aluno.numero;


            checkbox.checked =
                alunosDaAula.some(function (a) {

                    return String(a.id) ===
                           String(aluno.id);

                });


            label.appendChild(checkbox);

            label.appendChild(
                document.createTextNode(
                    " " +
                    aluno.numero +
                    " - " +
                    aluno.nome
                )
            );


            caixa.appendChild(label);

        });


        caixa.style.display = "block";


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


    button.onclick = function (event) {

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
            .forEach(function (checkbox) {

                const aluno =
                    alunos.find(function (a) {

                        return String(a.numero) ===
                               String(checkbox.value);

                    });


                if (!aluno) {
                    return;
                }


                const existe =
                    alunosDaAula.some(function (a) {

                        return String(a.id) ===
                               String(aluno.id);

                    });


                if (!existe) {
                    alunosDaAula.push(aluno);
                }

            });


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
// GUARDAR AULA
// ======================================================

function configurarBotaoGuardar(overlay) {

    const button =
        overlay.querySelector(
            "#saveLesson"
        );

    if (!button) {
        return;
    }


    button.onclick = async function (event) {

        event.preventDefault();


        if (!aulaEmEdicao) {

            mostrarNotificacao(
                "Nenhuma aula em edição.",
                "erro"
            );

            return;
        }


        const id =
            overlay.querySelector("#lessonId");

        const materia =
            overlay.querySelector("#lessonSubject");

        const data =
            overlay.querySelector("#lessonDate");

        const hora =
            overlay.querySelector("#lessonTime");


        if (!id || !materia || !data || !hora) {

            mostrarNotificacao(
                "Campos da aula não encontrados.",
                "erro"
            );

            return;
        }


        if (
            !id.value.trim() ||
            !materia.value.trim() ||
            !data.value ||
            !hora.value
        ) {

            mostrarNotificacao(
                "Preenche todos os dados da aula.",
                "erro"
            );

            return;
        }


        const numeros =
            alunosDaAula.map(function (aluno) {

                return aluno.numero;

            });


        try {

            await updateDoc(
                doc(
                    db,
                    "aulas",
                    aulaEmEdicao.id
                ),
                {

                    idAula:
                        id.value.trim(),

                    materia:
                        materia.value.trim(),

                    data:
                        data.value,

                    hora:
                        hora.value,

                    alunos:
                        numeros

                }
            );


            aulaEmEdicao.idAula =
                id.value.trim();

            aulaEmEdicao.materia =
                materia.value.trim();

            aulaEmEdicao.data =
                data.value;

            aulaEmEdicao.hora =
                hora.value;

            aulaEmEdicao.alunos =
                numeros;


            const indice =
                aulas.findIndex(function (a) {

                    return a.id ===
                           aulaEmEdicao.id;

                });


            if (indice !== -1) {
                aulas[indice] =
                    aulaEmEdicao;
            }


            overlay.remove();

            aulaEmEdicao = null;
            alunosDaAula = [];


            mostrarAulas();
            renderizarCalendario();
            atualizarDashboard();


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
// INICIALIZAÇÃO
// ======================================================

function iniciarAplicacao() {

    iniciarLogin();

    iniciarLogout();

    configurarMenu();

    configurarPesquisa();

    if ($("app")) {
        $("app").style.display = "none";
    }

}


// ======================================================
// ARRANCAR
// ======================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao
    );

}
else {

    iniciarAplicacao();

}

// ============================================
// EXPORTAR RELATÓRIO EXCEL
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


            try {

                const livro =
                    XLSX.utils.book_new();


                // =================================
                // DADOS DOS ALUNOS
                // =================================

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


                // =================================
                // DADOS DAS AULAS
                // =================================

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


                // =================================
                // GUARDAR
                // =================================

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
                    "Erro ao exportar Excel:",
                    erro
                );


                mostrarNotificacao(
                    "Erro ao exportar relatório: " +
                    erro.message,
                    "erro"
                );

            }

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
                                    Number(
                                        a.numero
                                    ) -
                                    Number(
                                        b.numero
                                    )
                                );

                            }
                        );


                if (
                    alunosAtivos.length ===
                    0
                ) {

                    pdf.text(
                        "Não existem alunos ativos.",
                        20,
                        y
                    );

                }


                alunosAtivos.forEach(
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
                    "Erro ao criar PDF:",
                    erro
                );


                mostrarNotificacao(
                    "Erro ao criar PDF: " +
                    erro.message,
                    "erro"
                );

            }

        }
    );

}

// ======================================================
// CALENDÁRIO
// ======================================================

// MÊS ATUAL DO CALENDÁRIO
let mesCalendarioAtual = new Date();


// ======================================================
// MATÉRIAS DAS LESSONS
// ======================================================

const materiasCalendario = {

    "1": "Driver Profile",

    "2": "Driver and Physical/Psychological Fitness",

    "3": "Road Safety and Defensive Driving",

    "4": "Traffic Rules and Road Signs",

    "5/6": "Vehicle and Driver Responsibilities",

    "7": "Driving Licence and Legal Requirements",

    "8": "Road Users",

    "9": "Speed",

    "10": "Safety Distance",

    "11": "Overtaking",

    "12": "Stopping and Parking",

    "13": "Changing Direction",

    "14": "Intersections",

    "15": "Traffic Lights and Signals",

    "16": "Road Signs",

    "17": "Special Manoeuvres",

    "18": "Motorways and Expressways",

    "19": "Night Driving and Adverse Conditions",

    "20": "Pedestrians and Vulnerable Road Users",

    "21": "Emergency Situations",

    "22": "Vehicle Safety",

    "23": "Environmental and Economic Driving",

    "24": "Final Review"
};


// ======================================================
// OBTER LESSON A PARTIR DO ID
// ======================================================

function obterNumeroLesson(aula) {

    if (!aula) {
        return "";
    }

    let valor =
        aula.idAula ||
        aula.lesson ||
        aula.numeroLesson ||
        "";

    valor =
        String(valor)
            .trim()
            .toLowerCase();

    // Aceita "Lesson 5", "lesson 5", "5", etc.
    valor =
        valor.replace(
            /^lesson\s*/i,
            ""
        );

    // Lessons 5 e 6 são uma só
    if (
        valor === "5" ||
        valor === "6" ||
        valor === "5/6"
    ) {
        return "5/6";
    }

    return valor;
}


// ======================================================
// COR DA LESSON
// ======================================================

function obterClasseLesson(lesson) {

    if (lesson === "24") {
        return "lesson-red";
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

        return "lesson-green";

    }

    if (
        !isNaN(numero) &&
        numero >= 8 &&
        numero <= 23
    ) {

        return "lesson-yellow";

    }

    // 5/6 pertence ao grupo verde
    if (lesson === "5/6") {
        return "lesson-green";
    }

    return "";
}


// ======================================================
// NOME DA MATÉRIA
// ======================================================

function obterMateriaLesson(lesson, aula) {

    if (
        materiasCalendario[lesson]
    ) {

        return materiasCalendario[lesson];

    }

    if (
        aula &&
        aula.materia
    ) {

        return aula.materia;

    }

    return "Lesson " + lesson;
}


// ======================================================
// RENDERIZAR CALENDÁRIO
// ======================================================

function renderizarCalendario() {

    const calendario =
        $("calendar");

    if (!calendario) {

        console.warn(
            "Elemento #calendar não encontrado."
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


    let primeiroDiaSemana =
        primeiroDia.getDay();


    // Domingo = 0
    // Queremos segunda-feira = 0

    primeiroDiaSemana =
        primeiroDiaSemana === 0
            ? 6
            : primeiroDiaSemana - 1;


    const totalDias =
        ultimoDia.getDate();


    const nomeMes =
        primeiroDia.toLocaleDateString(
            "pt-PT",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendario.innerHTML = `

        <div class="calendar-header">

            <button
                type="button"
                id="previousMonth"
            >
                ◀
            </button>

            <h2>
                ${nomeMes}
            </h2>

            <button
                type="button"
                id="nextMonth"
            >
                ▶
            </button>

        </div>


        <div class="calendar-weekdays">

            <div>SEG</div>
            <div>TER</div>
            <div>QUA</div>
            <div>QUI</div>
            <div>SEX</div>
            <div>SÁB</div>
            <div>DOM</div>

        </div>


        <div
            class="calendar-grid"
            id="calendarGrid"
        ></div>

    `;


    const grid =
        $("calendarGrid");


    if (!grid) {
        return;
    }


    // Espaços antes do primeiro dia

    for (
        let i = 0;
        i < primeiroDiaSemana;
        i++
    ) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "calendar-day empty";

        grid.appendChild(
            vazio
        );

    }


    // Dias do mês

    for (
        let dia = 1;
        dia <= totalDias;
        dia++
    ) {

        criarDiaCalendario(
            grid,
            ano,
            mes,
            dia
        );

    }


    configurarNavegacaoCalendario();

}


// ======================================================
// CRIAR DIA
// ======================================================

function criarDiaCalendario(
    grid,
    ano,
    mes,
    dia
) {

    const elemento =
        document.createElement("div");

    elemento.className =
        "calendar-day";


    const dataString =
        ano +
        "-" +
        String(mes + 1).padStart(2, "0") +
        "-" +
        String(dia).padStart(2, "0");


    const hoje =
        new Date();


    const hojeString =
        hoje.getFullYear() +
        "-" +
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            hoje.getDate()
        ).padStart(2, "0");


    if (
        dataString === hojeString
    ) {

        elemento.classList.add(
            "today"
        );

    }


    elemento.innerHTML = `

        <div class="calendar-number">
            ${dia}
        </div>

        <div class="calendar-lessons"></div>

    `;


    const lista =
        elemento.querySelector(
            ".calendar-lessons"
        );


    // Procurar aulas deste dia

    const aulasDoDia =
        aulas.filter(
            function (aula) {

                return (
                    String(aula.data || "") ===
                    dataString
                );

            }
        );


    aulasDoDia.forEach(
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


            const bloco =
                document.createElement(
                    "div"
                );


            bloco.className =
                "calendar-lesson " +
                classe;


            bloco.innerHTML = `

                <strong>
                    Lesson ${lesson}
                </strong>

                <span>
                    ${materia}
                </span>

                ${
                    aula.hora
                        ? `<small>${aula.hora}</small>`
                        : ""
                }

            `;


            bloco.title =
                "Lesson " +
                lesson +
                " - " +
                materia;


            bloco.onclick =
                function (event) {

                    event.stopPropagation();

                    abrirAula(
                        aula
                    );

                };


            lista.appendChild(
                bloco
            );

        }
    );


    // Dia fechado

    if (
        Array.isArray(diasFechados) &&
        diasFechados.includes(dataString)
    ) {

        elemento.classList.add(
            "closed-day"
        );

        elemento.innerHTML += `
            <div class="closed-label">
                FECHADO
            </div>
        `;

    }


    grid.appendChild(
        elemento
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
