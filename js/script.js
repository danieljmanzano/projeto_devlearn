// Elementos DOM
const trocaModo = document.getElementById('mostra-config');
const configSection = document.getElementById('configuracoes');
const principal = document.getElementById('principal');
const cronometro = document.getElementById('cronometro');
const botaoIniciaPausa = document.getElementById('inicia-pausa');
const botoesModo = document.querySelectorAll('.botao');
const inputPomodoro = document.getElementById('pomodoro');
const inputPausaCurta = document.getElementById('pausa-curta');
const inputPausaLonga = document.getElementById('pausa-longa');
const botaoAplicarConfig = document.getElementById('aplicar-config');
const botaoReiniciarConfig = document.getElementById('reiniciar-config');
const icone = botaoIniciaPausa.querySelector("i");


// Variáveis globais
let timer;
let minutos = 25;
let segundos = 0;
let isRunning = false;
let modoAtual = 'pomodoro';
let pomodorosConcluidos = 0;
let tempoPomodoro = 25; 
let tempoPausaCurta = 5;
let tempoPausaLonga = 15;


// Configuração inicial dos inputs
trocaModo.addEventListener('click', () => { // caso o botão seja clicado, a exibição de configurações ou o cronômetro será alternada
    if (configSection.style.display === 'none' || configSection.style.display === '') { // caso esteja no modo de cronômetro
        configSection.style.display = 'block'; 
        principal.style.display = 'none'; 
        trocaModo.textContent = 'Esconder Configurações';
    } else { // caso esteja no modo de configurações
        configSection.style.display = 'none';
        principal.style.display = 'block'; 
        trocaModo.textContent = 'Mostrar Configurações';
    }
});


// Salvar configurações
function salvarConfiguracoes() {
    localStorage.setItem('pomodoroTime', tempoPomodoro);
    localStorage.setItem('shortBreakTime', tempoPausaCurta);
    localStorage.setItem('longBreakTime', tempoPausaLonga);
}


// Função para atualizar o display
function atualizaDisplay() {
    cronometro.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    atualizaMensagemModo(); 
}


// Função principal do timer
function tick() {
    if (segundos === 0) {
        if (minutos === 0) {
            clearInterval(timer);
            isRunning = false;
            // Aqui você pode adicionar um alarme ou notificação

            if (modoAtual === 'pomodoro') {
                pomodorosConcluidos++;
                atualizaPomodoros(); // Atualiza o número de ciclos concluídos
                if (pomodorosConcluidos % 4 === 0) { // completou os ciclos de pomodoro, ativa pausa longa
                    iniciarModo('pausa-longa');
                } else {
                    iniciarModo('pausa-curta'); // ainda não terminou todos os ciclos, ativa pausa curta
                }

            } else if (modoAtual === 'pausa-curta') {
                iniciarModo('pomodoro'); // volta para o modo pomodoro após pausas
            } else if (modoAtual === 'pausa-longa') {
                atualizaPomodoros();
                iniciarModo('pomodoro'); 
            }

            return;
        }
        minutos--;
        segundos = 59;
    } else {
        segundos--;
    }
    atualizaDisplay();
}


// Função para iniciar o modo selecionado
function iniciarModo(modo) {
    modoAtual = modo;

    switch(modo) {
        case 'pomodoro':
            minutos = tempoPomodoro;
            break;
        case 'pausa-curta':
            minutos = tempoPausaCurta;
            break;
        case 'pausa-longa':
            minutos = tempoPausaLonga;
            break;
    }

    segundos = 0;
    atualizaDisplay();

    clearInterval(timer); // Limpa o timer anterior, se houver
    tick(); 

    timer = setInterval(tick, 100);
    isRunning = true;
    atualizarBotaoPausaPlay(isRunning);
}


// Evento do botão Iniciar/Pausar
botaoIniciaPausa.addEventListener('click', () => {
    if (isRunning) { // pausa
        clearInterval(timer);
        isRunning = false;
        atualizarBotaoPausaPlay(isRunning);
    } else { // inicia
        timer = setInterval(tick, 100);
        isRunning = true;
        atualizarBotaoPausaPlay(isRunning);
    }
});


// Eventos para os botões de modo
botoesModo.forEach(botao => {
    botao.addEventListener('click', () => {
        modoAtual = botao.dataset.mode;
        
        // Resetar timer
        clearInterval(timer);
        isRunning = false;
        atualizarBotaoPausaPlay(isRunning);
        
        // Definir tempos baseado no modo
        switch(modoAtual) {
            case 'pomodoro':
                minutos = tempoPomodoro; 
                break;
            case 'pausa-curta':
                minutos = tempoPausaCurta;
                break;
            case 'pausa-longa':
                minutos = tempoPausaLonga;
                break;
        }
        segundos = 0;
        atualizaDisplay();
    });
});


// Evento para aplicar configurações
botaoAplicarConfig.addEventListener('click', () => {
    tempoPomodoro = parseInt(inputPomodoro.value) || 25;
    tempoPausaCurta = parseInt(inputPausaCurta.value) || 5;
    tempoPausaLonga = parseInt(inputPausaLonga.value) || 15;

    salvarConfiguracoes();

    switch (modoAtual) {
        case 'pomodoro':
            minutos = tempoPomodoro;
            break;
        case 'pausa-curta':
            minutos = tempoPausaCurta;
            break;
        case 'pausa-longa':
            minutos = tempoPausaLonga;
            break;
    }

    segundos = 0;
    atualizaDisplay();


    // Esconder configurações e voltar ao cronômetro
    configSection.style.display = 'none';
    principal.style.display = 'block';
    trocaModo.textContent = 'Mostrar Configurações';

    // Pausa o cronômetro
    clearInterval(timer);
    isRunning = false;
    atualizarBotaoPausaPlay(isRunning);
});


// Evento para reiniciar configurações (descarta valores do usuário e volta aos valores padrões iniciais)
botaoReiniciarConfig.addEventListener('click', () => {
    // Voltar para os valores padrão
    inputPomodoro.value = 25;
    inputPausaCurta.value = 5;
    inputPausaLonga.value = 15;
    tempoPomodoro = 25;
    tempoPausaCurta = 5;
    tempoPausaLonga = 15;
    pomodorosConcluidos = 0;

    // Salvar no localStorage
    salvarConfiguracoes();

    // Atualizar o tempo se o modo atual estiver ativo
    switch(modoAtual) {
        case 'pomodoro':
            minutos = 25;
            break;
        case 'pausa-curta':
            minutos = 5;
            break;
        case 'pausa-longa':
            minutos = 15;
            break;
    }

    segundos = 0;
    atualizaPomodoros();
    atualizaDisplay();

    // Esconder configurações e voltar ao cronômetro
    configSection.style.display = 'none';
    principal.style.display = 'block';
    trocaModo.textContent = 'Mostrar Configurações';

    // Pausa o cronômetro
    clearInterval(timer);
    isRunning = false;
    atualizarBotaoPausaPlay(isRunning);
});


// Atualiza o texto de ciclos
function atualizaPomodoros() {
    const pomodoros = document.getElementById('pomodoros');
    pomodoros.textContent = `Pomodoros concluídos: ${pomodorosConcluidos}`;
    if (pomodorosConcluidos === 4) {
        pomodorosConcluidos = 0;
    }
}


// Atualiza o texto do modo atual
function atualizaMensagemModo() {
    const mensagemModo = document.getElementById('mensagem-modo');
    switch(modoAtual) {
        case 'pomodoro':
            mensagemModo.textContent = 'Hora de focar!';
            break;
        case 'pausa-curta':
            mensagemModo.textContent = 'Descanse um pouco...';
            break;
        case 'pausa-longa':
            mensagemModo.textContent = 'Aproveite uma pausa longa!';
            break;
    }
}


// Atualiza o ícone do botão de pausa/play
function atualizarBotaoPausaPlay(emExecucao) {
    if (emExecucao) {
        icone.classList.remove("fa-play");
        icone.classList.add("fa-pause");
    } else {
        icone.classList.remove("fa-pause");
        icone.classList.add("fa-play");
    }
}


// Inicializar display
atualizaDisplay();

