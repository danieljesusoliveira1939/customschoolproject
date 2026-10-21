// Configuração do Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estado do Teclado
const keys = {};

window.addEventListener('keydown', (e) => {
  // Impede que a tela role com as setas ou espaço se não estiver focando o chat
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key) && document.activeElement.id !== 'chat-input') {
    e.preventDefault();
  }
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Entidades do Jogo
const player = {
  x: 400,
  y: 250,
  size: 24,
  speed: 3,
  color: '#3498db',
  name: 'Heroi',
  level: 1,
  hp: 100,
  maxHp: 100,
  exp: 0,
  maxExp: 100,
  atk: 15,
  gold: 0
};

// Outros jogadores simulados (Servidor MMO Simulado)
const otherPlayers = [
  { id: 1, name: 'Knight_99', x: 200, y: 150, color: '#e74c3c' },
  { id: 2, name: 'Mage_Z', x: 600, y: 350, color: '#9b59b6' }
];

// Monstros/Inimigos
const monsters = [
  { id: 1, name: 'Goblin', x: 150, y: 300, size: 20, hp: 30, maxHp: 30, color: '#27ae60', expReward: 35, goldReward: 12 },
  { id: 2, name: 'Orc', x: 550, y: 150, size: 28, hp: 60, maxHp: 60, color: '#d35400', expReward: 70, goldReward: 25 }
];

// Atualizar Interface gráfica do usuário (UI)
function updateUI() {
  document.getElementById('player-name').innerText = player.name;
  document.getElementById('player-level').innerText = player.level;
  document.getElementById('hp-text').innerText = `${player.hp}/${player.maxHp}`;
  document.getElementById('exp-text').innerText = `${player.exp}/${player.maxExp}`;
  document.getElementById('hp-bar').style.width = `${(player.hp / player.maxHp) * 100}%`;
  document.getElementById('exp-bar').style.width = `${(player.exp / player.maxExp) * 100}%`;
  document.getElementById('stat-atk').innerText = player.atk;
  document.getElementById('stat-gold').innerText = player.gold;
}

// Movimentação do Jogador
function updatePlayerPosition() {
  // Não move o personagem se estiver digitando no chat
  if (document.activeElement.id === 'chat-input') return;

  if ((keys['ArrowUp'] || keys['w'] || keys['W']) && player.y > 0) {
    player.y -= player.speed;
  }
  if ((keys['ArrowDown'] || keys['s'] || keys['S']) && player.y < canvas.height - player.size) {
    player.y += player.speed;
  }
  if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && player.x > 0) {
    player.x -= player.speed;
  }
  if ((keys['ArrowRight'] || keys['d'] || keys['D']) && player.x < canvas.width - player.size) {
    player.x += player.speed;
  }

  // Ataque no Espaço
  if (keys[' ']) {
    checkAttack();
    keys[' '] = false; // Garante 1 ataque por clique
  }
}

// Sistema de Combate Simples
function checkAttack() {
  monsters.forEach((monster) => {
    if (monster.hp <= 0) return;

    // Checa distância entre jogador e monstro
    const dist = Math.hypot(player.x - monster.x, player.y - monster.y);
    if (dist < 45) {
      monster.hp -= player.atk;
      addChatMessage('Sistema', `Você causou ${player.atk} de dano em ${monster.name}!`, 'system');

      if (monster.hp <= 0) {
        addChatMessage('Sistema', `Você derrotou ${monster.name}! Ganhou ${monster.expReward} EXP e ${monster.goldReward} ouro.`, 'system');
        gainExperience(monster.expReward);
        player.gold += monster.goldReward;
        
        // Respawn do Monstro após 4 segundos
        setTimeout(() => {
          monster.hp = monster.maxHp;
          monster.x = Math.random() * (canvas.width - 50) + 25;
          monster.y = Math.random() * (canvas.height - 50) + 25;
        }, 4000);
      }
      updateUI();
    }
  });
}

// Ganhar Experiência e Subir de Nível
function gainExperience(amount) {
  player.exp += amount;
  if (player.exp >= player.maxExp) {
    player.level++;
    player.exp -= player.maxExp;
    player.maxExp = Math.floor(player.maxExp * 1.5);
    player.maxHp += 20;
    player.hp = player.maxHp;
    player.atk += 5;
    addChatMessage('Sistema', `PARABÉNS! Você alcançou o Nível ${player.level}!`, 'system');
  }
}

// Desenhar Elementos na Tela (Render Loop)
function draw() {
  // Limpa o Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha Grade de Fundo (Estilo MMO Clássico)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Desenha Monstros
  monsters.forEach((monster) => {
    if (monster.hp > 0) {
      ctx.fillStyle = monster.color;
      ctx.fillRect(monster.x, monster.y, monster.size, monster.size);

      // Nome do Monstro
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(monster.name, monster.x + monster.size / 2, monster.y - 8);

      // Barra de Vida do Monstro
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(monster.x, monster.y - 6, monster.size, 4);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(monster.x, monster.y - 6, (monster.hp / monster.maxHp) * monster.size, 4);
    }
  });

  // Desenha Outros Jogadores
  otherPlayers.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, player.size, player.size);

    ctx.fillStyle = '#f1c40f';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, p.x + player.size / 2, p.y - 6);
  });

  // Desenha o Próprio Jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.size, player.size);

  // Nome do Próprio Jogador
  ctx.fillStyle = '#3498db';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(player.name, player.x + player.size / 2, player.y - 6);
}

// Loop Principal do Jogo
function gameLoop() {
  updatePlayerPosition();
  draw();
  requestAnimationFrame(gameLoop);
}

// Sistema de Chat MMO
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

function addChatMessage(author, text, type = 'user') {
  const msgElement = document.createElement('div');
  msgElement.classList.add('chat-msg');
  if (type === 'system') msgElement.classList.add('system');

  if (type === 'system') {
    msgElement.innerText = `[${author}]: ${text}`;
  } else {
    msgElement.innerHTML = `<span class="author">${author}:</span> ${text}`;
  }

  chatMessages.appendChild(msgElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (text !== '') {
    addChatMessage(player.name, text);
    chatInput.value = '';
  }
});

// Simulação de mensagens randômicas de outros jogadores na rede MMO
setInterval(() => {
  const randomMsg = [
    'Alguém para matar o Orc?',
    'Compro poções de vida!',
    'Vendendo Espada de Madeira por 50G',
    'Como faz para subir de nível rápido?'
  ];
  const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
  const text = randomMsg[Math.floor(Math.random() * randomMsg.length)];
  addChatMessage(randomPlayer.name, text);
}, 12000);

// Inicialização
updateUI();
addChatMessage('Sistema', 'Bem-vindo ao Realm of Legends! Use W, A, S, D ou as SETAS para se mover e ESPAÇO para atacar.', 'system');
gameLoop();