import React, { useEffect, useRef, useState } from 'react';
import { ZoneId, Direction, TimeOfDay } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface PixelRoomCanvasProps {
  onInteract: (zone: ZoneId) => void;
  activeModal: ZoneId | null;
  timeOfDay: TimeOfDay;
  catState: 'sleeping' | 'purring' | 'following' | 'eating';
  onPetCat: () => void;
  exploredZones: Set<ZoneId>;
  hasBoba?: boolean;
  isBobaRunning?: boolean;
  isNapping?: boolean;
  napCountdown?: number;
  onWakeEarly?: () => void;
}

export const PixelRoomCanvas: React.FC<PixelRoomCanvasProps> = ({
  onInteract,
  activeModal,
  timeOfDay,
  catState,
  onPetCat,
  exploredZones,
  hasBoba = false,
  isBobaRunning = false,
  isNapping = false,
  napCountdown = 20,
  onWakeEarly
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 960;
  const CANVAS_HEIGHT = 600;
  const viewOffsetRef = useRef(0);

  // A wider desktop view reveals extra wall/floor, rather than widening sprites.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!height) return;
      const viewWidth = Math.max(CANVAS_WIDTH, Math.round(CANVAS_HEIGHT * width / height));
      if (canvas.width !== viewWidth) canvas.width = viewWidth;
      viewOffsetRef.current = (viewWidth - CANVAS_WIDTH) / 2;
      const context = canvas.getContext('2d');
      if (context) context.imageSmoothingEnabled = false;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, []);

  // Player state: start near center
  const [player, setPlayer] = useState({
    x: 480,
    y: 330,
    direction: 'down' as Direction,
    isWalking: false,
    frame: 0
  });

  // Cat position (Soobin)
  const catPosRef = useRef({
    x: 460,
    y: 370,
    direction: 'down' as Direction,
    frame: 0
  });

  // Daytime cat wandering target & idle timer
  const catWanderRef = useRef({
    targetX: 460,
    targetY: 370,
    waitTimer: 60
  });

  const CAT_BED_POS = { x: 125, y: 475 };
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number | null>(null);
  const stepSoundCounter = useRef<number>(0);
  const heartsRef = useRef<Array<{ x: number; y: number; life: number; vy: number }>>([]);
  const dustRef = useRef<Array<{ x: number; y: number; alpha: number; radius: number; vx: number; vy: number }>>([]);
  const rainDropsRef = useRef<Array<{ x: number; y: number; speed: number; length: number }>>([]);

  // Cat toy for Rain Mode zoomies
  const catToyRef = useRef({
    x: 420,
    y: 350,
    vx: 2.2,
    vy: 1.5,
    rotation: 0
  });

  // Boba walk animation state
  const [bobaDoorOpen, setBobaDoorOpen] = useState<boolean>(false);
  const [playerInDoor, setPlayerInDoor] = useState<boolean>(false);

  const [humanSleepingInBed, setHumanSleepingInBed] = useState<boolean>(timeOfDay === 'night' || isNapping);

  useEffect(() => {
    if (isNapping || timeOfDay === 'night') {
      setHumanSleepingInBed(true);
    } else {
      setHumanSleepingInBed(false);
    }
  }, [timeOfDay, isNapping]);

  // Ambient particles
  useEffect(() => {
    const dust: Array<{ x: number; y: number; alpha: number; radius: number; vx: number; vy: number }> = [];
    for (let i = 0; i < 35; i++) {
      dust.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        alpha: Math.random() * 0.5 + 0.2,
        radius: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.1
      });
    }
    dustRef.current = dust;

    const drops: Array<{ x: number; y: number; speed: number; length: number }> = [];
    for (let i = 0; i < 45; i++) {
      drops.push({
        x: Math.random() * 160 + 440,
        y: Math.random() * 90 + 10,
        speed: Math.random() * 4 + 4,
        length: Math.random() * 6 + 4
      });
    }
    rainDropsRef.current = drops;
  }, []);

  // Hearts when petted
  useEffect(() => {
    if (catState === 'purring' || catState === 'eating') {
      for (let i = 0; i < 5; i++) {
        heartsRef.current.push({
          x: catPosRef.current.x + (Math.random() * 26 - 13),
          y: catPosRef.current.y - 18 - Math.random() * 12,
          life: 1.0,
          vy: -0.7 - Math.random() * 0.5
        });
      }
    }
  }, [catState]);

  // THE 5 CORE EXPLORATION AREAS + PAPER STAR JAR
  const coreZones: Array<{ id: ZoneId; name: string; x: number; y: number; radius: number; label: string; overheadY: number; num: number }> = [
    { id: 'bed', name: '1. The Bed & Plushies', x: 770, y: 220, radius: 135, label: 'Cozy Bed', overheadY: 95, num: 1 },
    { id: 'door', name: '2. The Bedroom Door', x: 885, y: 515, radius: 130, label: 'Boba Break', overheadY: 450, num: 2 },
    { id: 'cat', name: '3. Soobin the Cat Tree', x: catPosRef.current.x, y: catPosRef.current.y, radius: 115, label: 'Meet Soobin', overheadY: catPosRef.current.y - 45, num: 3 },
    { id: 'bookshelf', name: '4. POPMART Shelf', x: 95, y: 310, radius: 125, label: 'Figurines', overheadY: 195, num: 4 },
    { id: 'desk', name: '5. My Desk & Cal', x: 185, y: 175, radius: 125, label: 'About & Work', overheadY: 65, num: 5 },
    { id: 'starjar', name: 'Paper Star Jar', x: 635, y: 140, radius: 85, label: 'Origami Star Jar', overheadY: 90, num: 6 }
  ];

  // Furniture solid obstacles - tight and streamlined so walking corridors are wide and smooth!
  const obstacles = [
    { minX: 0, minY: 0, maxX: CANVAS_WIDTH, maxY: 100 },
    { minX: 0, minY: 580, maxX: CANVAS_WIDTH, maxY: CANVAS_HEIGHT },
    { minX: 0, minY: 0, maxX: 40, maxY: CANVAS_HEIGHT },
    { minX: 920, minY: 0, maxX: CANVAS_WIDTH, maxY: CANVAS_HEIGHT },

    // Desk & Backpack
    { minX: 45, minY: 95, maxX: 260, maxY: 165 },
    // Bookshelf
    { minX: 45, minY: 220, maxX: 105, maxY: 380 },
    // Cat tree in bottom-left
    { minX: 45, minY: 450, maxX: 155, maxY: 565 },
    // Bed & nightstand
    { minX: 640, minY: 95, maxX: 890, maxY: 230 }
    // Door has no blocking obstacle so avatar can walk right on the mat!
  ];

  const checkCollision = (nx: number, ny: number): boolean => {
    const playerRadius = 15;
    for (const obs of obstacles) {
      if (
        nx + playerRadius > obs.minX &&
        nx - playerRadius < obs.maxX &&
        ny + 12 > obs.minY &&
        ny - 12 < obs.maxY
      ) {
        return true;
      }
    }
    return false;
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) {
        keysPressed.current = {};
        return;
      }
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
        if (humanSleepingInBed) {
          if (isNapping) onWakeEarly?.();
          setHumanSleepingInBed(false);
          setPlayer(prev => ({ ...prev, x: 740, y: 260, direction: 'down' }));
        }
      }

      if ((key === 'e' || key === ' ') && !activeModal) {
        e.preventDefault();
        if (activeZone) {
          if (activeZone === 'cat') {
            onPetCat();
          }
          soundEngine.playInspect();
          onInteract(activeZone);
        }
      }

      if (key === 'escape' && activeModal) {
        onInteract(null as unknown as ZoneId);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeZone, activeModal, onInteract, onPetCat, humanSleepingInBed, isNapping, onWakeEarly]);

  // Boba Run Sequence: Avatar walks into door, disappears, and steps back out holding boba
  useEffect(() => {
    if (isBobaRunning) {
      setPlayer(prev => ({ ...prev, x: 865, y: 520, direction: 'right', isWalking: true }));
      setBobaDoorOpen(true);

      const hideTimer = setTimeout(() => {
        setPlayerInDoor(true);
        setBobaDoorOpen(false);
      }, 450);

      const showTimer = setTimeout(() => {
        setBobaDoorOpen(true);
        setPlayerInDoor(false);
        setPlayer({ x: 830, y: 525, direction: 'left', isWalking: false, frame: 0 });
      }, 1450);

      const closeDoorTimer = setTimeout(() => {
        setBobaDoorOpen(false);
      }, 1900);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(showTimer);
        clearTimeout(closeDoorTimer);
      };
    } else {
      setPlayerInDoor(false);
      setBobaDoorOpen(false);
    }
  }, [isBobaRunning]);

  // Game Loop
  useEffect(() => {
    let animFrame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const gameLoop = () => {
      animFrame++;

      // Pause room keyboard movement while any popup is open.
      const dialogOpen = Boolean(document.querySelector('[role="dialog"]'));
      if (dialogOpen) keysPressed.current = {};
      if (!dialogOpen && !activeModal && !humanSleepingInBed) {
        const speed = 2.8;
        let dx = 0;
        let dy = 0;
        let newDir = player.direction;
        let isMoving = false;

        const keys = keysPressed.current;
        if (keys['w'] || keys['arrowup']) {
          dy -= speed;
          newDir = 'up';
          isMoving = true;
        }
        if (keys['s'] || keys['arrowdown']) {
          dy += speed;
          newDir = 'down';
          isMoving = true;
        }
        if (keys['a'] || keys['arrowleft']) {
          dx -= speed;
          newDir = 'left';
          isMoving = true;
        }
        if (keys['d'] || keys['arrowright']) {
          dx += speed;
          newDir = 'right';
          isMoving = true;
        }

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        let newX = player.x + dx;
        let newY = player.y + dy;

        if (checkCollision(newX, player.y)) newX = player.x;
        if (checkCollision(player.x, newY)) newY = player.y;
        if (checkCollision(newX, newY)) {
          newX = player.x;
          newY = player.y;
        }

        if (isMoving) {
          stepSoundCounter.current++;
          if (stepSoundCounter.current % 18 === 0) {
            soundEngine.playFootstep();
          }
        }

        const frame = isMoving ? Math.floor(animFrame / 7) % 4 : 0;

        setPlayer({
          x: newX,
          y: newY,
          direction: newDir,
          isWalking: isMoving,
          frame
        });

        // Proximity detection for active zone
        let nearestZone: ZoneId | null = null;
        let minDist = 9999;

        coreZones.forEach(z => {
          const zx = z.id === 'cat' ? catPosRef.current.x : z.x;
          const zy = z.id === 'cat' ? catPosRef.current.y : z.y;
          const dist = Math.hypot(newX - zx, newY - zy);
          if (dist < z.radius && dist < minDist) {
            minDist = dist;
            nearestZone = z.id;
          }
        });

        setActiveZone(nearestZone);
      }

      // Cat AI (Soobin)
      if (timeOfDay === 'night') {
        // Night mode: trot to plush cat tree in bottom left
        const targetX = CAT_BED_POS.x;
        const targetY = CAT_BED_POS.y;
        const cdx = targetX - catPosRef.current.x;
        const cdy = targetY - catPosRef.current.y;
        const dist = Math.hypot(cdx, cdy);

        if (dist > 4) {
          catPosRef.current.x += (cdx / dist) * 1.8;
          catPosRef.current.y += (cdy / dist) * 1.8;
          catPosRef.current.frame = Math.floor(animFrame / 8) % 4;
          catPosRef.current.direction = cdx > 0 ? 'right' : 'left';
        } else {
          catPosRef.current.x = targetX;
          catPosRef.current.y = targetY;
          catPosRef.current.frame = 0;
        }
      } else if (catState === 'purring') {
        // Paused in place while doing the happy hehe bounce!
        catPosRef.current.frame = 0;
      } else if (timeOfDay === 'rainy') {
        // RAIN MODE: Soobin gets the zoomies and playfully runs around chasing her yarn / floss toy!
        const toy = catToyRef.current;
        toy.x += toy.vx;
        toy.y += toy.vy;
        toy.rotation += 0.08;

        // Bounce toy off cozy room floor perimeter
        if (toy.x < 210) { toy.x = 210; toy.vx = Math.abs(toy.vx); }
        if (toy.x > 730) { toy.x = 730; toy.vx = -Math.abs(toy.vx); }
        if (toy.y < 240) { toy.y = 240; toy.vy = Math.abs(toy.vy); }
        if (toy.y > 510) { toy.y = 510; toy.vy = -Math.abs(toy.vy); }

        const cdx = toy.x - catPosRef.current.x;
        const cdy = toy.y - catPosRef.current.y;
        const dist = Math.hypot(cdx, cdy);

        if (dist > 22) {
          const runSpeed = 2.3;
          catPosRef.current.x += (cdx / dist) * runSpeed;
          catPosRef.current.y += (cdy / dist) * runSpeed;
          catPosRef.current.frame = Math.floor(animFrame / 5) % 4;
          catPosRef.current.direction = Math.abs(cdx) > Math.abs(cdy) ? (cdx > 0 ? 'right' : 'left') : (cdy > 0 ? 'down' : 'up');
        } else {
          catPosRef.current.frame = 1;
          toy.vx = (Math.random() - 0.5) * 4.2 + (cdx > 0 ? 1.2 : -1.2);
          toy.vy = (Math.random() - 0.5) * 3.6;
        }
      } else if (catState === 'following') {
        const cdx = player.x - catPosRef.current.x;
        const cdy = player.y - catPosRef.current.y;
        const dist = Math.hypot(cdx, cdy);

        if (dist > 55) {
          const catSpeed = 2.0;
          catPosRef.current.x += (cdx / dist) * catSpeed;
          catPosRef.current.y += (cdy / dist) * catSpeed;
          catPosRef.current.frame = Math.floor(animFrame / 7) % 4;
          catPosRef.current.direction = Math.abs(cdx) > Math.abs(cdy) ? (cdx > 0 ? 'right' : 'left') : (cdy > 0 ? 'down' : 'up');
        } else {
          catPosRef.current.frame = 0;
        }
      } else {
        // DAYTIME: Cat does NOT sleep! Wanders playfully around the room floor!
        if (catWanderRef.current.waitTimer > 0) {
          catWanderRef.current.waitTimer--;
          catPosRef.current.frame = 0;
        } else {
          const cdx = catWanderRef.current.targetX - catPosRef.current.x;
          const cdy = catWanderRef.current.targetY - catPosRef.current.y;
          const dist = Math.hypot(cdx, cdy);

          if (dist > 5) {
            const catSpeed = 1.35;
            catPosRef.current.x += (cdx / dist) * catSpeed;
            catPosRef.current.y += (cdy / dist) * catSpeed;
            catPosRef.current.frame = Math.floor(animFrame / 8) % 4;
            catPosRef.current.direction = Math.abs(cdx) > Math.abs(cdy) ? (cdx > 0 ? 'right' : 'left') : (cdy > 0 ? 'down' : 'up');
          } else {
            catPosRef.current.frame = 0;
            // Wait 2.5 to 5.5 seconds before next stroll
            catWanderRef.current.waitTimer = 150 + Math.floor(Math.random() * 180);
            // Pick next cozy floor destination (clear floor zone)
            catWanderRef.current.targetX = 230 + Math.random() * 410;
            catWanderRef.current.targetY = 260 + Math.random() * 190;
          }
        }
      }

      // Render Scene
      renderRoom(ctx, animFrame);

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [activeModal, timeOfDay, catState, humanSleepingInBed, player, exploredZones, isNapping, napCountdown, isBobaRunning, playerInDoor, hasBoba]);

  // Main rendering routine
  const renderRoom = (ctx: CanvasRenderingContext2D, animFrame: number) => {
    const offset = viewOffsetRef.current;
    const viewWidth = CANVAS_WIDTH + offset * 2;
    ctx.setTransform(1, 0, 0, 1, offset, 0);
    // 1. FLOOR
    ctx.fillStyle = '#eed9bf';
    ctx.fillRect(-offset, 0, viewWidth, CANVAS_HEIGHT);

    const plankH = 26;
    for (let y = 100; y < CANVAS_HEIGHT; y += plankH) {
      ctx.fillStyle = '#dfc3a3';
      ctx.fillRect(-offset, y, viewWidth, 2);

      ctx.fillStyle = 'rgba(195, 160, 125, 0.22)';
      ctx.fillRect(-offset, y + 8, viewWidth, 1);
      ctx.fillRect(-offset, y + 17, viewWidth, 1);

      const plankOffset = (Math.floor(y / plankH) % 3) * 70;
      for (let x = plankOffset - Math.ceil(offset / 180) * 180; x < CANVAS_WIDTH + offset; x += 180) {
        ctx.fillStyle = '#caa582';
        ctx.fillRect(x, y + 2, 2, plankH - 2);
      }
    }

    // 2. WALLS & MOLDING
    ctx.fillStyle = '#e8dff0';
    ctx.fillRect(-offset, 0, viewWidth, 102);

    ctx.fillStyle = '#ded1e8';
    for (let x = 14 - Math.ceil(offset / 32) * 32; x < CANVAS_WIDTH + offset; x += 32) {
      ctx.fillRect(x, 0, 3, 100);
      ctx.fillStyle = '#eed9ee';
      ctx.fillRect(x - 3, 34, 2, 2);
      ctx.fillRect(x + 4, 58, 2, 2);
      ctx.fillStyle = '#ded1e8';
    }

    ctx.fillStyle = '#8c5936';
    ctx.fillRect(-offset, 98, viewWidth, 7);
    ctx.fillStyle = '#6d4023';
    ctx.fillRect(-offset, 103, viewWidth, 3);

    // 3. ARCHED WINDOW
    const wx = 480;
    const wy = 12;
    const ww = 110;
    const wh = 80;

    ctx.fillStyle = '#5a3419';
    ctx.fillRect(wx - 4, wy - 4, ww + 8, wh + 8);

    if (timeOfDay === 'sunny') {
      ctx.fillStyle = '#8bd1f5';
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(wx + 15, wy + 20, 35, 12);
      ctx.fillRect(wx + 25, wy + 14, 20, 6);
      ctx.fillRect(wx + 65, wy + 32, 30, 10);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(wx + 80, wy + 12, 16, 16);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(wx + 83, wy + 15, 10, 10);
    } else if (timeOfDay === 'rainy') {
      ctx.fillStyle = '#57677d';
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = '#424f60';
      ctx.fillRect(wx + 10, wy + 10, 90, 26);
      ctx.strokeStyle = '#cbe4f9';
      ctx.lineWidth = 1.5;
      rainDropsRef.current.forEach(drop => {
        drop.y += drop.speed;
        if (drop.y > wy + wh) {
          drop.y = wy;
          drop.x = wx + Math.random() * ww;
        }
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length);
        ctx.stroke();
      });
    } else {
      ctx.fillStyle = '#1c1b38';
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = '#fef08a';
      const starTwinkle = Math.sin(animFrame * 0.08) > 0;
      ctx.fillRect(wx + 18, wy + 18, 2, 2);
      ctx.fillRect(wx + 52, wy + 24, starTwinkle ? 2 : 1, starTwinkle ? 2 : 1);
      ctx.fillRect(wx + 82, wy + 20, 2, 2);
      ctx.fillRect(wx + 75, wy + 14, 14, 16);
      ctx.fillStyle = '#1c1b38';
      ctx.fillRect(wx + 71, wy + 14, 12, 16);
    }

    ctx.fillStyle = '#7d4a25';
    ctx.fillRect(wx + ww / 2 - 2, wy, 4, wh);
    ctx.fillRect(wx, wy + wh / 2 - 2, ww, 4);

    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(wx - 8, wy, 14, wh + 10);
    ctx.fillRect(wx + ww - 6, wy, 14, wh + 10);
    ctx.fillStyle = '#d8b4fe';
    ctx.fillRect(wx - 4, wy + 42, 10, 4);
    ctx.fillRect(wx + ww - 6, wy + 42, 10, 4);

    if (timeOfDay === 'sunny') {
      const grad = ctx.createLinearGradient(wx + 55, wy + wh, wx + 40, 280);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      grad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(wx + 10, wy + wh);
      ctx.lineTo(wx + ww - 10, wy + wh);
      ctx.lineTo(wx + ww + 90, 310);
      ctx.lineTo(wx - 50, 310);
      ctx.closePath();
      ctx.fill();
    }

    // 4. LAVENDER RUG (Center)
    const rx = 310;
    const ry = 250;
    const rw = 340;
    const rh = 220;

    ctx.fillStyle = '#d8b4fe';
    ctx.fillRect(rx - 6, ry - 6, rw + 12, rh + 12);
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(rx, ry, rw, rh);

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.strokeRect(rx + 14, ry + 14, rw - 28, rh - 28);

    // 6. AREA 5: MY DESK & BLUE BACKPACK
    const dx = 55;
    const dy = 105;
    const dw = 195;
    const dh = 85;

    ctx.fillStyle = 'rgba(70, 40, 20, 0.2)';
    ctx.fillRect(dx + 4, dy + dh - 4, dw + 6, 16);

    ctx.fillStyle = '#783318';
    ctx.fillRect(dx, dy + 28, dw, dh - 28);
    ctx.fillStyle = '#a05c32';
    ctx.fillRect(dx, dy, dw, 28);
    ctx.fillStyle = '#5c3116';
    ctx.fillRect(dx, dy + 25, dw, 3);

    // Monitors
    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(dx + 30, dy - 32, 60, 44);
    ctx.fillStyle = '#2e2738';
    ctx.fillRect(dx + 32, dy - 30, 56, 36);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(dx + 36, dy - 26, 26, 2);
    ctx.fillRect(dx + 40, dy - 21, 38, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(dx + 40, dy - 16, 32, 2);
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(dx + 56, dy + 8, 8, 14);
    ctx.fillRect(dx + 50, dy + 21, 20, 3);

    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(dx + 102, dy - 30, 42, 52);
    ctx.fillStyle = '#382b47';
    ctx.fillRect(dx + 104, dy - 28, 38, 48);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(dx + 118, dy - 14, 10, 10);
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(dx + 118, dy + 12, 8, 10);
    ctx.fillRect(dx + 112, dy + 21, 20, 3);

    ctx.fillStyle = '#374151';
    ctx.fillRect(dx + 50, dy + 12, 40, 12);
    ctx.fillStyle = '#f9a8d4';
    ctx.fillRect(dx + 52, dy + 14, 16, 4);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(dx + 70, dy + 14, 16, 4);

    ctx.fillStyle = '#86efac';
    ctx.fillRect(dx + 155, dy + 10, 11, 13);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(dx + 156, dy + 11, 9, 2);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(dx + 175, dy - 20, 14, 12);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(dx + 180, dy - 8, 4, 22);
    ctx.fillRect(dx + 173, dy + 14, 18, 4);
    const lampGlow = ctx.createRadialGradient(dx + 182, dy - 12, 2, dx + 182, dy + 22, 54);
    lampGlow.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
    lampGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(dx + 182, dy + 22, 54, 0, Math.PI * 2);
    ctx.fill();

    // BLUE BACKPACK
    const bpx = dx + 210;
    const bpy = dy + 18;
    ctx.fillStyle = 'rgba(70, 40, 20, 0.25)';
    ctx.beginPath();
    ctx.ellipse(bpx + 14, bpy + 40, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(bpx, bpy, 28, 38, [8, 8, 4, 4]);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(bpx + 3, bpy + 16, 22, 18);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(bpx + 4, bpy + 14, 20, 2);
    ctx.fillRect(bpx + 12, bpy + 16, 3, 4);

    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(bpx - 3, bpy + 8, 4, 8);
    ctx.fillStyle = '#065f46';
    ctx.fillRect(bpx - 4, bpy + 6, 6, 3);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(bpx + 23, bpy + 24, 4, 4);

    // 7. AREA 4: POPMART BOOKSHELF
    const sx = 45;
    const sy = 225;
    const sw = 75;
    const sh = 175;

    ctx.fillStyle = 'rgba(70, 40, 20, 0.2)';
    ctx.fillRect(sx, sy + sh - 4, sw + 6, 14);
    ctx.fillStyle = '#5a3014';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = '#733e1c';
    ctx.fillRect(sx + 5, sy + 5, sw - 10, sh - 10);

    const sh1Y = sy + 50;
    const sh2Y = sy + 105;
    const sh3Y = sy + 155;

    ctx.fillStyle = '#4a250d';
    ctx.fillRect(sx + 5, sh1Y, sw - 10, 6);
    ctx.fillRect(sx + 5, sh2Y, sw - 10, 6);
    ctx.fillRect(sx + 5, sh3Y, sw - 10, 6);

    // LAYER 1: Skullpanda & Space Molly & Mini Box
    // Skullpanda
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(sx + 10, sh1Y - 26, 12, 11);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 12, sh1Y - 22, 8, 7);
    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(sx + 9, sh1Y - 15, 14, 15);

    // Space Molly with Visor
    ctx.fillStyle = '#facc15';
    ctx.fillRect(sx + 28, sh1Y - 28, 13, 13);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(sx + 30, sh1Y - 23, 9, 6);
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(sx + 29, sh1Y - 15, 11, 15);

    // POP MART Blind Box
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(sx + 48, sh1Y - 24, 14, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 50, sh1Y - 20, 10, 8);

    // LAYER 2: LABUBU & DIMOO FIGURINES! (Secret Brown Labubu & Disney Dimoo Goofy)
    // 1. Secret Brown Labubu (Best friend gift)
    const lbX = sx + 8;
    // Tall bunny ears
    ctx.fillStyle = '#78350f';
    ctx.fillRect(lbX + 2, sh2Y - 29, 3, 9);
    ctx.fillRect(lbX + 8, sh2Y - 29, 3, 9);
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(lbX + 3, sh2Y - 27, 1, 5);
    ctx.fillRect(lbX + 9, sh2Y - 27, 1, 5);
    // Brown fur head & body
    ctx.fillStyle = '#78350f';
    ctx.fillRect(lbX, sh2Y - 20, 13, 11);
    ctx.fillRect(lbX + 1, sh2Y - 9, 11, 9);
    // Face & cheeky smile
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(lbX + 2, sh2Y - 18, 9, 6);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(lbX + 3, sh2Y - 17, 2, 2);
    ctx.fillRect(lbX + 8, sh2Y - 17, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lbX + 4, sh2Y - 14, 5, 2); // jagged smile

    // 2. Disney x Dimoo: Goofy Figurine (Top favorite #1)
    const gfX = sx + 27;
    // Green floppy Goofy hat
    ctx.fillStyle = '#15803d';
    ctx.fillRect(gfX + 3, sh2Y - 30, 7, 7);
    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(gfX + 2, sh2Y - 23, 9, 2);
    // Floppy black dog ears
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(gfX - 1, sh2Y - 22, 3, 8);
    ctx.fillRect(gfX + 11, sh2Y - 22, 3, 8);
    // Cloud face
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(gfX + 1, sh2Y - 22, 11, 9);
    ctx.fillStyle = '#ffe4e6';
    ctx.fillRect(gfX + 2, sh2Y - 16, 9, 6);
    ctx.fillStyle = '#ea580c'; // Goofy sweater
    ctx.fillRect(gfX + 1, sh2Y - 10, 11, 10);

    // 3. Classic Cloud Dimoo
    const dmX = sx + 48;
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(dmX + 1, sh2Y - 26, 12, 10);
    ctx.fillStyle = '#ffe4e6';
    ctx.fillRect(dmX + 3, sh2Y - 17, 8, 7);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(dmX + 2, sh2Y - 10, 10, 10);

    const bkCols = ['#dc2626', '#2563eb', '#16a34a', '#d97706'];
    let bkX = sx + 9;
    bkCols.forEach(col => {
      ctx.fillStyle = col;
      ctx.fillRect(bkX, sh3Y - 26, 10, 26);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(bkX + 1, sh3Y - 21, 8, 2);
      bkX += 14;
    });

    // 8. AREA 3: THE CAT (Cat Tree & House in Bottom Left)
    drawCatTreeCorner(ctx, animFrame);

    // 9. AREA 1: THE COZY BED WITH NEAT CAT PATTERN BLANKET!
    drawNeatBed(ctx, animFrame);

    // 10. AREA 2: THE BEDROOM DOOR (Bottom Right)
    drawDoor(ctx);

    // If rain mode, draw Soobin's rolling yarn / floss toy
    if (timeOfDay === 'rainy') {
      const toy = catToyRef.current;
      ctx.save();
      ctx.fillStyle = 'rgba(60, 40, 20, 0.2)';
      ctx.beginPath();
      ctx.ellipse(toy.x, toy.y + 7, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pink yarn ball with stitch detail
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(toy.x, toy.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#db2777';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(toy.x, toy.y, 4, 0, Math.PI);
      ctx.stroke();

      // Loose curly yarn string
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(toy.x - 4, toy.y + 2);
      ctx.quadraticCurveTo(toy.x - 12, toy.y - 4, toy.x - 18, toy.y + 4);
      ctx.stroke();
      ctx.restore();
    }

    // 11. DRAW TUXEDO CAT SOOBIN
    drawCat(ctx, animFrame);

    // 12. DRAW RACHEL (PLAYER)
    if (!humanSleepingInBed && !playerInDoor) {
      drawPlayer(ctx, animFrame);
    }

    // 13. PARTICLES
    drawParticles(ctx);

    // 14. LIGHTING OVERLAY
    renderLightingOverlay(ctx);

    // 15. OVERHEAD FLOATING "EXPLORE ME!" BADGES & INTERACTION PROMPT
    drawOverheadIndicators(ctx, animFrame);
  };

  // Draw Bottom-Left Cat Tree
  const drawCatTreeCorner = (ctx: CanvasRenderingContext2D, animFrame: number) => {
    const tx = 55;
    const ty = 430;

    ctx.fillStyle = '#fae8ff';
    ctx.beginPath();
    ctx.ellipse(tx + 65, ty + 105, 65, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Condo box
    ctx.fillStyle = '#5a3014';
    ctx.fillRect(tx + 20, ty + 65, 75, 55);
    ctx.fillStyle = '#783e1c';
    ctx.fillRect(tx + 24, ty + 68, 67, 48);

    // Cat-ear door
    ctx.fillStyle = '#261206';
    ctx.beginPath();
    ctx.arc(tx + 57, ty + 95, 16, Math.PI, 0);
    ctx.fillRect(tx + 41, ty + 95, 32, 21);
    ctx.moveTo(tx + 41, ty + 85);
    ctx.lineTo(tx + 45, ty + 77);
    ctx.lineTo(tx + 51, ty + 83);
    ctx.moveTo(tx + 63, ty + 83);
    ctx.lineTo(tx + 69, ty + 77);
    ctx.lineTo(tx + 73, ty + 85);
    ctx.fill();

    // Sisal pillars
    ctx.fillStyle = '#d4b996';
    ctx.fillRect(tx + 30, ty + 18, 12, 48);
    ctx.fillRect(tx + 75, ty + 18, 12, 48);
    ctx.fillStyle = '#b89a74';
    for (let py = ty + 20; py < ty + 65; py += 5) {
      ctx.fillRect(tx + 30, py, 12, 1);
      ctx.fillRect(tx + 75, py, 12, 1);
    }

    // Top Perch Bed
    ctx.fillStyle = '#5a3014';
    ctx.fillRect(tx + 15, ty + 14, 90, 6);
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.ellipse(tx + 60, ty + 12, 42, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.ellipse(tx + 60, ty + 10, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hanging toy
    const stringSway = Math.sin(animFrame * 0.1) * 3;
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx + 95, ty + 20);
    ctx.quadraticCurveTo(tx + 95 + stringSway, ty + 38, tx + 93 + stringSway, ty + 46);
    ctx.stroke();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(tx + 93 + stringSway, ty + 48, 5, 0, Math.PI * 2);
    ctx.fill();

    // Bowls
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(tx + 112, ty + 102, 11, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.ellipse(tx + 138, ty + 102, 11, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // Draw Bed with NEAT, TUCKED BLANKETS with CAT DESIGN PATTERNS!
  const drawNeatBed = (ctx: CanvasRenderingContext2D, animFrame: number) => {
    const bedX = 660;
    const bedY = 105;
    const bedW = 205;
    const bedH = 145;

    // Ground shadow
    ctx.fillStyle = 'rgba(70, 40, 20, 0.2)';
    ctx.fillRect(bedX + 8, bedY + bedH - 6, bedW + 10, 18);

    // Headboard & posts
    ctx.fillStyle = '#4a250d';
    ctx.fillRect(bedX, bedY, bedW, 28);
    ctx.fillRect(bedX - 4, bedY - 12, 12, 155);
    ctx.fillRect(bedX + bedW - 8, bedY - 12, 12, 155);
    ctx.fillStyle = '#8c5028';
    ctx.fillRect(bedX - 6, bedY - 18, 16, 8);
    ctx.fillRect(bedX + bedW - 10, bedY - 18, 16, 8);

    // Mattress base
    ctx.fillStyle = '#f5f3ff';
    ctx.fillRect(bedX + 8, bedY + 26, bedW - 16, bedH - 26);

    // EXACTLY 1 FLUFFY PILLOW
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bedX + 24, bedY + 18, 155, 30, [10, 10, 8, 8]);
    ctx.fill();
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.roundRect(bedX + 28, bedY + 22, 147, 22, [6, 6, 6, 6]);
    ctx.fill();

    // BROCCOLI PLUSHIE
    const brX = bedX + 42;
    const brY = bedY + 20;
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(brX + 5, brY + 14, 10, 10);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(brX + 4, brY + 7, 7, 0, Math.PI * 2);
    ctx.arc(brX + 11, brY + 3, 8, 0, Math.PI * 2);
    ctx.arc(brX + 17, brY + 7, 7, 0, Math.PI * 2);
    ctx.arc(brX + 11, brY + 10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(brX + 7, brY + 16, 2, 2);
    ctx.fillRect(brX + 12, brY + 16, 2, 2);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(brX + 8, brY + 19, 4, 1);

    // TURTLE PLUSHIE
    const tuX = bedX + 140;
    const tuY = bedY + 20;
    ctx.fillStyle = '#3f6212';
    ctx.beginPath();
    ctx.ellipse(tuX + 8, tuY + 12, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.ellipse(tuX + 8, tuY + 12, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.arc(tuX + 22, tuY + 12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b24';
    ctx.fillRect(tuX + 23, tuY + 10, 2, 2);
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(tuX + 2, tuY + 1, 5, 4);
    ctx.fillRect(tuX + 2, tuY + 19, 5, 4);
    ctx.fillRect(tuX + 13, tuY + 2, 5, 4);
    ctx.fillRect(tuX + 13, tuY + 18, 5, 4);

    // NEAT, TUCKED BLANKET WITH CAT DESIGN PATTERNS!
    // Wooden side rails to firmly hold the mattress and tucked bedding:
    ctx.fillStyle = '#6b3614';
    ctx.fillRect(bedX, bedY + 28, 12, bedH - 38);
    ctx.fillRect(bedX + bedW - 12, bedY + 28, 12, bedH - 38);

    // Stays neatly inside the bed frame boundaries (no overflowing corners):
    const blanketX = bedX + 16;
    const blanketY = bedY + 54;
    const blanketW = bedW - 32;
    const blanketH = bedH - 70; // Ends neatly before footboard

    // Quilt background: soft pastel lavender with stitched border
    ctx.fillStyle = '#eddff7';
    ctx.beginPath();
    ctx.roundRect(blanketX, blanketY, blanketW, blanketH, [3, 3, 0, 0]);
    ctx.fill();

    // Stitched hem border
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 1;
    ctx.strokeRect(blanketX + 3, blanketY + 3, blanketW - 6, blanketH - 6);

    // Crisp white sheet fold at top edge (neatly pressed)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(blanketX, blanketY - 4, blanketW, 9);
    ctx.fillStyle = '#c4b5fd';
    ctx.fillRect(blanketX, blanketY + 5, blanketW, 1);

    // CAT DESIGN PATTERNS ON THE BLANKET!
    // Rows of cute pixel cat face silhouettes and kitty paw prints:
    for (let py = blanketY + 12; py < blanketY + blanketH - 8; py += 24) {
      for (let px = blanketX + 14; px < blanketX + blanketW - 12; px += 30) {
        const isCatFace = (Math.floor((px - blanketX) / 30) + Math.floor((py - blanketY) / 24)) % 2 === 0;

        if (isCatFace) {
          // Cute Pixel Cat Face Silhouette
          ctx.fillStyle = '#a855f7'; // Purple cat silhouette
          // Pointy ears
          ctx.fillRect(px - 4, py - 4, 2, 3);
          ctx.fillRect(px + 2, py - 4, 2, 3);
          // Head
          ctx.fillRect(px - 5, py - 1, 10, 6);
          // Eyes
          ctx.fillStyle = '#eddff7';
          ctx.fillRect(px - 3, py + 1, 1, 2);
          ctx.fillRect(px + 2, py + 1, 1, 2);
          // Whiskers
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(px - 7, py + 2, 2, 1);
          ctx.fillRect(px + 5, py + 2, 2, 1);
        } else {
          // Cute Kitty Paw Print
          ctx.fillStyle = '#f472b6'; // Pastel pink paw
          // Main pad
          ctx.fillRect(px - 2, py + 1, 5, 4);
          // 3 Toe beans
          ctx.fillRect(px - 4, py - 2, 2, 2);
          ctx.fillRect(px - 1, py - 3, 2, 2);
          ctx.fillRect(px + 2, py - 2, 2, 2);
        }
      }
    }

    // WOODEN FOOTBOARD (Neatly enclosing the bottom of the bed so blankets don't overflow)
    ctx.fillStyle = '#5c3116';
    ctx.fillRect(bedX, bedY + bedH - 16, bedW, 18);
    ctx.fillStyle = '#8c5028';
    ctx.fillRect(bedX + 2, bedY + bedH - 14, bedW - 4, 14);
    ctx.fillStyle = '#a05c32';
    ctx.fillRect(bedX + 2, bedY + bedH - 14, bedW - 4, 3);

    // IF HUMAN IS SLEEPING IN BED
    if (humanSleepingInBed) {
      const hx = bedX + 90;
      const hy = bedY + 24;

      ctx.fillStyle = '#fcd34d';
      ctx.fillRect(hx - 10, hy, 20, 18);
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(hx - 7, hy + 7, 5, 2);
      ctx.fillRect(hx + 2, hy + 7, 5, 2);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(hx - 8, hy + 11, 4, 2);
      ctx.fillRect(hx + 4, hy + 11, 4, 2);

      ctx.fillStyle = '#5c3821';
      ctx.fillRect(hx - 22, hy - 4, 12, 18);
      ctx.fillRect(hx + 10, hy - 4, 12, 18);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(hx - 15, hy - 2, 5, 5);
      ctx.fillRect(hx + 10, hy - 2, 5, 5);

      if (animFrame % 60 < 45) {
        ctx.fillStyle = '#c084fc';
        ctx.font = '10px Silkscreen';
        const zOff = (animFrame % 60) * 0.4;
        ctx.fillText('z', hx - 5, hy - 10 - zOff);
        ctx.fillText('Z', hx + 4, hy - 18 - zOff);
      }
    }

    // NIGHTSTAND WITH GLOWING GLASS PAPER STAR JAR
    ctx.fillStyle = '#78350f';
    ctx.fillRect(615, 130, 42, 55);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(615, 130, 42, 14);

    const jarX = 624;
    const jarY = 112;
    const jarW = 24;
    const jarH = 30;

    const jarGlow = ctx.createRadialGradient(jarX + 12, jarY + 15, 3, jarX + 12, jarY + 15, 26);
    jarGlow.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
    jarGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = jarGlow;
    ctx.beginPath();
    ctx.arc(jarX + 12, jarY + 15, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
    ctx.beginPath();
    ctx.roundRect(jarX, jarY + 6, jarW, jarH - 6, [3, 3, 5, 5]);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.fillRect(jarX + 4, jarY + 1, 16, 6);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(jarX + 6, jarY + 2, 12, 4);

    const starColors = ['#facc15', '#f472b6', '#a855f7', '#4ade80', '#38bdf8', '#fb923c'];
    starColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      const sx = jarX + 4 + (idx % 3) * 6;
      const sy = jarY + 12 + Math.floor(idx / 3) * 7;
      ctx.fillRect(sx, sy, 4, 4);
    });

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(jarX + 3, jarY + 8);
    ctx.lineTo(jarX + 3, jarY + 26);
    ctx.stroke();

    if (animFrame % 40 < 25) {
      ctx.fillStyle = '#fde047';
      ctx.font = '9px Silkscreen';
      ctx.fillText('★', jarX + 7, jarY - 2);
    }
  };

  // Draw Bedroom Door (Bottom Right)
  const drawDoor = (ctx: CanvasRenderingContext2D) => {
    const doorX = 865;
    const doorY = 485;
    const doorW = 50;
    const doorH = 92;

    ctx.fillStyle = '#451a03';
    ctx.fillRect(doorX - 4, doorY - 4, doorW + 8, doorH + 6);

    if (bobaDoorOpen) {
      // Open Doorway: Dark corridor with warm yellow light glow
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(doorX, doorY, doorW, doorH);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.fillRect(doorX + 2, doorY + 2, 6, doorH - 4);

      // Swung open door leaf
      ctx.fillStyle = '#8c5028';
      ctx.beginPath();
      ctx.moveTo(doorX + doorW, doorY);
      ctx.lineTo(doorX + doorW + 14, doorY + 6);
      ctx.lineTo(doorX + doorW + 14, doorY + doorH - 4);
      ctx.lineTo(doorX + doorW, doorY + doorH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#6d3914';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#8c5028';
      ctx.fillRect(doorX, doorY, doorW, doorH);

      ctx.fillStyle = '#6d3914';
      ctx.fillRect(doorX + 6, doorY + 8, doorW - 12, 32);
      ctx.fillRect(doorX + 6, doorY + 48, doorW - 12, 36);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(doorX + 8, doorY + 10, doorW - 16, 28);
      ctx.fillRect(doorX + 8, doorY + 50, doorW - 16, 32);

      ctx.fillStyle = '#fde047';
      ctx.fillRect(doorX + 6, doorY + 44, 10, 4);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(doorX + 8, doorY + 42, 4, 8);
    }

    const matX = doorX - 35;
    const matY = doorY + 35;
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.roundRect(matX, matY, 32, 50, [4, 4, 4, 4]);
    ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.fillRect(matX + 3, matY + 3, 26, 44);

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(matX + 16, matY + 28, 5, 0, Math.PI * 2);
    ctx.arc(matX + 11, matY + 18, 2, 0, Math.PI * 2);
    ctx.arc(matX + 16, matY + 16, 2, 0, Math.PI * 2);
    ctx.arc(matX + 21, matY + 18, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  // Draw Soobin the Tuxedo Cat
  const drawCat = (ctx: CanvasRenderingContext2D, animFrame: number) => {
    const cx = Math.round(catPosRef.current.x);
    const cy = Math.round(catPosRef.current.y);
    const isSleeping = timeOfDay === 'night'; // Cat NEVER sleeps during the day!
    const isPurring = catState === 'purring';

    ctx.fillStyle = 'rgba(60, 40, 20, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 9, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isSleeping) {
      const breath = Math.sin(animFrame * 0.06) * 1;
      ctx.fillStyle = '#1e1b24';
      ctx.beginPath();
      ctx.ellipse(cx, cy + breath, 14, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx - 3, cy + 2 + breath, 7, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b24';
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 3 + breath, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b24';
      ctx.fillRect(cx - 16, cy - 12 + breath, 5, 7);
      ctx.fillRect(cx - 6, cy - 12 + breath, 5, 7);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(cx - 15, cy - 10 + breath, 3, 5);
      ctx.fillRect(cx - 5, cy - 10 + breath, 3, 5);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx + 2, cy + 5 + breath, 7, 6);

      ctx.strokeStyle = '#1e1b24';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx + 11, cy - 2, 9, 0.2, Math.PI * 0.9);
      ctx.stroke();

      if (animFrame % 60 < 45) {
        ctx.fillStyle = '#c084fc';
        ctx.font = '9px Silkscreen';
        const zOff = (animFrame % 60) * 0.35;
        ctx.fillText('z', cx - 13, cy - 16 - zOff);
        ctx.fillText('Z', cx - 8, cy - 23 - zOff);
      }
    } else {
      let walkBob = catPosRef.current.frame % 2 === 0 ? 0 : 2;
      let heheWiggle = 0;

      if (isPurring) {
        // The playful "hehe" movement!
        const heheBounce = Math.abs(Math.sin(animFrame * 0.45)) * 4;
        walkBob = -heheBounce;
        heheWiggle = Math.sin(animFrame * 0.45) * 2;
      }

      ctx.save();
      ctx.translate(cx + heheWiggle, cy);

      // Body
      ctx.fillStyle = '#1e1b24';
      ctx.fillRect(-9, -9 + walkBob, 18, 14);

      // White chest & tuxedo bib
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -5 + walkBob, 9, 9);

      // Head
      ctx.fillStyle = '#1e1b24';
      ctx.fillRect(-8, -20 + walkBob, 16, 12);

      // White muzzle
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -15 + walkBob, 6, 7);

      // Pointy ears with pink inside
      ctx.fillStyle = '#1e1b24';
      ctx.fillRect(-8, -26 + walkBob, 5, 7);
      ctx.fillRect(3, -26 + walkBob, 5, 7);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-7, -24 + walkBob, 3, 5);
      ctx.fillRect(4, -24 + walkBob, 3, 5);

      if (isPurring) {
        // Joyful smiling squinty eyes "^ ◡ ^" during hehe movement!
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-6, -17 + walkBob, 3, 2);
        ctx.fillRect(3, -17 + walkBob, 3, 2);
        // Pink cheek blush
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(-7, -13 + walkBob, 2, 2);
        ctx.fillRect(5, -13 + walkBob, 2, 2);
      } else {
        // Emerald green eyes
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-6, -17 + walkBob, 3, 3);
        ctx.fillRect(3, -17 + walkBob, 3, 3);
      }

      // White mittens (paws)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, 5, 5, 5);
      ctx.fillRect(3, 5, 5, 5);

      // Tail with happy playful wagging
      const tailWag = isPurring ? Math.sin(animFrame * 0.45) * 8 : (catPosRef.current.direction === 'left' ? -3 : 3);
      ctx.strokeStyle = '#1e1b24';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(8, -2);
      ctx.quadraticCurveTo(18 + tailWag, -15, 14 + tailWag, -22);
      ctx.stroke();

      ctx.restore();
    }
  };

  // Draw Rachel (Player)
  const drawPlayer = (ctx: CanvasRenderingContext2D, animFrame: number) => {
    const px = Math.round(player.x);
    const py = Math.round(player.y);
    const dir = player.direction;
    const walkFrame = player.frame;
    const walkBob = player.isWalking ? (walkFrame % 2 === 0 ? -2 : 2) : 0;

    ctx.fillStyle = 'rgba(60, 40, 20, 0.32)';
    ctx.beginPath();
    ctx.ellipse(px, py + 22, 17, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pants & sneakers
    ctx.fillStyle = '#1e293b';
    if (player.isWalking) {
      if (walkFrame === 1) {
        ctx.fillRect(px - 8, py + 10, 6, 12);
        ctx.fillRect(px + 2, py + 7, 6, 12);
      } else if (walkFrame === 3) {
        ctx.fillRect(px - 8, py + 7, 6, 12);
        ctx.fillRect(px + 2, py + 10, 6, 12);
      } else {
        ctx.fillRect(px - 8, py + 9, 6, 12);
        ctx.fillRect(px + 2, py + 9, 6, 12);
      }
    } else {
      ctx.fillRect(px - 8, py + 9, 6, 12);
      ctx.fillRect(px + 2, py + 9, 6, 12);
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 9, py + 19, 7, 5);
    ctx.fillRect(px + 2, py + 19, 7, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(px - 8, py + 21, 5, 3);
    ctx.fillRect(px + 3, py + 21, 5, 3);

    // OVERSIZED BERKELEY SWEATER (Navy Blue #003262 & California Gold #FDB515)
    ctx.fillStyle = '#003262';
    ctx.beginPath();
    ctx.roundRect(px - 14, py - 8 + walkBob, 28, 20, [4, 4, 2, 2]);
    ctx.fill();

    if (dir === 'left') {
      ctx.fillRect(px - 17, py - 4 + walkBob, 6, 15);
      ctx.fillStyle = '#fdb515';
      ctx.fillRect(px - 17, py + 7 + walkBob, 6, 3);
    } else if (dir === 'right') {
      ctx.fillRect(px + 11, py - 4 + walkBob, 6, 15);
      ctx.fillStyle = '#fdb515';
      ctx.fillRect(px + 11, py + 7 + walkBob, 6, 3);
    } else {
      ctx.fillRect(px - 17, py - 4 + walkBob, 6, 14);
      ctx.fillRect(px + 11, py - 4 + walkBob, 6, 14);
      ctx.fillStyle = '#fdb515';
      ctx.fillRect(px - 17, py + 6 + walkBob, 6, 3);
      ctx.fillRect(px + 11, py + 6 + walkBob, 6, 3);
    }

    // PROMINENT "CAL" LETTERS ON CHEST!
    if (dir === 'down') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 4, py - 9 + walkBob, 8, 3);

      ctx.fillStyle = '#fdb515';
      const cx = px - 9;
      const cy = py - 3 + walkBob;
      // "C"
      ctx.fillRect(cx, cy, 5, 2);
      ctx.fillRect(cx, cy, 2, 7);
      ctx.fillRect(cx, cy + 5, 5, 2);
      // "A"
      const ax = px - 2;
      ctx.fillRect(ax, cy, 5, 2);
      ctx.fillRect(ax, cy, 2, 7);
      ctx.fillRect(ax + 3, cy, 2, 7);
      ctx.fillRect(ax, cy + 3, 5, 2);
      // "L"
      const lx = px + 5;
      ctx.fillRect(lx, cy, 2, 7);
      ctx.fillRect(lx, cy + 5, 5, 2);

      // Bear accent
      ctx.fillRect(px - 4, cy + 9, 8, 2);
    } else if (dir === 'left' || dir === 'right') {
      ctx.fillStyle = '#fdb515';
      ctx.fillRect(dir === 'left' ? px - 4 : px - 1, py - 2 + walkBob, 5, 6);
    }

    // Face & Head
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(px - 9, py - 26 + walkBob, 18, 18);

    if (dir === 'down') {
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(px - 6, py - 20 + walkBob, 3, 4);
      ctx.fillRect(px + 3, py - 20 + walkBob, 3, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 6, py - 20 + walkBob, 1, 2);
      ctx.fillRect(px + 3, py - 20 + walkBob, 1, 2);

      ctx.fillStyle = '#f472b6';
      ctx.fillRect(px - 8, py - 14 + walkBob, 3, 2);
      ctx.fillRect(px + 5, py - 14 + walkBob, 3, 2);

      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(px - 2, py - 13 + walkBob, 4, 2);
    } else if (dir === 'left') {
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(px - 8, py - 20 + walkBob, 3, 4);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(px - 8, py - 14 + walkBob, 3, 2);
    } else if (dir === 'right') {
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(px + 5, py - 20 + walkBob, 3, 4);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(px + 5, py - 14 + walkBob, 3, 2);
    }

    // Hair & Pigtails
    ctx.fillStyle = '#5c3821';
    ctx.fillRect(px - 11, py - 30 + walkBob, 22, 7);

    if (dir === 'down') {
      ctx.fillRect(px - 9, py - 25 + walkBob, 18, 5);
      ctx.fillRect(px - 2, py - 22 + walkBob, 4, 3);
    } else if (dir === 'up') {
      ctx.fillRect(px - 10, py - 27 + walkBob, 20, 18);
    }

    const hairSway = player.isWalking ? Math.sin(animFrame * 0.35) * 3 : 0;
    ctx.fillStyle = '#5c3821';
    ctx.fillRect(px - 18 + hairSway, py - 24 + walkBob, 7, 18);
    ctx.fillRect(px - 20 + hairSway, py - 12 + walkBob, 7, 14);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px - 16 + hairSway, py - 26 + walkBob, 5, 5);

    ctx.fillStyle = '#5c3821';
    ctx.fillRect(px + 11 - hairSway, py - 24 + walkBob, 7, 18);
    ctx.fillRect(px + 13 - hairSway, py - 12 + walkBob, 7, 14);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px + 11 - hairSway, py - 26 + walkBob, 5, 5);

    // If Rachel went on a Boba Run and is holding Boba! 🧋
    if (hasBoba) {
      const bx = dir === 'left' ? px - 18 : px + 12;
      const by = py - 6 + walkBob;

      // Clear plastic cup body
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(bx, by, 9, 13);
      // Roasted oolong milk tea
      ctx.fillStyle = '#b45309';
      ctx.fillRect(bx + 1, by + 3, 7, 9);
      // Tapioca pearls
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(bx + 2, by + 8, 2, 2);
      ctx.fillRect(bx + 5, by + 9, 2, 2);
      ctx.fillRect(bx + 3, by + 10, 2, 2);
      // Cup lid
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx - 1, by - 1, 11, 2);
      // Fat pink boba straw
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(bx + 4, by - 6, 2, 6);
    }
  };

  // Particles
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    if (timeOfDay === 'sunny') {
      ctx.fillStyle = 'rgba(255, 255, 230, 0.45)';
      dustRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 100) p.y = CANVAS_HEIGHT - 30;
        if (p.x < 0) p.x = CANVAS_WIDTH;
        if (p.x > CANVAS_WIDTH) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    for (let i = heartsRef.current.length - 1; i >= 0; i--) {
      const h = heartsRef.current[i];
      h.y += h.vy;
      h.life -= 0.02;

      if (h.life <= 0) {
        heartsRef.current.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(244, 63, 94, ${h.life})`;
      ctx.fillRect(h.x - 3, h.y - 3, 3, 3);
      ctx.fillRect(h.x + 2, h.y - 3, 3, 3);
      ctx.fillRect(h.x - 4, h.y, 9, 3);
      ctx.fillRect(h.x - 3, h.y + 3, 7, 3);
      ctx.fillRect(h.x, h.y + 6, 2, 2);
    }
  };

  // Ambient Lighting Overlay
  const renderLightingOverlay = (ctx: CanvasRenderingContext2D) => {
    if (timeOfDay === 'night') {
      ctx.fillStyle = 'rgba(18, 16, 45, 0.46)';
      ctx.fillRect(-viewOffsetRef.current, 0, CANVAS_WIDTH + viewOffsetRef.current * 2, CANVAS_HEIGHT);

      const deskLamp = ctx.createRadialGradient(235, 125, 6, 235, 125, 140);
      deskLamp.addColorStop(0, 'rgba(254, 240, 138, 0.32)');
      deskLamp.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = deskLamp;
      ctx.fillRect(-viewOffsetRef.current, 0, CANVAS_WIDTH + viewOffsetRef.current * 2, CANVAS_HEIGHT);

      const bedLamp = ctx.createRadialGradient(635, 145, 6, 635, 145, 100);
      bedLamp.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      bedLamp.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bedLamp;
      ctx.fillRect(-viewOffsetRef.current, 0, CANVAS_WIDTH + viewOffsetRef.current * 2, CANVAS_HEIGHT);
    } else if (timeOfDay === 'rainy') {
      ctx.fillStyle = 'rgba(40, 55, 80, 0.25)';
      ctx.fillRect(-viewOffsetRef.current, 0, CANVAS_WIDTH + viewOffsetRef.current * 2, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = 'rgba(255, 240, 210, 0.08)';
      ctx.fillRect(-viewOffsetRef.current, 0, CANVAS_WIDTH + viewOffsetRef.current * 2, CANVAS_HEIGHT);
    }

    // 20-second Nap feedback banner
    if (isNapping) {
      ctx.save();
      ctx.fillStyle = 'rgba(26, 16, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(CANVAS_WIDTH / 2 - 250, 18, 500, 48, [10, 10, 10, 10]);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Silkscreen';
      ctx.textAlign = 'center';
      ctx.fillText(`😴 Rachel's Cozy Nap: ${napCountdown}s 💤`, CANVAS_WIDTH / 2, 38);

      // Nap Progress bar
      const pW = 340;
      const pH = 6;
      const pX = CANVAS_WIDTH / 2 - pW / 2;
      const pY = 46;
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(pX, pY, pW, pH);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(pX, pY, pW * ((20 - napCountdown) / 20), pH);
      ctx.restore();
    }

    // Boba Run brief feedback banner
    if (isBobaRunning) {
      ctx.save();
      ctx.fillStyle = 'rgba(26, 20, 36, 0.94)';
      ctx.beginPath();
      ctx.roundRect(CANVAS_WIDTH / 2 - 240, 24, 480, 44, [8, 8, 8, 8]);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Silkscreen';
      ctx.textAlign = 'center';
      ctx.fillText('🏃‍♀️ Stepping out to Telegraph Ave for Boba... 🧋', CANVAS_WIDTH / 2, 51);
      ctx.restore();
    }
  };

  // OVERHEAD FLOATING "EXPLORE ME!" BADGES & VIBRANT "CLICK ON ME!" PROMPT
  const drawOverheadIndicators = (ctx: CanvasRenderingContext2D, animFrame: number) => {
    if (activeModal) return;

    const active5 = coreZones.filter(z => z.id !== 'starjar');

    active5.forEach(zone => {
      const isPlayerNear = activeZone === zone.id;
      const isVisited = exploredZones.has(zone.id);

      const zx = zone.id === 'cat' ? catPosRef.current.x : zone.x;
      const baseOy = zone.id === 'cat' ? catPosRef.current.y - 36 : zone.overheadY;
      const bounce = Math.sin(animFrame * 0.12 + zone.x) * 4;
      const oy = baseOy + bounce;

      ctx.save();

      if (zone.id === 'cat') {
        // SPECIAL "PET ME!" HOVERING BADGE OVER SOOBIN
        const isPurring = catState === 'purring';
        const label = isPlayerNear ? '✨ CLICK ON ME! ✨ Pet Soobin 💕' : (isPurring ? 'Hehe~ Purr! 💖' : 'Pet me! 💕');
        ctx.font = 'bold 10px Silkscreen';
        const tw = ctx.measureText(label).width;
        const bw = tw + 22;
        const bh = isPlayerNear ? 28 : 22;
        const bx = zx - bw / 2;

        ctx.fillStyle = '#831843';
        ctx.fillRect(bx - 2, oy - bh - 2, bw + 4, bh + 4);
        ctx.fillStyle = isPurring ? '#fdf2f8' : (isPlayerNear ? '#fde047' : '#fff1f2');
        ctx.fillRect(bx, oy - bh, bw, bh);
        ctx.fillStyle = isPlayerNear ? '#78350f' : '#be185d';
        ctx.fillText(label, bx + 11, oy - bh + (isPlayerNear ? 18 : 15));

        // Down pointer
        ctx.fillStyle = '#831843';
        ctx.fillRect(zx - 3, oy + 1, 6, 4);
      } else if (isPlayerNear) {
        // PROMINENT "CLICK ON ME!" BANNER WHEN REACHED!
        const mainLabel = '✨ CLICK ON ME! ✨';
        const subLabel = `${zone.label} (or [E])`;
        ctx.font = 'bold 11px Silkscreen';
        const twMain = ctx.measureText(mainLabel).width;
        ctx.font = '9px Silkscreen';
        const twSub = ctx.measureText(subLabel).width;
        const bw = Math.max(twMain, twSub) + 30;
        const bh = 34;
        const bx = zx - bw / 2;

        // Animated energetic pulsing border
        const flashBorder = animFrame % 24 < 12 ? '#f59e0b' : '#ef4444';
        ctx.fillStyle = flashBorder;
        ctx.fillRect(bx - 3, oy - bh - 3, bw + 6, bh + 6);

        // High contrast yellow background
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(bx, oy - bh, bw, bh);

        // Main action text
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 11px Silkscreen';
        ctx.fillText(mainLabel, bx + 14, oy - bh + 15);

        // Sublabel
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 9px Silkscreen';
        ctx.fillText(subLabel, bx + 14, oy - bh + 27);

        // Down pointer
        ctx.fillStyle = flashBorder;
        ctx.fillRect(zx - 5, oy + 2, 10, 4);
        ctx.fillRect(zx - 2, oy + 6, 4, 3);
      } else if (!isVisited) {
        // Floating "Explore me! ✨" indicator hovering overhead
        const label = `${zone.num}. ${zone.label}`;
        ctx.font = '10px Silkscreen';
        const tw = ctx.measureText(label).width;
        const bw = tw + 18;
        const bh = 20;
        const bx = zx - bw / 2;

        ctx.fillStyle = 'rgba(74, 40, 16, 0.9)';
        ctx.fillRect(bx - 1, oy - bh - 1, bw + 2, bh + 2);

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(bx, oy - bh, bw, bh);

        ctx.fillStyle = '#78350f';
        ctx.fillText(label, bx + 8, oy - bh + 14);

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(zx - 2, oy - 1, 4, 3);
      } else {
        // Completed golden star
        ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
        ctx.font = '11px Silkscreen';
        ctx.fillText('★', zx - 4, oy - 6);
      }

      ctx.restore();
    });

    // Star Jar prompt if player is near nightstand
    if (activeZone === 'starjar') {
      const zx = 635;
      const oy = 90 + Math.sin(animFrame * 0.12) * 3;
      ctx.save();
      const label = '[E] Star Jar ⭐';
      ctx.font = 'bold 11px Silkscreen';
      const tw = ctx.measureText(label).width;
      const bw = tw + 18;
      ctx.fillStyle = '#5a3014';
      ctx.fillRect(zx - bw / 2 - 2, oy - 26, bw + 4, 26);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(zx - bw / 2, oy - 24, bw, 22);
      ctx.fillStyle = '#b45309';
      ctx.fillText(label, zx - bw / 2 + 8, oy - 9);
      ctx.restore();
    }
  };

  // Canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || activeModal) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX - viewOffsetRef.current;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if clicked directly on an interactive zone or overhead "Explore me!" badge
    for (const z of coreZones) {
      const zx = z.id === 'cat' ? catPosRef.current.x : z.x;
      const zy = z.id === 'cat' ? catPosRef.current.y : z.y;
      const hitCenter = Math.hypot(clickX - zx, clickY - zy) < z.radius;
      const hitOverhead = Math.hypot(clickX - zx, clickY - z.overheadY) < 55;
      if (hitCenter || hitOverhead) {
        if (z.id === 'cat') {
          onPetCat();
        }
        soundEngine.playInspect();
        onInteract(z.id);
        return;
      }
    }

    if (humanSleepingInBed) {
      if (isNapping) onWakeEarly?.();
      setHumanSleepingInBed(false);
    }

    setPlayer(prev => ({
      ...prev,
      x: Math.max(60, Math.min(CANVAS_WIDTH - 60, clickX)),
      y: Math.max(115, Math.min(CANVAS_HEIGHT - 40, clickY)),
      direction: clickY < prev.y ? 'up' : 'down'
    }));
  };

  const handleDPadPress = (dir: Direction) => {
    const speed = 28;
    if (humanSleepingInBed) {
      if (isNapping) onWakeEarly?.();
      setHumanSleepingInBed(false);
      setPlayer({ x: 740, y: 260, direction: 'down', isWalking: true, frame: 0 });
      return;
    }
    setPlayer(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (dir === 'up') ny -= speed;
      if (dir === 'down') ny += speed;
      if (dir === 'left') nx -= speed;
      if (dir === 'right') nx += speed;

      if (!checkCollision(nx, ny)) {
        soundEngine.playFootstep();
        return { ...prev, x: nx, y: ny, direction: dir, isWalking: true };
      }
      return { ...prev, direction: dir };
    });
  };

  const activeZoneObj = coreZones.find(z => z.id === activeZone);

  return (
    <div className="relative flex flex-col items-center justify-center room-canvas w-full max-w-5xl mx-auto md:flex-1 min-h-0">
      {/* Wooden Screen Frame */}
      <div className="relative p-1.5 sm:p-2 bg-[#4a2810] rounded-xl shadow-2xl border-4 border-[#783e1c] w-full max-h-[calc(100vh-170px)] flex flex-col items-center justify-center">
        <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-[#facc15] border border-[#78350f] z-10" />

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="w-full h-auto max-h-[calc(100vh-215px)] aspect-[960/600] pixelated cursor-pointer rounded-md bg-[#eed9bf] block shadow-inner object-contain"
        />

        {isNapping && (
          <div className="w-full flex flex-wrap items-center justify-between gap-2 px-2 pt-1 font-pixel text-xs text-[#fef08a]">
            <span role="status" aria-live="off">Cozy nap: {napCountdown}s remaining</span>
            <button onClick={onWakeEarly} className="min-h-11 px-3 rounded border border-[#d59f63] bg-[#783e1c] text-[#fff9f0]">
              Wake up early
            </button>
          </div>
        )}

        {/* Dynamic Nearby Proximity Quick Bar */}
        {!isNapping && <div className="flex flex-wrap items-center justify-between w-full px-2 pt-1 text-[11px] font-pixel text-[#fde047] gap-2">
          {activeZoneObj ? (
            <button
              onClick={() => {
                if (activeZone) {
                  if (activeZone === 'cat') {
                    onPetCat();
                  }
                  soundEngine.playInspect();
                  onInteract(activeZone);
                }
              }}
              className="px-3 py-0.5 rounded bg-[#fde047] text-[#451a03] font-bold border border-[#78350f] shadow-xs min-h-11 md:min-h-8 flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <span>Explore {activeZoneObj.label}</span>
              <span className="hidden md:inline text-xs text-[#78350f]">(or press E)</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {timeOfDay === 'night'
                  ? "Night Mode: Soobin sleeping in Cat Tree · Rachel in Bed"
                  : timeOfDay === 'rainy'
                  ? "Rain Mode: Soobin running around with her yarn toy!"
                  : 'Walk Rachel near an "Explore me!" spot!'}
              </span>
            </span>
          )}

          <span className="text-[#f5d0fe] text-[10px] hidden sm:inline">
            WASD / Arrow Keys or Click Floor to Move
          </span>
        </div>}
      </div>

      {/* Mobile D-Pad */}
      <div className="flex items-center justify-between w-full max-w-xl mt-3 px-2 md:hidden">
        <div className="relative w-36 h-36 bg-[#5a3014] rounded-full p-2 border-2 border-[#8c5028] shadow-md flex items-center justify-center">
          <button
            onClick={() => handleDPadPress('up')}
            className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-11 bg-[#8c5028] active:bg-[#d59f63] text-white rounded text-xs font-bold"
            aria-label="Move Up"
          >
            ▲
          </button>
          <button
            onClick={() => handleDPadPress('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#8c5028] active:bg-[#d59f63] text-white rounded text-xs font-bold"
            aria-label="Move Left"
          >
            ◀
          </button>
          <button
            onClick={() => handleDPadPress('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#8c5028] active:bg-[#d59f63] text-white rounded text-xs font-bold"
            aria-label="Move Right"
          >
            ▶
          </button>
          <button
            onClick={() => handleDPadPress('down')}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 bg-[#8c5028] active:bg-[#d59f63] text-white rounded text-xs font-bold"
            aria-label="Move Down"
          >
            ▼
          </button>
          <div className="w-5 h-5 rounded-full bg-[#381a07]" />
        </div>

        <button
          onClick={() => {
            if (activeZone) {
              if (activeZone === 'cat') {
                onPetCat();
              }
              soundEngine.playInspect();
              onInteract(activeZone);
            }
          }}
          disabled={!activeZone}
          className={`px-3 py-4 rounded-xl font-pixel text-sm uppercase tracking-wider border-2 cursor-pointer ${
            activeZone
              ? 'bg-[#d59f63] text-[#381a07] border-[#fff9f0] shadow-lg animate-bounce'
              : 'bg-[#5a3014] text-[#a88265] border-[#381a07] opacity-60'
          }`}
        >
          {activeZone ? 'Tap to explore' : 'Walk Near'}
        </button>
      </div>
    </div>
  );
};
