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

// Variáveis globais
let timer;
let minutos = 25;
let segundos = 0;
let isRunning = false;
let modoAtual = 'pomodoro';
let pomodorosConcluidos = 0;

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
    localStorage.setItem('pomodoroTime', inputPomodoro.value);
    localStorage.setItem('shortBreakTime', inputPausaCurta.value);
    localStorage.setItem('longBreakTime', inputPausaLonga.value);
}

// Carregar configurações
function carregarConfiguracoes() {
    const pomodoroTime = localStorage.getItem('pomodoroTime') || 25;
    const shortBreakTime = localStorage.getItem('shortBreakTime') || 5;
    const longBreakTime = localStorage.getItem('longBreakTime') || 15;
    
    inputPomodoro.value = pomodoroTime;
    inputPausaCurta.value = shortBreakTime;
    inputPausaLonga.value = longBreakTime;
}

// Carregar configurações quando a página carrega
document.addEventListener('DOMContentLoaded', carregarConfiguracoes);

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
            minutos = parseInt(inputPomodoro.value);
            break;
        case 'pausa-curta':
            minutos = parseInt(inputPausaCurta.value);
            break;
        case 'pausa-longa':
            minutos = parseInt(inputPausaLonga.value);
            break;
    }

    segundos = 0;
    atualizaDisplay();

    clearInterval(timer); // Limpa o timer anterior, se houver
    tick(); 

    timer = setInterval(tick, 1000);
    isRunning = true;
    botaoIniciaPausa.textContent = 'Pausar';
}

// Evento do botão Iniciar/Pausar
botaoIniciaPausa.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        botaoIniciaPausa.textContent = 'Iniciar';
    } else {
        timer = setInterval(tick, 1000);
        isRunning = true;
        botaoIniciaPausa.textContent = 'Pausar';
    }
});

// Eventos para os botões de modo
botoesModo.forEach(botao => {
    botao.addEventListener('click', () => {
        modoAtual = botao.dataset.mode;
        
        // Resetar timer
        clearInterval(timer);
        isRunning = false;
        botaoIniciaPausa.textContent = 'Iniciar';
        
        // Definir tempos baseado no modo
        switch(modoAtual) {
            case 'pomodoro':
                minutos = parseInt(inputPomodoro.value) || 25; 
                break;
            case 'pausa-curta':
                minutos = parseInt(inputPausaCurta.value) || 5;
                break;
            case 'pausa-longa':
                minutos = parseInt(inputPausaLonga.value) || 15;
                break;
        }
        segundos = 0;
        atualizaDisplay();
    });
});

// Evento para aplicar configurações
botaoAplicarConfig.addEventListener('click', () => {
    salvarConfiguracoes(); // salva no localStorage

    // Atualiza o tempo baseado no modo atual
    switch(modoAtual) {
        case 'pomodoro':
            minutos = parseInt(inputPomodoro.value) || 25;
            break;
        case 'pausa-curta':
            minutos = parseInt(inputPausaCurta.value) || 5;
            break;
        case 'pausa-longa':
            minutos = parseInt(inputPausaLonga.value) || 15;
            break;
    }

    segundos = 0;
    atualizaDisplay();

    
});

// Evento para reiniciar configurações (descarta valores do usuário e volta aos valores padrões iniciais)
botaoReiniciarConfig.addEventListener('click', () => {
    // Voltar para os valores padrão
    inputPomodoro.value = 25;
    inputPausaCurta.value = 5;
    inputPausaLonga.value = 15;

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
    atualizaDisplay();
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

// Inicializar display
atualizaDisplay();

