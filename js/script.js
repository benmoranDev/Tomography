(function(){

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- generation data ---------- */
    var gens = [
        {
            title:"1ª geração — Pencil beam",
            year:"1972",
            mode:"translate",
            movementLabel:"Translação-rotação",
            detLabel:"1 detector · feixe 3×13 mm · 160 feixes/projeção",
            time:"≈ 5 min/corte · +1h/exame",
            detCount:1,
            fanSpread:0,
            speed:1.1,
            desc:"Apresentado por Godfrey Hounsfield em 1972, usava um feixe de radiação muito estreito — cerca de 3 × 13 mm — que fazia uma varredura linear coletando dados de 160 feixes distintos. Terminada a varredura, o tubo girava 1° e uma nova varredura começava; o processo se repetia 180 vezes, até completar 180 projeções com 160 feixes cada. O tempo de aquisição de um corte era de aproximadamente 5 minutos, e um estudo completo podia levar mais de uma hora.",
            diff:"Ponto de partida: 1 tubo + 1 detector deslizando juntos em linha reta, coletando 160 feixes por passada, repetindo por 180 projeções a cada 1° de rotação."
        },
        {
            title:"2ª geração — Fan beam estreito",
            year:"1974",
            mode:"translate",
            movementLabel:"Translação-rotação",
            detLabel:"20–40 detectores (leque estreito)",
            time:"< 1 min/corte",
            detCount:6,
            fanSpread:18,
            speed:1.6,
            desc:"Trouxe como inovação a aquisição a partir de um conjunto de detectores — entre 20 e 40, dependendo do fabricante —, com o feixe passando a ser laminar, em forma de leque, cobrindo todo esse conjunto. O princípio ainda era o da 1ª geração: múltiplas projeções defasadas por cerca de 1° de rotação, até completar 180 projeções. O tempo de aquisição caiu para menos de 1 minuto por corte. Hoje esses equipamentos estão proibidos de operar, por apresentarem taxas de dose incompatíveis com os níveis atualmente admissíveis.",
            diff:"Ainda translação-rotação, como a 1ª geração — mas agora de 20 a 40 detectores captam um leque de raios ao mesmo tempo, reduzindo o tempo de aquisição para menos de 1 minuto por corte."
        },
        {
            title:"3ª geração — Rotação-rotação",
            year:"1976",
            mode:"rotate",
            movementLabel:"Rotação-rotação",
            detLabel:"≈ 600 detectores",
            time:"2–5 s/corte · proc. 5–40 s",
            detCount:24,
            fanSpread:50,
            speed:2.4,
            desc:"Eliminou a varredura linear: o tubo deixou de avançar grau a grau e passou a girar continuamente enquanto os dados eram coletados. Um conjunto de aproximadamente 600 detectores, suficiente para captar um feixe largo de radiação, girava em sincronia com o tubo, reduzindo o tempo de aquisição para 2 a 5 segundos por imagem — com processamento computacional entre 5 e 40 segundos. Ainda hoje ocupa grande parte dos serviços de diagnóstico por imagem, embora venha sendo gradualmente substituída pelos tomógrafos helicoidais.",
            diff:"Grande virada: acabou o zigue-zague. Agora é rotação contínua de 360°, com tubo e ≈600 detectores presos um ao outro, cortando o tempo de aquisição para 2–5 segundos."
        },
        {
            title:"4ª geração — Rotação-fixo",
            year:"1978",
            mode:"rotate4",
            movementLabel:"Rotação-fixo",
            detLabel:"Anel completo (360°) · slip-ring",
            time:"poucas unidades produzidas",
            detCount:48,
            fanSpread:0,
            speed:2.2,
            desc:"Distribuiu os detectores por todo o anel do gantry — 360° completos — e introduziu a tecnologia slip-ring: um anel de ligas especiais que fornece tensão ao anodo e ao catodo do tubo sem conexão de cabos, com um sistema de escovas transmitindo as informações ajustadas pelo operador. Sem cabos, o tubo pôde girar continuamente numa única direção, agilizando aquisição e processamento, com detectores mais estáveis. Mas o alto custo inviabilizou a produção em larga escala, e poucas unidades desta geração chegaram a ser comercializadas.",
            diff:"Inverte a lógica da 3ª geração: os detectores param de girar e ocupam todo o anel (360°, contorno tracejado). A grande herança é o slip-ring — ele é o que torna possível a rotação contínua da geração seguinte."
        },
        {
            title:"5ª geração — Feixe de elétrons (EBCT)",
            year:"1983",
            mode:"ebct",
            movementLabel:"Sem partes móveis",
            detLabel:"Anel fixo de detectores",
            time:"≈ 50 ms/corte",
            detCount:22,
            fanSpread:0,
            speed:5,
            desc:"Nenhuma peça mecânica se move. Um feixe de elétrons é direcionado eletromagneticamente contra anéis semicirculares de tungstênio, gerando raios-X quase instantaneamente. Foi criada para capturar imagens do coração em batimento, sem borrão de movimento.",
            diff:"Salto conceitual: não existe mais tubo físico girando. O ponto amarelo que 'varre' o arco inferior é um feixe de elétrons desviado eletronicamente — por isso é tão mais rápido que todas as gerações anteriores."
        },
        {
            title:"Tomografia helicoidal (espiral)",
            year:"1989",
            mode:"helical",
            movementLabel:"Rotação contínua + mesa",
            detLabel:"Anel + slip-ring (herdado da 4ª ger.)",
            time:"crânio < 20 s · revolução ≈ 1 s",
            detCount:24,
            fanSpread:50,
            speed:2.6,
            desc:"Sucedeu o equipamento de 4ª geração associando o slip-ring ao deslocamento contínuo e simultâneo da mesa. Os cortes deixam de ser planos e passam a ter forma de hélice — a aquisição se assemelha a um modelo espiral. Sistemas computacionais mais potentes trouxeram agilidade: um exame de crânio, que levava cerca de 3 minutos numa 3ª geração, passou a ser feito em menos de 20 segundos. Introduziu três conceitos centrais — revolução, pitch e interpolação — detalhados logo abaixo da linha do tempo.",
            diff:"Visualmente é a mesma rotação contínua da 3ª geração — mas repare na mesa deslizando sem parar. Rotação + avanço contínuo da mesa é o que desenha a espiral, e é a base dos conceitos de revolução e pitch explicados a seguir."
        },
        {
            title:"Multislice / multidetector (MSCT)",
            year:"1998",
            mode:"multislice",
            movementLabel:"Rotação contínua + mesa",
            detLabel:"4–12 cortes/revolução (detectores pareados)",
            time:"revolução até 0,5 s (sub-second)",
            detCount:24,
            fanSpread:56,
            speed:2.8,
            desc:"Evoluiu graças ao slip-ring, a tubos de raios-X mais potentes e a sistemas computacionais mais modernos. Os detectores passaram a ser pareados em várias coroas, permitindo a aquisição simultânea de vários cortes por revolução — os primeiros modelos ofereciam de 4 a 12 cortes por revolução. As coroas podem ter espessuras de 0,5 a 10 mm; cortes sub-milimétricos (tecnologia sub-millimeter) permitem reformatações vasculares e 3D de alta resolução. Alguns equipamentos giram em até 0,5 segundo por revolução (sub-second), o que viabilizou a sincronização cardíaca (gating) e o manuseio de imagens em tempo real. Ajuste a fileira de detectores no controle abaixo e veja o efeito.",
            diff:"A diferença agora é de espessura, não de movimento: a faixa de detectores fica mais grossa conforme você arrasta o controle abaixo — cada fileira pareada extra é um corte a mais coletado por revolução, com opções sub-milimétricas."
        },
        {
            title:"Atual — Dual-source & photon-counting",
            year:"2005–hoje",
            mode:"dual",
            movementLabel:"Dois tubos em rotação",
            detLabel:"2 tubos · 2 detectores · 90°",
            time:"2× mais rápida · frações de segundo",
            detCount:16,
            fanSpread:40,
            speed:2.6,
            desc:"Introduzida comercialmente em 2005, a TC de fonte dupla usa dois pares tubo-detector girando juntos, a 90° um do outro, adquirindo dados duas vezes mais rápido que um scanner de fonte única. Isso tornou possível escanear o coração batendo sem reduzir artificialmente o ritmo cardíaco do paciente, na maioria dos casos. Quando os dois tubos operam em voltagens diferentes (80 kV e 140 kV, por exemplo), o sistema realiza imagem de energia dual espectral, diferenciando tecidos, ossos e implantes com mais precisão.",
            diff:"Aparece um segundo tubo (ponto violeta), fixo a 90° do primeiro, girando junto. Dois pares tubo-detector coletando ao mesmo tempo é o que dobra a resolução temporal — veja os detalhes na seção sobre fonte dupla, logo abaixo da linha do tempo."
        }
    ];

    var current = 0;
    var angle = 0;
    var sliceRows = 4;
    var cx = 200, cy = 200;
    var ringR = 150, innerR = 118;

    var svgns = "http://www.w3.org/2000/svg";
    var tubeEl = document.getElementById('tube');
    var tube2El = document.getElementById('tube2');
    var sweepEl = document.getElementById('sweepPoint');
    var tungstenEl = document.getElementById('tungstenArc');
    var tableEl = document.getElementById('tableRect');
    var detGroup = document.getElementById('detectorsGroup');
    var beamGroup = document.getElementById('beamGroup');
    var trailGroup = document.getElementById('trailGroup');
    var trailGroup2 = document.getElementById('trailGroup2');
    var fixedRingGuide = document.getElementById('fixedRingGuide');
    var tableMotionNote = document.getElementById('tableMotionNote');

    var trailPrimary = [];
    var trailSecondary = [];
    var TRAIL_MAX = 16;

    var iconByMode = {
        translate:"\u2194 translac\u00e3o + rotac\u00e3o em passos",
        rotate:"\u27f3 rotac\u00e3o cont\u00ednua",
        rotate4:"\u27f3 tubo gira \u00b7 anel fixo",
        ebct:"\u26a1 feixe eletr\u00f4nico \u00b7 sem partes m\u00f3veis",
        helical:"\u27f3 rotac\u00e3o cont\u00ednua + mesa em movimento",
        multislice:"\u27f3 rotac\u00e3o cont\u00ednua + m\u00faltiplas fileiras",
        dual:"\u27f3 dois tubos em rotac\u00e3o conjunta"
    };

    function pushTrail(arr, x, y){
        arr.push({x:x, y:y});
        if(arr.length > TRAIL_MAX){ arr.shift(); }
    }

    function renderTrail(group, arr, color){
        clearGroup(group);
        arr.forEach(function(p, i){
            var frac = (i + 1) / arr.length;
            var op = frac * 0.4;
            var r = 1.5 + frac * 2.2;
            group.appendChild(makeDot(p.x, p.y, r, color, op));
        });
    }

    function fullCirclePath(r){
        return "M "+(cx+r)+" "+cy+" A "+r+" "+r+" 0 1 1 "+(cx-r)+" "+cy+" A "+r+" "+r+" 0 1 1 "+(cx+r)+" "+cy;
    }

    function arcPath(r, startDeg, endDeg){
        var a = polar(r, startDeg), b = polar(r, endDeg);
        return "M "+a.x+" "+a.y+" A "+r+" "+r+" 0 0 1 "+b.x+" "+b.y;
    }

    function polar(r, deg){
        var rad = (deg - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function clearGroup(g){ while(g.firstChild){ g.removeChild(g.firstChild); } }

    function makeDot(x, y, r, fill, opacity){
        var c = document.createElementNS(svgns, 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
        c.setAttribute('fill', fill);
        if(opacity !== undefined) c.setAttribute('opacity', opacity);
        return c;
    }

    function makeLine(x1,y1,x2,y2,stroke,width,opacity){
        var l = document.createElementNS(svgns,'line');
        l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',x2); l.setAttribute('y2',y2);
        l.setAttribute('stroke',stroke); l.setAttribute('stroke-width',width);
        l.setAttribute('opacity', opacity !== undefined ? opacity : 0.35);
        l.setAttribute('stroke-linecap','round');
        return l;
    }

    var fixedRing48 = [];
    for(var i=0;i<48;i++){ fixedRing48.push(i*7.5); }

    function setupGen(g){
        clearGroup(detGroup);
        clearGroup(beamGroup);
        tube2El.setAttribute('opacity', g.mode === 'dual' ? 1 : 0);
        sweepEl.setAttribute('opacity', g.mode === 'ebct' ? 1 : 0);
        tungstenEl.setAttribute('opacity', g.mode === 'ebct' ? 1 : 0);
        tubeEl.setAttribute('opacity', g.mode === 'ebct' ? 0 : 1);

        if(g.mode === 'ebct'){
            var a1 = polar(ringR, 195), a2 = polar(ringR, 345);
            tungstenEl.setAttribute('d', 'M '+a1.x+' '+a1.y+' A '+ringR+' '+ringR+' 0 0 1 '+a2.x+' '+a2.y);
            fixedRing48.forEach(function(deg){
                if(deg >= 20 && deg <= 160){
                    var p = polar(ringR, deg);
                    var dot = makeDot(p.x, p.y, 3.4, 'rgba(8,145,178,0.5)');
                    dot.dataset.angle = deg;
                    detGroup.appendChild(dot);
                }
            });
        } else if(g.mode === 'rotate4'){
            fixedRing48.forEach(function(deg){
                var p = polar(ringR, deg);
                var dot = makeDot(p.x, p.y, 3.2, 'rgba(8,145,178,0.4)');
                dot.dataset.angle = deg;
                detGroup.appendChild(dot);
            });
        }

        var sliceControl = document.getElementById('sliceControl');
        if(g.mode === 'multislice'){ sliceControl.classList.add('active'); }
        else { sliceControl.classList.remove('active'); }

        if(g.mode === 'rotate4'){
            fixedRingGuide.setAttribute('d', fullCirclePath(ringR));
            fixedRingGuide.setAttribute('opacity', 0.3);
        } else if(g.mode === 'ebct'){
            fixedRingGuide.setAttribute('d', arcPath(ringR, 20, 160));
            fixedRingGuide.setAttribute('opacity', 0.3);
        } else {
            fixedRingGuide.setAttribute('opacity', 0);
        }

        tableMotionNote.classList.toggle('active', g.mode === 'helical' || g.mode === 'multislice');

        trailPrimary = [];
        trailSecondary = [];
        clearGroup(trailGroup);
        clearGroup(trailGroup2);
        tableEl.setAttribute('x', 30);
        tableEl.style.transition = 'none';
    }

    function drawTranslate(g, ang){
        var stepAngle = 15;
        var cyclePeriod = 34;
        var cyclePos = ang % cyclePeriod;
        var stepIndex = Math.floor(ang / cyclePeriod) % 12;
        var axis = stepIndex * stepAngle;
        var t = cyclePos / cyclePeriod;
        var lateral = Math.sin(t * Math.PI * 2) * 46;

        var dir = (axis + 90) * Math.PI / 180;
        var lx = Math.cos(dir) * lateral, ly = Math.sin(dir) * lateral;

        var tubeBase = polar(ringR, axis);
        var detBase = polar(ringR, axis + 180);
        var tubePos = { x: tubeBase.x + lx, y: tubeBase.y + ly };
        var detPos = { x: detBase.x + lx, y: detBase.y + ly };

        tubeEl.setAttribute('cx', tubePos.x); tubeEl.setAttribute('cy', tubePos.y);
        pushTrail(trailPrimary, tubePos.x, tubePos.y);
        renderTrail(trailGroup, trailPrimary, '#b45309');

        clearGroup(detGroup); clearGroup(beamGroup);
        var n = Math.max(1, g.detCount);
        var half = g.fanSpread / 2;
        for(var i=0;i<n;i++){
            var frac = n === 1 ? 0 : (i/(n-1) - 0.5);
            var offAngle = frac * g.fanSpread;
            var dRad = (axis + 180 + offAngle) * Math.PI / 180;
            var dr = { x: detBase.x + lx + Math.cos((axis+180+offAngle-90)*Math.PI/180)*0, y: 0 };
            var p = polar(ringR, axis + 180 + offAngle);
            var fp = { x: p.x + lx, y: p.y + ly };
            detGroup.appendChild(makeDot(fp.x, fp.y, 3.6, '#0891b2', 0.85));
            beamGroup.appendChild(makeLine(tubePos.x, tubePos.y, fp.x, fp.y, '#0891b2', 1.1, 0.28));
        }
    }

    function drawRotate(g, ang, opts){
        opts = opts || {};
        var tubeAngle = ang % 360;
        var tubePos = polar(ringR, tubeAngle);
        tubeEl.setAttribute('cx', tubePos.x); tubeEl.setAttribute('cy', tubePos.y);
        pushTrail(trailPrimary, tubePos.x, tubePos.y);
        renderTrail(trailGroup, trailPrimary, '#b45309');

        clearGroup(detGroup); clearGroup(beamGroup);

        var n = opts.detCount !== undefined ? opts.detCount : g.detCount;
        var spread = opts.fanSpread !== undefined ? opts.fanSpread : g.fanSpread;
        var rows = opts.rows || 1;

        for(var r=0;r<rows;r++){
            var rowOffset = rows > 1 ? (r - (rows-1)/2) * 4.5 : 0;
            for(var i=0;i<n;i++){
                var frac = n === 1 ? 0 : (i/(n-1) - 0.5);
                var offAngle = frac * spread;
                var p = polar(ringR + rowOffset, tubeAngle + 180 + offAngle);
                var opacity = rows > 1 ? 0.6 : 0.85;
                detGroup.appendChild(makeDot(p.x, p.y, rows>1?2.4:3.4, '#0891b2', opacity));
                if(i % (rows>3?3:1) === 0){
                    beamGroup.appendChild(makeLine(tubePos.x, tubePos.y, p.x, p.y, '#0891b2', 1, rows>1?0.1:0.22));
                }
            }
        }

        if(opts.secondTube){
            var t2angle = (tubeAngle + 90) % 360;
            var t2pos = polar(ringR, t2angle);
            tube2El.setAttribute('cx', t2pos.x); tube2El.setAttribute('cy', t2pos.y);
            pushTrail(trailSecondary, t2pos.x, t2pos.y);
            renderTrail(trailGroup2, trailSecondary, '#6d28d9');
            var half2 = spread/2;
            for(var j=0;j<n;j++){
                var f2 = n===1?0:(j/(n-1)-0.5);
                var p2 = polar(ringR, t2angle + 180 + f2*spread);
                detGroup.appendChild(makeDot(p2.x, p2.y, 3, '#6d28d9', 0.75));
                beamGroup.appendChild(makeLine(t2pos.x, t2pos.y, p2.x, p2.y, '#6d28d9', 1, 0.2));
            }
        }

        if(opts.slideTable){
            var span = 300;
            var phase = (ang * 1.4) % (span*2);
            var tx = phase < span ? phase : span*2 - phase;
            tableEl.setAttribute('x', 30 + tx*0.02 - 3);
        }
    }

    function drawRotate4(g, ang){
        var tubeAngle = ang % 360;
        var tubePos = polar(innerR, tubeAngle);
        tubeEl.setAttribute('cx', tubePos.x); tubeEl.setAttribute('cy', tubePos.y);
        pushTrail(trailPrimary, tubePos.x, tubePos.y);
        renderTrail(trailGroup, trailPrimary, '#b45309');

        clearGroup(beamGroup);
        var target = (tubeAngle + 180) % 360;
        var kids = detGroup.children;
        for(var i=0;i<kids.length;i++){
            var d = parseFloat(kids[i].dataset.angle);
            var diff = Math.abs(((d - target + 540) % 360) - 180);
            if(diff < 22){
                kids[i].setAttribute('fill', '#b45309');
                kids[i].setAttribute('opacity', 0.95);
                var p = { x: kids[i].getAttribute('cx'), y: kids[i].getAttribute('cy') };
                beamGroup.appendChild(makeLine(tubePos.x, tubePos.y, p.x, p.y, '#b45309', 1, 0.3));
            } else {
                kids[i].setAttribute('fill', 'rgba(8,145,178,0.4)');
                kids[i].setAttribute('opacity', 0.45);
            }
        }
    }

    function drawEbct(g, ang){
        var sweepAngle = 195 + ((ang * 3.2) % 150);
        var sp = polar(ringR - 8, sweepAngle);
        sweepEl.setAttribute('cx', sp.x); sweepEl.setAttribute('cy', sp.y);
        tubeEl.setAttribute('opacity', 0);
        pushTrail(trailPrimary, sp.x, sp.y);
        renderTrail(trailGroup, trailPrimary, '#ca8a04');

        var mirrorTarget = (sweepAngle + 180) % 360;
        clearGroup(beamGroup);
        var kids = detGroup.children;
        var best = null, bestDiff = 999;
        for(var i=0;i<kids.length;i++){
            var d = parseFloat(kids[i].dataset.angle);
            var diff = Math.abs(((d - mirrorTarget + 540) % 360) - 180);
            if(diff < bestDiff){ bestDiff = diff; best = kids[i]; }
        }
        for(var j=0;j<kids.length;j++){
            kids[j].setAttribute('fill', kids[j] === best ? '#b45309' : 'rgba(8,145,178,0.4)');
            kids[j].setAttribute('opacity', kids[j] === best ? 0.95 : 0.45);
        }
        if(best){
            beamGroup.appendChild(makeLine(sp.x, sp.y, best.getAttribute('cx'), best.getAttribute('cy'), '#ca8a04', 1.1, 0.35));
        }
    }

    function drawMultislice(g, ang){
        var visualRows = Math.max(1, Math.min(9, Math.round(sliceRows/36)+1));
        drawRotate(g, ang, { detCount: g.detCount, fanSpread: g.fanSpread, rows: visualRows, slideTable: true });
    }

    function frame(){
        var g = gens[current];
        angle += g.speed * (reduceMotion ? 0.25 : 1);
        if(angle > 100000) angle = angle % 360;

        switch(g.mode){
            case 'translate': drawTranslate(g, angle); break;
            case 'rotate': drawRotate(g, angle, { slideTable:false }); break;
            case 'helical': drawRotate(g, angle, { slideTable:true }); break;
            case 'multislice': drawMultislice(g, angle); break;
            case 'rotate4': drawRotate4(g, angle); break;
            case 'ebct': drawEbct(g, angle); break;
            case 'dual': drawRotate(g, angle, { secondTube:true }); break;
        }
        requestAnimationFrame(frame);
    }

    /* ---------- UI wiring ---------- */
    var ticksWrap = document.getElementById('timelineTicks');
    var fillEl = document.getElementById('timelineFill');

    gens.forEach(function(g, idx){
        var btn = document.createElement('button');
        btn.className = 'tick-btn' + (idx === 0 ? ' active' : '');
        btn.innerHTML = '<span class="tick-dot"></span><span class="tick-year">'+g.year+'</span>';
        btn.addEventListener('click', function(){ selectGen(idx); });
        ticksWrap.appendChild(btn);
    });

    var compareBody = document.getElementById('compareBody');
    gens.forEach(function(g, idx){
        var tr = document.createElement('tr');
        tr.id = 'row-'+idx;
        tr.innerHTML =
            '<td><span class="gen-chip">'+g.title+'</span></td>'+
            '<td class="mono">'+g.year+'</td>'+
            '<td>'+g.movementLabel+'</td>'+
            '<td class="mono">'+g.detLabel+'</td>'+
            '<td class="mono">'+g.time+'</td>';
        tr.addEventListener('click', function(){
            selectGen(idx);
            document.getElementById('geracoes').scrollIntoView({behavior:'smooth', block:'start'});
        });
        compareBody.appendChild(tr);
    });

    function updateInfoPanel(){
        var g = gens[current];
        document.getElementById('infoMode').textContent = g.movementLabel;
        document.getElementById('infoYear').textContent = g.year;
        document.getElementById('infoTitle').textContent = g.title;
        document.getElementById('infoDesc').textContent = g.desc;
        document.getElementById('infoDiff').textContent = g.diff;
        document.getElementById('statDet').textContent = g.detLabel;
        document.getElementById('statTime').textContent = g.time;
        document.getElementById('movementTag').textContent = iconByMode[g.mode] || g.movementLabel;
    }

    function updateTimelineUI(){
        var ticks = ticksWrap.querySelectorAll('.tick-btn');
        ticks.forEach(function(t, i){ t.classList.toggle('active', i === current); });
        var pct = (current / (gens.length - 1)) * 100;
        fillEl.style.width = pct + '%';

        var rows = compareBody.querySelectorAll('tr');
        rows.forEach(function(r, i){ r.classList.toggle('row-active', i === current); });
    }

    function selectGen(idx){
        current = idx;
        angle = 0;
        setupGen(gens[current]);
        updateInfoPanel();
        updateTimelineUI();
    }

    var slider = document.getElementById('sliceSlider');
    slider.addEventListener('input', function(){
        sliceRows = parseInt(slider.value, 10);
        document.getElementById('sliceValue').textContent = sliceRows;
        var baseTime = 80;
        var est = Math.max(1, Math.round(baseTime / (sliceRows/4)));
        document.getElementById('sliceTimeEstimate').textContent = '≈ ' + est + 's (tórax completo)';
    });

    /* ---------- matrix resolution demo ---------- */
    var matrixPresets = [
        { n:80,  label:"80 × 80",   note:"EMI, 1971 — primeira matriz clínica" },
        { n:128, label:"128 × 128", note:"Gerações seguintes, ainda baixa definição" },
        { n:160, label:"160 × 160", note:"Ganho perceptível de detalhe" },
        { n:256, label:"256 × 256", note:"Padrão em equipamentos mais antigos" },
        { n:320, label:"320 × 320", note:"Usada em reconstruções específicas (ex. cardíacas)" },
        { n:512, label:"512 × 512", note:"Padrão de alta definição nos tomógrafos atuais" }
    ];

    var matrixCanvas = document.getElementById('matrixCanvas');
    var matrixCtx = matrixCanvas ? matrixCanvas.getContext('2d') : null;
    var matrixSlider = document.getElementById('matrixSlider');

    function drawSyntheticSlice(ctx, n){
        ctx.clearRect(0, 0, n, n);
        ctx.fillStyle = '#05070a';
        ctx.fillRect(0, 0, n, n);

        var cx = n/2, cy = n/2, r = n*0.42;
        var grad = ctx.createRadialGradient(cx, cy, r*0.1, cx, cy, r);
        grad.addColorStop(0, '#3d4a58');
        grad.addColorStop(1, '#1a2129');
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fillStyle = grad; ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx - r*0.42, cy - r*0.02, n*0.09, n*0.135, 0.3, 0, Math.PI*2);
        ctx.fillStyle = '#8a97a6'; ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx + r*0.42, cy - r*0.02, n*0.09, n*0.135, -0.3, 0, Math.PI*2);
        ctx.fillStyle = '#8a97a6'; ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy + r*0.06, n*0.05, 0, Math.PI*2);
        ctx.fillStyle = '#0b0e12'; ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy + r*0.55, n*0.045, 0, Math.PI*2);
        ctx.fillStyle = '#eef3f6'; ctx.fill();
    }

    function renderMatrix(n){
        if(!matrixCtx) return;
        var off = document.createElement('canvas');
        off.width = n; off.height = n;
        var offCtx = off.getContext('2d');
        drawSyntheticSlice(offCtx, n);

        matrixCtx.imageSmoothingEnabled = false;
        matrixCtx.clearRect(0, 0, 512, 512);
        matrixCtx.drawImage(off, 0, 0, n, n, 0, 0, 512, 512);

        if(n <= 160){
            matrixCtx.strokeStyle = 'rgba(8,11,17,0.55)';
            matrixCtx.lineWidth = 1;
            var step = 512 / n;
            for(var i=1;i<n;i++){
                var pos = Math.round(i*step) + 0.5;
                matrixCtx.beginPath(); matrixCtx.moveTo(pos,0); matrixCtx.lineTo(pos,512); matrixCtx.stroke();
                matrixCtx.beginPath(); matrixCtx.moveTo(0,pos); matrixCtx.lineTo(512,pos); matrixCtx.stroke();
            }
        }
    }

    function updateMatrixReadout(preset){
        document.getElementById('matrixValue').textContent = preset.label;
        document.getElementById('matrixNote').textContent = preset.note;
        document.getElementById('matrixModeTag').textContent = preset.label;
        document.getElementById('matrixPixelCount').textContent = (preset.n*preset.n).toLocaleString('pt-BR');
        var pixelSize = 400 / preset.n;
        document.getElementById('matrixPixelSize').textContent = '≈ ' + pixelSize.toFixed(2).replace('.',',') + ' mm';
    }

    function selectMatrix(idx){
        var preset = matrixPresets[idx];
        renderMatrix(preset.n);
        updateMatrixReadout(preset);
    }

    if(matrixSlider){
        matrixSlider.addEventListener('input', function(){
            selectMatrix(parseInt(matrixSlider.value, 10));
        });
        selectMatrix(0);
    }

    /* ---------- pitch calculator ---------- */
    var pitchThicknessEl = document.getElementById('pitchThickness');
    var pitchRatioEl = document.getElementById('pitchRatio');
    var pitchCountEl = document.getElementById('pitchCount');

    function formatPitchNum(n){
        var s = n.toFixed(1);
        if(s.slice(-2) === '.0'){ s = s.slice(0, -2); }
        return s.replace('.', ',');
    }

    function updatePitch(){
        if(!pitchThicknessEl) return;
        var thickness = parseInt(pitchThicknessEl.value, 10);
        var pitch = parseInt(pitchRatioEl.value, 10) / 10;
        var count = parseInt(pitchCountEl.value, 10);

        var displacement = pitch * thickness;
        var revolutions = count / pitch;
        var totalTime = revolutions * 1;

        document.getElementById('pitchThicknessVal').textContent = thickness + ' mm';
        document.getElementById('pitchRatioVal').textContent = formatPitchNum(pitch) + ' : 1';
        document.getElementById('pitchCountVal').textContent = count;
        document.getElementById('pitchDisplacement').textContent = formatPitchNum(displacement) + ' mm';
        document.getElementById('pitchTime').textContent = '≈ ' + formatPitchNum(totalTime) + ' s';

        var note = document.getElementById('pitchNote');
        if(pitch < 1){
            note.textContent = 'Pitch abaixo de 1:1 — a mesa avança menos que a espessura de corte por revolução, aumentando a dose e a sobreposição entre cortes.';
        } else if(pitch === 1){
            note.textContent = 'Pitch 1:1 — a mesa se desloca na mesma proporção da espessura de corte a cada revolução.';
        } else {
            note.textContent = 'Pitch acima de 1:1 — o exame fica mais rápido, mas a dose por corte cai, aumentando o ruído da imagem.';
        }
    }

    [pitchThicknessEl, pitchRatioEl, pitchCountEl].forEach(function(el){
        if(el) el.addEventListener('input', updatePitch);
    });
    updatePitch();

    /* ---------- scroll reveal ---------- */
    var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting){ e.target.classList.add('is-visible'); }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

    /* ---------- hero scan animation ---------- */
    var heroVisual = document.getElementById('heroVisual');
    var heroTube = document.getElementById('heroTube');
    var heroDetGroup = document.getElementById('heroDetGroup');
    var heroBeamGroup = document.getElementById('heroBeamGroup');
    var heroTrailGroup = document.getElementById('heroTrailGroup');

    if(heroVisual && heroTube){
        var heroAngle = 0;
        var heroTilt = 0;
        var heroTargetTilt = 0;
        var heroHover = false;
        var heroTrail = [];
        var HERO_R = 150;
        var HERO_TRAIL_MAX = 14;

        heroVisual.addEventListener('mousemove', function(e){
            var rect = heroVisual.getBoundingClientRect();
            var relX = (e.clientX - rect.left) / rect.width;
            heroTargetTilt = Math.max(-1, Math.min(1, (relX - 0.5) * 2));
        });
        heroVisual.addEventListener('mouseenter', function(){ heroHover = true; });
        heroVisual.addEventListener('mouseleave', function(){ heroHover = false; heroTargetTilt = 0; });
        heroVisual.addEventListener('touchmove', function(e){
            if(!e.touches || !e.touches[0]) return;
            var rect = heroVisual.getBoundingClientRect();
            var relX = (e.touches[0].clientX - rect.left) / rect.width;
            heroTargetTilt = Math.max(-1, Math.min(1, (relX - 0.5) * 2));
        }, { passive: true });

        function heroFrame(){
            heroTilt += (heroTargetTilt - heroTilt) * 0.06;
            var speed = (heroHover ? 0.55 : 0.32) * (reduceMotion ? 0.3 : 1);
            heroAngle += speed;
            if(heroAngle > 100000){ heroAngle = heroAngle % 360; }

            var tubeAngle = heroAngle + heroTilt * 22;
            var tubePos = polar(HERO_R, tubeAngle);
            heroTube.setAttribute('cx', tubePos.x);
            heroTube.setAttribute('cy', tubePos.y);

            heroTrail.push({ x: tubePos.x, y: tubePos.y });
            if(heroTrail.length > HERO_TRAIL_MAX){ heroTrail.shift(); }
            clearGroup(heroTrailGroup);
            heroTrail.forEach(function(p, i){
                var frac = (i + 1) / heroTrail.length;
                heroTrailGroup.appendChild(makeDot(p.x, p.y, 1.4 + frac * 2, '#b45309', frac * 0.3));
            });

            clearGroup(heroDetGroup);
            clearGroup(heroBeamGroup);
            var detCount = 9, spread = 44;
            for(var i = 0; i < detCount; i++){
                var frac2 = detCount === 1 ? 0 : (i / (detCount - 1) - 0.5);
                var p = polar(HERO_R, tubeAngle + 180 + frac2 * spread);
                heroDetGroup.appendChild(makeDot(p.x, p.y, 3, '#0891b2', 0.65));
                heroBeamGroup.appendChild(makeLine(tubePos.x, tubePos.y, p.x, p.y, '#0891b2', 1, 0.13));
            }

            requestAnimationFrame(heroFrame);
        }
        requestAnimationFrame(heroFrame);
    }

    /* ---------- contrast volume calculator ---------- */
    var contrastWeightSlider = document.getElementById('contrastWeightSlider');
    if(contrastWeightSlider){
        contrastWeightSlider.addEventListener('input', function(){
            var kg = parseInt(contrastWeightSlider.value, 10);
            document.getElementById('contrastWeightVal').textContent = kg + ' kg';
            document.getElementById('contrastVol1').textContent = (kg * 1) + ' ml';
            document.getElementById('contrastVol2').textContent = (kg * 2) + ' ml';
        });
        contrastWeightSlider.dispatchEvent(new Event('input'));
    }

    /* ---------- FOV / pixel size calculator ---------- */
    var fovCalcSlider = document.getElementById('fovCalcSlider');
    var fovMatrixSlider = document.getElementById('fovMatrixSlider');

    function updateFovCalc(){
        if(!fovCalcSlider) return;
        var fovCm = parseInt(fovCalcSlider.value, 10);
        var preset = matrixPresets[parseInt(fovMatrixSlider.value, 10)];
        var pixelMm = (fovCm * 10) / preset.n;

        document.getElementById('fovCalcVal').textContent = fovCm + ' cm';
        document.getElementById('fovMatrixVal').textContent = preset.label;
        document.getElementById('fovPixelSize').textContent = pixelMm.toFixed(2).replace('.', ',') + ' mm';
    }

    if(fovCalcSlider){
        fovCalcSlider.addEventListener('input', updateFovCalc);
        fovMatrixSlider.addEventListener('input', updateFovCalc);
        document.querySelectorAll('.window-preset-row [data-fov]').forEach(function(btn){
            btn.addEventListener('click', function(){
                fovCalcSlider.value = btn.getAttribute('data-fov');
                updateFovCalc();
            });
        });
        updateFovCalc();
    }

    /* ---------- hounsfield explorer ---------- */
    var huTissues = [
        { min: 300, max: 1000, name: "Osso denso / cortical" },
        { min: 100, max: 299,  name: "Osso normal" },
        { min: 55,  max: 99,   name: "Fígado" },
        { min: 45,  max: 54,   name: "Pâncreas" },
        { min: 30,  max: 44,   name: "Parênquima cerebral" },
        { min: 10,  max: 29,   name: "Músculo" },
        { min: -5,  max: 9,    name: "Água" },
        { min: -80, max: -6,   name: "Gordura" },
        { min: -800,max: -81,  name: "Pulmão" },
        { min: -1000,max: -801,name: "Ar" }
    ];

    function tissueForHU(hu){
        for(var i=0;i<huTissues.length;i++){
            if(hu >= huTissues[i].min && hu <= huTissues[i].max){ return huTissues[i].name; }
        }
        return "—";
    }

    var huSlider = document.getElementById('huSlider');
    if(huSlider){
        huSlider.addEventListener('input', function(){
            var hu = parseInt(huSlider.value, 10);
            var gray = Math.round(((hu + 1000) / 2000) * 255);
            document.getElementById('huValue').textContent = hu + ' HU';
            document.getElementById('huTissue').textContent = tissueForHU(hu);
            document.getElementById('huSwatch').style.background = 'rgb(' + gray + ',' + gray + ',' + gray + ')';
        });
        huSlider.dispatchEvent(new Event('input'));
    }

    /* ---------- window level / width demo ---------- */
    var windowCanvas = document.getElementById('windowCanvas');
    var windowCtx = windowCanvas ? windowCanvas.getContext('2d') : null;
    var wlSlider = document.getElementById('wlSlider');
    var wwSlider = document.getElementById('wwSlider');

    function huToGray(hu, wl, ww){
        var lo = wl - ww / 2;
        var g = Math.round((255 * (hu - lo)) / ww);
        if(g < 0){ g = 0; }
        if(g > 255){ g = 255; }
        return g;
    }

    function drawWindowedSlice(ctx, n, wl, ww){
        ctx.clearRect(0, 0, n, n);
        var cx = n/2, cy = n/2, r = n*0.42;

        var bg = huToGray(-1000, wl, ww);
        ctx.fillStyle = 'rgb(' + bg + ',' + bg + ',' + bg + ')';
        ctx.fillRect(0, 0, n, n);

        var bodyG = huToGray(40, wl, ww);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fillStyle = 'rgb(' + bodyG + ',' + bodyG + ',' + bodyG + ')'; ctx.fill();

        var organG = huToGray(60, wl, ww);
        ctx.fillStyle = 'rgb(' + organG + ',' + organG + ',' + organG + ')';
        ctx.beginPath(); ctx.ellipse(cx - r*0.42, cy - r*0.02, n*0.09, n*0.135, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + r*0.42, cy - r*0.02, n*0.09, n*0.135, -0.3, 0, Math.PI*2); ctx.fill();

        var fatG = huToGray(-60, wl, ww);
        ctx.beginPath(); ctx.arc(cx, cy + r*0.06, n*0.05, 0, Math.PI*2);
        ctx.fillStyle = 'rgb(' + fatG + ',' + fatG + ',' + fatG + ')'; ctx.fill();

        var boneG = huToGray(500, wl, ww);
        ctx.beginPath(); ctx.arc(cx, cy + r*0.55, n*0.045, 0, Math.PI*2);
        ctx.fillStyle = 'rgb(' + boneG + ',' + boneG + ',' + boneG + ')'; ctx.fill();
    }

    function renderWindow(){
        if(!windowCtx) return;
        var wl = parseInt(wlSlider.value, 10);
        var ww = parseInt(wwSlider.value, 10);
        document.getElementById('wlVal').textContent = wl + ' HU';
        document.getElementById('wwVal').textContent = ww + ' HU';

        var off = document.createElement('canvas');
        off.width = 256; off.height = 256;
        drawWindowedSlice(off.getContext('2d'), 256, wl, ww);

        windowCtx.imageSmoothingEnabled = true;
        windowCtx.clearRect(0, 0, 512, 512);
        windowCtx.drawImage(off, 0, 0, 256, 256, 0, 0, 512, 512);
    }

    if(windowCtx){
        wlSlider.addEventListener('input', renderWindow);
        wwSlider.addEventListener('input', renderWindow);
        document.getElementById('presetClosed').addEventListener('click', function(){
            wwSlider.value = 80; renderWindow();
        });
        document.getElementById('presetOpen').addEventListener('click', function(){
            wwSlider.value = 1500; renderWindow();
        });
        renderWindow();
    }

    /* ---------- navbar: active section on scroll ---------- */
    (function(){
        var navLinks = Array.prototype.slice.call(
            document.querySelectorAll('.navbar-nav a.nav-link[href^="#"], .navbar-nav a.dropdown-item[href^="#"]')
        );
        if(!navLinks.length) return;

        var linksById = {};
        navLinks.forEach(function(a){
            var id = a.getAttribute('href').slice(1);
            if(!linksById[id]) linksById[id] = [];
            linksById[id].push(a);
        });

        function clearActive(){
            document.querySelectorAll('.navbar-nav .active').forEach(function(el){
                el.classList.remove('active');
            });
        }

        function setActive(id){
            clearActive();
            var links = linksById[id];
            if(!links) return;
            links.forEach(function(a){
                a.classList.add('active');
                var dropdownMenu = a.closest('.dropdown-menu');
                if(dropdownMenu){
                    var toggle = dropdownMenu.previousElementSibling;
                    if(toggle && toggle.classList.contains('dropdown-toggle')){
                        toggle.classList.add('active');
                    }
                }
            });
        }

        var navObserver = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){ setActive(entry.target.id); }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        Object.keys(linksById).forEach(function(id){
            var section = document.getElementById(id);
            if(section) navObserver.observe(section);
        });
    })();

    /* ---------- init ---------- */
    setupGen(gens[0]);
    updateInfoPanel();
    updateTimelineUI();
    requestAnimationFrame(frame);

})();