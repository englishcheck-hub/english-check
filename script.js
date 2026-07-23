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
    onSnapshot
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
let alunos = []; onSnapshot(collection(db,"alunos"), (snapshot) => {
    alunos = [];
    snapshot.forEach((doc) => {
        alunos.push({
            id: doc.id,
            ...doc.data()
        });
    });
    atualizarDashboard();
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


    const lista =
        document
        .getElementById("studentsList");


    const pesquisa =
        document
        .getElementById("searchStudent")
        .value
        .toLowerCase()
        .trim();


    const alunosFiltrados =

        alunos.filter(function (aluno) {


            return (

                aluno.nome
                .toLowerCase()
                .includes(pesquisa)

                ||

                aluno.numero
                .toLowerCase()
                .includes(pesquisa)

            );

        });


    if (

        alunosFiltrados.length === 0

    ) {

        lista.innerHTML =
            "Ainda não existem alunos.";

        return;

    }


    lista.innerHTML = "";


    alunosFiltrados.forEach(function (aluno) {


        const cartao =
            document
            .createElement("div");


        cartao.className =
            "student-card";


        cartao.innerHTML = `


            <h3>

                👨‍🎓 ${aluno.nome}

            </h3>


            <p>

                <strong>

                    N.º de aluno:

                </strong>

                ${aluno.numero}

            </p>


            <p>

                <strong>

                    Validade da licença:

                </strong>

                ${formatarData(

                    aluno.validadeLicenca

                )}

            </p>


            <p>

                <strong>

                    Aulas realizadas:

                </strong>

                ${aluno.aulasRealizadas}

            </p>


            <p>

                <strong>

                    Estado do exame:

                </strong>

                ${aluno.estadoExame}

            </p>


            <p>

                <strong>

                    Validade do código:

                </strong>

                ${formatarData(

                    aluno.validadeCodigo

                )}

            </p>


            <p>

                <strong>

                    QR Code:

                </strong>

                ${

                    aluno.qrCode

                    ||

                    "Não registado"

                }

            </p>


            <p>

                <strong>

                    Estado:

                </strong>

                ${aluno.estado}

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

        botao.addEventListener("click", async function () {

            alert("Botão Registar Aula Clicado");

            const docid = botao.getAttribute("data-docid");

            alert("ID do botão: " + docid);
            alert("Número de alunos: " + alunos.length);

            const aluno = alunos.find(function (aluno) {
                return aluno.id === docid;
            });

            alert("Aluno encontrado: " + (aluno ? "SIM" : "NÃO"));

            if (!aluno) {
                return;
            }

            try {

                await updateDoc(doc(db, "alunos", docid), {
                    aulasRealizadas: aluno.aulasRealizadas + 1
                });

                alert("Aula registada com sucesso ✅");

            } catch (error) {

                alert("Erro: " + error.message);

            }

        });

    });


    const botoesApagar = document.querySelectorAll(".delete-button");

    botoesApagar.forEach(function (botao) {

        botao.addEventListener("click", async function () {

            const docid = botao.getAttribute("data-docid");

            const confirmar = confirm("Tens a certeza que queres apagar este aluno?");

            if (!confirmar) {
                return;
            }

            try {

                await deleteDoc(doc(db, "alunos", docid));

                alert("Aluno apagado com sucesso ✅");

            } catch (error) {

                alert("Erro: " + error.message);

            }

        });

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


    const dataFormatada =

        new Date(data);


    return dataFormatada

        .toLocaleDateString(

            "pt-PT"

        );

}
