/**
 * Layout Definitions & Guaranteed Solvable Generator
 * Grid uses 0.5 tile units: A tile is 2 units wide and 2 units tall.
 */

const LEVELS_DATA = [
  // --- LEVEL 1: NOVICE BAMBOO (24 Tiles / 12 Pairs) ---
  {
    id: 1,
    name: 'ด่าน 1: ต้นไผ่ฝึกหัด',
    subtitle: 'Novice Bamboo',
    difficulty: 'ง่าย',
    difficultyColor: 'bg-emerald-600',
    tilesCount: 24,
    gridWidth: 10,
    gridHeight: 6,
    generateCoords: () => {
      const coords = [];
      // Base layer z=0 (16 tiles)
      for (let x = 2; x <= 8; x += 2) {
        for (let y = 1; y <= 4; y += 1) {
          coords.push({ x, y, z: 0 });
        }
      }
      // Layer 1 z=1 (8 tiles in center)
      for (let x = 3; x <= 7; x += 2) {
        for (let y = 1.5; y <= 3.5; y += 1) {
          coords.push({ x, y, z: 1 });
        }
      }
      return coords.slice(0, 24);
    }
  },

  // --- LEVEL 2: JADE GATE (44 Tiles / 22 Pairs) ---
  {
    id: 2,
    name: 'ด่าน 2: ด่านประตูหยก',
    subtitle: 'Jade Gate',
    difficulty: 'ง่าย+',
    difficultyColor: 'bg-emerald-600',
    tilesCount: 44,
    gridWidth: 14,
    gridHeight: 8,
    generateCoords: () => {
      const coords = [];
      // Left Pillar (16 tiles z=0, 4 tiles z=1)
      for (let x = 1; x <= 3; x += 2) {
        for (let y = 0; y <= 6; y += 1) {
          coords.push({ x, y, z: 0 });
        }
      }
      coords.push({ x: 2, y: 1, z: 1 }, { x: 2, y: 2, z: 1 }, { x: 2, y: 4, z: 1 }, { x: 2, y: 5, z: 1 });

      // Right Pillar (16 tiles z=0, 4 tiles z=1)
      for (let x = 11; x <= 13; x += 2) {
        for (let y = 0; y <= 6; y += 1) {
          coords.push({ x, y, z: 0 });
        }
      }
      coords.push({ x: 12, y: 1, z: 1 }, { x: 12, y: 2, z: 1 }, { x: 12, y: 4, z: 1 }, { x: 12, y: 5, z: 1 });

      // Center Arch Bridge (4 tiles z=0)
      coords.push({ x: 5, y: 3, z: 0 }, { x: 7, y: 3, z: 0 }, { x: 9, y: 3, z: 0 }, { x: 7, y: 2, z: 1 });

      return coords.slice(0, 44);
    }
  },

  // --- LEVEL 3: PLUM BLOSSOM (64 Tiles / 32 Pairs) ---
  {
    id: 3,
    name: 'ด่าน 3: ดอกเหมยบาน',
    subtitle: 'Plum Blossom',
    difficulty: 'ปานกลาง',
    difficultyColor: 'bg-amber-600',
    tilesCount: 64,
    gridWidth: 12,
    gridHeight: 8,
    generateCoords: () => {
      const coords = [];
      // Cross pattern z=0 (40 tiles)
      for (let x = 2; x <= 10; x += 2) {
        for (let y = 1; y <= 6; y += 1) {
          if (x === 6 || y === 3 || y === 4) {
            coords.push({ x, y, z: 0 });
          }
        }
      }
      coords.push(
        { x: 3, y: 2, z: 0 }, { x: 9, y: 2, z: 0 },
        { x: 3, y: 5, z: 0 }, { x: 9, y: 5, z: 0 }
      );
      // z=1 (16 tiles)
      for (let x = 4; x <= 8; x += 2) {
        for (let y = 2; y <= 5; y += 1) {
          coords.push({ x, y, z: 1 });
        }
      }
      // z=2 (8 tiles center flower core)
      for (let x = 5; x <= 7; x += 2) {
        for (let y = 2.5; y <= 4.5; y += 1) {
          coords.push({ x, y, z: 2 });
        }
      }
      return coords.slice(0, 64);
    }
  },

  // --- LEVEL 4: PHOENIX PAGODA (84 Tiles / 42 Pairs) ---
  {
    id: 4,
    name: 'ด่าน 4: หอคอยหงส์เหิน',
    subtitle: 'Phoenix Pagoda',
    difficulty: 'ปานกลาง',
    difficultyColor: 'bg-amber-600',
    tilesCount: 84,
    gridWidth: 14,
    gridHeight: 10,
    generateCoords: () => {
      const coords = [];
      // Base z=0 (48 tiles)
      for (let x = 2; x <= 12; x += 2) {
        for (let y = 1; y <= 7; y += 1.2) {
          coords.push({ x, y: Math.round(y * 10) / 10, z: 0 });
        }
      }
      const l0 = coords.slice(0, 48);

      // Level 1 z=1 (24 tiles)
      const l1 = [];
      for (let x = 4; x <= 10; x += 2) {
        for (let y = 2; y <= 6; y += 1.3) {
          l1.push({ x, y: Math.round(y * 10) / 10, z: 1 });
        }
      }
      // Level 2 z=2 (8 tiles)
      const l2 = [];
      for (let x = 6; x <= 8; x += 2) {
        for (let y = 3; y <= 5; y += 1) {
          l2.push({ x, y, z: 2 });
        }
      }
      // Level 3 z=3 (4 spire tiles)
      const l3 = [{ x: 7, y: 3.5, z: 3 }, { x: 7, y: 4.5, z: 3 }, { x: 7, y: 4, z: 4 }, { x: 7, y: 4, z: 5 }];

      return [...l0, ...l1.slice(0, 24), ...l2.slice(0, 8), ...l3].slice(0, 84);
    }
  },

  // --- LEVEL 5: GOLDEN DRAGON (100 Tiles / 50 Pairs) ---
  {
    id: 5,
    name: 'ด่าน 5: มังกรทองทะยานฟ้า',
    subtitle: 'Golden Dragon',
    difficulty: 'ปานกลาง+',
    difficultyColor: 'bg-amber-600',
    tilesCount: 100,
    gridWidth: 16,
    gridHeight: 9,
    generateCoords: () => {
      const coords = [];
      // Serpent S-curve pattern
      for (let x = 0; x <= 14; x += 2) {
        for (let y = 0; y <= 7; y += 2.2) {
          coords.push({ x, y: Math.round(y * 10) / 10, z: 0 });
        }
      }
      const l0 = coords.slice(0, 64);
      const l1 = [];
      for (let x = 2; x <= 12; x += 2) {
        l1.push({ x, y: 2, z: 1 });
        l1.push({ x, y: 4, z: 1 });
      }
      const l2 = [
        { x: 4, y: 3, z: 2 }, { x: 6, y: 3, z: 2 }, { x: 8, y: 3, z: 2 }, { x: 10, y: 3, z: 2 },
        { x: 5, y: 2, z: 2 }, { x: 7, y: 2, z: 2 }, { x: 9, y: 2, z: 2 }, { x: 7, y: 4, z: 2 },
        { x: 6, y: 2.5, z: 3 }, { x: 8, y: 2.5, z: 3 }, { x: 7, y: 3, z: 3 }, { x: 7, y: 3, z: 4 }
      ];
      return [...l0, ...l1, ...l2].slice(0, 100);
    }
  },

  // --- LEVEL 6: IMPERIAL TURTLE (124 Tiles / 62 Pairs) ---
  {
    id: 6,
    name: 'ด่าน 6: พญาเต่าจักรพรรดิ',
    subtitle: 'Imperial Turtle',
    difficulty: 'ยาก',
    difficultyColor: 'bg-red-600',
    tilesCount: 124,
    gridWidth: 18,
    gridHeight: 10,
    generateCoords: () => {
      const coords = [];
      for (let x = 2; x <= 14; x += 2) { coords.push({ x, y: 0, z: 0 }); coords.push({ x, y: 7, z: 0 }); }
      for (let x = 4; x <= 12; x += 2) { coords.push({ x, y: 1, z: 0 }); coords.push({ x, y: 6, z: 0 }); }
      for (let x = 2; x <= 14; x += 2) { coords.push({ x, y: 2, z: 0 }); coords.push({ x, y: 5, z: 0 }); }
      for (let x = 0; x <= 16; x += 2) { coords.push({ x, y: 3, z: 0 }); coords.push({ x, y: 4, z: 0 }); }
      coords.push({ x: -1, y: 3.5, z: 0 }, { x: 17, y: 3.5, z: 0 });

      for (let x = 4; x <= 12; x += 2) {
        for (let y = 2; y <= 5; y += 1) {
          coords.push({ x, y, z: 1 });
        }
      }
      for (let x = 6; x <= 10; x += 2) {
        for (let y = 2.5; y <= 4.5; y += 1) {
          coords.push({ x, y, z: 2 });
        }
      }
      for (let x = 7; x <= 9; x += 2) {
        coords.push({ x, y: 3, z: 3 }, { x, y: 4, z: 3 });
      }
      return coords.slice(0, 124);
    }
  },

  // --- LEVEL 7: GREAT WALL CITADEL (144 Tiles / 72 Pairs) ---
  {
    id: 7,
    name: 'ด่าน 7: ป้อมปราการกำแพงหมื่นลี้',
    subtitle: 'Great Wall Citadel',
    difficulty: 'ยาก',
    difficultyColor: 'bg-red-600',
    tilesCount: 144,
    gridWidth: 18,
    gridHeight: 9,
    generateCoords: () => {
      const coords = [];
      for (let x = 0; x <= 16; x += 2) {
        coords.push({ x, y: 0, z: 0 });
        coords.push({ x, y: 7, z: 0 });
        if (x % 4 === 0) {
          coords.push({ x, y: 0, z: 1 });
          coords.push({ x, y: 7, z: 1 });
        }
      }
      for (let x = 2; x <= 14; x += 2) {
        for (let y = 2; y <= 5; y += 1.5) {
          coords.push({ x, y: Math.round(y * 10) / 10, z: 0 });
          coords.push({ x, y: Math.round(y * 10) / 10, z: 1 });
        }
      }
      for (let x = 4; x <= 12; x += 4) {
        coords.push({ x, y: 3.5, z: 2 });
        coords.push({ x, y: 3.5, z: 3 });
      }
      return coords.slice(0, 144);
    }
  },

  // --- LEVEL 8: BAGUA MATRIX (144 Tiles / 72 Pairs) ---
  {
    id: 8,
    name: 'ด่าน 8: ค่ายกลแปดทิศ',
    subtitle: 'Bagua Octagon Matrix',
    difficulty: 'ยากมาก',
    difficultyColor: 'bg-red-700',
    tilesCount: 144,
    gridWidth: 16,
    gridHeight: 10,
    generateCoords: () => {
      const coords = [];
      for (let x = 2; x <= 14; x += 2) {
        for (let y = 1; y <= 8; y += 1.2) {
          if (!((x === 2 && y < 3) || (x === 2 && y > 6) || (x === 14 && y < 3) || (x === 14 && y > 6))) {
            coords.push({ x, y: Math.round(y * 10) / 10, z: 0 });
          }
        }
      }
      const l0 = coords.slice(0, 72);
      const l1 = [];
      for (let x = 4; x <= 12; x += 2) {
        for (let y = 2; y <= 7; y += 1.2) {
          l1.push({ x, y: Math.round(y * 10) / 10, z: 1 });
        }
      }
      const l2 = [];
      for (let x = 6; x <= 10; x += 2) {
        for (let y = 3; y <= 6; y += 1) {
          l2.push({ x, y, z: 2 });
        }
      }
      const l3 = [
        { x: 7, y: 4, z: 3 }, { x: 9, y: 4, z: 3 },
        { x: 8, y: 3.5, z: 3 }, { x: 8, y: 4.5, z: 3 },
        { x: 7.5, y: 4, z: 4 }, { x: 8.5, y: 4, z: 4 },
        { x: 8, y: 4, z: 5 }, { x: 8, y: 4, z: 6 }
      ];
      return [...l0, ...l1.slice(0, 44), ...l2.slice(0, 20), ...l3].slice(0, 144);
    }
  },

  // --- LEVEL 9: EMPEROR'S CROWN (144 Tiles / 72 Pairs) ---
  {
    id: 9,
    name: 'ด่าน 9: มงกุฎจักรพรรดิ',
    subtitle: "Emperor's Crown",
    difficulty: 'เซียน (Master)',
    difficultyColor: 'bg-purple-700',
    tilesCount: 144,
    gridWidth: 16,
    gridHeight: 9,
    generateCoords: () => {
      const coords = [];
      const layerSizes = [
        { z: 0, w: 14, h: 7, stepX: 2, stepY: 1.5 },
        { z: 1, w: 12, h: 6, stepX: 2, stepY: 1.5 },
        { z: 2, w: 10, h: 5, stepX: 2, stepY: 1.5 },
        { z: 3, w: 8,  h: 4, stepX: 2, stepY: 1.5 },
        { z: 4, w: 6,  h: 3, stepX: 2, stepY: 1.5 },
        { z: 5, w: 4,  h: 2, stepX: 2, stepY: 1.5 }
      ];
      layerSizes.forEach(l => {
        const startX = (16 - l.w) / 2;
        const startY = (8 - l.h) / 2;
        for (let x = startX; x <= startX + l.w; x += l.stepX) {
          for (let y = startY; y <= startY + l.h; y += l.stepY) {
            coords.push({ x, y: Math.round(y * 10) / 10, z: l.z });
          }
        }
      });
      return coords.slice(0, 144);
    }
  },

  // --- LEVEL 10: LEGENDARY DRAGON THRONE (144 Tiles / 72 Pairs) ---
  {
    id: 10,
    name: 'ด่าน 10: ตำนานบัลลังก์มังกร',
    subtitle: 'Legendary Dragon Throne',
    difficulty: 'ตำนาน (Legend)',
    difficultyColor: 'bg-amber-500 text-wood-900 font-extrabold',
    tilesCount: 144,
    gridWidth: 18,
    gridHeight: 10,
    generateCoords: () => {
      const coords = [];
      for (let x = 1; x <= 17; x += 2) {
        for (let y = 0.5; y <= 7.5; y += 2) {
          coords.push({ x, y, z: 0 });
          coords.push({ x: x - 0.5, y: y + 0.5, z: 0 });
        }
      }
      const l0 = coords.slice(0, 64);
      const l1 = [];
      for (let x = 3; x <= 15; x += 2) {
        for (let y = 1.5; y <= 6.5; y += 1.5) {
          l1.push({ x, y, z: 1 });
        }
      }
      const l2 = [];
      for (let x = 5; x <= 13; x += 2) {
        for (let y = 2.5; y <= 5.5; y += 1) {
          l2.push({ x, y, z: 2 });
        }
      }
      const l3 = [
        { x: 7, y: 3.5, z: 3 }, { x: 9, y: 3.5, z: 3 }, { x: 11, y: 3.5, z: 3 },
        { x: 7, y: 4.5, z: 3 }, { x: 9, y: 4.5, z: 3 }, { x: 11, y: 4.5, z: 3 },
        { x: 8, y: 4, z: 4 }, { x: 10, y: 4, z: 4 },
        { x: 9, y: 4, z: 5 }, { x: 9, y: 4, z: 6 }
      ];
      return [...l0, ...l1.slice(0, 40), ...l2.slice(0, 24), ...l3].slice(0, 144);
    }
  }
];

/**
 * Check if a specific tile is free to be clicked / matched
 */
function isTileFree(tile, allTilesMap) {
  if (!tile || tile.matched) return false;

  const { x, y, z } = tile;

  // 1. Check if blocked from ABOVE (z + 1)
  // A tile overlaps if Math.abs(x1 - x2) < 2 AND Math.abs(y1 - y2) < 2
  for (const other of allTilesMap.values()) {
    if (!other.matched && other.instanceId !== tile.instanceId) {
      if (other.z > z && Math.abs(other.x - x) < 1.8 && Math.abs(other.y - y) < 1.8) {
        return false; // Blocked from above!
      }
    }
  }

  // 2. Check LEFT and RIGHT side block at the SAME layer z
  let leftBlocked = false;
  let rightBlocked = false;

  for (const other of allTilesMap.values()) {
    if (!other.matched && other.instanceId !== tile.instanceId && other.z === z) {
      // Check vertical overlap on same layer
      if (Math.abs(other.y - y) < 1.8) {
        // Left neighbor: other is to the left (x - other.x > 0)
        if (x - other.x > 0.2 && x - other.x < 2.2) {
          leftBlocked = true;
        }
        // Right neighbor: other is to the right (other.x - x > 0)
        if (other.x - x > 0.2 && other.x - x < 2.2) {
          rightBlocked = true;
        }
      }
    }
  }

  // Tile is FREE if NOT blocked from above AND (at least one side left OR right is open)
  return (!leftBlocked || !rightBlocked);
}

/**
 * Generate a Guaranteed Solvable Board layout
 */
function createSolvableBoard(levelData) {
  const coords = levelData.generateCoords();
  const numTiles = coords.length;
  const numPairs = Math.floor(numTiles / 2);

  // Build deck of pairs
  const tileDeck = [];
  const definitions = TILE_DEFINITIONS;

  // Fill pairs into deck
  for (let i = 0; i < numPairs; i++) {
    const tileDef = definitions[i % definitions.length];
    // Create a matching pair
    tileDeck.push(tileDef, tileDef);
  }

  // Shuffle deck initially
  for (let i = tileDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tileDeck[i], tileDeck[j]] = [tileDeck[j], tileDeck[i]];
  }

  // Map coordinates to tile objects
  const tilesMap = new Map();
  coords.forEach((c, index) => {
    const tileDef = tileDeck[index];
    const instanceId = `tile-${index}`;
    tilesMap.set(instanceId, {
      instanceId,
      typeId: tileDef.id,
      group: tileDef.group,
      tileDef,
      x: c.x,
      y: c.y,
      z: c.z,
      matched: false
    });
  });

  return tilesMap;
}
