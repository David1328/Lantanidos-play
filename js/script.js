// Datos de los elementos (1-20). Cada elemento indica su grupo (columna) y periodo (fila).
    const elements = [
      {no:1,symbol:'H',name:'Hidrógeno',group:1,period:1},
      {no:2,symbol:'He',name:'Helio',group:18,period:1},

      {no:3,symbol:'Li',name:'Litio',group:1,period:2},
      {no:4,symbol:'Be',name:'Berilio',group:2,period:2},
      {no:5,symbol:'B',name:'Boro',group:13,period:2},
      {no:6,symbol:'C',name:'Carbono',group:14,period:2},
      {no:7,symbol:'N',name:'Nitrógeno',group:15,period:2},
      {no:8,symbol:'O',name:'Oxígeno',group:16,period:2}, // ESTE estará en blanco en la tabla y como ficha para arrastrar
      {no:9,symbol:'F',name:'Flúor',group:17,period:2},
      {no:10,symbol:'Ne',name:'Neón',group:18,period:2},

      {no:11,symbol:'Na',name:'Sodio',group:1,period:3}, // ESTE estará en blanco en la tabla y como ficha para arrastrar
      {no:12,symbol:'Mg',name:'Magnesio',group:2,period:3},
      {no:13,symbol:'Al',name:'Aluminio',group:13,period:3},
      {no:14,symbol:'Si',name:'Silicio',group:14,period:3},
      {no:15,symbol:'P',name:'Fósforo',group:15,period:3},
      {no:16,symbol:'S',name:'Azufre',group:16,period:3},
      {no:17,symbol:'Cl',name:'Cloro',group:17,period:3},
      {no:18,symbol:'Ar',name:'Argón',group:18,period:3},

      
      {no:19,symbol:'K',name:'Potasio',group:1,period:4},
      {no:20,symbol:'Ca',name:'Calcio',group:2,period:4},
      {no:21,symbol:'Sc',name:'Escandio',group:3,period:4},
      {no:22,symbol:'Ti',name:'Titanio',group:4,period:4},//Prueba
      {no:23,symbol:'V',name:'Vanadio',group:5,period:4},
      {no:24,symbol:'Cr',name:'Cromo',group:6,period:4},
      {no:25,symbol:'Mn',name:'Manganeso',group:7,period:4},
      {no:26,symbol:'Fe',name:'Hierro',group:8,period:4},
      {no:27,symbol:'Co',name:'Cobalto',group:9,period:4},
      {no:28,symbol:'Ni',name:'Niquel',group:10,period:4},
      {no:29,symbol:'Cu',name:'Cobre',group:11,period:4},
      {no:30,symbol:'Zn',name:'Zinc',group:12,period:4},
      {no:31,symbol:'Ga',name:'Galio',group:13,period:4},
      {no:32,symbol:'Ge',name:'Germanio',group:14,period:4},
      {no:33,symbol:'As',name:'Arsénico',group:15,period:4},
      {no:34,symbol:'Se',name:'Selenio',group:16,period:4},
      {no:35,symbol:'Br',name:'Bromo',group:17,period:4},
      {no:36,symbol:'Kr',name:'Kritón',group:8,period:4},



      //{no:48,symbol:'Ce',name:'Cerio',group:18,period:4},
    ]; 

    // Elementos que queremos sacar de la tabla y convertir en fichas para arrastrar
    const targets = ['Na','O','Ti'];

    const cols = 18; const rows = 9; // dimensiones de la tabla representacional

    const ptable = document.getElementById('ptable');
    const palette = document.getElementById('palette');
    const infoRight = document.getElementById('infoRight');

    // Crea una malla vacía rows x cols
    const grid = Array.from({length: rows},()=>Array(cols).fill(null));

    // Colocar los elementos en su posición (fila index = period-1, col index = group-1)
    elements.forEach(el=>{
      const r = el.period - 1;
      const c = el.group - 1;
      grid[r][c] = el;
    });

    // Función para construir la tabla en el DOM
    function renderTable(){
      ptable.innerHTML = '';
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const cell = document.createElement('div');
          cell.className = 'cell';
          // si hay elemento y NO es objetivo (Na u O) mostramos, si es objetivo lo dejamos vacío con drop
          const el = grid[r][c];
          if(!el){
            cell.classList.add('empty');
            cell.innerHTML = '<div class="drop-target placeholder" data-row="'+r+'" data-col="'+c+'" aria-label="Casilla vacía"></div>';
          } else if(targets.includes(el.symbol)){
            // dejamos hueco para el elemento objetivo
            cell.classList.add('empty');
            const dt = document.createElement('div');
            dt.className = 'drop-target';
            dt.setAttribute('data-expected', el.symbol);
            dt.setAttribute('data-row', r);
            dt.setAttribute('data-col', c);
            dt.setAttribute('aria-label', 'Colocar ' + el.name + ' aquí');
            cell.appendChild(dt);
          } else {
            // elemento normal
            cell.innerHTML = '<div class="number">'+el.no+'</div><div class="symbol">'+el.symbol+'</div><div class="label">'+el.name+'</div>';
          }

          // configurar comportamiento dragover/drop en drop-targets
          ptable.appendChild(cell);
        }
      }

      // registrar manejadores para zonas de drop
      document.querySelectorAll('.drop-target').forEach(dt=>{
        dt.addEventListener('dragover', e=>{
          e.preventDefault();
          dt.classList.add('over');
        });
        dt.addEventListener('dragleave', e=>{ dt.classList.remove('over'); });
        dt.addEventListener('drop', onDrop);
      });
    }

    // Crear la paleta con las fichas (targets)
    function renderPalette(){
      palette.innerHTML='';
      targets.forEach(sym=>{
        const el = elements.find(x=>x.symbol===sym);
        const d = document.createElement('div');
        d.className='draggable';
        d.setAttribute('draggable','true');
        d.setAttribute('data-symbol',el.symbol);
        d.innerHTML = '<div class="symbol">'+el.symbol+'</div><div class="label">'+el.name+'</div>';
        d.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', el.symbol); setTimeout(()=>d.classList.add('hidden'),0); });
        d.addEventListener('dragend', e=>{ d.classList.remove('hidden'); });
        palette.appendChild(d);
      });
    }

    // Lógica cuando sueltan una ficha
    function onDrop(e){
      e.preventDefault();
      const expected = e.currentTarget.getAttribute('data-expected');
      const symbol = e.dataTransfer.getData('text/plain');
      e.currentTarget.classList.remove('over');

      if(symbol && expected){
        if(symbol === expected){
          // colocar ficha dentro de la celda
          const wrapper = e.currentTarget.closest('.cell');
          wrapper.classList.remove('empty');
          wrapper.innerHTML = '<div class="number">'+getElementBySymbol(symbol).no+'</div><div class="symbol">'+symbol+'</div><div class="label">'+getElementBySymbol(symbol).name+'</div>';

          // eliminar la ficha de la paleta
          const tile = palette.querySelector('[data-symbol="'+symbol+'"]');
          if(tile) tile.remove();

          // actualizar panel derecho con información del elemento colocado
          mostrarInfoElemento(symbol);

          // marcar completado
          checkWin();
        } else {
          // respuesta incorrecta -> pequeño feedback
          shake(e.currentTarget);
          flashMessage('Ficha incorrecta para esta casilla');
        }
      }
    }

    function getElementBySymbol(sym){ return elements.find(x=>x.symbol===sym); }

    function shake(node){
      node.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300});
    }

    function flashMessage(text){
      const msg = document.createElement('div');
      msg.textContent = text;
      msg.style.position='fixed';msg.style.left='50%';msg.style.transform='translateX(-50%)';msg.style.bottom='24px';msg.style.padding='10px 14px';msg.style.background='rgba(11,118,239,0.95)';msg.style.color='#fff';msg.style.borderRadius='10px';msg.style.boxShadow='0 8px 20px rgba(11,37,64,0.12)';
      document.body.appendChild(msg);
      setTimeout(()=>msg.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(20px)'}],{duration:500,fill:'forwards'}).finished.then(()=>msg.remove()),900);
    }

    function checkWin(){
      if(palette.querySelectorAll('.draggable').length===0){
        flashMessage('¡Excelente! Tabla completada.');
      }
    }

    // Reiniciar el juego (reponer fichas y huecos)
    function reset(){
      // restaurar la tabla a su estado original: volver a colocar objetivos
      // reconstruimos grid con elementos originales
      // (para simplicidad usaremos la definición inicial)
      // re-render
      renderTable(); renderPalette();
      // limpiar panel derecho
      infoRight.innerHTML = '<h2>Información del elemento</h2><p>Selecciona o coloca correctamente un elemento en la tabla para ver su información aquí.</p>';
    }

    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('showAnswer').addEventListener('click', ()=>{
      // colocar respuestas automáticamente
      document.querySelectorAll('.drop-target').forEach(dt=>{
        const expected = dt.getAttribute('data-expected');
        if(expected){
          const wrapper = dt.closest('.cell');
          wrapper.classList.remove('empty');
          wrapper.innerHTML = '<div class="number">'+getElementBySymbol(expected).no+'</div><div class="symbol">'+expected+'</div><div class="label">'+getElementBySymbol(expected).name+'</div>';
          // Actualizar panel derecho con la última respuesta colocada (puede llamarse varias veces)
          mostrarInfoElemento(expected);
        }
      });
      // limpiar paleta
      palette.innerHTML='';
      checkWin();
    });

    // Inicializar
    renderTable(); renderPalette();

    // accesibilidad: permitir keyboard drag'n'drop (simple)
    // seleccionar ficha con Enter la "toma" y luego mover el foco a la casilla y presionar Enter para soltar
    let picked = null;
    palette.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && e.target.classList.contains('draggable')){
        picked = e.target.getAttribute('data-symbol');
        e.target.style.outline='3px solid rgba(11,118,239,0.25)';
        flashMessage('Ficha '+picked+' seleccionada. Presiona Enter sobre la casilla objetivo para colocar.');
      }
    });
    ptable.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && picked){
        const dt = e.target.querySelector('.drop-target') || e.target;
        if(dt && dt.getAttribute && dt.getAttribute('data-expected')){
          const expected = dt.getAttribute('data-expected');
          if(picked === expected){
            const wrapper = dt.closest('.cell');
            wrapper.classList.remove('empty');
            wrapper.innerHTML = '<div class="number">'+getElementBySymbol(picked).no+'</div><div class="symbol">'+picked+'</div><div class="label">'+getElementBySymbol(picked).name+'</div>';
            const tile = palette.querySelector('[data-symbol="'+picked+'"]'); if(tile) tile.remove();
            picked = null; flashMessage('Colocado con teclado.'); checkWin();

            // actualizar panel derecho cuando se coloca con teclado
            mostrarInfoElemento(expected);
          } else { flashMessage('No corresponde aquí.'); }
        }
      }
    });

    // ----------------------------
    // Mostrar información lateral
    // ----------------------------
    function mostrarInfoElemento(symbol){
      const el = getElementBySymbol(symbol);
      if(!el) return;
      // Opcional: descripciones cortas según elemento (puedes ampliar)
      const descriptions = {
        'Na': 'El sodio (Na) es un metal alcalino, blando y muy reactivo, especialmente con el agua. Es esencial en procesos biológicos y se encuentra en la sal de mesa.',
        'O': 'El oxígeno (O) es un no metal gaseoso, esencial para la respiración y la combustión. Forma aproximadamente el 21% de la atmósfera terrestre.',
        'Ti': 'Su madre me la pela'
      };
      const descripcion = descriptions[symbol] || '';

      infoRight.innerHTML = '<h2>'+el.name+' ('+symbol+')</h2>' +
                            '<p><strong>Número:</strong> '+el.no+'</p>' +
                            '<p><strong>Grupo:</strong> '+el.group+' — Período: '+el.period+'</p>' +
                            '<p>'+descripcion+'</p>';
    }
