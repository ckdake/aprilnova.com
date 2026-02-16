const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hudLevel = document.getElementById("hud-level");
const hudFlowers = document.getElementById("hud-flowers");

const state = {
  keys: new Set(),
  pointer: new Set(),
  width: 0,
  height: 0,
  worldWidth: 3200,
  worldHeight: 900,
  time: 0,
  win: false,
  winTime: 0,
  snailInRocket: false,
  levelIndex: 0,
  flowersPassed: 0,
};

const snail = {
  x: 240,
  y: 580,
  vx: 0,
  vy: 0,
  dir: 1,
  speed: 140,
  bob: 0,
};

const sparkles = Array.from({ length: 24 }, (_, index) => ({
  x: 320 + index * 120,
  y: 480 + (index % 5) * 30,
  life: 0,
}));

const FLOWER_COUNT = 10;
const FLOWER_START_X = 260;
const FLOWER_END_X = 2940;
const FLOWER_LANES = [640, 598, 556, 514, 472, 430];

const flowers = Array.from({ length: FLOWER_COUNT }, () => ({
  x: FLOWER_START_X,
  y: FLOWER_LANES[0],
  sway: Math.random() * Math.PI * 2,
  passed: false,
}));

const clouds = Array.from({ length: 8 }, (_, index) => ({
  x: index * 420,
  y: 110 + (index % 3) * 40,
  scale: 0.8 + (index % 3) * 0.15,
}));

const hills = [
  { x: 0, y: 620, r: 480, color: "#a3dfb4" },
  { x: 520, y: 640, r: 560, color: "#8fd2a6" },
  { x: 1200, y: 640, r: 520, color: "#7ec49a" },
  { x: 1800, y: 640, r: 600, color: "#90d9b1" },
  { x: 2600, y: 640, r: 560, color: "#7fc7a0" },
];

const stones = Array.from({ length: 16 }, (_, index) => ({
  x: 260 + index * 170,
  y: 690 + (index % 3) * 10,
  w: 60 + (index % 4) * 10,
  h: 22 + (index % 2) * 8,
}));

const rocket = {
  x: 3080,
  y: 540,
  launch: 0,
};

const stars = Array.from({ length: 60 }, (_, index) => ({
  x: (index * 57) % 1200,
  y: 60 + ((index * 83) % 420),
  size: 1 + (index % 3),
}));

const bubbles = Array.from({ length: 40 }, (_, index) => ({
  x: 120 + (index * 86) % 1400,
  y: 740 - (index * 47) % 520,
  r: 4 + (index % 5),
  drift: (index % 3) * 0.3 + 0.2,
}));

const levels = [
  {
    sky: [
      [253, 242, 196],
      [215, 240, 255],
      [178, 241, 220],
    ],
    hillColors: ["#a3dfb4", "#8fd2a6", "#7ec49a", "#90d9b1", "#7fc7a0"],
    ground: "#6cab74",
    flowerScale: 1,
    obstacleScale: 1,
    cloudSpeed: 6,
    water: false,
    plantType: "flower",
    creatureType: "meadow",
    flower: {
      stem: "#2f7a4d",
      petal: "#f28e7a",
      center: "#f4c75a",
      passedPetal: "#ffd3a8",
      passedCenter: "#ffe68a",
    },
    rock: "#b3b6c4",
    sparkle: [255, 241, 183],
    rocket: {
      body: "#f8f6ff",
      top: "#ff7aa2",
      window: "#5fc5ff",
      fin: "#ffb347",
      flame: "rgba(255, 200, 120, 0.9)",
    },
    snail: {
      body: "#f6a0c8",
      detail: "#ee86b4",
      shell: "#d77aa0",
      shellAccent: "#f5c2d8",
      eye: "#4b3a6f",
      scale: 0.92,
      crazy: 0,
    },
    hud: {
      bg: "rgba(255, 255, 255, 0.75)",
      ink: "#1f1f29",
      accent: "#ff7aa2",
    },
  },
  {
    sky: [
      [246, 228, 255],
      [212, 235, 255],
      [190, 246, 228],
    ],
    hillColors: ["#b7e5bf", "#9fd7b4", "#8bcba7", "#9cddb9", "#8fd0af"],
    ground: "#5fa96a",
    flowerScale: 1.25,
    obstacleScale: 1.15,
    cloudSpeed: 4,
    water: false,
    plantType: "flower",
    creatureType: "meadow",
    flower: {
      stem: "#2f8f6b",
      petal: "#9ad7ff",
      center: "#ffe05e",
      passedPetal: "#d7f1ff",
      passedCenter: "#fff3b0",
    },
    rock: "#a8b7d1",
    sparkle: [209, 239, 255],
    rocket: {
      body: "#f3f0ff",
      top: "#7f6bff",
      window: "#7fe7ff",
      fin: "#ff9b5e",
      flame: "rgba(255, 196, 120, 0.9)",
    },
    snail: {
      body: "#ffa1d9",
      detail: "#ff7fbf",
      shell: "#7f6bff",
      shellAccent: "#ffd36b",
      eye: "#2c2c5a",
      scale: 1.2,
      crazy: 2,
    },
    hud: {
      bg: "rgba(236, 235, 255, 0.78)",
      ink: "#1a1a33",
      accent: "#7f6bff",
    },
  },
  {
    sky: [
      [96, 188, 215],
      [48, 132, 182],
      [28, 92, 138],
    ],
    hillColors: ["#74c2c8", "#5fb1bb", "#4da2b0", "#5ab7c1", "#4ea4b5"],
    ground: "#3f7c76",
    flowerScale: 1.45,
    obstacleScale: 1.25,
    cloudSpeed: 0,
    water: true,
    plantType: "coral",
    creatureType: "underwater",
    flower: {
      stem: "#1c6f6a",
      petal: "#ff9edb",
      center: "#ffe08a",
      passedPetal: "#ffd7f0",
      passedCenter: "#fff0c1",
    },
    rock: "#6aa1b8",
    sparkle: [176, 238, 255],
    rocket: {
      body: "#e9f7ff",
      top: "#34b3ff",
      window: "#ffe08a",
      fin: "#ff7aa2",
      flame: "rgba(120, 222, 255, 0.9)",
    },
    snail: {
      body: "#ff9bd0",
      detail: "#ff6fb6",
      shell: "#2b9ed3",
      shellAccent: "#f7f3ff",
      eye: "#2a1e47",
      scale: 1.45,
      crazy: 4,
    },
    hud: {
      bg: "rgba(200, 236, 255, 0.78)",
      ink: "#0b2b3f",
      accent: "#34b3ff",
    },
  },
  {
    sky: [
      [255, 209, 141],
      [255, 168, 93],
      [226, 106, 69],
    ],
    hillColors: ["#f5c17d", "#e9ab67", "#dd9658", "#e7a96b", "#d68b4d"],
    ground: "#c97f42",
    flowerScale: 1.7,
    obstacleScale: 1.4,
    cloudSpeed: 1,
    water: false,
    plantType: "cactus",
    creatureType: "desert",
    flower: {
      stem: "#8a4a26",
      petal: "#ffb347",
      center: "#ffd86a",
      passedPetal: "#ffd9a1",
      passedCenter: "#ffe6ad",
    },
    rock: "#a8643a",
    sparkle: [255, 210, 145],
    rocket: {
      body: "#fff2df",
      top: "#ff6a3d",
      window: "#ffd179",
      fin: "#ff3f2e",
      flame: "rgba(255, 145, 72, 0.92)",
    },
    snail: {
      body: "#ff5a36",
      detail: "#ff8742",
      shell: "#e53520",
      shellAccent: "#ffb347",
      eye: "#3c180f",
      scale: 1.7,
      crazy: 6,
    },
    hud: {
      bg: "rgba(255, 224, 192, 0.82)",
      ink: "#4a210f",
      accent: "#e53520",
    },
  },
  {
    sky: [
      [225, 245, 255],
      [174, 218, 255],
      [132, 182, 230],
    ],
    hillColors: ["#d8ecff", "#c7e2ff", "#b4d5f8", "#c3defb", "#a9cdef"],
    ground: "#a8d0f2",
    flowerScale: 1.85,
    obstacleScale: 1.45,
    cloudSpeed: 2,
    water: false,
    plantType: "frozen",
    creatureType: "ice",
    flower: {
      stem: "#9ad3ff",
      petal: "#d9f1ff",
      center: "#f5fbff",
      passedPetal: "#edf8ff",
      passedCenter: "#ffffff",
    },
    rock: "#8fb8de",
    sparkle: [216, 242, 255],
    rocket: {
      body: "#f7fcff",
      top: "#7ac4ff",
      window: "#fff3c7",
      fin: "#5aa7e8",
      flame: "rgba(175, 231, 255, 0.95)",
    },
    snail: {
      body: "#ff7f5c",
      detail: "#ff9b62",
      shell: "#d6452a",
      shellAccent: "#ffc37d",
      eye: "#2a2d47",
      scale: 1.9,
      crazy: 7,
    },
    hud: {
      bg: "rgba(228, 245, 255, 0.84)",
      ink: "#13334f",
      accent: "#5aa7e8",
    },
  },
  {
    sky: [
      [210, 255, 203],
      [146, 228, 170],
      [90, 178, 126],
    ],
    hillColors: ["#9fe19a", "#84cf84", "#6fbe76", "#7fc985", "#61ab67"],
    ground: "#4d9c5e",
    flowerScale: 2.2,
    obstacleScale: 1.65,
    cloudSpeed: 3,
    water: false,
    plantType: "flower",
    creatureType: "meadow",
    flower: {
      stem: "#27643b",
      petal: "#74e08d",
      center: "#d6ff9e",
      passedPetal: "#b8f0c5",
      passedCenter: "#eeffc6",
    },
    rock: "#769f7f",
    sparkle: [198, 255, 186],
    rocket: {
      body: "#efffe8",
      top: "#4cbe73",
      window: "#7ff0b1",
      fin: "#78d998",
      flame: "rgba(176, 255, 178, 0.9)",
    },
    snail: {
      body: "#8ce89f",
      detail: "#67d180",
      shell: "#3ea95f",
      shellAccent: "#d7ffb3",
      eye: "#1d3c2b",
      scale: 2.25,
      crazy: 9,
    },
    hud: {
      bg: "rgba(224, 255, 223, 0.8)",
      ink: "#14311f",
      accent: "#3ea95f",
    },
  },
  {
    sky: [
      [245, 192, 255],
      [174, 132, 255],
      [102, 95, 212],
    ],
    hillColors: ["#d6b0ff", "#b98cf4", "#a072df", "#b082ef", "#8b63d0"],
    ground: "#6a56b8",
    flowerScale: 2.35,
    obstacleScale: 1.72,
    cloudSpeed: 2,
    water: false,
    plantType: "flower",
    creatureType: "meadow",
    flower: {
      stem: "#4f2f8f",
      petal: "#ff8ddd",
      center: "#9ff7ff",
      passedPetal: "#ffc9ee",
      passedCenter: "#d8feff",
    },
    rock: "#7e74bc",
    sparkle: [236, 198, 255],
    rocket: {
      body: "#f2ebff",
      top: "#9f7bff",
      window: "#7fe7ff",
      fin: "#ff8ddd",
      flame: "rgba(206, 172, 255, 0.92)",
    },
    snail: {
      body: "#ff8fce",
      detail: "#ff73bf",
      shell: "#8f6bff",
      shellAccent: "#bff4ff",
      eye: "#2c1f56",
      scale: 2.4,
      crazy: 10,
    },
    hud: {
      bg: "rgba(235, 223, 255, 0.82)",
      ink: "#21143f",
      accent: "#8f6bff",
    },
  },
  {
    sky: [
      [255, 188, 134],
      [255, 118, 88],
      [175, 58, 54],
    ],
    hillColors: ["#ffb178", "#eb8f66", "#d77458", "#e68561", "#c9644a"],
    ground: "#a94938",
    flowerScale: 2.5,
    obstacleScale: 1.82,
    cloudSpeed: 1,
    water: false,
    plantType: "cactus",
    creatureType: "desert",
    flower: {
      stem: "#6f2f23",
      petal: "#ff9b5e",
      center: "#ffe08a",
      passedPetal: "#ffcfa7",
      passedCenter: "#fff0bc",
    },
    rock: "#8f4d40",
    sparkle: [255, 196, 146],
    rocket: {
      body: "#ffe9dd",
      top: "#ff6a3d",
      window: "#ffd179",
      fin: "#ff3f2e",
      flame: "rgba(255, 136, 78, 0.95)",
    },
    snail: {
      body: "#ff6a46",
      detail: "#ff8d5a",
      shell: "#d83a27",
      shellAccent: "#ffbc68",
      eye: "#3e1a12",
      scale: 2.55,
      crazy: 11,
    },
    hud: {
      bg: "rgba(255, 221, 198, 0.84)",
      ink: "#4b2116",
      accent: "#d83a27",
    },
  },
  {
    sky: [
      [95, 180, 226],
      [45, 110, 188],
      [17, 55, 118],
    ],
    hillColors: ["#5eb4d6", "#4c9fc7", "#3d8bb8", "#4d9aca", "#377cad"],
    ground: "#2d5e8f",
    flowerScale: 2.65,
    obstacleScale: 1.9,
    cloudSpeed: 0,
    water: true,
    plantType: "coral",
    creatureType: "underwater",
    flower: {
      stem: "#1f5a84",
      petal: "#ff9be3",
      center: "#ffe39d",
      passedPetal: "#ffd2f0",
      passedCenter: "#fff2c4",
    },
    rock: "#4a7da8",
    sparkle: [168, 231, 255],
    rocket: {
      body: "#e8f7ff",
      top: "#2ea8ff",
      window: "#ffe08a",
      fin: "#ff7aa2",
      flame: "rgba(126, 214, 255, 0.92)",
    },
    snail: {
      body: "#ffa2d7",
      detail: "#ff80c3",
      shell: "#2f8fd4",
      shellAccent: "#f4f3ff",
      eye: "#221744",
      scale: 2.7,
      crazy: 12,
    },
    hud: {
      bg: "rgba(195, 229, 255, 0.82)",
      ink: "#0f2b47",
      accent: "#2ea8ff",
    },
  },
  {
    sky: [
      [36, 32, 86],
      [22, 25, 62],
      [10, 14, 38],
    ],
    hillColors: ["#5b4ea8", "#4b3f95", "#3f367f", "#50469f", "#362f72"],
    ground: "#332a68",
    flowerScale: 2.8,
    obstacleScale: 2,
    cloudSpeed: 1,
    water: false,
    plantType: "flower",
    creatureType: "meadow",
    flower: {
      stem: "#6db3ff",
      petal: "#c0a2ff",
      center: "#ffd37f",
      passedPetal: "#e0ceff",
      passedCenter: "#ffe9b7",
    },
    rock: "#52478a",
    sparkle: [223, 206, 255],
    rocket: {
      body: "#eef0ff",
      top: "#9a8dff",
      window: "#9fd9ff",
      fin: "#ff9ad7",
      flame: "rgba(179, 160, 255, 0.95)",
    },
    snail: {
      body: "#ff9cde",
      detail: "#ff7fcb",
      shell: "#7a66f3",
      shellAccent: "#ffd98e",
      eye: "#1f173d",
      scale: 2.85,
      crazy: 14,
    },
    hud: {
      bg: "rgba(219, 216, 255, 0.8)",
      ink: "#181438",
      accent: "#9a8dff",
    },
  },
];

function getSnailFrontX(scale) {
  return snail.x - snail.dir * 58 * scale;
}

const pathObstaclesByLevel = [
  [{ x: 900, y: 500, w: 90, h: 170 }],
  [
    { x: 820, y: 470, w: 86, h: 150 },
    { x: 1500, y: 560, w: 92, h: 150 },
  ],
  [
    { x: 760, y: 555, w: 82, h: 140 },
    { x: 1260, y: 470, w: 88, h: 170 },
    { x: 1880, y: 540, w: 96, h: 160 },
  ],
  [
    { x: 700, y: 480, w: 90, h: 160 },
    { x: 1160, y: 560, w: 98, h: 152 },
    { x: 1660, y: 470, w: 92, h: 176 },
    { x: 2220, y: 545, w: 104, h: 158 },
  ],
  [
    { x: 680, y: 560, w: 94, h: 146 },
    { x: 1040, y: 470, w: 94, h: 176 },
    { x: 1420, y: 555, w: 100, h: 150 },
    { x: 1820, y: 470, w: 96, h: 180 },
    { x: 2280, y: 545, w: 108, h: 162 },
  ],
  [
    { x: 650, y: 475, w: 94, h: 170 },
    { x: 980, y: 560, w: 98, h: 154 },
    { x: 1320, y: 470, w: 100, h: 180 },
    { x: 1700, y: 555, w: 106, h: 158 },
    { x: 2060, y: 470, w: 100, h: 178 },
  ],
  [
    { x: 640, y: 560, w: 94, h: 150 },
    { x: 930, y: 470, w: 96, h: 178 },
    { x: 1240, y: 560, w: 102, h: 150 },
    { x: 1580, y: 470, w: 100, h: 182 },
    { x: 1940, y: 555, w: 108, h: 158 },
    { x: 2320, y: 470, w: 102, h: 182 },
  ],
  [
    { x: 620, y: 475, w: 96, h: 172 },
    { x: 900, y: 560, w: 98, h: 152 },
    { x: 1190, y: 470, w: 102, h: 182 },
    { x: 1510, y: 560, w: 104, h: 152 },
    { x: 1860, y: 470, w: 104, h: 184 },
    { x: 2190, y: 555, w: 110, h: 160 },
  ],
  [
    { x: 610, y: 560, w: 98, h: 150 },
    { x: 860, y: 470, w: 100, h: 182 },
    { x: 1130, y: 560, w: 102, h: 152 },
    { x: 1410, y: 470, w: 106, h: 186 },
    { x: 1710, y: 560, w: 108, h: 152 },
    { x: 2030, y: 470, w: 108, h: 186 },
    { x: 2370, y: 555, w: 112, h: 160 },
  ],
  [
    { x: 600, y: 475, w: 100, h: 174 },
    { x: 840, y: 560, w: 100, h: 152 },
    { x: 1090, y: 470, w: 104, h: 186 },
    { x: 1360, y: 560, w: 106, h: 152 },
    { x: 1650, y: 470, w: 108, h: 188 },
    { x: 1960, y: 560, w: 108, h: 152 },
    { x: 2280, y: 470, w: 110, h: 188 },
  ],
];

const ceilingCloudObstaclesByLevel = [
  [{ x: 1350, y: 342, w: 170, h: 96 }],
  [{ x: 1080, y: 332, w: 180, h: 100 }],
  [
    { x: 980, y: 338, w: 170, h: 96 },
    { x: 2140, y: 326, w: 188, h: 108 },
  ],
  [
    { x: 900, y: 332, w: 184, h: 102 },
    { x: 1680, y: 338, w: 172, h: 96 },
  ],
  [
    { x: 860, y: 326, w: 192, h: 108 },
    { x: 1560, y: 334, w: 176, h: 98 },
    { x: 2360, y: 340, w: 170, h: 96 },
  ],
  [
    { x: 840, y: 328, w: 188, h: 104 },
    { x: 1450, y: 336, w: 174, h: 98 },
    { x: 2140, y: 330, w: 184, h: 102 },
  ],
  [
    { x: 780, y: 324, w: 194, h: 108 },
    { x: 1380, y: 334, w: 178, h: 98 },
    { x: 1980, y: 324, w: 194, h: 108 },
  ],
  [
    { x: 760, y: 322, w: 198, h: 110 },
    { x: 1320, y: 334, w: 180, h: 98 },
    { x: 1860, y: 322, w: 198, h: 110 },
  ],
  [
    { x: 730, y: 320, w: 204, h: 112 },
    { x: 1270, y: 332, w: 184, h: 100 },
    { x: 1820, y: 320, w: 204, h: 112 },
    { x: 2390, y: 334, w: 182, h: 100 },
  ],
  [
    { x: 700, y: 318, w: 210, h: 114 },
    { x: 1220, y: 332, w: 186, h: 100 },
    { x: 1750, y: 318, w: 210, h: 114 },
    { x: 2290, y: 332, w: 186, h: 100 },
  ],
];

const levelObstacles = levels.map((level) =>
  stones.map((stone) => ({
    x: stone.x,
    y: stone.y - (level.obstacleScale - 1) * 18,
    w: stone.w,
    h: stone.h * level.obstacleScale,
    kind: "stone",
  }))
);

levelObstacles.forEach((obstacles, index) => {
  const blockers = pathObstaclesByLevel[index] || [];
  blockers.forEach((blocker) => {
    obstacles.push({
      x: blocker.x,
      y: blocker.y,
      w: blocker.w,
      h: blocker.h,
      kind: "stone",
    });
  });

  const ceilingClouds = ceilingCloudObstaclesByLevel[index] || [];
  ceilingClouds.forEach((cloud) => {
    obstacles.push({
      x: cloud.x,
      y: cloud.y,
      w: cloud.w,
      h: cloud.h,
      kind: "cloud",
    });
  });
});

function spreadMixedLaneObstacles() {
  levelObstacles.forEach((obstacles, levelIndex) => {
    const snailScale = levels[levelIndex].snail.scale;
    const minOverUnderCenterGap = 190 + snailScale * 95;
    const minCloudCloudGap = 150 + snailScale * 60;
    const worldPadding = 120;

    const clouds = obstacles
      .filter((obstacle) => obstacle.kind === "cloud")
      .sort((a, b) => a.x - b.x);

    const lowerBlockers = obstacles.filter(
      (obstacle) => obstacle.kind === "stone" && obstacle.y <= 620 && obstacle.h >= 120
    );

    clouds.forEach((cloud) => {
      lowerBlockers.forEach((blocker) => {
        const cloudCenter = cloud.x + cloud.w * 0.5;
        const blockerCenter = blocker.x + blocker.w * 0.5;
        const distance = cloudCenter - blockerCenter;
        if (Math.abs(distance) >= minOverUnderCenterGap) return;

        const shiftDir = distance < 0 ? -1 : 1;
        const shiftAmount = minOverUnderCenterGap - Math.abs(distance);
        cloud.x = clamp(
          cloud.x + shiftDir * shiftAmount,
          worldPadding,
          state.worldWidth - cloud.w - worldPadding
        );
      });
    });

    clouds.sort((a, b) => a.x - b.x);
    for (let i = 1; i < clouds.length; i += 1) {
      const prev = clouds[i - 1];
      const current = clouds[i];
      const prevCenter = prev.x + prev.w * 0.5;
      const currentCenter = current.x + current.w * 0.5;
      const separation = currentCenter - prevCenter;
      if (separation >= minCloudCloudGap) continue;

      const adjust = minCloudCloudGap - separation;
      current.x = clamp(
        current.x + adjust,
        worldPadding,
        state.worldWidth - current.w - worldPadding
      );
    }
  });
}

spreadMixedLaneObstacles();

function boxesOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function getPlantBounds(x, y, plantType, scale) {
  if (plantType === "cactus") {
    return {
      left: x - 24 * scale,
      right: x + 24 * scale,
      top: y - 50 * scale,
      bottom: y + 8 * scale,
    };
  }

  if (plantType === "coral") {
    return {
      left: x - 20 * scale,
      right: x + 20 * scale,
      top: y - 48 * scale,
      bottom: y + 8 * scale,
    };
  }

  return {
    left: x - 14 * scale,
    right: x + 14 * scale,
    top: y - 48 * scale,
    bottom: y + 6 * scale,
  };
}

function flowerOverlapsObstacle(x, y, level, obstacles) {
  const flowerBounds = getPlantBounds(x, y, level.plantType, level.flowerScale);
  return obstacles.some((obstacle) =>
    boxesOverlap(flowerBounds, {
      left: obstacle.x,
      right: obstacle.x + obstacle.w,
      top: obstacle.y,
      bottom: obstacle.y + obstacle.h,
    })
  );
}

function buildFlowerLayout(levelIndex) {
  const level = levels[levelIndex];
  const obstacles = levelObstacles[levelIndex];
  const xStep = (FLOWER_END_X - FLOWER_START_X) / Math.max(1, FLOWER_COUNT - 1);
  const xOffsets = [0, 40, -40, 80, -80, 120, -120];
  const layout = [];

  for (let i = 0; i < FLOWER_COUNT; i += 1) {
    const baseX = FLOWER_START_X + i * xStep;
    let placed = null;

    for (const offset of xOffsets) {
      const x = clamp(baseX + offset, 180, state.worldWidth - 180);
      const laneOrder = i % 2 === 0 ? FLOWER_LANES : [...FLOWER_LANES].reverse();
      const y = laneOrder.find((laneY) => !flowerOverlapsObstacle(x, laneY, level, obstacles));
      if (typeof y === "number") {
        placed = { x, y };
        break;
      }
    }

    layout.push(placed || { x: clamp(baseX, 180, state.worldWidth - 180), y: 360 });
  }

  return layout;
}

const levelFlowerLayouts = levels.map((_, index) => buildFlowerLayout(index));

function getFlowerTouchPoint(flower, level) {
  if (level.plantType === "cactus") {
    return { x: flower.x, y: flower.y - 22 * level.flowerScale };
  }

  if (level.plantType === "coral") {
    return { x: flower.x, y: flower.y - 32 * level.flowerScale };
  }

  return { x: flower.x, y: flower.y - 38 * level.flowerScale };
}

function isSnailTouchingFlower(flower, level, snailScale) {
  const target = getFlowerTouchPoint(flower, level);
  const dx = target.x - snail.x;
  const dy = target.y - snail.y;
  const reachX = 60 * snailScale + 12 * level.flowerScale;
  const reachY = 30 * snailScale + 14 * level.flowerScale;
  return (dx * dx) / (reachX * reachX) + (dy * dy) / (reachY * reachY) <= 1;
}

const audio = {
  ctx: null,
  last: 0,
  enabled: false,
  musicStarted: false,
  musicStep: 0,
  musicTimer: null,
  musicProfileIndex: 0,
  musicStepMs: 180,
};

const MUSIC_TEMPO_MULTIPLIER = 1.12;
const MUSIC_VERSE_STEPS = 32;

const musicProfiles = [
  {
    stepMs: 180,
    leadPattern: [69, 72, 76, 72, 74, 72, 69, null, 67, 71, 74, 71, 72, 71, 67, null],
    bassPattern: [45, null, 45, null, 48, null, 50, null, 43, null, 43, null, 47, null, 45, null],
    chordRoots: [57, 55],
    leadDetune: 6,
  },
  {
    stepMs: 165,
    leadPattern: [72, 76, 79, 76, 77, 74, 72, null, 71, 74, 77, 74, 76, 72, 71, null],
    bassPattern: [48, null, 48, null, 52, null, 55, null, 47, null, 47, null, 50, null, 48, null],
    chordRoots: [60, 59],
    leadDetune: 8,
  },
  {
    stepMs: 190,
    leadPattern: [64, 67, 71, 67, 69, 67, 64, null, 62, 66, 69, 66, 67, 66, 62, null],
    bassPattern: [40, null, 40, null, 43, null, 45, null, 38, null, 38, null, 42, null, 40, null],
    chordRoots: [52, 50],
    leadDetune: 4,
  },
  {
    stepMs: 155,
    leadPattern: [69, 74, 76, 74, 77, 74, 72, null, 71, 74, 79, 74, 76, 74, 71, null],
    bassPattern: [45, null, 45, null, 41, null, 43, null, 40, null, 40, null, 43, null, 45, null],
    chordRoots: [57, 53],
    leadDetune: 10,
  },
  {
    stepMs: 172,
    leadPattern: [76, 79, 83, 79, 81, 79, 76, null, 74, 77, 81, 77, 79, 77, 74, null],
    bassPattern: [43, null, 43, null, 46, null, 48, null, 41, null, 41, null, 45, null, 43, null],
    chordRoots: [55, 53],
    leadDetune: 5,
  },
  {
    stepMs: 160,
    leadPattern: [74, 78, 81, 78, 79, 78, 76, null, 74, 76, 79, 76, 78, 76, 74, null],
    bassPattern: [47, null, 47, null, 50, null, 52, null, 45, null, 45, null, 48, null, 47, null],
    chordRoots: [59, 57],
    leadDetune: 9,
  },
  {
    stepMs: 148,
    leadPattern: [72, 76, 79, 81, 79, 76, 72, null, 71, 74, 77, 79, 77, 74, 71, null],
    bassPattern: [45, null, 43, null, 41, null, 43, null, 40, null, 41, null, 43, null, 45, null],
    chordRoots: [57, 53],
    leadDetune: 11,
  },
  {
    stepMs: 176,
    leadPattern: [67, 71, 74, 76, 74, 71, 67, null, 66, 69, 72, 74, 72, 69, 66, null],
    bassPattern: [40, null, 40, null, 43, null, 45, null, 38, null, 38, null, 41, null, 40, null],
    chordRoots: [52, 50],
    leadDetune: 6,
  },
  {
    stepMs: 138,
    leadPattern: [79, 83, 86, 88, 86, 83, 79, null, 77, 81, 84, 86, 84, 81, 77, null],
    bassPattern: [48, null, 48, null, 52, null, 55, null, 47, null, 47, null, 50, null, 48, null],
    chordRoots: [60, 59],
    leadDetune: 12,
  },
  {
    stepMs: 126,
    leadPattern: [81, 84, 88, 91, 88, 84, 81, null, 79, 83, 86, 88, 86, 83, 79, null],
    bassPattern: [50, null, 50, null, 53, null, 57, null, 48, null, 48, null, 52, null, 50, null],
    chordRoots: [62, 60],
    leadDetune: 14,
  },
];

function resize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  state.width = innerWidth;
  state.height = innerHeight;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ease(value) {
  return value * value * (3 - 2 * value);
}

function getLevel() {
  return levels[state.levelIndex];
}

function setLevel(index) {
  state.levelIndex = index;
  state.win = false;
  state.winTime = 0;
  state.snailInRocket = false;
  state.flowersPassed = 0;
  rocket.launch = 0;
  snail.x = 240;
  snail.y = 580;
  snail.vx = 0;
  snail.vy = 0;
  const flowerLayout = levelFlowerLayouts[index] || [];
  flowers.forEach((flower, flowerIndex) => {
    const placement = flowerLayout[flowerIndex];
    if (placement) {
      flower.x = placement.x;
      flower.y = placement.y;
    }
    flower.passed = false;
  });
  const level = getLevel();
  updateHud();
  document.documentElement.style.setProperty("--hud-bg", level.hud.bg);
  document.documentElement.style.setProperty("--hud-ink", level.hud.ink);
  document.documentElement.style.setProperty("--hud-accent", level.hud.accent);
  setMusicForLevel(index);
}

function initAudio() {
  if (!audio.ctx) {
    audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
  audio.enabled = true;
  startRetroMusic();
}

function midiToFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function playSynthNote(type, frequency, startTime, duration, volume, detune = 0) {
  if (!audio.ctx) return;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  const filter = audio.ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.value = frequency;
  osc.detune.value = detune;

  filter.type = "lowpass";
  filter.frequency.value = type === "sawtooth" ? 1800 : 2400;
  filter.Q.value = 0.8;

  gain.gain.value = 0.0001;
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

function scheduleRetroStep() {
  if (!audio.ctx || !audio.enabled) return;

  const profile = musicProfiles[audio.musicProfileIndex] || musicProfiles[0];
  const step = audio.musicStep;
  const verseStep = step % MUSIC_VERSE_STEPS;
  const now = audio.ctx.currentTime + 0.02;
  const leadPattern = profile.leadPattern;
  const bassPattern = profile.bassPattern;
  const leadPhraseStep = verseStep % leadPattern.length;
  const bassPhraseStep = verseStep % bassPattern.length;

  let leadNote = leadPattern[leadPhraseStep];
  let bassNote = bassPattern[bassPhraseStep];

  if (verseStep >= leadPattern.length && leadNote !== null) {
    const melodicLift = verseStep % 8 === 0 ? 2 : verseStep % 8 === 4 ? -1 : 0;
    leadNote += melodicLift;
  }

  if (verseStep >= bassPattern.length) {
    if (bassNote !== null && verseStep % 4 === 0) {
      bassNote -= 2;
    }
    if (verseStep % 6 === 3) {
      bassNote = null;
    }
  }

  if (leadNote !== null) {
    const leadFrequency = midiToFrequency(leadNote);
    playSynthNote("square", leadFrequency, now, 0.16, 0.015);
    playSynthNote("square", leadFrequency, now, 0.16, 0.01, profile.leadDetune);
  }

  if (bassNote !== null) {
    playSynthNote("sawtooth", midiToFrequency(bassNote), now, 0.22, 0.02);
  }

  if (step % 8 === 0) {
    const chordSection = Math.floor(verseStep / 8) % 4;
    const chordRoot =
      profile.chordRoots[chordSection % profile.chordRoots.length] +
      (chordSection >= 2 ? 2 : 0);
    playSynthNote("triangle", midiToFrequency(chordRoot), now, 0.52, 0.008);
    playSynthNote("triangle", midiToFrequency(chordRoot + 7), now, 0.52, 0.007);
  }

  audio.musicStep += 1;
}

function startRetroMusic() {
  if (!audio.ctx || audio.musicStarted) return;
  audio.musicStarted = true;
  setMusicForLevel(state.levelIndex);
  scheduleRetroStep();
  audio.musicTimer = window.setInterval(scheduleRetroStep, audio.musicStepMs);
}

function setMusicForLevel(levelIndex) {
  const nextProfile = Math.max(0, Math.min(levelIndex, musicProfiles.length - 1));
  const profile = musicProfiles[nextProfile];
  audio.musicProfileIndex = nextProfile;
  audio.musicStepMs = Math.round(profile.stepMs * MUSIC_TEMPO_MULTIPLIER);
  audio.musicStep = 0;

  if (audio.musicTimer) {
    window.clearInterval(audio.musicTimer);
    audio.musicTimer = null;
  }

  if (audio.musicStarted && audio.enabled && audio.ctx) {
    scheduleRetroStep();
    audio.musicTimer = window.setInterval(scheduleRetroStep, audio.musicStepMs);
  }
}

function playSnailSound() {
  if (!audio.ctx || !audio.enabled) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 420 + Math.random() * 60;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(audio.ctx.destination);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.start(now);
  osc.stop(now + 0.2);
}

function updateSnail(dt) {
  if (state.win) {
    snail.vx *= 0.9;
    snail.vy *= 0.9;
    return;
  }

  const level = getLevel();
  const snailScale = level.snail.scale;

  const input = {
    left: state.keys.has("ArrowLeft") || state.pointer.has("left"),
    right: state.keys.has("ArrowRight") || state.pointer.has("right"),
    up: state.keys.has("ArrowUp") || state.pointer.has("up"),
    down: state.keys.has("ArrowDown") || state.pointer.has("down"),
  };

  const targetX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const targetY = (input.down ? 1 : 0) - (input.up ? 1 : 0);

  snail.vx += (targetX * snail.speed - snail.vx) * 0.12;
  snail.vy += (targetY * snail.speed - snail.vy) * 0.12;
  snail.vy += 78 * dt;

  snail.x += snail.vx * dt;
  snail.y += snail.vy * dt;

  const xPadding = 120 * snailScale;
  const yMin = 360 - (snailScale - 1) * 34;
  const yMax = 720 - (snailScale - 1) * 14;
  snail.x = clamp(snail.x, xPadding, state.worldWidth - xPadding);
  snail.y = clamp(snail.y, yMin, yMax);

  if (Math.abs(snail.vx) > 4) {
    snail.dir = snail.vx > 0 ? -1 : 1;
  }

  snail.bob += dt * 4.2;

  resolveCollisions(levelObstacles[state.levelIndex], snailScale);

  let passedCount = 0;
  flowers.forEach((flower) => {
    if (!flower.passed && isSnailTouchingFlower(flower, level, snailScale)) {
      flower.passed = true;
    }
    if (flower.passed) passedCount += 1;
  });
  state.flowersPassed = passedCount;

  const snailFrontX = getSnailFrontX(snailScale);
  const reachX = 36 * snailScale;
  const reachY = 120 * snailScale;
  const nearRocket =
    snailFrontX > rocket.x - reachX &&
    snailFrontX < rocket.x + reachX &&
    snail.y < rocket.y + reachY;

  if (passedCount === flowers.length && nearRocket) {
    state.win = true;
    state.winTime = state.time;
    state.snailInRocket = true;
  }

  const speed = Math.hypot(snail.vx, snail.vy);
  if (speed > 18 && state.time - audio.last > 280) {
    audio.last = state.time;
    playSnailSound();
  }

  sparkles.forEach((sparkle) => {
    const dx = sparkle.x - snail.x;
    const dy = sparkle.y - snail.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 70 && sparkle.life <= 0) {
      sparkle.life = 1;
    }
    if (sparkle.life > 0) {
      sparkle.life = Math.max(0, sparkle.life - dt * 0.7);
    }
  });
}

function drawBackground(cameraX) {
  const winProgress = state.win
    ? clamp((state.time - state.winTime) / 2200, 0, 1)
    : 0;
  const level = getLevel();

  drawSky(level.sky, winProgress);

  if (!level.water) {
    ctx.save();
    ctx.translate(-cameraX * 0.15, 0);
    clouds.forEach((cloud) => {
      const x =
        (cloud.x + state.time * level.cloudSpeed) % (state.worldWidth + 400) - 200;
      drawCloud(x, cloud.y, cloud.scale);
    });
    ctx.restore();
  }

  ctx.save();
  ctx.translate(-cameraX * 0.35, 0);
  hills.forEach((hill, index) => {
    drawHill({ ...hill, color: level.hillColors[index] || hill.color });
  });
  ctx.restore();

  if (winProgress > 0) {
    drawStars(winProgress);
  }

  drawCreatures(level, cameraX);

  if (level.water) {
    drawBubbles();
  }
}

function drawCreatures(level, cameraX) {
  if (level.creatureType === "underwater") {
    drawFishSchool(cameraX);
    return;
  }

  if (level.creatureType === "desert") {
    drawDesertFlyers(cameraX);
    return;
  }

  drawMeadowBirds(cameraX);
}

function drawMeadowBirds(cameraX) {
  ctx.save();
  ctx.translate(-cameraX * 0.2, 0);
  ctx.strokeStyle = "rgba(50, 53, 72, 0.45)";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 8; i += 1) {
    const x = ((state.time * 0.07 + i * 180) % (state.worldWidth + 320)) - 160;
    const y = 130 + (i % 3) * 22 + Math.sin(state.time * 0.002 + i) * 8;
    ctx.beginPath();
    ctx.arc(x, y, 12, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(x + 18, y, 12, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFishSchool(cameraX) {
  ctx.save();
  ctx.translate(-cameraX * 0.3, 0);
  for (let i = 0; i < 14; i += 1) {
    const x = ((state.time * 0.09 + i * 170) % (state.worldWidth + 280)) - 140;
    const y = 250 + (i % 5) * 56 + Math.sin(state.time * 0.002 + i * 0.7) * 18;
    const dir = i % 2 === 0 ? 1 : -1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 194, 121, 0.55)" : "rgba(164, 236, 255, 0.6)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-25, -8);
    ctx.lineTo(-25, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawDesertFlyers(cameraX) {
  ctx.save();
  ctx.translate(-cameraX * 0.18, 0);
  for (let i = 0; i < 10; i += 1) {
    const x = ((state.time * 0.08 + i * 210) % (state.worldWidth + 340)) - 170;
    const y = 145 + (i % 4) * 28 + Math.sin(state.time * 0.0025 + i) * 10;
    ctx.strokeStyle = "rgba(82, 37, 20, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 6);
    ctx.quadraticCurveTo(x, y - 12, x + 10, y + 6);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSky(colors, winProgress) {
  const top = blendColor(colors[0], [8, 12, 36], winProgress);
  const mid = blendColor(colors[1], [14, 24, 60], winProgress);
  const bottom = blendColor(colors[2], [25, 20, 55], winProgress);
  const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
  gradient.addColorStop(0, `rgb(${top[0]}, ${top[1]}, ${top[2]})`);
  gradient.addColorStop(0.55, `rgb(${mid[0]}, ${mid[1]}, ${mid[2]})`);
  gradient.addColorStop(1, `rgb(${bottom[0]}, ${bottom[1]}, ${bottom[2]})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);
}

function blendColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function drawStars(alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(255, 246, 214, 0.85)";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(
      star.x + (state.time * 0.02) % state.width,
      star.y,
      star.size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
  ctx.restore();
}

function drawBubbles() {
  ctx.save();
  ctx.strokeStyle = "rgba(224, 248, 255, 0.7)";
  ctx.lineWidth = 2;
  bubbles.forEach((bubble) => {
    const rise = (state.time * bubble.drift) % (state.height + 120);
    const y = bubble.y - rise;
    const x = bubble.x + Math.sin(state.time * 0.001 + bubble.x) * 10;
    ctx.beginPath();
    ctx.arc(x, y, bubble.r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawHill(hill) {
  ctx.fillStyle = hill.color;
  ctx.beginPath();
  ctx.arc(hill.x, hill.y, hill.r, Math.PI, Math.PI * 2);
  ctx.fill();
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 60, 26, 0, 0, Math.PI * 2);
  ctx.ellipse(30, -8, 40, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(-30, -6, 36, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCloudObstacle(obstacle) {
  const x = obstacle.x;
  const y = obstacle.y;
  const w = obstacle.w;
  const h = obstacle.h;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.roundRect(x, y + h * 0.28, w, h * 0.72, 18);
  ctx.fill();

  ctx.fillStyle = "rgba(245, 251, 255, 0.96)";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.2, y + h * 0.42, w * 0.2, h * 0.28, 0, 0, Math.PI * 2);
  ctx.ellipse(x + w * 0.47, y + h * 0.3, w * 0.24, h * 0.34, 0, 0, Math.PI * 2);
  ctx.ellipse(x + w * 0.77, y + h * 0.4, w * 0.2, h * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(201, 226, 242, 0.65)";
  ctx.beginPath();
  ctx.roundRect(x + 12, y + h * 0.7, w - 24, h * 0.2, 12);
  ctx.fill();
  ctx.restore();
}

function drawGround(cameraX) {
  const level = getLevel();
  ctx.save();
  ctx.translate(-cameraX, 0);

  ctx.fillStyle = level.ground;
  ctx.beginPath();
  ctx.moveTo(0, 720);
  ctx.quadraticCurveTo(400, 700, 800, 720);
  ctx.quadraticCurveTo(1200, 740, 1600, 720);
  ctx.quadraticCurveTo(2000, 700, 2400, 720);
  ctx.quadraticCurveTo(2800, 740, 3200, 720);
  ctx.lineTo(3200, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();

  levelObstacles[state.levelIndex].forEach((obstacle) => {
    if (obstacle.kind === "cloud") {
      drawCloudObstacle(obstacle);
      return;
    }

    ctx.fillStyle = level.rock;
    ctx.beginPath();
    ctx.roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 10);
    ctx.fill();
  });

  flowers.forEach((flower) => {
    const sway = Math.sin(state.time * 0.0006 + flower.sway) * 0.06;
    drawPlant(
      flower.x,
      flower.y,
      sway,
      flower.passed,
      level.flowerScale,
      level.flower,
      level.plantType
    );
  });

  sparkles.forEach((sparkle) => {
    drawSparkle(sparkle, level);
  });

  drawRocket(level);

  ctx.restore();
}

function drawPlant(x, y, sway, passed, scale, palette, plantType) {
  if (plantType === "coral") {
    drawCoral(x, y, sway, passed, scale, palette);
    return;
  }

  if (plantType === "cactus") {
    drawCactus(x, y, sway, passed, scale, palette);
    return;
  }

  drawFlower(x, y, sway, passed, scale, palette);
}

function drawFlower(x, y, sway, passed, scale, palette) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(sway);
  ctx.strokeStyle = palette.stem;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -36);
  ctx.stroke();

  ctx.fillStyle = passed ? palette.passedPetal : palette.petal;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, -38, 10, 18, (Math.PI * 2 * i) / 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = passed ? palette.passedCenter : palette.center;
  ctx.beginPath();
  ctx.arc(0, -38, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCoral(x, y, sway, passed, scale, palette) {
  ctx.save();
  ctx.translate(x, y + 4);
  ctx.scale(scale, scale);
  ctx.rotate(sway * 0.6);

  ctx.strokeStyle = passed ? palette.passedPetal : palette.petal;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -36);
  ctx.moveTo(0, -22);
  ctx.lineTo(-14, -34);
  ctx.moveTo(0, -18);
  ctx.lineTo(14, -32);
  ctx.moveTo(0, -30);
  ctx.lineTo(-8, -44);
  ctx.moveTo(0, -28);
  ctx.lineTo(10, -42);
  ctx.stroke();

  ctx.fillStyle = passed ? palette.passedCenter : palette.center;
  ctx.beginPath();
  ctx.arc(0, -36, 4.5, 0, Math.PI * 2);
  ctx.arc(-14, -34, 3.6, 0, Math.PI * 2);
  ctx.arc(14, -32, 3.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCactus(x, y, sway, passed, scale, palette) {
  ctx.save();
  ctx.translate(x, y + 6);
  ctx.scale(scale, scale);
  ctx.rotate(sway * 0.25);

  const body = passed ? palette.passedPetal : palette.petal;
  const accent = passed ? palette.passedCenter : palette.center;

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.roundRect(-9, -46, 18, 46, 8);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(-22, -30, 10, 22, 6);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(12, -34, 10, 24, 6);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.6;
  for (let i = -6; i <= 6; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, -42);
    ctx.lineTo(i, -4);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSparkle(sparkle, level) {
  const pulse = Math.sin(state.time * 3 + sparkle.x) * 0.5 + 0.5;
  const alpha = sparkle.life > 0 ? ease(sparkle.life) : 0.4;
  const sparkleColor = level.sparkle;
  ctx.save();
  ctx.translate(sparkle.x, sparkle.y);
  ctx.scale(0.7 + pulse * 0.4, 0.7 + pulse * 0.4);
  ctx.fillStyle = `rgba(${sparkleColor[0]}, ${sparkleColor[1]}, ${sparkleColor[2]}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(6, -4);
  ctx.lineTo(18, 0);
  ctx.lineTo(6, 4);
  ctx.lineTo(0, 16);
  ctx.lineTo(-6, 4);
  ctx.lineTo(-18, 0);
  ctx.lineTo(-6, -4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSnail(cameraX) {
  if (state.snailInRocket) {
    return;
  }

  const level = getLevel();
  const style = level.snail;
  const bob = Math.sin(snail.bob) * 3;
  const wobble =
    Math.sin(state.time * 0.004 + state.levelIndex) * (0.02 + style.crazy * 0.008);
  ctx.save();
  ctx.translate(snail.x - cameraX, snail.y + bob);
  ctx.scale(snail.dir * style.scale, style.scale);
  ctx.rotate(wobble * 0.3);

  ctx.fillStyle = style.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 70, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = style.detail;
  ctx.beginPath();
  ctx.ellipse(30, -24, 18, 14, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = style.detail;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-20, -8);
  ctx.lineTo(-50, -24);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, -8);
  ctx.lineTo(-30, -30);
  ctx.stroke();

  ctx.fillStyle = style.eye;
  ctx.beginPath();
  ctx.arc(-52, -26, 6, 0, Math.PI * 2);
  ctx.arc(-32, -32, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(42, -14);
  ctx.rotate(-0.2 + wobble * 0.6);
  ctx.fillStyle = style.shell;
  ctx.beginPath();
  ctx.ellipse(0, 0, 46, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = style.shellAccent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 28, Math.PI * 0.1, Math.PI * 1.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 16, Math.PI * 0.2, Math.PI * 2.1);
  ctx.stroke();

  const rings = 2 + state.levelIndex;
  ctx.lineWidth = 3;
  for (let i = 0; i < rings; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 8 + i * 6, Math.PI * 0.3, Math.PI * 1.7);
    ctx.stroke();
  }

  if (style.crazy > 0) {
    ctx.strokeStyle = style.shellAccent;
    ctx.lineWidth = 4;
    const count = style.crazy;
    for (let i = 0; i < count; i += 1) {
      const angle = -0.9 + (i / Math.max(1, count - 1)) * 1.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 20, Math.sin(angle) * 14);
      ctx.lineTo(Math.cos(angle) * 34, Math.sin(angle) * 24);
      ctx.stroke();
    }
  }
  ctx.restore();

  ctx.restore();
}

function drawRocket(level) {
  const lift = state.win
    ? ease(clamp((state.time - state.winTime) / 2200, 0, 1)) * 260
    : 0;
  rocket.launch = lift;
  const x = rocket.x;
  const y = rocket.y - lift;

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = level.rocket.body;
  ctx.beginPath();
  ctx.ellipse(0, -60, 26, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = level.rocket.top;
  ctx.beginPath();
  ctx.ellipse(0, -86, 12, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = level.rocket.window;
  ctx.beginPath();
  ctx.arc(0, -58, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = level.rocket.fin;
  ctx.beginPath();
  ctx.moveTo(-22, -22);
  ctx.lineTo(-44, -2);
  ctx.lineTo(-10, -6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(22, -22);
  ctx.lineTo(44, -2);
  ctx.lineTo(10, -6);
  ctx.closePath();
  ctx.fill();

  if (state.win) {
    ctx.fillStyle = level.rocket.flame;
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawForeground(cameraX) {
  const level = getLevel();
  if (level.water) return;
  ctx.save();
  ctx.translate(-cameraX * 1.1, 0);
  for (let i = 0; i < 18; i += 1) {
    const x = 80 + i * 180;
    const y = 740 + (i % 2) * 6;
    ctx.fillStyle = "rgba(44, 82, 56, 0.4)";
    ctx.beginPath();
    ctx.ellipse(x, y, 120, 40, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function loop(timestamp) {
  const dt = Math.min(0.033, (timestamp - state.time) / 1000 || 0.016);
  state.time = timestamp;

  updateSnail(dt);

  const cameraX = clamp(
    snail.x - state.width * 0.5,
    0,
    state.worldWidth - state.width
  );

  ctx.clearRect(0, 0, state.width, state.height);
  drawBackground(cameraX);
  drawGround(cameraX);
  drawSnail(cameraX);
  drawForeground(cameraX);

  updateHud();

  if (state.win && state.time - state.winTime > 2600) {
    if (state.levelIndex < levels.length - 1) {
      setLevel(state.levelIndex + 1);
    }
  }

  requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  initAudio();
  state.keys.add(event.key);
});
window.addEventListener("keyup", (event) => state.keys.delete(event.key));

const dpad = document.querySelector(".dpad");
const stage = document.querySelector(".stage");
const gameCanvas = document.getElementById("game");

if (stage) {
  stage.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
}

if (gameCanvas) {
  gameCanvas.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
    },
    { passive: false }
  );
}

if (dpad) {
  dpad.addEventListener("pointerdown", (event) => {
    const target = event.target.closest(".pad");
    if (!target) return;
    event.preventDefault();
    initAudio();
    state.pointer.add(target.dataset.dir);
    target.setPointerCapture(event.pointerId);
  });

  const releasePointer = (event) => {
    const target = event.target.closest(".pad");
    if (!target) return;
    event.preventDefault();
    state.pointer.delete(target.dataset.dir);
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  dpad.addEventListener("pointerup", releasePointer);
  dpad.addEventListener("pointercancel", releasePointer);
  dpad.addEventListener("lostpointercapture", () => {
    state.pointer.clear();
  });

  dpad.addEventListener("pointerleave", () => {
    state.pointer.clear();
  });
}

resize();
setLevel(0);
requestAnimationFrame(loop);

function resolveCollisions(obstacles, scale) {
  const halfW = 55 * scale;
  const halfH = 28 * scale;

  obstacles.forEach((obstacle) => {
    const left = snail.x - halfW;
    const right = snail.x + halfW;
    const top = snail.y - halfH;
    const bottom = snail.y + halfH;

    const oLeft = obstacle.x;
    const oRight = obstacle.x + obstacle.w;
    const oTop = obstacle.y;
    const oBottom = obstacle.y + obstacle.h;

    if (right <= oLeft || left >= oRight || bottom <= oTop || top >= oBottom) {
      return;
    }

    const overlapX = Math.min(right - oLeft, oRight - left);
    const overlapY = Math.min(bottom - oTop, oBottom - top);

    if (overlapX < overlapY) {
      if (snail.x < oLeft + obstacle.w / 2) {
        snail.x -= overlapX;
      } else {
        snail.x += overlapX;
      }
      snail.vx = 0;
    } else {
      if (snail.y < oTop + obstacle.h / 2) {
        snail.y -= overlapY;
      } else {
        snail.y += overlapY;
      }
      snail.vy = 0;
    }
  });
}

function updateHud() {
  if (!hudLevel || !hudFlowers) return;
  hudLevel.textContent = String(state.levelIndex + 1);
  hudFlowers.textContent = `${state.flowersPassed}/${flowers.length}`;
}
