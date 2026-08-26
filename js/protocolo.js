var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

/* ---------- scout planning: drag + sweep, independent per topogram ---------- */
(function(){
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var THICKNESS_MM = 2;
    var ASSUMED_SKULL_HEIGHT_MM = 190; // approx. vertex-to-neck span visible in the scout, for teaching-scale purposes only

    function clampPct(v){ return Math.max(2, Math.min(98, v)); }

    function pctFromClientY(clientY, wrap){
        var rect = wrap.getBoundingClientRect();
        return ((clientY - rect.top) / rect.height) * 100;
    }

    function bindDrag(handle, onDrag, wrap){
        handle.addEventListener('pointerdown', function(e){
            handle.setPointerCapture(e.pointerId);
            function onMove(ev){ onDrag(pctFromClientY(ev.clientY, wrap)); }
            function onUp(ev){
                handle.releasePointerCapture(ev.pointerId);
                handle.removeEventListener('pointermove', onMove);
                handle.removeEventListener('pointerup', onUp);
            }
            handle.addEventListener('pointermove', onMove);
            handle.addEventListener('pointerup', onUp);
        });
    }

    /* --- AP topogram: full simulation (drag + sweep + stats readout) --- */
    (function(){
        var wrap = document.getElementById('scoutInteractive');
        if(!wrap) return;

        var lineEnd = document.getElementById('lineEnd');
        var lineStart = document.getElementById('lineStart');
        var handleEnd = document.getElementById('handleEnd');
        var handleStart = document.getElementById('handleStart');
        var sweep = document.getElementById('scoutSweep');
        var currentEl = document.getElementById('scoutCurrentSlice');
        var totalEl = document.getElementById('scoutTotalSlices');
        var rangeEl = document.getElementById('scoutRangeMm');

        var endPct = 12, startPct = 82;

        function updateStats(){
            var spanPct = Math.abs(startPct - endPct);
            var rangeMm = Math.round((spanPct / 100) * ASSUMED_SKULL_HEIGHT_MM);
            var slices = Math.max(1, Math.round(rangeMm / THICKNESS_MM));
            rangeEl.textContent = '≈ ' + rangeMm + ' mm';
            totalEl.textContent = slices;
        }

        bindDrag(handleEnd, function(pct){
            endPct = clampPct(pct);
            lineEnd.style.top = endPct + '%';
            handleEnd.style.top = endPct + '%';
            updateStats();
        }, wrap);

        bindDrag(handleStart, function(pct){
            startPct = clampPct(pct);
            lineStart.style.top = startPct + '%';
            handleStart.style.top = startPct + '%';
            updateStats();
        }, wrap);

        updateStats();

        var duration = reduceMotion ? 12000 : 4200;
        function frame(ts){
            var cycle = (ts % duration) / duration;
            var y = startPct > endPct ? (startPct - (startPct - endPct) * cycle) : (startPct + (endPct - startPct) * cycle);
            sweep.style.top = y + '%';
            if(currentEl){
                var total = parseInt(totalEl.textContent, 10) || 1;
                currentEl.textContent = Math.max(1, Math.round(cycle * total));
            }
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    })();

    /* --- Lateral topogram: independent plan markers, no sweep, no stats --- */
    (function(){
        var wrap = document.getElementById('scoutInteractive2');
        if(!wrap) return;

        var lineEnd = document.getElementById('lineEnd2');
        var lineStart = document.getElementById('lineStart2');
        var handleEnd = document.getElementById('handleEnd2');
        var handleStart = document.getElementById('handleStart2');

        bindDrag(handleEnd, function(pct){
            pct = clampPct(pct);
            lineEnd.style.top = pct + '%';
            handleEnd.style.top = pct + '%';
        }, wrap);

        bindDrag(handleStart, function(pct){
            pct = clampPct(pct);
            lineStart.style.top = pct + '%';
            handleStart.style.top = pct + '%';
        }, wrap);
    })();
})();