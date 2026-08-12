/**
 * Mahjong Tile Definitions & Renderers
 */

const TILE_GROUPS = {
  WAN: 'wan',       // Character suit
  BING: 'bing',     // Dot suit
  SUO: 'suo',       // Bamboo suit
  WIND: 'wind',     // Winds
  DRAGON: 'dragon', // Dragons
  SEASON: 'season', // Seasons (Any Season matches any Season)
  FLOWER: 'flower'  // Flowers (Any Flower matches any Flower)
};

// All 42 unique tile types in standard Mahjong deck
const TILE_DEFINITIONS = [
  // --- 9 CHARACTERS (WAN 1-9) ---
  { id: 'wan-1', group: TILE_GROUPS.WAN, val: 1, label: '一萬', text: '一', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-2', group: TILE_GROUPS.WAN, val: 2, label: '二萬', text: '二', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-3', group: TILE_GROUPS.WAN, val: 3, label: '三萬', text: '三', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-4', group: TILE_GROUPS.WAN, val: 4, label: '四萬', text: '四', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-5', group: TILE_GROUPS.WAN, val: 5, label: '五萬', text: '五', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-6', group: TILE_GROUPS.WAN, val: 6, label: '六萬', text: '六', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-7', group: TILE_GROUPS.WAN, val: 7, label: '七萬', text: '七', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-8', group: TILE_GROUPS.WAN, val: 8, label: '八萬', text: '八', sub: '萬', colorClass: 'color-wan' },
  { id: 'wan-9', group: TILE_GROUPS.WAN, val: 9, label: '九萬', text: '九', sub: '萬', colorClass: 'color-wan' },

  // --- 9 DOTS (BING 1-9) ---
  { id: 'bing-1', group: TILE_GROUPS.BING, val: 1, label: '一筒', colorClass: 'color-bing' },
  { id: 'bing-2', group: TILE_GROUPS.BING, val: 2, label: '二筒', colorClass: 'color-bing' },
  { id: 'bing-3', group: TILE_GROUPS.BING, val: 3, label: '三筒', colorClass: 'color-bing' },
  { id: 'bing-4', group: TILE_GROUPS.BING, val: 4, label: '四筒', colorClass: 'color-bing' },
  { id: 'bing-5', group: TILE_GROUPS.BING, val: 5, label: '五筒', colorClass: 'color-bing' },
  { id: 'bing-6', group: TILE_GROUPS.BING, val: 6, label: '六筒', colorClass: 'color-bing' },
  { id: 'bing-7', group: TILE_GROUPS.BING, val: 7, label: '七筒', colorClass: 'color-bing' },
  { id: 'bing-8', group: TILE_GROUPS.BING, val: 8, label: '八筒', colorClass: 'color-bing' },
  { id: 'bing-9', group: TILE_GROUPS.BING, val: 9, label: '九筒', colorClass: 'color-bing' },

  // --- 9 BAMBOOS (SUO 1-9) ---
  { id: 'suo-1', group: TILE_GROUPS.SUO, val: 1, label: '一索', colorClass: 'color-suo' },
  { id: 'suo-2', group: TILE_GROUPS.SUO, val: 2, label: '二索', colorClass: 'color-suo' },
  { id: 'suo-3', group: TILE_GROUPS.SUO, val: 3, label: '三索', colorClass: 'color-suo' },
  { id: 'suo-4', group: TILE_GROUPS.SUO, val: 4, label: '四索', colorClass: 'color-suo' },
  { id: 'suo-5', group: TILE_GROUPS.SUO, val: 5, label: '五索', colorClass: 'color-suo' },
  { id: 'suo-6', group: TILE_GROUPS.SUO, val: 6, label: '六索', colorClass: 'color-suo' },
  { id: 'suo-7', group: TILE_GROUPS.SUO, val: 7, label: '七索', colorClass: 'color-suo' },
  { id: 'suo-8', group: TILE_GROUPS.SUO, val: 8, label: '八索', colorClass: 'color-suo' },
  { id: 'suo-9', group: TILE_GROUPS.SUO, val: 9, label: '九索', colorClass: 'color-suo' },

  // --- 4 WINDS ---
  { id: 'wind-east', group: TILE_GROUPS.WIND, val: 'E', label: '東風', text: '東', colorClass: 'color-wind' },
  { id: 'wind-south', group: TILE_GROUPS.WIND, val: 'S', label: '南風', text: '南', colorClass: 'color-wind' },
  { id: 'wind-west', group: TILE_GROUPS.WIND, val: 'W', label: '西風', text: '西', colorClass: 'color-wind' },
  { id: 'wind-north', group: TILE_GROUPS.WIND, val: 'N', label: '北風', text: '北', colorClass: 'color-wind' },

  // --- 3 DRAGONS ---
  { id: 'dragon-red', group: TILE_GROUPS.DRAGON, val: 'R', label: '紅中', text: '中', colorClass: 'color-red-dragon' },
  { id: 'dragon-green', group: TILE_GROUPS.DRAGON, val: 'G', label: '發財', text: '發', colorClass: 'color-green-dragon' },
  { id: 'dragon-white', group: TILE_GROUPS.DRAGON, val: 'B', label: '白板', text: '□', colorClass: 'color-white-dragon' },

  // --- 4 SEASONS (Match any season with any season) ---
  { id: 'season-spring', group: TILE_GROUPS.SEASON, val: 1, label: '春', text: '春', icon: '🌸', colorClass: 'color-season' },
  { id: 'season-summer', group: TILE_GROUPS.SEASON, val: 2, label: '夏', text: '夏', icon: '☀️', colorClass: 'color-season' },
  { id: 'season-autumn', group: TILE_GROUPS.SEASON, val: 3, label: '秋', text: '秋', icon: '🍁', colorClass: 'color-season' },
  { id: 'season-winter', group: TILE_GROUPS.SEASON, val: 4, label: '冬', text: '冬', icon: '❄️', colorClass: 'color-season' },

  // --- 4 FLOWERS (Match any flower with any flower) ---
  { id: 'flower-plum', group: TILE_GROUPS.FLOWER, val: 1, label: '梅', text: '梅', icon: '🌺', colorClass: 'color-flower' },
  { id: 'flower-orchid', group: TILE_GROUPS.FLOWER, val: 2, label: '蘭', text: '蘭', icon: '🌷', colorClass: 'color-flower' },
  { id: 'flower-bamboo', group: TILE_GROUPS.FLOWER, val: 3, label: '竹', text: '竹', icon: '🎋', colorClass: 'color-flower' },
  { id: 'flower-chrys', group: TILE_GROUPS.FLOWER, val: 4, label: '菊', text: '菊', icon: '🌻', colorClass: 'color-flower' },
];

/**
 * Check if two tiles are a valid matching pair according to Mahjong rules
 */
function areTilesMatching(tileA, tileB) {
  if (!tileA || !tileB) return false;
  if (tileA.instanceId === tileB.instanceId) return false; // Same exact tile on board cannot match itself

  // Seasons match with any Season
  if (tileA.group === TILE_GROUPS.SEASON && tileB.group === TILE_GROUPS.SEASON) {
    return true;
  }
  // Flowers match with any Flower
  if (tileA.group === TILE_GROUPS.FLOWER && tileB.group === TILE_GROUPS.FLOWER) {
    return true;
  }
  // Standard tiles match if they have the exact same tile ID
  return tileA.typeId === tileB.typeId;
}

/**
 * Render inner SVG / HTML graphics for tile face
 */
function renderTileFaceHTML(tileDef) {
  const { group, text, sub, val, colorClass, icon } = tileDef;

  // 1. CHARACTER SUIT (萬)
  if (group === TILE_GROUPS.WAN) {
    return `
      <div class="flex flex-col items-center justify-center h-full leading-none font-chinese select-none">
        <span class="text-sm sm:text-base font-bold text-red-700">${text}</span>
        <span class="text-xs sm:text-sm font-bold text-red-600 mt-0.5">${sub}</span>
      </div>
    `;
  }

  // 2. WIND (風) OR RED/GREEN DRAGON (中 / 發)
  if (group === TILE_GROUPS.WIND || (group === TILE_GROUPS.DRAGON && val !== 'B')) {
    return `
      <div class="flex items-center justify-center h-full font-chinese select-none">
        <span class="text-xl sm:text-2xl font-black ${colorClass}">${text}</span>
      </div>
    `;
  }

  // 3. WHITE DRAGON (白板 - Gold Frame)
  if (group === TILE_GROUPS.DRAGON && val === 'B') {
    return `
      <div class="flex items-center justify-center h-full w-full p-1 select-none">
        <div class="w-full h-full border-2 border-amber-600 rounded flex items-center justify-center bg-amber-500/10">
          <span class="text-xs font-bold text-amber-700">白</span>
        </div>
      </div>
    `;
  }

  // 4. SEASON & FLOWER (Special Badges)
  if (group === TILE_GROUPS.SEASON || group === TILE_GROUPS.FLOWER) {
    const isSeason = group === TILE_GROUPS.SEASON;
    const badgeColor = isSeason ? 'text-amber-700' : 'text-purple-700';
    return `
      <div class="flex flex-col items-center justify-between h-full py-0.5 select-none">
        <span class="text-[9px] font-bold ${badgeColor} uppercase tracking-tighter">${isSeason ? 'SEASON' : 'FLOWER'}</span>
        <span class="text-base sm:text-lg">${icon}</span>
        <span class="text-xs font-chinese font-bold ${badgeColor}">${text}</span>
      </div>
    `;
  }

  // 5. DOT SUIT (筒)
  if (group === TILE_GROUPS.BING) {
    return renderDotSVG(val);
  }

  // 6. BAMBOO SUIT (索)
  if (group === TILE_GROUPS.SUO) {
    return renderBambooSVG(val);
  }

  return `<div class="text-xs">${tileDef.label}</div>`;
}

// Generate SVG layout for Dots (1-9)
function renderDotSVG(val) {
  // SVG Circles
  let circles = '';
  const r = 2.8;
  const red = '#dc2626', green = '#16a34a', blue = '#1d4ed8';

  if (val === 1) {
    // 1-Dot: Big Red Circle with inner flower detail
    return `
      <svg class="w-full h-full p-1" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="${red}" stroke="#991b1b" stroke-width="1"/>
        <circle cx="12" cy="12" r="4" fill="#fbbf24"/>
        <circle cx="12" cy="12" r="2" fill="${red}"/>
      </svg>
    `;
  } else if (val === 2) {
    circles = `<circle cx="12" cy="7" r="${r}" fill="${blue}"/><circle cx="12" cy="17" r="${r}" fill="${green}"/>`;
  } else if (val === 3) {
    circles = `<circle cx="7" cy="6" r="${r}" fill="${blue}"/><circle cx="12" cy="12" r="${r}" fill="${red}"/><circle cx="17" cy="18" r="${r}" fill="${green}"/>`;
  } else if (val === 4) {
    circles = `<circle cx="7" cy="7" r="${r}" fill="${blue}"/><circle cx="17" cy="7" r="${r}" fill="${green}"/><circle cx="7" cy="17" r="${r}" fill="${green}"/><circle cx="17" cy="17" r="${r}" fill="${blue}"/>`;
  } else if (val === 5) {
    circles = `<circle cx="7" cy="6" r="${r}" fill="${blue}"/><circle cx="17" cy="6" r="${r}" fill="${green}"/><circle cx="12" cy="12" r="${r}" fill="${red}"/><circle cx="7" cy="18" r="${r}" fill="${green}"/><circle cx="17" cy="18" r="${r}" fill="${blue}"/>`;
  } else if (val === 6) {
    circles = `<circle cx="7" cy="6" r="${r}" fill="${green}"/><circle cx="17" cy="6" r="${r}" fill="${green}"/><circle cx="7" cy="12" r="${r}" fill="${red}"/><circle cx="17" cy="12" r="${r}" fill="${red}"/><circle cx="7" cy="18" r="${r}" fill="${red}"/><circle cx="17" cy="18" r="${r}" fill="${red}"/>`;
  } else if (val === 7) {
    circles = `<circle cx="6" cy="5" r="2" fill="${green}"/><circle cx="12" cy="7" r="2" fill="${green}"/><circle cx="18" cy="9" r="2" fill="${green}"/><circle cx="7" cy="14" r="2" fill="${red}"/><circle cx="17" cy="14" r="2" fill="${red}"/><circle cx="7" cy="19" r="2" fill="${red}"/><circle cx="17" cy="19" r="2" fill="${red}"/>`;
  } else if (val === 8) {
    circles = `<circle cx="7" cy="5" r="2" fill="${blue}"/><circle cx="17" cy="5" r="2" fill="${blue}"/><circle cx="7" cy="10" r="2" fill="${blue}"/><circle cx="17" cy="10" r="2" fill="${blue}"/><circle cx="7" cy="15" r="2" fill="${blue}"/><circle cx="17" cy="15" r="2" fill="${blue}"/><circle cx="7" cy="20" r="2" fill="${blue}"/><circle cx="17" cy="20" r="2" fill="${blue}"/>`;
  } else if (val === 9) {
    circles = `<circle cx="6" cy="5" r="2" fill="${green}"/><circle cx="12" cy="5" r="2" fill="${green}"/><circle cx="18" cy="5" r="2" fill="${green}"/><circle cx="6" cy="12" r="2" fill="${red}"/><circle cx="12" cy="12" r="2" fill="${red}"/><circle cx="18" cy="12" r="2" fill="${red}"/><circle cx="6" cy="19" r="2" fill="${blue}"/><circle cx="12" cy="19" r="2" fill="${blue}"/><circle cx="18" cy="19" r="2" fill="${blue}"/>`;
  }

  return `<svg class="w-full h-full p-0.5" viewBox="0 0 24 24">${circles}</svg>`;
}

// Generate SVG layout for Bamboo (1-9)
function renderBambooSVG(val) {
  const g = '#15803d', r = '#dc2626', b = '#1d4ed8';

  if (val === 1) {
    // 1-Bamboo: Peacock / Bird Icon
    return `
      <div class="flex items-center justify-center h-full select-none text-emerald-700">
        <span class="text-xl sm:text-2xl">🦚</span>
      </div>
    `;
  }

  // Vertical Bamboo Sticks
  const stick = (x, y, h, color) => `<rect x="${x}" y="${y}" width="2.5" height="${h}" rx="1" fill="${color}"/>`;

  let sticks = '';
  if (val === 2) {
    sticks = stick(11, 4, 7, g) + stick(11, 13, 7, r);
  } else if (val === 3) {
    sticks = stick(11, 4, 6, g) + stick(7, 13, 6, g) + stick(15, 13, 6, g);
  } else if (val === 4) {
    sticks = stick(7, 4, 6, g) + stick(15, 4, 6, r) + stick(7, 13, 6, r) + stick(15, 13, 6, g);
  } else if (val === 5) {
    sticks = stick(6, 4, 5, g) + stick(16, 4, 5, b) + stick(11, 10, 5, r) + stick(6, 16, 5, b) + stick(16, 16, 5, g);
  } else if (val === 6) {
    sticks = stick(6, 4, 6, g) + stick(11, 4, 6, g) + stick(16, 4, 6, g) + stick(6, 13, 6, r) + stick(11, 13, 6, r) + stick(16, 13, 6, r);
  } else if (val === 7) {
    sticks = `<circle cx="11" cy="4" r="1.5" fill="${r}"/>` + stick(6, 8, 5, g) + stick(11, 8, 5, g) + stick(16, 8, 5, g) + stick(6, 15, 5, g) + stick(11, 15, 5, g) + stick(16, 15, 5, g);
  } else if (val === 8) {
    sticks = stick(6, 3, 5, g) + stick(11, 3, 5, g) + stick(16, 3, 5, g) + stick(8, 10, 4, r) + stick(14, 10, 4, r) + stick(6, 16, 5, g) + stick(11, 16, 5, g) + stick(16, 16, 5, g);
  } else if (val === 9) {
    sticks = stick(6, 3, 5, r) + stick(11, 3, 5, b) + stick(16, 3, 5, g) + stick(6, 10, 5, r) + stick(11, 10, 5, b) + stick(16, 10, 5, g) + stick(6, 17, 5, r) + stick(11, 17, 5, b) + stick(16, 17, 5, g);
  }

  return `<svg class="w-full h-full p-0.5" viewBox="0 0 22 24">${sticks}</svg>`;
}
