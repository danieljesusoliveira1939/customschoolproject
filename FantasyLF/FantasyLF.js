// Estado do Personagem
let player = {
    skinColor: "#f5d0b1",
    hairStyle: "short",
    hairColor: "#8b4513",
    outfit: "tunic",
    age: 6,       // Começa como criança
    scale: 0.7    // Escala menor por ser criança
};

// Elementos da UI
const skinColorInput = document.getElementById('skinColor');
const hairStyleSelect = document.getElementById('hairStyle');
const hairColorInput = document.getElementById('hairColor');
const outfitSelect = document.getElementById('outfitStyle');
const btnComecar = document.getElementById('btn-comecar');
const btnEnvelhecer = document.getElementById('btn-envelhecer');

const previewCanvas = document.getElementById('characterCanvas');
const previewCtx = previewCanvas.getContext('2d');

// Atualizar propriedades em tempo real na pré-visualização
function atualizarPreview() {
    player.skinColor = skinColorInput.value;
    player.hairStyle = hairStyleSelect.value;
    player.hairColor = hairColorInput.value;
    player.outfit = outfitSelect.value;

    desenharPersonagem(previewCtx, previewCanvas.width, previewCanvas.height, player);
}

[skinColorInput, hairStyleSelect, hairColorInput, outfitSelect].forEach(element => {
    element.addEventListener('input', atualizarPreview);
});

// Função genérica para desenhar o personagem (usando formas básicas ou sprites com tint)
function desennarPersonagem(ctx, width, height, char) {
    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    // Se for criança, desenhamos mais pequeno ou com proporções ajustadas
    let currentScale = char.age < 12 ? 0.75 : 1.0;
    ctx.translate(width / 2, height / 2);
    ctx.scale(currentScale, currentScale);
    ctx.translate(-width / 2, -height / 2);

    // 1. Corpo / Pele (Cabeça e Mãos)
    ctx.fillStyle = char.skinColor;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 10, 20 * (char.age < 12 ? 0.9 : 1), 0, Math.PI * 2); // Cabeça
    ctx.fill();

    // 2. Roupa
    ctx.fillStyle = char.outfit === 'tunic' ? '#8b5a2b' : '#a0a0a0';
    ctx.fillRect(width / 2 - 15, height / 2 + 10, 30, 35);

    // 3. Cabelo
    ctx.fillStyle = char.hairColor;
    if (char.hairStyle === 'short') {
        ctx.fillRect(width / 2 - 18, height / 2 - 32, 36, 12);
    } else if (char.hairStyle === 'long') {
        ctx.fillRect(width / 2 - 18, height / 2 - 32, 36, 25);
    } else if (char.hairStyle === 'spiky') {
        ctx.beginPath();
        ctx.moveTo(width / 2 - 20, height / 2 - 20);
        ctx.lineTo(width / 2, height / 2 - 45);
        ctx.lineTo(width / 2 + 20, height / 2 - 20);
        ctx.fill();
    }

    ctx.restore();
}

// Iniciar Jogo
btnComecar.addEventListener('click', () => {
    document.getElementById('criacao-container').style.display = 'none';
    document.getElementById('jogo-container').style.display = 'block';
    document.getElementById('idade-char').innerText = player.age;
});

// Mecânica de Envelhecimento
btnEnvelhecer.addEventListener('click', () => {
    player.age += 2; // Avança 2 anos por clique (ou por marco de história)
    if (player.age > 60) player.age = 6; // Opcional: ciclo ou limite

    document.getElementById('idade-char').innerText = player.age;
    
    // Atualizar lógica de envelhecimento (ex: mudar estatísticas, tamanho, sprites ou bónus)
    const gameCanvas = document.getElementById('gameCanvas');
    const gameCtx = gameCanvas.getContext('2d');
    desenharPersonagem(gameCtx, gameCanvas.width, gameCanvas.height, player);
});

// Render inicial
atualizarPreview();
  
