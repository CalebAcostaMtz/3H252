// Lógica del juego Numpuz (rompecabezas deslizante)
const size = 4; // 4x4
let tiles = [];
let moves = 0;
let timer = null;
let seconds = 0;
let emptyIndex = -1;

const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const volSlider = document.getElementById('vol');
const muteBtn = document.getElementById('muteBtn');
const bgAudio = document.getElementById('bgAudio');

// Lista de pistas disponibles
const playlist = [
  'assets/music.mp3',
  'assets/music2.mp3',
  'assets/music3.mp3'
];
let currentTrackIndex = 0;

function shuffleArray(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function playCurrent(){
  bgAudio.src = playlist[currentTrackIndex];
  bgAudio.play().catch(()=>{});
}

bgAudio.addEventListener('ended', ()=>{
  currentTrackIndex++;
  if(currentTrackIndex >= playlist.length){
    // volver a mezclar para nuevo orden aleatorio continuo
    shuffleArray(playlist);
    currentTrackIndex = 0;
  }
  playCurrent();
});

function formatTime(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const ss = (s%60).toString().padStart(2,'0');
  return `${m}:${ss}`;
}

function createSolved(){
  const arr = [];
  for(let i=1;i<size*size;i++) arr.push(i);
  arr.push(null);
  return arr;
}

function render(){
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${size},1fr)`;
  tiles.forEach((v, i)=>{
    const el = document.createElement('div');
    el.className = 'tile' + (v===null? ' blank':'');
    el.textContent = v===null? '': v;
    el.dataset.index = i;
    if(v!==null) el.addEventListener('click', onTileClick);
    boardEl.appendChild(el);
  });
}

function onTileClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(canMove(idx)){
    moveTile(idx);
  }
}

function pos(row,col){return row*size+col}
function rowCol(index){return {r:Math.floor(index/size), c:index%size}}

function canMove(index){
  const a = rowCol(index), b = rowCol(emptyIndex);
  const man = Math.abs(a.r-b.r) + Math.abs(a.c-b.c);
  return man===1;
}

function moveTile(index){
  [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
  emptyIndex = index;
  moves++;
  movesEl.textContent = moves;
  render();
  if(checkWin()) onWin();
}

function checkWin(){
  for(let i=0;i<tiles.length-1;i++) if(tiles[i] !== i+1) return false;
  return tiles[tiles.length-1] === null;
}

function onWin(){
  clearInterval(timer); timer = null;
  setTimeout(()=>{alert(`¡Felicidades! Resuelto en ${moves} movimientos y ${formatTime(seconds)}.`);},100);
}

// --- Mezclar asegurando solvable ---
function shuffleUntilSolvable(){
  let arr;
  do{
    arr = createSolved().slice(0, -1);
    // Fisher-Yates
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    arr.push(null);
  }while(!isSolvable(arr));
  return arr;
}

function getInversions(array){
  const a = array.filter(x=>x!==null);
  let inv=0;
  for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]>a[j])inv++;
  return inv;
}

function isSolvable(arr){
  const inv = getInversions(arr);
  const blankRowFromBottom = size - Math.floor(arr.indexOf(null)/size);
  if(size%2===1){
    return inv%2===0;
  } else {
    if(blankRowFromBottom%2===0) return inv%2===1;
    else return inv%2===0;
  }
}

function startGame(){
  tiles = shuffleUntilSolvable();
  emptyIndex = tiles.indexOf(null);
  moves = 0; movesEl.textContent = moves;
  seconds = 0; timeEl.textContent = formatTime(seconds);
  render();
  if(timer) clearInterval(timer);
  timer = setInterval(()=>{seconds++; timeEl.textContent = formatTime(seconds);},1000);
  // reproducir música en orden aleatorio
  shuffleArray(playlist);
  currentTrackIndex = 0;
  playCurrent();
}

startBtn.addEventListener('click', startGame);

volSlider.addEventListener('input', e=>{
  bgAudio.volume = Number(e.target.value);
});

muteBtn.addEventListener('click', ()=>{
  if(bgAudio.muted){
    bgAudio.muted = false; muteBtn.textContent = 'Sonido';
  } else { bgAudio.muted = true; muteBtn.textContent = 'Silenciar'; }
});

// Inicialización: tablero resuelto hasta que el usuario inicia juego
tiles = createSolved();
emptyIndex = tiles.indexOf(null);
render();
bgAudio.volume = Number(volSlider.value);
