const presetsUrl = './presets.json';
let presets = [];
const presetSelect = document.getElementById('presetSelect');
const keyboardContainer = document.getElementById('keyboardContainer');
const bgPreset = document.getElementById('bgPreset');
const bgColorPicker = document.getElementById('bgColorPicker');
const scaleS = document.getElementById('scale');
const showLabels = document.getElementById('showLabels');
const addKeyMode = document.getElementById('addKeyMode');
const clearCustomBtn = document.getElementById('clearCustom');
const customRow = document.getElementById('customRow');
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
      key.addEventListener('mousedown', (e)=>handleKeyClick(e, key));
      r.appendChild(key);
    });
    kb.appendChild(r);
  });
  keyboardContainer.appendChild(kb);
}

function toggleKey(keyEl){ keyEl.classList.toggle('active') }

function handleKeyClick(e, key){
  e.preventDefault();
  toggleKey(key);
  if(addKeyMode && addKeyMode.checked){
    const label = key.querySelector('.label') ? key.querySelector('.label').textContent : key.dataset.code;
    addKeyToCustomRow(key.dataset.code, label);
  }
}

function addKeyToCustomRow(code, label){
  const el = document.createElement('div');
  el.className = 'custom-key';
  el.dataset.code = code;
  el.textContent = label;
  el.title = code;
  el.addEventListener('click', ()=>el.remove());
  customRow.appendChild(el);
}

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
  bgPreset.addEventListener('change', (e)=>{
    document.documentElement.style.setProperty('--bg-color', e.target.value);
    if(bgColorPicker) bgColorPicker.value = e.target.value;
  });

  if(bgColorPicker){
    const initialBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    try{ bgColorPicker.value = initialBg }catch(e){}
    bgColorPicker.addEventListener('input', (e)=>{
      document.documentElement.style.setProperty('--bg-color', e.target.value);
      Array.from(bgPreset.options).forEach(o=>o.selected = o.value === e.target.value);
    });
  }

  scaleS.addEventListener('input', (e)=>document.documentElement.style.setProperty('--scale', e.target.value));
  showLabels.addEventListener('change', (e)=>{
    document.getElementById('keyboardContainer').classList.toggle('hide-labels', !e.target.checked);
  });

  if(clearCustomBtn){
    clearCustomBtn.addEventListener('click', ()=> customRow.innerHTML = '');
  }

  downloadPresetBtn.addEventListener('click', ()=>{
    const id = presetSelect.value; const p = presets.find(x=>x.id===id); if(!p) return;
    const blob = new Blob([JSON.stringify(p, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${p.id}.json`; a.click();
  });
}

init().catch(err=>console.error(err));