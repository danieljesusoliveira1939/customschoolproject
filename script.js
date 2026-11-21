/* ==========================================================================
 * script.js — Efeitos, animações e melhorias visuais do site "Árvores Peculiares"
 *
 * COMO USAR: coloque esta linha no FINAL do <body> de TODAS as páginas (index, sobre,
 *            galeria, jogo e contato), logo antes de </body>:
 *                <script src="script.js"></script>
 *            Não precisa mexer no CSS: este arquivo injeta os estilos que precisa.
 *
 * O QUE ELE FAZ:  1) fade-in/fade-out entre páginas      2) barra de progresso de rolagem
 *                 3) menu com link ativo + menu celular  4) título com letras animadas
 *                 5) cards que aparecem ao rolar         6) cards com inclinação 3D
 *                 7) galeria ampliada (lightbox)         8) folhas caindo de fundo
 *                 9) botão "voltar ao topo"             10) efeito de onda nos botões
 *                11) animações e confete no quiz        12) ajustes de rodapé e celular
 *
 * REGRA DESTE ARQUIVO: toda linha de código tem um comentário (//) explicando o que ela faz.
 * ========================================================================== */

(function () { // abre uma função que roda sozinha: assim as variáveis daqui não se misturam com as do jogo.js
    'use strict'; // modo estrito: o navegador avisa sobre erros de programação comuns

    /* ======================================================================
     * 1. FERRAMENTAS BÁSICAS (usadas por todo o resto do arquivo)
     * ====================================================================== */

    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // true se a pessoa pediu "menos animações" nas configurações do sistema
    const temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches; // true em computador com mouse; false em celular/tablet (toque)
    const paginaAtual = (location.pathname.split('/').pop() || 'index.html').toLowerCase().replace('.html', ''); // nome da página atual sem ".html" (ex.: "galeria"); se vazio, assume "index"

    function criar(tag, classe, texto) { // atalho para criar um elemento HTML já com classe e texto
        const el = document.createElement(tag); // cria o elemento (ex.: <div>, <span>, <button>)
        if (classe) el.className = classe; // se foi informada uma classe, aplica no elemento
        if (texto) el.textContent = texto; // se foi informado um texto, escreve dentro do elemento
        return el; // devolve o elemento pronto para quem chamou
    } // fim de criar

    function aoCarregar(funcao) { // executa "funcao" assim que o HTML da página estiver pronto
        if (document.readyState === 'loading') { // se o navegador ainda está lendo o HTML...
            document.addEventListener('DOMContentLoaded', funcao); // ...espera o aviso de "HTML pronto" e só então executa
        } else { // senão (o HTML já foi lido)...
            funcao(); // ...executa imediatamente
        } // fim do if/else
    } // fim de aoCarregar

    /* ======================================================================
     * 2. ESTILOS INJETADOS (CSS escrito em JS: uma regra por linha para poder comentar)
     * ====================================================================== */

    const REGRAS_CSS = [ // lista com todas as regras CSS que o script adiciona à página
        /* --- aparência geral --- */
        'html { scroll-behavior: smooth; }', // rolagem suave ao clicar em âncoras e no botão "voltar ao topo"
        '::selection { background: #a3c995; color: #1e3317; }', // cor verde-folha quando o texto é selecionado com o mouse
        'a:focus-visible, button:focus-visible { outline: 3px solid #a3c995; outline-offset: 3px; }', // contorno visível ao navegar pelo teclado (acessibilidade)
        'header.cabecalho-itens { background-image: linear-gradient(135deg, #2d4a22 0%, #416f31 100%); }', // cabeçalho com degradê em vez de verde chapado
        '.escola { z-index: 4; border-top: 3px solid #a3c995; box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.25); }', // rodapé fica acima das folhas e ganha uma borda verde + sombra

        /* --- transição entre páginas --- */
        '@keyframes paginaEntra { from { opacity: 0; } to { opacity: 1; } }', // animação: a página sai de invisível para visível
        'body.pagina-entra { animation: paginaEntra 0.6s ease-out; }', // aplica o fade-in no corpo da página (só opacidade, para não quebrar o rodapé fixo)
        'body.saindo { opacity: 0; transition: opacity 0.28s ease; }', // ao clicar em um link, a página some suavemente antes de trocar

        /* --- barra de progresso de rolagem --- */
        '#barra-rolagem { position: fixed; top: 0; left: 0; width: 0; height: 4px; z-index: 10001; background: linear-gradient(90deg, #a3c995, #f4c95d); transition: width 0.1s linear; }', // faixa fina no topo da tela que cresce conforme se rola a página

        /* --- navbar --- */
        '@keyframes descer { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }', // animação: desce de cima para a posição normal
        '.navbar { animation: descer 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25); }', // navbar entra deslizando e ganha sombra
        '.navbar .logo { transition: transform 0.3s ease; }', // prepara o logo para crescer suavemente
        '.navbar .logo:hover { transform: scale(1.06); }', // logo aumenta um pouco quando o mouse passa por cima
        '.nav-links a { position: relative; padding: 4px 0; }', // permite posicionar o sublinhado animado dentro de cada link
        ".nav-links a::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 100%; height: 2px; background: #a3c995; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }", // sublinhado verde que começa com largura zero
        '.nav-links a:hover::after, .nav-links a.ativo::after { transform: scaleX(1); }', // sublinhado cresce da esquerda para a direita no hover e no link da página atual
        '.nav-links a.ativo { color: #a3c995; }', // link da página em que você está fica verde-claro
        '.menu-toggle { display: none; background: transparent; border: 0; color: #f4f0ea; font-size: 1.7rem; line-height: 1; cursor: pointer; padding: 4px 8px; }', // botão ☰ do menu de celular: escondido no computador

        /* --- navbar e cards em telas pequenas --- */
        '@media (max-width: 720px) {', // abre as regras que só valem em telas de até 720px (celular)
        '  .navbar { flex-wrap: wrap; padding: 12px 18px; }', // permite que o menu quebre para a linha de baixo
        '  .menu-toggle { display: block; }', // mostra o botão ☰ no celular
        '  .nav-links { display: none; width: 100%; flex-direction: column; gap: 2px; padding-top: 10px; }', // esconde os links e, quando abertos, empilha um embaixo do outro
        '  .nav-links.aberto { display: flex; animation: descer 0.3s ease; }', // quando o menu está aberto, mostra os links com uma pequena animação
        '  .nav-links a { display: inline-block; padding: 10px 0; }', // aumenta a área de toque de cada link
        '  .estudantes_todos > * { flex: 1 1 calc(50% - 20px); max-width: calc(50% - 20px); }', // cards passam a ficar 2 por linha (antes eram 3 espremidos)
        '}', // fecha as regras de celular
        '@media (max-width: 480px) {', // abre as regras que valem só em telas de até 480px (celular pequeno)
        '  .estudantes_todos { padding: 0 16px; }', // dá margem lateral para os cards não encostarem na borda
        '  .estudantes_todos > * { flex: 1 1 100%; max-width: 100%; }', // cards passam a ocupar a linha inteira (1 por linha)
        '}', // fecha as regras de celular pequeno

        /* --- título com letras animadas --- */
        '@keyframes letraSobe { from { opacity: 0; transform: translateY(24px) rotate(8deg); } to { opacity: 1; transform: none; } }', // animação: a letra sobe e endireita
        '.titulo_site { text-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); }', // sombra suave atrás do título para dar profundidade
        '.titulo_site .palavra { display: inline-block; white-space: nowrap; }', // impede que uma palavra seja cortada no meio da linha
        '.titulo_site .letra { display: inline-block; transition: transform 0.2s ease, color 0.2s ease; animation: letraSobe 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }', // cada letra é um bloco que anima na entrada e reage ao mouse
        '.titulo_site .letra:hover { transform: translateY(-6px) rotate(-5deg); color: #a3c995; }', // a letra "pula" e fica verde quando o mouse passa

        /* --- aparecer ao rolar --- */
        '@keyframes revelarSobe { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: none; } }', // animação: sobe 40px e cresce até o tamanho normal
        '.revelar { opacity: 0; }', // elemento fica invisível até chegar na tela
        '.revelar-ativo { animation: revelarSobe 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }', // quando aparece na tela, toca a animação de subir

        /* --- cards da galeria --- */
        '.estudante-div.inclinando { transition: transform 0.08s linear, box-shadow 0.2s ease; }', // enquanto o mouse se move, o card responde rápido
        '.estudante-div:hover { box-shadow: 0 14px 30px rgba(45, 74, 34, 0.28); }', // sombra esverdeada maior quando o mouse está sobre o card
        '.estudante-imagem { cursor: zoom-in; transition: filter 0.3s ease; }', // cursor de lupa e prepara a troca de brilho da foto
        '.estudante-div:hover .estudante-imagem { filter: brightness(1.07) saturate(1.2); }', // foto fica mais viva quando o mouse está sobre o card

        /* --- imagem da página inicial, vídeo e link de contato --- */
        'img.img-container { display: block; transition: transform 0.4s ease, filter 0.4s ease; }', // mapa mental vira "bloco" (assim o margin: auto do CSS finalmente o centraliza) e prepara o crescimento suave
        'img.img-container:hover { transform: scale(1.02); filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.25)); }', // mapa mental aumenta um pouco e ganha sombra no hover
        '.container-video { transition: transform 0.3s ease, box-shadow 0.3s ease; }', // prepara a caixa do vídeo para subir suavemente
        '.container-video:hover { transform: translateY(-4px); box-shadow: 0 10px 22px rgba(0, 0, 0, 0.3); }', // caixa do vídeo "levanta" no hover
        '@keyframes pulsar { 0%, 100% { transform: scale(1); text-shadow: 0 0 0 rgba(163, 201, 149, 0); } 50% { transform: scale(1.06); text-shadow: 0 0 12px rgba(163, 201, 149, 0.8); } }', // animação: cresce e brilha, depois volta
        '.link { display: inline-block; animation: pulsar 2.2s ease-in-out infinite; }', // o link de WhatsApp fica pulsando para chamar atenção
        '.link:hover { animation-play-state: paused; }', // pausa a pulsação enquanto o mouse está em cima (facilita o clique)

        /* --- folhas caindo --- */
        '#folhas { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 3; }', // camada que cobre a tela toda, não bloqueia cliques e fica abaixo do rodapé
        '.folha { position: absolute; top: -40px; opacity: 0.75; will-change: transform; animation: folhaCai linear infinite; }', // cada folha começa acima da tela e cai para sempre
        '@keyframes folhaCai { 0% { transform: translate3d(0, -5vh, 0) rotate(0deg); } 25% { transform: translate3d(var(--dx), 25vh, 0) rotate(calc(var(--rot) * 0.25)); } 50% { transform: translate3d(calc(var(--dx) * -0.4), 52vh, 0) rotate(calc(var(--rot) * 0.5)); } 75% { transform: translate3d(calc(var(--dx) * 0.8), 80vh, 0) rotate(calc(var(--rot) * 0.75)); } 100% { transform: translate3d(0, 110vh, 0) rotate(var(--rot)); } }', // animação: a folha desce balançando de um lado para o outro enquanto gira

        /* --- botão voltar ao topo --- */
        '#voltar-topo { position: fixed; right: 20px; bottom: calc(var(--altura-rodape, 80px) + 16px); width: 46px; height: 46px; border: 0; border-radius: 50%; background: #2d4a22; color: #fff; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); opacity: 0; transform: translateY(20px) scale(0.8); pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease; z-index: 9000; }', // botão redondo escondido, logo acima do rodapé
        '#voltar-topo.visivel { opacity: 1; transform: none; pointer-events: auto; }', // quando a página já foi rolada, o botão aparece subindo
        '#voltar-topo.visivel:hover { background: #3e5c30; transform: translateY(-3px); }', // botão sobe um pouquinho e clareia no hover

        /* --- janela de foto ampliada (lightbox) --- */
        '.lightbox { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(10, 20, 8, 0.93); z-index: 10002; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }', // tela escura cobrindo tudo, invisível por padrão
        '.lightbox.aberta { opacity: 1; visibility: visible; }', // quando aberta, aparece suavemente
        '.lightbox figure { max-width: 90vw; text-align: center; transform: scale(0.9); transition: transform 0.3s ease; }', // a foto começa um pouco menor...
        '.lightbox.aberta figure { transform: scale(1); }', // ...e cresce até o tamanho normal ao abrir
        '.lightbox img { max-width: 90vw; max-height: 78vh; border-radius: 10px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); }', // foto ampliada nunca passa do tamanho da tela
        '.lightbox figcaption { color: #f4f0ea; margin-top: 14px; font-size: 1.2rem; font-weight: 600; }', // legenda com o nome da árvore
        '.lightbox button { position: absolute; width: 48px; height: 48px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #fff; font-size: 2rem; line-height: 1; cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; }', // estilo comum dos botões redondos (fechar, anterior, próxima)
        '.lightbox button:hover { background: rgba(255, 255, 255, 0.28); transform: scale(1.1); }', // botão cresce e clareia no hover
        '.lightbox .lb-fechar { top: 18px; right: 18px; }', // botão de fechar no canto superior direito
        '.lightbox .lb-ant { left: 18px; top: 50%; margin-top: -24px; }', // seta "anterior" no meio da borda esquerda
        '.lightbox .lb-prox { right: 18px; top: 50%; margin-top: -24px; }', // seta "próxima" no meio da borda direita

        /* --- efeito de onda ao clicar em botões --- */
        '.btn-primary, .option-btn { position: relative; overflow: hidden; }', // permite que a onda fique presa dentro do botão
        '@keyframes ondinha { to { transform: scale(4); opacity: 0; } }', // animação: a onda cresce 4x e some
        '.ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.35); transform: scale(0); animation: ondinha 0.6s linear; pointer-events: none; }', // círculo branco translúcido que nasce do ponto do clique

        /* --- quiz (jogo.html) --- */
        '@keyframes opcaoEntra { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }', // animação: a opção entra deslizando da esquerda
        '@keyframes pop { 0% { opacity: 0; transform: scale(0.7); } 70% { transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }', // animação: surge pequena, passa do tamanho e assenta
        '@keyframes tremer { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-6px); } 80% { transform: translateX(6px); } }', // animação: sacode de um lado para o outro (erro)
        '@keyframes opcaoCerta { 0% { transform: scale(1); } 50% { transform: scale(1.04); box-shadow: 0 0 22px rgba(34, 197, 94, 0.7); } 100% { transform: scale(1); } }', // animação: a resposta certa cresce e brilha em verde
        '.option-btn { animation: opcaoEntra 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }', // toda opção nova entra deslizando
        '.option-btn:nth-child(2) { animation-delay: 0.08s; }', // a 2ª opção espera 0,08s para entrar (efeito escadinha)
        '.option-btn:nth-child(3) { animation-delay: 0.16s; }', // a 3ª opção espera 0,16s
        '.option-btn:nth-child(4) { animation-delay: 0.24s; }', // a 4ª opção espera 0,24s
        '.option-btn:nth-child(5) { animation-delay: 0.32s; }', // a 5ª opção espera 0,32s (caso um dia existam mais alternativas)
        '.option-btn:hover:not([disabled]) { transform: translateX(8px); }', // opção anda 8px para a direita quando o mouse passa
        '.option-btn.correct { animation: opcaoCerta 0.6s ease; }', // a opção correta pulsa em verde (vem depois das regras acima para cancelar o atraso)
        '.option-btn.incorrect { animation: tremer 0.45s ease; }', // a opção errada escolhida treme
        '.feedback:not(.hidden) { animation: pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }', // a mensagem "Resposta Correta/Incorreta" aparece com efeito de "pop"
        '.btn-primary:not(.hidden) { animation: pop 0.35s ease; }', // os botões "Próxima Pergunta" e "Jogar Novamente" também aparecem com "pop"
        '#result-screen:not(.hidden) { animation: pop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }', // a tela de resultado final aparece com "pop"
        '#progress-bar { background-image: linear-gradient(90deg, #38bdf8, #22c55e); transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }', // barra de progresso com degradê azul→verde e movimento mais suave
        '.confete { position: fixed; top: 0; left: 0; z-index: 10003; pointer-events: none; border-radius: 2px; }', // cada pedacinho de confete: solto na tela e sem bloquear cliques

        /* --- respeito a quem prefere menos movimento --- */
        '@media (prefers-reduced-motion: reduce) {', // abre as regras para quem ativou "reduzir movimento" no sistema
        '  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }', // praticamente desliga todas as animações e transições
        '}' // fecha as regras de movimento reduzido
    ]; // fim da lista de regras CSS

    function injetarEstilos() { // coloca todas as regras acima dentro de uma tag <style> na página
        const estilo = criar('style'); // cria a tag <style>
        estilo.id = 'estilos-do-script'; // dá um id para facilitar encontrar no inspetor do navegador
        estilo.textContent = REGRAS_CSS.join('\n'); // junta as regras (uma por linha) e escreve dentro da tag
        document.head.appendChild(estilo); // adiciona no <head> (depois do style.css, então estas regras têm prioridade)
    } // fim de injetarEstilos

    function carregarFonte() { // carrega a fonte Poppins, que o style.css pede mas nenhuma página carregava
        if (document.querySelector('link[href*="fonts.googleapis.com"]')) return; // se a página já carrega fonte do Google, não repete
        const link = criar('link'); // cria uma tag <link>
        link.rel = 'stylesheet'; // informa que o link aponta para uma folha de estilos
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'; // endereço da fonte (display=swap mostra o texto logo e troca a fonte quando chegar)
        document.head.appendChild(link); // adiciona no <head> para o navegador baixar a fonte
    } // fim de carregarFonte

    /* ======================================================================
     * 3. TRANSIÇÃO ENTRE PÁGINAS (fade-in ao chegar, fade-out ao sair)
     * ====================================================================== */

    function iniciarTransicaoDePagina() { // liga o efeito de entrada e saída das páginas
        document.body.classList.add('pagina-entra'); // aplica o fade-in assim que a página abre
    
