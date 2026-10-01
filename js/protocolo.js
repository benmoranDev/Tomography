/* ==========================================================================
   Protocolos de Exame — Tomografia Computadorizada (protocolo.js)
   - Inicializa automaticamente TODOS os cards .matrix-def-card com scouts
   - AP e lateral sincronizados
   - Arraste o caixote inteiro, as bordas (tm/bm) ou os losangos dos cantos
   - Painel de controles gerado por JS (espessura, incremento, cortes)
   - Simulação de aquisição sob demanda
   - Modo treino: sorteia o caixote, você ajusta e clica em "Conferir"
   - Scroll-spy na navbar
   Dica de calibração: abra a página com ?edit=1 para mostrar o botão
   "Copiar posição" e pegar os valores top/bottom ideais de cada exame.
   ========================================================================== */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var EDIT_MODE = /[?&]edit=1/.test(location.search);

    /* ---------- reveal on scroll ---------- */
    var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                revealIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });

    /* ---------- configuração dos protocolos ----------
       top/bottom   = posição inicial do caixote (% da altura da imagem)
       heightMm     = altura real aproximada coberta pela imagem do scout
       thick/interval = espessura e incremento padrão (mm)
       ideal        = {top,bottom} para o modo treino (CALIBRAR com ?edit=1)
       hint         = instrução mostrada no modo treino                   */
    var OPTIONS = [0.5, 0.8, 1, 1.5, 2, 3, 5];
    var DEFAULT = { top: 15, bottom: 75, heightMm: 200, thick: 2, interval: 1 };

    var PROTOCOLS = {
        'cranio':          { top: 10, bottom: 80, heightMm: 190, thick: 2, interval: 1,
            ideal: { top: 12, bottom: 78 },
            hint: 'Da base do crânio (forame magno) ao topo do crânio.' },
        'seios-face':      { top: 20, bottom: 60, heightMm: 160, thick: 1, interval: 0.8,
            ideal: { top: 22, bottom: 58 },
            hint: 'Seios: 0,5 cm abaixo do palato duro até o seio frontal.' },
        'orbitas':         { top: 25, bottom: 50, heightMm: 160, thick: 1, interval: 0.8,
            ideal: { top: 27, bottom: 48 },
            hint: '0,5 cm abaixo a 0,5 cm acima da cavidade orbitária.' },
        'atm':             { top: 35, bottom: 65, heightMm: 160, thick: 1, interval: 0.8,
            ideal: { top: 37, bottom: 62 },
            hint: 'Do mento até 0,5 cm acima da ATM.' },
        'mastoides':       { top: 30, bottom: 55, heightMm: 160, thick: 1, interval: 0.8 },
        'pescoco':         { top: 30, bottom: 80, heightMm: 250, thick: 2, interval: 1.5 },
        'coluna-cervical': { top: 25, bottom: 75, heightMm: 250, thick: 1, interval: 0.8 },
        'coluna-toracica': { top: 10, bottom: 85, heightMm: 350, thick: 2, interval: 1.5 },
        'coluna-lombar':   { top: 20, bottom: 70, heightMm: 300, thick: 2, interval: 1.5 },
        'torax':           { top: 10, bottom: 85, heightMm: 350, thick: 2, interval: 1 },
        'abdomen':         { top: 10, bottom: 90, heightMm: 450, thick: 3, interval: 3 },
        'pelve':           { top: 25, bottom: 85, heightMm: 300, thick: 3, interval: 3 },
        'ombro':           { top: 20, bottom: 70, heightMm: 250, thick: 1, interval: 0.8 },
        'cotovelo':        { top: 25, bottom: 75, heightMm: 250, thick: 1, interval: 0.8 },
        'punho':           { top: 30, bottom: 70, heightMm: 200, thick: 1, interval: 0.8 },
        'bacia':           { top: 15, bottom: 80, heightMm: 400, thick: 2, interval: 1.5 },
        'joelho':          { top: 25, bottom: 75, heightMm: 300, thick: 1, interval: 0.8 },
        'tornozelo':       { top: 30, bottom: 75, heightMm: 250, thick: 1, interval: 0.8 },
        'pe':              { top: 25, bottom: 80, heightMm: 250, thick: 1, interval: 0.8 }
    };

    var MIN_GAP = 4;      // % mínimo entre as bordas
    var TOLERANCE = 4;    // % de tolerância no modo "Conferir"

    function fmt(n) { return String(n).replace('.', ',') + ' mm'; }
    function clamp(v) { return Math.max(2, Math.min(98, v)); }
    function pctFromY(clientY, wrap) {
        var r = wrap.getBoundingClientRect();
        return ((clientY - r.top) / r.height) * 100;
    }

    /* ---------- arrastar com pointer events ---------- */
    function makeDraggable(el, wrap, onStart, onMove, onEnd) {
        el.style.touchAction = 'none';
        el.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var y0 = pctFromY(e.clientY, wrap);
            var snap = onStart();
            el.setPointerCapture(e.pointerId);

            function move(ev) {
                var y = pctFromY(ev.clientY, wrap);
                onMove(y - y0, y, snap);
            }
            function up(ev) {
                try { el.releasePointerCapture(ev.pointerId); } catch (err) {}
                el.removeEventListener('pointermove', move);
                el.removeEventListener('pointerup', up);
                el.removeEventListener('pointercancel', up);
                if (onEnd) onEnd();
            }
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerup', up);
            el.addEventListener('pointercancel', up);
        });
    }

    function mkBtn(label, cls, fn) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn-sm ' + cls + ' mr-2 mb-2';
        b.style.fontFamily = 'var(--font-mono)';
        b.style.fontSize = '0.75rem';
        b.textContent = label;
        b.addEventListener('click', fn);
        return b;
    }

    /* ---------- inicialização de cada card ---------- */
    function initCard(card) {
        var wraps = card.querySelectorAll('.scout-image-wrap');
        var row = card.querySelector('.scout-real-row');
        if (!wraps.length || !row) return;

        var cfg = Object.assign({}, DEFAULT, PROTOCOLS[card.id] || {});
        var state = {
            top: cfg.top, bottom: cfg.bottom,
            thick: cfg.thick, interval: cfg.interval,
            playing: false
        };

        var views = Array.prototype.map.call(wraps, function (w) {
            var sweep = w.querySelector('.scout-sweep-real');
            if (!sweep) {
                sweep = document.createElement('div');
                sweep.className = 'scout-sweep-real';
                w.appendChild(sweep);
            }
            sweep.style.display = 'none';
            return { wrap: w, box: w.querySelector('.scout-box-overlay'), sweep: sweep, ghost: null };
        });

        /* painel de controles unificado (substitui os painéis antigos) */
        card.querySelectorAll('.scout-controls-panel').forEach(function (n) { n.remove(); });

        var panel = document.createElement('div');
        panel.className = 'scout-controls-panel mt-3';
        panel.innerHTML =
            '<div class="row align-items-end">' +
            '<div class="col-md-3 col-6 mb-2"><label class="control-label">Espessura</label>' +
            '<select class="custom-select scout-select" data-role="thick"></select></div>' +
            '<div class="col-md-3 col-6 mb-2"><label class="control-label">Incremento</label>' +
            '<select class="custom-select scout-select" data-role="interval"></select></div>' +
            '<div class="col-md-3 col-6 mb-2"><div class="stat-box"><div class="stat-label">Extensão</div>' +
            '<div class="stat-value" data-role="range">—</div></div></div>' +
            '<div class="col-md-3 col-6 mb-2"><div class="stat-box"><div class="stat-label">Corte atual / total</div>' +
            '<div class="stat-value"><span data-role="cur">1</span> / <span data-role="total">1</span></div></div></div>' +
            '</div>' +
            '<div data-role="hint" style="font-family:var(--font-mono);font-size:0.74rem;color:var(--text-muted);margin:4px 0 10px;"></div>' +
            '<div data-role="actions" class="d-flex flex-wrap"></div>' +
            '<div data-role="feedback" aria-live="polite" style="font-size:0.85rem;line-height:1.6;"></div>';
        row.parentNode.insertBefore(panel, row.nextSibling);

        function q(role) { return panel.querySelector('[data-role="' + role + '"]'); }
        var thickSel = q('thick'), intSel = q('interval');
        var outRange = q('range'), outCur = q('cur'), outTotal = q('total');
        var outHint = q('hint'), actions = q('actions'), feedback = q('feedback');

        [thickSel, intSel].forEach(function (sel) {
            OPTIONS.forEach(function (n) {
                var o = document.createElement('option');
                o.value = n; o.textContent = fmt(n);
                sel.appendChild(o);
            });
        });
        thickSel.value = state.thick;
        intSel.value = state.interval;

        /* ---------- cálculos e renderização ---------- */
        function rangeMm() {
            return Math.round(((state.bottom - state.top) / 100) * cfg.heightMm);
        }
        function totalSlices() {
            return Math.max(1, Math.round(rangeMm() / state.interval));
        }

        function render() {
            var h = state.bottom - state.top;
            views.forEach(function (v) {
                if (!v.box) return;
                v.box.style.top = state.top + '%';
                v.box.style.height = h + '%';
            });
            outRange.textContent = '≈ ' + rangeMm() + ' mm';
            outTotal.textContent = totalSlices();
            if (!state.playing) outCur.textContent = 1;

            if (state.interval > state.thick + 1e-9) {
                outHint.style.color = '#b91c1c';
                outHint.textContent = '⚠ Incremento maior que a espessura: ficam lacunas (gaps) entre os cortes.';
            } else if (state.interval < state.thick - 1e-9) {
                outHint.style.color = 'var(--cyan)';
                outHint.textContent = 'Reconstrução com sobreposição (overlap): melhora MPR e 3D.';
            } else {
                outHint.style.color = 'var(--text-muted)';
                outHint.textContent = 'Cortes contíguos (incremento = espessura).';
            }
        }

        thickSel.addEventListener('change', function () { state.thick = parseFloat(thickSel.value); render(); });
        intSel.addEventListener('change', function () { state.interval = parseFloat(intSel.value); render(); });

        /* ---------- arrastar: bordas, losangos e caixote inteiro ---------- */
        function setTop(v) { state.top = Math.min(clamp(v), state.bottom - MIN_GAP); }
        function setBottom(v) { state.bottom = Math.max(clamp(v), state.top + MIN_GAP); }

        function clearGhost() { views.forEach(function (v) { if (v.ghost) v.ghost.style.display = 'none'; }); }

        views.forEach(function (v) {
            if (!v.box) return;

            v.box.style.pointerEvents = 'auto';
            v.box.style.cursor = 'move';

            makeDraggable(v.box, v.wrap,
                function () { return { t: state.top, b: state.bottom }; },
                function (delta, abs, s) {
                    var h = s.b - s.t;
                    var t = Math.max(2, Math.min(98 - h, s.t + delta));
                    state.top = t; state.bottom = t + h;
                    render();
                }, clearGhost);

            v.box.querySelectorAll('.scout-diamond-marker').forEach(function (m) {
                var isTop = /\b(tl|tm|tr)\b/.test(m.className);
                m.style.cursor = 'ns-resize';
                makeDraggable(m, v.wrap,
                    function () { return null; },
                    function (delta, abs) {
                        if (isTop) setTop(abs); else setBottom(abs);
                        render();
                    }, clearGhost);
            });
        });

        /* ---------- simulação de aquisição ---------- */
        var btnPlay;
        function stopScan() {
            state.playing = false;
            views.forEach(function (v) { v.sweep.style.display = 'none'; });
            btnPlay.textContent = '▶ Simular aquisição';
            render();
        }
        function startScan() {
            if (state.playing) { stopScan(); return; }
            state.playing = true;
            btnPlay.textContent = '■ Parar';
            var dur = reduceMotion ? 8000 : 4000, t0 = null;
            function frame(ts) {
                if (!state.playing) return;
                if (t0 === null) t0 = ts;
                var c = Math.min(1, (ts - t0) / dur);
                var y = state.top + (state.bottom - state.top) * c;
                views.forEach(function (v) {
                    v.sweep.style.display = 'block';
                    v.sweep.style.top = y + '%';
                });
                outCur.textContent = Math.max(1, Math.round(c * totalSlices()));
                if (c < 1) requestAnimationFrame(frame); else stopScan();
            }
            requestAnimationFrame(frame);
        }
        btnPlay = mkBtn('▶ Simular aquisição', 'btn-outline-info', startScan);
        actions.appendChild(btnPlay);

        actions.appendChild(mkBtn('↺ Restaurar', 'btn-outline-secondary', function () {
            state.top = cfg.top; state.bottom = cfg.bottom;
            state.thick = cfg.thick; state.interval = cfg.interval;
            thickSel.value = state.thick; intSel.value = state.interval;
            feedback.innerHTML = '';
            clearGhost();
            if (state.playing) stopScan(); else render();
        }));

        /* ---------- modo treino ---------- */
        if (cfg.ideal) {
            actions.appendChild(mkBtn('🎯 Treinar', 'btn-outline-warning', function () {
                if (state.playing) stopScan();
                var h = (cfg.ideal.bottom - cfg.ideal.top) + (Math.random() * 20 - 10);
                h = Math.max(12, h);
                var t = 5 + Math.random() * (88 - h - 5);
                state.top = clamp(t); state.bottom = clamp(t + h);
                clearGhost();
                feedback.innerHTML = '<b>Desafio:</b> ' + cfg.hint +
                    ' Ajuste o caixote e clique em <b>Conferir</b>.';
                render();
            }));

            actions.appendChild(mkBtn('✔ Conferir', 'btn-outline-success', function () {
                var dt = state.top - cfg.ideal.top;
                var db = state.bottom - cfg.ideal.bottom;
                var toMm = function (p) { return Math.round((Math.abs(p) / 100) * cfg.heightMm); };
                var msgs = [];

                if (dt < -TOLERANCE) msgs.push('Limite superior: ~' + toMm(dt) + ' mm além do necessário (dose extra ao paciente).');
                else if (dt > TOLERANCE) msgs.push('Limite superior: faltam ~' + toMm(dt) + ' mm — estrutura cortada.');
                if (db > TOLERANCE) msgs.push('Limite inferior: ~' + toMm(db) + ' mm além do necessário (dose extra ao paciente).');
                else if (db < -TOLERANCE) msgs.push('Limite inferior: faltam ~' + toMm(db) + ' mm — estrutura cortada.');

                if (!msgs.length) {
                    feedback.innerHTML = '<span style="color:#15803d;font-weight:600;">✔ Planejamento correto! ' + cfg.hint + '</span>';
                } else {
                    feedback.innerHTML = '<span style="color:#b45309;">' + msgs.join('<br>') + '</span>';
                }

                views.forEach(function (v) {
                    if (!v.ghost) {
                        v.ghost = document.createElement('div');
                        v.ghost.style.cssText = 'position:absolute;left:10%;width:80%;border:2px dashed #22c55e;' +
                            'z-index:5;pointer-events:none;';
                        v.wrap.appendChild(v.ghost);
                    }
                    v.ghost.style.top = cfg.ideal.top + '%';
                    v.ghost.style.height = (cfg.ideal.bottom - cfg.ideal.top) + '%';
                    v.ghost.style.display = 'block';
                });
            }));
        }

        /* ---------- ferramenta de calibração (?edit=1) ---------- */
        if (EDIT_MODE) {
            actions.appendChild(mkBtn('📋 Copiar posição', 'btn-outline-dark', function () {
                var txt = "'" + card.id + "': { top: " + Math.round(state.top) +
                    ", bottom: " + Math.round(state.bottom) + " }";
                if (navigator.clipboard) navigator.clipboard.writeText(txt);
                feedback.textContent = txt;
            }));
        }

        render();
    }

    document.querySelectorAll('.matrix-def-card').forEach(initCard);

    /* ---------- navbar: scroll-spy, margem de âncora e menu mobile ---------- */
    document.querySelectorAll('section[id], .matrix-def-card[id]').forEach(function (el) {
        el.style.scrollMarginTop = '90px';
    });

    var links = document.querySelectorAll('.navbar-scan .nav-link[href^="#"]');
    var linkById = {};
    links.forEach(function (a) { linkById[a.getAttribute('href').slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            links.forEach(function (a) { a.classList.remove('active'); });
            var a = linkById[e.target.id];
            if (a) a.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    Object.keys(linkById).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) spy.observe(sec);
    });

    links.forEach(function (a) {
        a.addEventListener('click', function () {
            if (window.jQuery) window.jQuery('#navMain').collapse('hide');
        });
    });
})();