const presetsUrl = './presets.json';
let presets = [];
const presetSelect = document.getElementById('presetSelect');
const keyboardContainer = document.getElementById('keyboardContainer');
const bgPreset = document.getElementById('bgPreset');
const scaleS = document.getElementById('scale');
const showLabels = document.getElementById('showLabels');
const downloadPresetBtn = document.getElementById('downloadPreset');

async function init(){
  const res = await fetch(presetsUrl);
  presets = await res.json();
  populatePresets();
  loadPreset(presets[0].id);
  attachListeners();
}

function populatePresets(){
  presets.forEach(p=>{
    const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.name; presetSelect.appendChild(opt);
  })
}

function clearKeyboard(){ keyboardContainer.innerHTML = '' }

function loadPreset(id){
  const p = presets.find(x=>x.id===id); if(!p) return;
  clearKeyboard();
  keyboardContainer.className = p.className ? p.className : '';

  const kb = document.createElement('div'); kb.className = 'keyboard';
  p.rows.forEach(row=>{
    const r = document.createElement('div'); r.className='row';
    row.forEach(k=>{
      const key = document.createElement('div'); key.className='key';
      if(k.w) key.setAttribute('data-w', String(k.w));
      key.dataset.code = k.code;
      key.innerHTML = `<span class="label">${k.label}</span><span class="code">${k.code}</span>`;
      key.addEventListener('mousedown', ()=>toggleKey(key));
      r.appendChild(key);
    });
    kb.appendChild(r);
  });
  keyboardContainer.appendChild(kb);
}

function toggleKey(keyEl){ keyEl.classList.toggle('active') }

function handleKeyDown(e){
  const code = e.code;
  const el = keyboardContainer.querySelector(`.key[data-code="${code}"]`);
  if(el) el.classList.add('active');
}
function handleKeyUp(e){
  const code = e.code;
  const el = keyboardContainer.querySelector(`.key[data-code="${code}"]`);
  if(el) el.classList.remove('active');
}

function attachListeners(){
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  presetSelect.addEventListener('change', (e)=>loadPreset(e.target.value));
  bgPreset.addEventListener('change', (e)=>document.documentElement.style.setProperty('--bg-color', e.target.value));
  scaleS.addEventListener('input', (e)=>document.documentElement.style.setProperty('--scale', e.target.value));
  showLabels.addEventListener('change', (e)=>{
    document.getElementById('keyboardContainer').classList.toggle('hide-labels', !e.target.checked);
  });
  downloadPresetBtn.addEventListener('click', ()=>{
    const id = presetSelect.value; const p = presets.find(x=>x.id===id); if(!p) return;
    const blob = new Blob([JSON.stringify(p, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${p.id}.json`; a.click();
  });
}

init().catch(err=>console.error(err));