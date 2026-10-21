/* -------------------------------------------------------------------------- */
/* AUDIO SYNTHESIZER (Web Audio API)                                          */
/* -------------------------------------------------------------------------- */
class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
    }

    playShoot() {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playReload() {
        if (!this.enabled || !this.ctx) return;
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(120 + Math.random() * 80, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.08);
            }, i * 90);
        }
    }

    playHit() {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playBoss() {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
    }
}

const sounds = new SoundSystem();

function toggleAudio() {
    sounds.enabled = !sounds.enabled;
    const btn = document.getElementById('sound-btn');
    btn.innerText = sounds.enabled ? '🔊' : '🔇';
}

/* -------------------------------------------------------------------------- */
/* SHOP & PERSISTENCE DATA                                                   */
/* -------------------------------------------------------------------------- */
const SKINS_DATA = {
    lumberjack: [
        { id: 'classic', name: 'Lenhador Clássico', price: 0, color: '#dc2626', hat: '#991b1b', desc: 'O clássico cortador de árvores com camisa xadrez.' },
        { id: 'viking', name: 'Lenhador Viking', price: 50, color: '#d97706', hat: '#92400e', desc: 'Barba ruiva e machado duplo nórdico!' },
        { id: 'robot', name: 'Cyber Lenhador 3000', price: 120, color: '#0284c7', hat: '#38bdf8', desc: 'Mecânico e implacável com machado laser.' },
        { id: 'fire', name: 'Lenhador de Fogo', price: 250, color: '#ea580c', hat: '#f97316', desc: 'Nascido nas brasas da floresta queimada.' }
    ],
    seed: [
        { id: 'classic', name: 'Semente Tradicional', price: 0, color: '#78350f', glow: null, speed: 12, damage: 25, desc: 'Semente comum de maçã. Confiável.' },
        { id: 'golden', name: 'Semente Dourada', price: 60, color: '#fbbf24', glow: '#fef08a', speed: 14, damage: 35, desc: '+10% Dano extra e tiro mais rápido!' },
        { id: 'plasma', name: 'Semente de Plasma', price: 150, color: '#a855f7', glow: '#e9d5ff', speed: 16, damage: 45, desc: 'Energia concentrada para atravessar cascas!' },
        { id: 'star', name: 'Semente Mágica Estelar', price: 300, color: '#38bdf8', glow: '#ffffff', speed: 18, damage: 60, desc: 'Poder cósmico natural devastador!' }
    ],
    apple: [
        { id: 'red', name: 'Maçã Vermelha', price: 0, emoji: '🍎', maxAmmo: 10, color: '#ef4444', desc: 'Maçã standard suculenta. Cap: 10 sementes.' },
        { id: 'green', name: 'Maçã Verde', price: 40, emoji: '🍏', maxAmmo: 12, color: '#22c55e', desc: 'Ácida e revitalizante! Cap: 12 sementes.' },
        { id: 'gold', name: 'Maçã Dourada', price: 120, emoji: '🌟', maxAmmo: 15, color: '#eab308', desc: 'Rara e nutritiva. Cap: 15 sementes.' },
        { id: 'crystal', name: 'Maçã de Cristal', price: 250, emoji: '💎', maxAmmo: 20, color: '#06b6d4', desc: 'Mística! Cap máxima de 20 sementes.' }
    ]
};

let playerData = {
    coins: 0,
    highScore: 0,
    unlockedSkins: {
        lumberjack: ['classic'],
        seed: ['classic'],
        apple: ['red']
    },
    activeSkins: {
        lumberjack: 'classic',
        seed: 'classic',
        apple: 'red'
    }
};

function loadStorage() {
    const saved = localStorage.getItem('apple_seed_defender_save');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            playerData = { ...playerData, ...parsed };
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
    updateMenuUI();
}

function saveStorage() {
    localStorage.setItem('apple_seed_defender_save', JSON.stringify(playerData));
    updateMenuUI();
}

function updateMenuUI() {
    document.getElementById('menu-highscore').innerText = playerData.highScore;
    document.getElementById('menu-coins-val').innerText = playerData.coins;
    document.getElementById('shop-coins-val').innerText = playerData.coins;
}

/* -------------------------------------------------------------------------- */
/* SHOP SYSTEM INTERACTION                                                    */
/* -------------------------------------------------------------------------- */
let currentShopTab = 'lumberjack';

function openShop() {
    sounds.init();
    document.getElementById('shop-menu').classList.remove('hidden');
    renderShopItems();
}

function closeShop() {
    document.getElementById('shop-menu').classList.add('hidden');
}

function switchShopTab(tab) {
    currentShopTab = tab;
    ['lumberjack', 'seed', 'apple'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (t === tab) {
            btn.className = "flex-1 py-2 rounded-xl font-bold text-sm bg-green-600 text-white border border-green-400/50";
        } else {
            btn.className = "flex-1 py-2 rounded-xl font-bold text-sm bg-black/40 text-gray-300 border border-white/10";
        }
    });
    renderShopItems();
}

function renderShopItems() {
    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    const items = SKINS_DATA[currentShopTab];
    const unlockedList = playerData.unlockedSkins[currentShopTab];
    const activeId = playerData.activeSkins[currentShopTab];

    items.forEach(item => {
        const isUnlocked = unlockedList.includes(item.id);
        const isActive = activeId === item.id;

        const card = document.createElement('div');
        card.className = `bg-black/40 border ${isActive ? 'border-amber-400' : 'border-white/10'} p-3 rounded-2xl flex flex-col justify-between`;

        let visualDisplay = '';
        if (currentShopTab === 'apple') {
            visualDisplay = `<span class="text-4xl">${item.emoji}</span>`;
        } else if (currentShopTab === 'seed') {
            visualDisplay = `<div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style="background:${item.color}; box-shadow: 0 0 10px ${item.glow || item.color}"></div>`;
        } else {
            visualDisplay = `<div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xl" style="background:${item.color}">🪓</div>`;
        }

        card.innerHTML = `
            <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-black/30 rounded-xl flex items-center justify-center min-w-[50px] min-h-[50px]">
                    ${visualDisplay}
                </div>
                <div>
                    <h3 class="font-bold text-white text-sm">${item.name}</h3>
                    <p class="text-[11px] text-gray-400 leading-tight">${item.desc}</p>
                </div>
            </div>
            <div class="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                ${!isUnlocked ? `
                    <span class="text-amber-400 font-bold text-xs flex items-center gap-1">🍎 ${item.price}</span>
                    <button onclick="buySkin('${currentShopTab}', '${item.id}',${item.price})" class="btn-amber text-xs px-3 py-1.5 rounded-lg font-bold">Comprar</button>
                ` : isActive ? `
                    <span class="text-green-400 text-xs font-bold flex items-center gap-1">✓ Equipado</span>
                    <button class="bg-gray-700 text-gray-400 text-xs px-3 py-1.5 rounded-lg font-bold cursor-default" disabled>Em Uso</button>
                ` : `
                    <span class="text-gray-400 text-xs">Adquirido</span>
                    <button onclick="equipSkin('${currentShopTab}', '${item.id}')" class="btn-green text-xs px-3 py-1.5 rounded-lg font-bold">Equipar</button>
                `}
            </div>
        `;
        container.appendChild(card);
    });
}

function buySkin(category, id, price) {
    if (playerData.coins >= price) {
        playerData.coins -= price;
        playerData.unlockedSkins[category].push(id);
        playerData.activeSkins[category] = id;
        saveStorage();
        renderShopItems();
    } else {
        alert("Maçãs insuficientes! Jogue mais rounds para ganhar maçãs.");
    }
}

function equipSkin(category, id) {
    playerData.activeSkins[category] = id;
    saveStorage();
    renderShopItems();
}

/* -------------------------------------------------------------------------- */
/* GAME ENGINE & CANVAS RENDERER                                              */
/* -------------------------------------------------------------------------- */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Carregar Dados Salvos
loadStorage();
