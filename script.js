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


// ============================================
// LOGIN
// ============================================

const utilizadores = [

    {
        username:
            "andria",

        password:
            "druxa2099"

    },

    {
        username:
            "joaof",

        password:
            "lumiar2026"

    }

];


// ============================================
// BOTÃO LOGIN
// ============================================

const loginButton =
    document.getElementById(
        "loginButton"
    );


if (loginButton) {

    loginButton.addEventListener(

        "click",

        function () {

            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value
                    .trim();


            const utilizador =
                utilizadores.find(
                    function (u) {

                        return (

                            u.username ===
                            username

                            &&

                            u.password ===
                            password

                        );

                    }
                );


            // =================================
            // LOGIN CORRETO
            // =================================

            if (utilizador) {

                document
                    .getElementById(
                        "loginPage"
                    )
                    .style.display =
                    "none";


                document
                    .getElementById(
                        "app"
                    )
                    .style.display =
                    "block";


                document
                    .getElementById(
                        "loginMessage"
                    )
                    .innerHTML = "";

            }


            // =================================
            // LOGIN INCORRETO
            // =================================

            else {

                document
                    .getElementById(
                        "loginMessage"
                    )
                    .innerHTML =
                    "Utilizador ou palavra-passe incorretos.";


                document
                    .getElementById(
                        "loginMessage"
                    )
                    .style.color =
                    "red";

            }

        }

    );

}


// ============================================
// LOGOUT
// ============================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(

        "click",

        function () {

            document
                .getElementById(
                    "app"
                )
                .style.display =
                "none";


            document
                .getElementById(
                    "loginPage"
                )
                .style.display =
                "flex";


            document
                .getElementById(
                    "username"
                )
                .value = "";


            document
                .getElementById(
                    "password"
                )
                .value = "";


            document
                .getElementById(
                    "loginMessage"
                )
                .innerHTML = "";

        }

    );

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


    const totalAlerts =
        document.getElementById(
            "totalAlerts"
        );


    const alunosAtivos =
        alunos.filter(
            function (aluno) {

                return (
                    aluno.estado ===
                    "Ativo"
                );

            }
        );


    const examesAprovados =
        alunos.filter(
            function (aluno) {

                return (
                    aluno.estadoExame ===
                    "Aprovado"
                );

            }
        );


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
        new Date(
            hoje
        );


    tresMesesDepois.setMonth(
        tresMesesDepois.getMonth() + 3
    );


    const alertas = [];


    alunos.forEach(
        function (aluno) {

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


        const dataValidade =
            new Date(
                data + "T00:00:00"
            );


        if (isNaN(dataValidade.getTime())) {
            return;
        }


        if (
            dataValidade <
            hoje
        ) {

            alertas.push(`

                <div class="alert expired">

                    🔴

                    <strong>
                        ${aluno.nome || "Aluno"}
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
                        ${aluno.nome || "Aluno"}
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

                Não existem validades
                a terminar nos próximos 3 meses.

            </div>

        `;

    }

    else {

        listaAlertas.innerHTML =
            alertas.join("");

    }


    const totalAlertas =
        document.getElementById(
            "totalAlerts"
        );


    if (totalAlertas) {

        totalAlertas.innerText =
            alertas.length;

    }

}


// ============================================
// TEORIA COMPLETA
// ============================================

function verificarTeoriaCompleta(
    aluno
) {

    if (
        (aluno.aulasRealizadas || 0) >=
        28
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

function formatarData(
    data
) {

    if (!data) {
        return "Não definida";
    }


    const dataObj =
        new Date(
            data + "T00:00:00"
        );


    if (
        isNaN(
            dataObj.getTime()
        )
    ) {

        return "Data inválida";

    }


    return dataObj.toLocaleDateString(
        "pt-PT"
    );

}


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


    if (
        alunosDaAula.length === 0
    ) {

        lista.innerHTML =
            "Ainda não existem alunos nesta aula.";

        return;
    }


    lista.innerHTML = "";


    alunosDaAula.forEach(
        function (aluno) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "student-card";


            div.innerHTML = `

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


// ============================================
// ABRIR AULA EXISTENTE
// ============================================

function abrirAula(
    aula
) {

    if (!aula) {

        mostrarNotificacao(
            "Aula não encontrada.",
            "erro"
        );

        return;
    }


    // ========================================
    // GUARDAR AULA EM EDIÇÃO
    // ========================================

    aulaEmEdicao =
        aula;


    // ========================================
    // LIMPAR LISTA
    // ========================================

    alunosDaAula = [];


    // ========================================
    // CARREGAR ALUNOS
    // ========================================

    (
        aula.alunos ||
        []
    ).forEach(
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

                alunosDaAula.push(
                    aluno
                );

            }

        }
    );


    // ========================================
    // PREENCHER FORMULÁRIO
    // ========================================

    const campoId =
        document.getElementById(
            "lessonId"
        );


    const campoMateria =
        document.getElementById(
            "lessonSubject"
        );


    const campoData =
        document.getElementById(
            "lessonDate"
        );


    const campoHora =
        document.getElementById(
            "lessonTime"
        );


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
    // MOSTRAR ALUNOS
    // ========================================

    atualizarListaDaAula();


    // ========================================
    // ABRIR PÁGINA
    // ========================================

    mostrarPagina(
        "lessonsPage"
    );


    // ========================================
    // MENSAGEM
    // ========================================

    mostrarNotificacao(
        "Aula aberta. Podes adicionar alunos por número ou QR Code. ✅"
    );


    // ========================================
    // IR PARA FORMULÁRIO
    // ========================================

    setTimeout(
        function () {

            const formulario =
                document.getElementById(
                    "saveLesson"
                );


            if (formulario) {

                formulario.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            }

        },
        100
    );

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


            if (
                numero === ""
            ) {

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
                            String(a.numero) ===
                            String(numero)
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
                    "Este aluno já está nesta aula.",
                    "erro"
                );

                return;
            }


            alunosDaAula.push(
                aluno
            );


            campo.value =
                "";


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


            caixa.innerHTML =
                "";


            [...alunos]

                .sort(
                    function (a, b) {

                        return (
                            Number(a.numero) -
                            Number(b.numero)
                        );

                    }
                )

                .forEach(
                    function (aluno) {

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

                    }
                );


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
                        alunos.find(
                            function (a) {

                                return (
                                    String(a.numero) ===
                                    String(numero)
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
// GUARDAR AULA + ALUNOS DA AULA
// ============================================

const saveLesson =
    document.getElementById("saveLesson");


if (saveLesson) {

    saveLesson.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();

            console.log(
                "BOTÃO GUARDAR AULA FOI CLICADO"
            );


            // ========================================
            // VERIFICAR SE EXISTE AULA EM EDIÇÃO
            // ========================================

            if (!aulaEmEdicao) {

                mostrarNotificacao(
                    "Primeiro cria ou abre uma aula através do calendário.",
                    "erro"
                );

                return;
            }


            // ========================================
            // VERIFICAR ID FIRESTORE
            // ========================================

            if (!aulaEmEdicao.id) {

                console.error(
                    "A aula não tem ID do Firestore:",
                    aulaEmEdicao
                );

                mostrarNotificacao(
                    "Esta aula não tem um ID válido no Firestore.",
                    "erro"
                );

                return;
            }


            // ========================================
            // OBTER CAMPOS
            // ========================================

            const campoId =
                document.getElementById(
                    "lessonId"
                );


            const campoMateria =
                document.getElementById(
                    "lessonSubject"
                );


            const campoData =
                document.getElementById(
                    "lessonDate"
                );


            const campoHora =
                document.getElementById(
                    "lessonTime"
                );


            if (
                !campoId ||
                !campoMateria ||
                !campoData ||
                !campoHora
            ) {

                mostrarNotificacao(
                    "Campos da aula não encontrados.",
                    "erro"
                );

                return;
            }


            // ========================================
            // LER VALORES
            // ========================================

            const idAula =
                campoId.value.trim();


            const materia =
                campoMateria.value.trim();


            const data =
                campoData.value;


            const hora =
                campoHora.value;


            // ========================================
            // VALIDAR
            // ========================================

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


            // ========================================
            // NÚMEROS DOS ALUNOS
            // ========================================

            const numerosAlunos =
                (alunosDaAula || []).map(
                    function (aluno) {

                        return aluno.numero;

                    }
                );


            // ========================================
            // ALUNOS QUE JÁ ESTAVAM NA AULA
            // ========================================

            const alunosAntigos =
                Array.isArray(
                    aulaEmEdicao.alunos
                )
                    ? aulaEmEdicao.alunos
                    : [];


            // ========================================
            // DETERMINAR NOVOS ALUNOS
            // ========================================

            const novosAlunos =
                (alunosDaAula || []).filter(
                    function (aluno) {

                        return !alunosAntigos.some(
                            function (numero) {

                                return (
                                    String(numero) ===
                                    String(aluno.numero)
                                );

                            }
                        );

                    }
                );


            try {

                // ====================================
                // GUARDAR AULA NO FIRESTORE
                // ====================================

                const referenciaAula =
                    doc(
                        db,
                        "aulas",
                        aulaEmEdicao.id
                    );


                await updateDoc(
                    referenciaAula,
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


                // ====================================
                // ATUALIZAR CONTADORES DOS NOVOS
                // ALUNOS
                // ====================================

                for (
                    const aluno of novosAlunos
                ) {

                    if (!aluno.id) {
                        continue;
                    }


                    const novasAulas =
                        Number(
                            aluno.aulasRealizadas || 0
                        ) + 1;


                    const dadosAtualizar = {

                        aulasRealizadas:
                            novasAulas,

                        historicoAulas:
                            arrayUnion(
                                idAula
                            )

                    };


                    // =================================
                    // ALUNO COM REPROVAÇÃO
                    // =================================

                    if (
                        aluno.ultimaReprovacao
                    ) {

                        const aulasReprovacao =
                            Math.max(
                                0,
                                novasAulas -
                                Number(
                                    aluno.aulasNaUltimaReprovacao || 0
                                )
                            );


                        dadosAtualizar
                            .aulasReprovacaoFeitas =
                            Math.min(
                                aulasReprovacao,
                                5
                            );


                        const historico =
                            [
                                ...(
                                    aluno.historicoExames ||
                                    []
                                )
                            ];


                        if (
                            historico.length > 0
                        ) {

                            const ultimoIndice =
                                historico.length - 1;


                            const ultimo =
                                historico[
                                    ultimoIndice
                                ];


                            if (
                                ultimo &&
                                ultimo.resultado ===
                                    "Reprovado" &&
                                !ultimo.aulasConcluidas
                            ) {

                                historico[
                                    ultimoIndice
                                ] = {

                                    ...ultimo,

                                    aulasReprovacao:
                                        Math.min(
                                            aulasReprovacao,
                                            5
                                        ),

                                    aulasConcluidas:
                                        aulasReprovacao >= 5

                                };

                            }

                        }


                        dadosAtualizar
                            .historicoExames =
                            historico;

                    }


                    // =================================
                    // GUARDAR ALTERAÇÕES DO ALUNO
                    // =================================

                    await updateDoc(
                        doc(
                            db,
                            "alunos",
                            aluno.id
                        ),
                        dadosAtualizar
                    );

                }


                // ====================================
                // ATUALIZAR OBJETO LOCAL DA AULA
                // ====================================

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


                // ====================================
                // ATUALIZAR AULA NA LISTA LOCAL
                // ====================================

                const indiceAula =
                    aulas.findIndex(
                        function (aula) {

                            return (
                                aula.id ===
                                aulaEmEdicao.id
                            );

                        }
                    );


                if (
                    indiceAula !== -1
                ) {

                    aulas[
                        indiceAula
                    ] = {

                        ...aulas[
                            indiceAula
                        ],

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

                }


                // ====================================
                // ATUALIZAR INTERFACE
                // ====================================

                atualizarListaDaAula();

                mostrarAulas();

                renderizarCalendario();

                atualizarDashboard();


                // ====================================
                // CONFIRMAÇÃO
                // ====================================

                mostrarNotificacao(
                    "Aula guardada com sucesso ✅"
                );


            }

            catch (erro) {

                console.error(
                    "ERRO AO GUARDAR AULA:",
                    erro
                );


                console.error(
                    "Aula em edição:",
                    aulaEmEdicao
                );


                mostrarNotificacao(
                    "Erro ao guardar aula: " +
                    (
                        erro.message ||
                        erro
                    ),
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

        .sort(
            function (a, b) {

                return (
                    new Date(
                        b.data
                    ) -
                    new Date(
                        a.data
                    )
                );

            }
        )

        .forEach(
            function (aula) {

                let alunosTexto =
                    "Nenhum aluno adicionado.";


                if (
                    Array.isArray(aula.alunos) &&
                    aula.alunos.length > 0
                ) {

                    alunosTexto = "";


                    aula.alunos.forEach(
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
                    document.createElement(
                        "div"
                    );


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


                lista.appendChild(
                    cartao
                );

            }
        );


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
        .querySelectorAll(
            ".deleteLessonButton"
        )
        .forEach(
            function (botao) {

                botao.onclick =
                    async function (event) {

                        event.preventDefault();


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


                        if (!aula) {

                            mostrarNotificacao(
                                "Aula não encontrada.",
                                "erro"
                            );

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

                            // =========================
                            // DEVOLVER AULA AOS ALUNOS
                            // =========================

                            for (
                                const numero
                                of (
                                    aula.alunos ||
                                    []
                                )
                            ) {

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
                                    continue;
                                }


                                const novoHistorico =
                                    (
                                        aluno.historicoAulas ||
                                        []
                                    ).filter(
                                        function (item) {

                                            return (
                                                String(item) !==
                                                String(
                                                    aula.idAula
                                                )
                                            );

                                        }
                                    );


                                const novoTotal =
                                    Math.max(
                                        Number(
                                            aluno.aulasRealizadas ||
                                            0
                                        ) - 1,
                                        0
                                    );


                                await updateDoc(
                                    doc(
                                        db,
                                        "alunos",
                                        aluno.id
                                    ),
                                    {

                                        aulasRealizadas:
                                            novoTotal,

                                        historicoAulas:
                                            novoHistorico

                                    }
                                );

                            }


                            // =========================
                            // APAGAR AULA
                            // =========================

                            await deleteDoc(
                                doc(
                                    db,
                                    "aulas",
                                    id
                                )
                            );


                            if (
                                aulaEmEdicao &&
                                aulaEmEdicao.id === id
                            ) {

                                aulaEmEdicao =
                                    null;

                                alunosDaAula =
                                    [];

                            }


                            mostrarNotificacao(
                                "Aula apagada com sucesso ✅"
                            );


                            mostrarAulas();

                            renderizarCalendario();

                            atualizarDashboard();

                        }

                        catch (erro) {

                            console.error(
                                "Erro ao apagar aula:",
                                erro
                            );


                            mostrarNotificacao(
                                "Erro ao apagar aula: " +
                                (
                                    erro.message ||
                                    erro
                                ),
                                "erro"
                            );

                        }

                    };

            }
        );


    // ========================================
    // ABRIR AULA
    // ========================================

    document
        .querySelectorAll(
            ".editLessonButton"
        )
        .forEach(
            function (botao) {

                botao.onclick =
                    function (event) {

                        event.preventDefault();


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


                        if (!aula) {

                            mostrarNotificacao(
                                "Aula não encontrada.",
                                "erro"
                            );

                            return;
                        }


                        abrirAula(
                            aula
                        );

                    };

            }
        );

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

                mostrarNotificacao(
                    "Leitor QR Code não encontrado.",
                    "erro"
                );

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

                    decodedText =
                        String(
                            decodedText
                        ).trim();


                    html5QrCode
                        .stop()
                        .then(
                            function () {

                                reader.style.display =
                                    "none";

                            }
                        )
                        .catch(
                            function () {

                                reader.style.display =
                                    "none";

                            }
                        );


                    const aluno =
                        alunos.find(
                            function (a) {

                                return (

                                    String(
                                        a.idAluno || ""
                                    ) ===
                                    decodedText ||

                                    String(
                                        a.id || ""
                                    ) ===
                                    decodedText ||

                                    String(
                                        a.numero || ""
                                    ) ===
                                    decodedText ||

                                    String(
                                        a.qrCode || ""
                                    ) ===
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

                    // Erros de leitura
                    // são ignorados.

                }

            )
            .catch(
                function (erro) {

                    console.error(
                        "Erro QR Code:",
                        erro
                    );


                    reader.style.display =
                        "none";


                    mostrarNotificacao(
                        "Não foi possível abrir a câmara.",
                        "erro"
                    );

                }
            );

        }
    );

}
// ============================================
// MENU / PÁGINAS
// ============================================

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
                document.getElementById(
                    id
                );


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

            atualizarDashboard();

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
// CALENDÁRIO
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


            const nomeMesLimpo =
                nomeMes.trim();


            if (
                nomeMesLimpo === ""
            ) {

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
                            nomeMesLimpo,

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

                console.error(
                    "Erro ao guardar mês:",
                    erro
                );


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

        mesesCalendario =
            [];


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

    },
    function (erro) {

        console.error(
            "Erro ao carregar meses:",
            erro
        );


        mostrarNotificacao(
            "Erro ao carregar meses: " +
            erro.message,
            "erro"
        );

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

        diasFechados =
            [];


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

    },
    function (erro) {

        console.error(
            "Erro ao carregar dias fechados:",
            erro
        );


        mostrarNotificacao(
            "Erro ao carregar dias fechados: " +
            erro.message,
            "erro"
        );

    }
);


// ============================================
// PÁSCOA
// ============================================

function calcularPascoa(
    ano
) {

    const a =
        ano % 19;


    const b =
        Math.floor(
            ano / 100
        );


    const c =
        ano % 100;


    const d =
        Math.floor(
            b / 4
        );


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
        Math.floor(
            c / 4
        );


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

function obterFeriados(
    ano
) {

    const feriados =
        [];


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
        new Date(
            ano,
            0,
            1
        ),
        "Ano Novo"
    );


    adicionar(
        new Date(
            ano,
            3,
            25
        ),
        "Dia da Liberdade"
    );


    adicionar(
        new Date(
            ano,
            4,
            1
        ),
        "Dia do Trabalhador"
    );


    adicionar(
        new Date(
            ano,
            5,
            10
        ),
        "Dia de Portugal"
    );


    adicionar(
        new Date(
            ano,
            5,
            13
        ),
        "Santo António — Lisboa"
    );


    adicionar(
        new Date(
            ano,
            9,
            5
        ),
        "Implantação da República"
    );


    adicionar(
        new Date(
            ano,
            10,
            1
        ),
        "Dia de Todos os Santos"
    );


    adicionar(
        new Date(
            ano,
            11,
            1
        ),
        "Restauração da Independência"
    );


    adicionar(
        new Date(
            ano,
            11,
            8
        ),
        "Imaculada Conceição"
    );


    adicionar(
        new Date(
            ano,
            11,
            25
        ),
        "Natal"
    );


    const pascoa =
        calcularPascoa(
            ano
        );


    const sexta =
        new Date(
            pascoa
        );


    sexta.setDate(
        sexta.getDate() - 2
    );


    adicionar(
        sexta,
        "Sexta-feira Santa"
    );


    adicionar(
        new Date(
            pascoa
        ),
        "Páscoa"
    );


    const corpo =
        new Date(
            pascoa
        );


    corpo.setDate(
        corpo.getDate() + 60
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


    if (
        feriado ===
        "true"
    ) {

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

            function fecharMenu(
                event
            ) {

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


            document.addEventListener(
                "click",
                fecharMenu
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
    // VERIFICAR SE JÁ EXISTE
    // ========================================

    const existe =
        aulas.find(
            function (aula) {

                return (
                    aula.data === data &&
                    aula.hora === hora
                );

            }
        );


    if (existe) {

        abrirAula(
            existe
        );

        return;
    }


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


    if (
        idAulaLimpo === ""
    ) {

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


    if (
        materiaLimpa === ""
    ) {

        return;
    }


    // ========================================
    // CRIAR AULA
    // ========================================

    try {

        const dadosNovaAula = {

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

        };


        const novaAula =
            await addDoc(
                collection(
                    db,
                    "aulas"
                ),
                dadosNovaAula
            );


        const aulaCriada = {

            id:
                novaAula.id,

            ...dadosNovaAula

        };


        // =====================================
        // ATUALIZAR LISTA LOCAL
        // =====================================

        aulas.push(
            aulaCriada
        );


        mostrarNotificacao(
            "Aula criada no calendário ✅"
        );


        // =====================================
        // ABRIR AULA
        // =====================================

        abrirAula(
            aulaCriada
        );

    }

    catch (erro) {

        console.error(
            "Erro ao criar aula:",
            erro
        );


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


    let html =
        "";


    mesesCalendario.forEach(
        function (mes) {

            const partes =
                String(
                    mes.nome || ""
                )
                .trim()
                .split(/\s+/);


            const nomeMesTexto =
                partes[0];


            const ano =
                parseInt(
                    partes[1],
                    10
                );


            const mesNumero =
                nomesMeses.indexOf(
                    String(
                        nomeMesTexto || ""
                    ).toLowerCase()
                );


            if (
                mesNumero === -1 ||
                isNaN(ano)
            ) {

                html += `

                    <div class="calendar-month">

                        <h3>
                            📅 ${mes.nome || ""}
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
                obterFeriados(
                    ano
                );


            const diasUteis =
                [];


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


                    const fechado =
                        obterDiaFechado(
                            dia.dataString
                        );


                    if (
                        dia.feriado
                    ) {

                        classe +=
                            " holiday";

                    }

                    else if (
                        fechado
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
                                fechado
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

                            else {

                                // =================================
                                // CÉLULA VAZIA
                                // =================================

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


                            if (aula) {

                                abrirAula(
                                    aula
                                );

                            }

                            else {

                                mostrarNotificacao(
                                    "Aula não encontrada.",
                                    "erro"
                                );

                            }


                            return;
                        }


                        await criarAulaPeloCalendario(
                            data,
                            horario
                        );

                    };

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
        !aluno ||
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


    const aulasFeitas =
        aluno.aulasReprovacaoFeitas || 0;


    if (
        aulasFeitas >= 5
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

                ${aulasFeitas}/5

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

            const modal =
                document.getElementById(
                    "examModal"
                );


            if (modal) {

                modal.style.display =
                    "none";

            }


            alunoResultadoExame =
                null;

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

            if (
                !alunoResultadoExame
            ) {

                mostrarNotificacao(
                    "Nenhum aluno selecionado.",
                    "erro"
                );

                return;
            }


            const campoData =
                document.getElementById(
                    "examDate"
                );


            const campoResultado =
                document.getElementById(
                    "examResult"
                );


            if (
                !campoData ||
                !campoResultado
            ) {

                mostrarNotificacao(
                    "Campos do exame não encontrados.",
                    "erro"
                );

                return;
            }


            const data =
                campoData.value;


            const resultado =
                campoResultado.value;


            if (
                data === ""
            ) {

                mostrarNotificacao(
                    "Seleciona a data do exame.",
                    "erro"
                );

                return;
            }


            if (
                resultado === ""
            ) {

                mostrarNotificacao(
                    "Seleciona o resultado do exame.",
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


                // =================================
                // REPROVADO
                // =================================

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


                // =================================
                // APROVADO
                // =================================

                if (
                    resultado ===
                    "Aprovado"
                ) {

                    dadosAtualizar
                        .ultimaReprovacao =
                            null;


                    dadosAtualizar
                        .aulasNaUltimaReprovacao =
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


                const modal =
                    document.getElementById(
                        "examModal"
                    );


                if (modal) {

                    modal.style.display =
                        "none";

                }


                mostrarNotificacao(
                    "Resultado do exame guardado com sucesso ✅"
                );


                alunoResultadoExame =
                    null;


                atualizarDashboard();

                mostrarAlunos();

            }

            catch (erro) {

                console.error(
                    "Erro ao guardar exame:",
                    erro
                );


                mostrarNotificacao(
                    "Erro ao guardar: " +
                    erro.message,
                    "erro"
                );

            }

        };

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
