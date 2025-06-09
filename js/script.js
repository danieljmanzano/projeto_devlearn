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

// Variáveis globais
let timer;
let minutos = 25;
let segundos = 0;
let isRunning = false;
let modoAtual = 'pomodoro';

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

// Adicionar evento para salvar quando sair das configurações
configSection.addEventListener('change', salvarConfiguracoes);

// Carregar configurações quando a página carrega
document.addEventListener('DOMContentLoaded', carregarConfiguracoes);

// Função para atualizar o display
function atualizaDisplay() {
    cronometro.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Função principal do timer
function tick() {
    if (segundos === 0) {
        if (minutos === 0) {
            clearInterval(timer);
            isRunning = false;
            botaoIniciaPausa.textContent = 'Iniciar';
            // Aqui você pode adicionar um alarme ou notificação
            return;
        }
        minutos--;
        segundos = 59;
    } else {
        segundos--;
    }
    atualizaDisplay();
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
});

// Inicializar display
atualizaDisplay();

