/**
 * Core Mahjong Solitaire Game Engine (Mobile-First)
 */

class MahjongGame {
  constructor() {
    this.currentLevelIndex = 0;
    this.boardState = new Map(); // instanceId -> Tile Object
    this.selectedTileId = null;
    this.undoStack = [];
    this.timerInterval = null;
    this.secondsPlayed = 0;
    this.score = 0;
    this.comboCount = 0;
    this.lastMatchTime = 0;
    this.hintsRemaining = 3;
    this.isGameOver = false;

    // Viewport scaling parameters
    this.baseTileWidth = 42; // Base tile width in px for grid calculation
    this.baseTileHeight = 56; // Base tile height in px
    this.zOffset = 4; // 3D depth shift per z level

    this.initDOM();
    this.initEvents();
    this.loadProgress();
    this.loadLevel(0);
  }

  initDOM() {
    this.dom = {
      viewport: document.getElementById('game-viewport'),
      board: document.getElementById('board-container'),
      levelTitle: document.getElementById('current-level-title'),
      tilesRemaining: document.getElementById('tiles-remaining'),
      gameTimer: document.getElementById('game-timer'),
      scoreDisplay: document.getElementById('score-display'),
      hintBadge: document.getElementById('hint-badge'),

      // Buttons
      btnLevelsOpen: document.getElementById('btn-levels-open'),
      btnAudioToggle: document.getElementById('btn-audio-toggle'),
      iconSoundOn: document.getElementById('icon-sound-on'),
      iconSoundOff: document.getElementById('icon-sound-off'),
      btnRulesOpen: document.getElementById('btn-rules-open'),
      btnUndo: document.getElementById('btn-undo'),
      btnHint: document.getElementById('btn-hint'),
      btnShuffle: document.getElementById('btn-shuffle'),
      btnRestart: document.getElementById('btn-restart'),

      // Modals
      modalLevels: document.getElementById('modal-levels'),
      btnLevelsClose: document.getElementById('btn-levels-close'),
      levelsGrid: document.getElementById('levels-grid'),

      modalVictory: document.getElementById('modal-victory'),
      victoryLevelName: document.getElementById('victory-level-name'),
      victoryTime: document.getElementById('victory-time'),
      victoryScore: document.getElementById('victory-score'),
      victoryHighscore: document.getElementById('victory-highscore'),
      victoryStars: document.getElementById('victory-stars'),
      btnVictoryReplay: document.getElementById('btn-victory-replay'),
      btnVictoryNext: document.getElementById('btn-victory-next'),

      modalRules: document.getElementById('modal-rules'),
      btnRulesClose: document.getElementById('btn-rules-close'),

      modalAudio: document.getElementById('modal-audio'),
      btnAudioClose: document.getElementById('btn-audio-close'),
      sliderBgmVol: document.getElementById('slider-bgm-vol'),
      sliderSfxVol: document.getElementById('slider-sfx-vol'),
      valBgmVol: document.getElementById('val-bgm-vol'),
      valSfxVol: document.getElementById('val-sfx-vol'),
      btnAudioMasterToggle: document.getElementById('btn-audio-master-toggle'),
      iconMasterMute: document.getElementById('icon-master-mute'),
      textMasterMute: document.getElementById('text-master-mute'),

      // Popups
      comboPopup: document.getElementById('combo-popup'),
      comboText: document.getElementById('combo-text'),
      comboScore: document.getElementById('combo-score'),
      toast: document.getElementById('toast-message'),
      toastText: document.getElementById('toast-text'),
      toastIcon: document.getElementById('toast-icon')
    };
  }

  initEvents() {
    // Window Resize -> Re-scale Board for Mobile Viewports
    window.addEventListener('resize', () => this.scaleBoardToFit());

    // Control Buttons
    this.dom.btnLevelsOpen.addEventListener('click', () => this.openLevelsModal());
    this.dom.btnLevelsClose.addEventListener('click', () => this.closeLevelsModal());

    this.dom.btnRulesOpen.addEventListener('click', () => this.openRulesModal());
    this.dom.btnRulesClose.addEventListener('click', () => this.closeRulesModal());

    this.dom.btnAudioToggle.addEventListener('click', () => {
      this.openAudioModal();
    });

    if (this.dom.btnAudioClose) {
      this.dom.btnAudioClose.addEventListener('click', () => this.closeAudioModal());
    }

    if (this.dom.sliderBgmVol) {
      this.dom.sliderBgmVol.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        window.soundEngine.setBgmVolume(val / 100);
        if (this.dom.valBgmVol) this.dom.valBgmVol.textContent = `${val}%`;
      });
    }

    if (this.dom.sliderSfxVol) {
      let previewDebounce = null;
      this.dom.sliderSfxVol.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        window.soundEngine.setSfxVolume(val / 100);
        if (this.dom.valSfxVol) this.dom.valSfxVol.textContent = `${val}%`;

        // Real-time audio feedback click when dragging SFX slider
        if (previewDebounce) clearTimeout(previewDebounce);
        previewDebounce = setTimeout(() => {
          window.soundEngine.playClick();
        }, 60);
      });
    }

    if (this.dom.btnAudioMasterToggle) {
      this.dom.btnAudioMasterToggle.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        this.updateAudioModalState(isMuted);
      });
    }

    this.dom.btnUndo.addEventListener('click', () => this.handleUndo());
    this.dom.btnHint.addEventListener('click', () => this.handleHint());
    if (this.dom.btnShuffle) this.dom.btnShuffle.addEventListener('click', () => this.handleShuffle());
    this.dom.btnRestart.addEventListener('click', () => this.loadLevel(this.currentLevelIndex));

    this.dom.btnVictoryReplay.addEventListener('click', () => {
      this.closeVictoryModal();
      this.loadLevel(this.currentLevelIndex);
    });

    this.dom.btnVictoryNext.addEventListener('click', () => {
      this.closeVictoryModal();
      const nextIdx = (this.currentLevelIndex + 1) % LEVELS_DATA.length;
      this.loadLevel(nextIdx);
    });
  }

  // Load level progress from localStorage
  loadProgress() {
    try {
      const saved = localStorage.getItem('mahjong_progress');
      this.progress = saved ? JSON.parse(saved) : { unlockedLevel: 1, highScores: {}, stars: {} };
    } catch (e) {
      this.progress = { unlockedLevel: 1, highScores: {}, stars: {} };
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('mahjong_progress', JSON.stringify(this.progress));
    } catch (e) {}
  }

  // Load & Start Level
  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const levelData = LEVELS_DATA[levelIndex];

    this.dom.levelTitle.textContent = levelData.name;
    this.isGameOver = false;
    this.selectedTileId = null;
    this.undoStack = [];
    this.score = 0;
    this.comboCount = 0;
    this.hintsRemaining = 3;
    this.dom.hintBadge.textContent = this.hintsRemaining;
    this.dom.hintBadge.className = 'absolute -top-1 -right-1 bg-gold-500 text-wood-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow';
    this.updateScoreDisplay();

    // Reset Timer
    clearInterval(this.timerInterval);
    this.secondsPlayed = 0;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.secondsPlayed++;
      this.updateTimerDisplay();
    }, 1000);

    // Create Board State Map
    this.boardState = createSolvableBoard(levelData);

    // Render Tiles into DOM
    this.renderBoard();
    this.scaleBoardToFit();
    this.updateTilesRemainingCount();
    this.updateUndoButton();
  }

  // Render Tiles to Board DOM
  renderBoard() {
    this.dom.board.innerHTML = '';
    const levelData = LEVELS_DATA[this.currentLevelIndex];

    // Determine board pixel dimensions from actual tile positions
    const tileW = this.baseTileWidth;
    const tileH = this.baseTileHeight;

    let maxRight = 0;
    let maxBottom = 0;
    for (const tile of this.boardState.values()) {
      if (tile.matched) continue;
      const leftPx = tile.x * (tileW / 2) + tile.z * this.zOffset;
      const topPx = tile.y * (tileH / 2) - tile.z * this.zOffset;
      if (leftPx + tileW > maxRight) maxRight = leftPx + tileW;
      if (topPx + tileH > maxBottom) maxBottom = topPx + tileH;
    }

    const boardWidthPx = Math.max(maxRight + 20, (levelData.gridWidth + 2) * (tileW / 2));
    const boardHeightPx = Math.max(maxBottom + 20, (levelData.gridHeight + 2) * (tileH / 2));

    this.dom.board.style.width = `${boardWidthPx}px`;
    this.dom.board.style.height = `${boardHeightPx}px`;

    // Render each tile
    for (const [instanceId, tile] of this.boardState.entries()) {
      if (tile.matched) continue;

      const tileEl = document.createElement('div');
      tileEl.id = instanceId;
      tileEl.className = 'mahjong-tile';
      tileEl.style.width = `${tileW}px`;
      tileEl.style.height = `${tileH}px`;

      // Positioning in 3D grid
      const leftPx = tile.x * (tileW / 2) + tile.z * this.zOffset;
      const topPx = tile.y * (tileH / 2) - tile.z * this.zOffset;
      const zIndex = tile.z * 50 + Math.floor(tile.y * 10) + Math.floor(tile.x);

      tileEl.style.left = `${leftPx}px`;
      tileEl.style.top = `${topPx}px`;
      tileEl.style.zIndex = zIndex;

      // Free / Blocked status
      const isFree = isTileFree(tile, this.boardState);
      if (isFree) {
        tileEl.classList.add('tile-free');
      } else {
        tileEl.classList.add('tile-blocked');
      }

      // Tile Inner Structure
      const tileInner = document.createElement('div');
      tileInner.className = 'tile-inner';

      const tileFace = document.createElement('div');
      tileFace.className = 'tile-face';
      tileFace.innerHTML = renderTileFaceHTML(tile.tileDef);

      tileInner.appendChild(tileFace);
      tileEl.appendChild(tileInner);

      // Event Listener (Touch & Click)
      tileEl.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleTileClick(instanceId);
      });

      this.dom.board.appendChild(tileEl);
    }
  }

  // Update Free/Blocked CSS classes for all tiles dynamically
  updateAllTileStates() {
    for (const [instanceId, tile] of this.boardState.entries()) {
      if (tile.matched) continue;
      const tileEl = document.getElementById(instanceId);
      if (!tileEl) continue;

      const isFree = isTileFree(tile, this.boardState);
      tileEl.classList.toggle('tile-free', isFree);
      tileEl.classList.toggle('tile-blocked', !isFree);
      tileEl.classList.remove('tile-hinted');
    }
  }

  // Scale Board Container to perfectly fit any mobile or desktop screen size
  scaleBoardToFit() {
    if (!this.dom.viewport || !this.dom.board) return;

    const levelData = LEVELS_DATA[this.currentLevelIndex];
    const tileW = this.baseTileWidth;
    const tileH = this.baseTileHeight;

    const boardWidthPx = parseFloat(this.dom.board.style.width) || (levelData.gridWidth + 2) * (tileW / 2);
    const boardHeightPx = parseFloat(this.dom.board.style.height) || (levelData.gridHeight + 2) * (tileH / 2);

    const viewportW = this.dom.viewport.clientWidth - 24;
    const viewportH = this.dom.viewport.clientHeight - 24;

    if (viewportW <= 0 || viewportH <= 0) return;

    const scaleX = viewportW / boardWidthPx;
    const scaleY = viewportH / boardHeightPx;
    let scale = Math.min(scaleX, scaleY);

    // Clamp scale so the entire board is 100% visible on screen without clipping
    scale = Math.min(scale, 1.35);
    scale = Math.max(scale, 0.40);

    this.dom.board.style.transform = `scale(${scale})`;
  }

  // Handle Tile Click / Selection
  handleTileClick(instanceId) {
    if (this.isGameOver) return;
    const tile = this.boardState.get(instanceId);
    if (!tile || tile.matched) return;

    const tileEl = document.getElementById(instanceId);
    const isFree = isTileFree(tile, this.boardState);

    // Blocked Tile Handling
    if (!isFree) {
      window.soundEngine.playBlocked();
      if (tileEl) {
        tileEl.classList.remove('tile-shake');
        void tileEl.offsetWidth; // Trigger reflow
        tileEl.classList.add('tile-shake');
      }
      this.showToast('ไพ่ใบนี้ถูกล็อคอยู่! (ต้องไม่มีไพ่ทับและฝั่งซ้าย/ขวาว่าง)', '🔒');
      return;
    }

    // Free Tile Clicked
    if (!this.selectedTileId) {
      // First Tile Selection
      this.selectedTileId = instanceId;
      if (tileEl) tileEl.classList.add('tile-selected');
      window.soundEngine.playClick();
    } else if (this.selectedTileId === instanceId) {
      // Deselect if clicked same tile
      this.clearSelection();
      window.soundEngine.playClick();
    } else {
      // Second Tile Selection
      const prevTile = this.boardState.get(this.selectedTileId);
      const prevTileEl = document.getElementById(this.selectedTileId);

      if (areTilesMatching(prevTile, tile)) {
        // MATCH SUCCESS!
        this.processMatch(prevTile, tile);
      } else {
        // NO MATCH! Deselect previous, select current
        if (prevTileEl) prevTileEl.classList.remove('tile-selected');
        this.selectedTileId = instanceId;
        if (tileEl) tileEl.classList.add('tile-selected');
        window.soundEngine.playClick();
      }
    }
  }

  // Process Successful Tile Match
  processMatch(tileA, tileB) {
    window.soundEngine.playMatch();

    const elA = document.getElementById(tileA.instanceId);
    const elB = document.getElementById(tileB.instanceId);

    // Add match animation
    if (elA) elA.classList.add('tile-matching');
    if (elB) elB.classList.add('tile-matching');

    // Mark matched in state
    tileA.matched = true;
    tileB.matched = true;

    // Push to Undo Stack
    this.undoStack.push([tileA.instanceId, tileB.instanceId]);
    this.updateUndoButton();

    // Clear Selection
    this.selectedTileId = null;

    // Combo System Calculation
    const now = Date.now();
    if (now - this.lastMatchTime < 3500) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastMatchTime = now;

    const basePoints = 100;
    const comboBonus = (this.comboCount - 1) * 50;
    const totalPoints = basePoints + comboBonus;
    this.score += totalPoints;
    this.updateScoreDisplay();

    if (this.comboCount > 1) {
      this.triggerComboPopup(this.comboCount, totalPoints);
    }

    // Remove DOM elements after animation
    setTimeout(() => {
      if (elA) elA.remove();
      if (elB) elB.remove();

      this.updateAllTileStates();
      this.updateTilesRemainingCount();
      this.checkWinOrNoMoves();
    }, 300);
  }

  // Check Win Condition or No Available Moves Left
  checkWinOrNoMoves() {
    let remaining = 0;
    for (const t of this.boardState.values()) {
      if (!t.matched) remaining++;
    }

    if (remaining === 0) {
      // VICTORY!
      this.handleVictory();
      return;
    }

    // Check if any valid playable pair exists
    const playablePairs = this.getPlayablePairs();
    if (playablePairs.length === 0) {
      // Auto Shuffle Notice
      this.showToast('ไม่มีทางเดินต่อ! กำลังสลับตำแหน่งไพ่อัตโนมัติ...', '🔄');
      setTimeout(() => this.handleShuffle(true), 1200);
    }
  }

  // Find all current playable matching pairs
  getPlayablePairs() {
    const freeTiles = [];
    for (const t of this.boardState.values()) {
      if (!t.matched && isTileFree(t, this.boardState)) {
        freeTiles.push(t);
      }
    }

    const pairs = [];
    for (let i = 0; i < freeTiles.length; i++) {
      for (let j = i + 1; j < freeTiles.length; j++) {
        if (areTilesMatching(freeTiles[i], freeTiles[j])) {
          pairs.push([freeTiles[i], freeTiles[j]]);
        }
      }
    }
    return pairs;
  }

  // Handle Hint Button
  handleHint() {
    if (this.isGameOver) return;

    if (this.hintsRemaining <= 0) {
      this.showToast('คำใบ้หมดแล้วสำหรับด่านนี้!', '⚠️');
      return;
    }

    const pairs = this.getPlayablePairs();

    if (pairs.length === 0) {
      this.showToast('ไม่มีคู่ไพ่ที่จับได้ในขณะนี้! กดปุ่มสลับไพ่', '⚠️');
      return;
    }

    // Decrement hint count
    this.hintsRemaining--;
    this.dom.hintBadge.textContent = this.hintsRemaining;
    if (this.hintsRemaining <= 0) {
      this.dom.hintBadge.className = 'absolute -top-1 -right-1 bg-wood-600 text-amber-200/50 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow';
    }

    window.soundEngine.playHint();
    this.clearSelection();

    // Pick first pair
    const [tileA, tileB] = pairs[0];
    const elA = document.getElementById(tileA.instanceId);
    const elB = document.getElementById(tileB.instanceId);

    if (elA) elA.classList.add('tile-hinted');
    if (elB) elB.classList.add('tile-hinted');

    this.showToast(`แนะนำคู่ไพ่ให้แล้ว! (เหลือคำใบ้ ${this.hintsRemaining} ครั้ง)`, '💡');
  }

  // Handle Shuffle Button
  handleShuffle(auto = false) {
    if (this.isGameOver) return;

    window.soundEngine.playShuffle();
    this.clearSelection();

    // Collect remaining unmatched tiles & their types
    const remainingInstances = [];
    const remainingTypes = [];

    for (const [id, t] of this.boardState.entries()) {
      if (!t.matched) {
        remainingInstances.push(id);
        remainingTypes.push({ typeId: t.typeId, group: t.group, tileDef: t.tileDef });
      }
    }

    // Shuffle array of tile types
    for (let i = remainingTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingTypes[i], remainingTypes[j]] = [remainingTypes[j], remainingTypes[i]];
    }

    // Re-assign types to remaining board positions
    remainingInstances.forEach((id, idx) => {
      const t = this.boardState.get(id);
      const newType = remainingTypes[idx];
      t.typeId = newType.typeId;
      t.group = newType.group;
      t.tileDef = newType.tileDef;
    });

    // Re-render board
    this.renderBoard();
    this.scaleBoardToFit();
    if (!auto) this.showToast('สลับตำแหน่งไพ่เรียบร้อยแล้ว!', '🔀');
  }

  // Handle Undo Button
  handleUndo() {
    if (this.undoStack.length === 0 || this.isGameOver) return;

    window.soundEngine.playClick();
    this.clearSelection();

    const [idA, idB] = this.undoStack.pop();
    const tileA = this.boardState.get(idA);
    const tileB = this.boardState.get(idB);

    if (tileA) tileA.matched = false;
    if (tileB) tileB.matched = false;

    // Deduct undo penalty
    this.score = Math.max(0, this.score - 50);
    this.updateScoreDisplay();

    this.renderBoard();
    this.scaleBoardToFit();
    this.updateTilesRemainingCount();
    this.updateUndoButton();
    this.showToast('ย้อนกลับการจับคู่แล้ว (-50 คะแนน)', '↩️');
  }

  // Deselect currently highlighted tile
  clearSelection() {
    if (this.selectedTileId) {
      const el = document.getElementById(this.selectedTileId);
      if (el) el.classList.remove('tile-selected');
      this.selectedTileId = null;
    }
  }

  // Handle Level Victory
  handleVictory() {
    this.isGameOver = true;
    clearInterval(this.timerInterval);
    window.soundEngine.playVictory();

    // Trigger Confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const levelData = LEVELS_DATA[this.currentLevelIndex];
    const timeFormatted = this.formatTime(this.secondsPlayed);

    // Calculate Stars (1-3 stars based on completion speed)
    let stars = 1;
    if (this.secondsPlayed < 120) stars = 3;
    else if (this.secondsPlayed < 240) stars = 2;

    // Save Progress
    const levelKey = `level_${levelData.id}`;
    const prevHigh = this.progress.highScores[levelKey] || 0;
    const newHigh = Math.max(prevHigh, this.score);
    this.progress.highScores[levelKey] = newHigh;
    this.progress.stars[levelKey] = Math.max(this.progress.stars[levelKey] || 0, stars);

    // Unlock Next Level
    if (this.currentLevelIndex + 2 > this.progress.unlockedLevel) {
      this.progress.unlockedLevel = Math.min(LEVELS_DATA.length, this.currentLevelIndex + 2);
    }
    this.saveProgress();

    // Update Victory Modal UI
    this.dom.victoryLevelName.textContent = levelData.name;
    this.dom.victoryTime.textContent = timeFormatted;
    this.dom.victoryScore.textContent = this.score.toLocaleString();
    this.dom.victoryHighscore.textContent = newHigh.toLocaleString();

    // Stars UI
    let starsHTML = '';
    for (let i = 0; i < 3; i++) {
      if (i < stars) {
        starsHTML += `<span class="text-gold-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">★</span>`;
      } else {
        starsHTML += `<span class="text-wood-600 opacity-40">★</span>`;
      }
    }
    this.dom.victoryStars.innerHTML = starsHTML;

    // Show Victory Modal
    this.openVictoryModal();
  }

  // --- UI UPDATERS ---
  updateTilesRemainingCount() {
    let remaining = 0;
    let total = this.boardState.size;
    for (const t of this.boardState.values()) {
      if (!t.matched) remaining++;
    }
    this.dom.tilesRemaining.textContent = `${remaining} / ${total}`;
  }

  updateTimerDisplay() {
    this.dom.gameTimer.textContent = this.formatTime(this.secondsPlayed);
  }

  updateScoreDisplay() {
    this.dom.scoreDisplay.textContent = this.score.toLocaleString();
  }

  updateUndoButton() {
    this.dom.btnUndo.disabled = (this.undoStack.length === 0);
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  triggerComboPopup(combo, bonus) {
    this.dom.comboText.textContent = `COMBO x${combo}!`;
    this.dom.comboScore.textContent = `+${bonus} คะแนน`;

    this.dom.comboPopup.classList.remove('opacity-0', '-translate-y-4');
    this.dom.comboPopup.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      this.dom.comboPopup.classList.remove('opacity-100', 'translate-y-0');
      this.dom.comboPopup.classList.add('opacity-0', '-translate-y-4');
    }, 1000);
  }

  showToast(text, icon = '💡') {
    this.dom.toastText.textContent = text;
    this.dom.toastIcon.textContent = icon;

    this.dom.toast.classList.remove('opacity-0', 'translate-y-4');
    this.dom.toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('opacity-100', 'translate-y-0');
      this.dom.toast.classList.add('opacity-0', 'translate-y-4');
    }, 2200);
  }

  // --- MODALS ENGINE ---
  openLevelsModal() {
    this.renderLevelsGrid();
    this.dom.modalLevels.classList.remove('opacity-0', 'pointer-events-none');
  }

  closeLevelsModal() {
    this.dom.modalLevels.classList.add('opacity-0', 'pointer-events-none');
  }

  openVictoryModal() {
    this.dom.modalVictory.classList.remove('opacity-0', 'pointer-events-none');
    this.dom.modalVictory.children[0].classList.remove('scale-90');
    this.dom.modalVictory.children[0].classList.add('scale-100');
  }

  closeVictoryModal() {
    this.dom.modalVictory.classList.add('opacity-0', 'pointer-events-none');
    this.dom.modalVictory.children[0].classList.remove('scale-100');
    this.dom.modalVictory.children[0].classList.add('scale-90');
  }

  openRulesModal() {
    this.dom.modalRules.classList.remove('opacity-0', 'pointer-events-none');
  }

  closeRulesModal() {
    this.dom.modalRules.classList.add('opacity-0', 'pointer-events-none');
  }

  openAudioModal() {
    if (!this.dom.modalAudio) return;
    const bgmPercent = Math.round(window.soundEngine.bgmVolume * 100);
    const sfxPercent = Math.round(window.soundEngine.sfxVolume * 100);

    if (this.dom.sliderBgmVol) this.dom.sliderBgmVol.value = bgmPercent;
    if (this.dom.valBgmVol) this.dom.valBgmVol.textContent = `${bgmPercent}%`;

    if (this.dom.sliderSfxVol) this.dom.sliderSfxVol.value = sfxPercent;
    if (this.dom.valSfxVol) this.dom.valSfxVol.textContent = `${sfxPercent}%`;

    this.updateAudioModalState(window.soundEngine.muted);
    this.dom.modalAudio.classList.remove('opacity-0', 'pointer-events-none');
  }

  closeAudioModal() {
    if (this.dom.modalAudio) {
      this.dom.modalAudio.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  updateAudioModalState(isMuted) {
    if (this.dom.iconSoundOn) this.dom.iconSoundOn.classList.toggle('hidden', isMuted);
    if (this.dom.iconSoundOff) this.dom.iconSoundOff.classList.toggle('hidden', !isMuted);

    if (this.dom.iconMasterMute) this.dom.iconMasterMute.textContent = isMuted ? '🔇' : '🔊';
    if (this.dom.textMasterMute) this.dom.textMasterMute.textContent = isMuted ? 'เปิดเสียงอีกครั้ง' : 'ปิดเสียงทั้งหมด';
  }

  renderLevelsGrid() {
    this.dom.levelsGrid.innerHTML = '';
    const unlocked = this.progress.unlockedLevel || 1;

    LEVELS_DATA.forEach((lvl, idx) => {
      const isLocked = idx + 1 > unlocked;
      const isCurrent = idx === this.currentLevelIndex;
      const starsCount = this.progress.stars[`level_${lvl.id}`] || 0;
      const high = this.progress.highScores[`level_${lvl.id}`] || 0;

      const card = document.createElement('div');
      card.className = `p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
        isCurrent
          ? 'bg-wood-700/90 border-gold-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
          : isLocked
          ? 'bg-wood-900/60 border-wood-700 opacity-60 pointer-events-none'
          : 'bg-wood-800 hover:bg-wood-700 border-gold-500/30 cursor-pointer active:scale-95'
      }`;

      let starsHtml = '';
      for (let s = 0; s < 3; s++) {
        starsHtml += `<span class="${s < starsCount ? 'text-gold-400' : 'text-wood-600'}">★</span>`;
      }

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${lvl.difficultyColor}">${lvl.difficulty}</span>
            <div class="text-xs">${starsHtml}</div>
          </div>
          <h3 class="text-sm font-bold text-gold-200 font-chinese">${lvl.name}</h3>
          <p class="text-[11px] text-amber-300/70 mt-0.5">${lvl.subtitle} • ${lvl.tilesCount} ไพ่</p>
        </div>
        <div class="mt-3 pt-2 border-t border-wood-700/60 flex items-center justify-between text-[11px]">
          <span class="text-amber-300/80">คะแนนสูงสุด: ${high > 0 ? high.toLocaleString() : '-'}</span>
          ${isLocked ? '<span class="text-red-400 font-bold">🔒 ล็อค</span>' : '<span class="text-gold-400 font-bold">เล่น ▶</span>'}
        </div>
      `;

      if (!isLocked) {
        card.addEventListener('click', () => {
          this.closeLevelsModal();
          this.loadLevel(idx);
        });
      }

      this.dom.levelsGrid.appendChild(card);
    });
  }
}

// Start Game on Window Load
window.addEventListener('DOMContentLoaded', () => {
  window.mahjongGame = new MahjongGame();
});
