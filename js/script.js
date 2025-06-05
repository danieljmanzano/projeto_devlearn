const trocaModo = document.getElementById('mostra-config');
const configSection = document.getElementById('configuracoes');
const principal = document.getElementById('principal');

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


