// Button ripple effect and metric counters

// Ripple for buttons with .btn
document.addEventListener('click', function(e){
    const btn = e.target.closest('.btn');
    if(!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    // remove after animation
    setTimeout(()=> ripple.remove(), 700);
});

// Simple counter animation when visible
function animateCounters(){
    const els = document.querySelectorAll('.value[data-target]');
    const speed = 200; // larger = slower
    els.forEach(el => {
        const target = +el.getAttribute('data-target');
        const start = 0;
        const duration = Math.max(800, Math.min(2400, Math.floor(target / speed * 1000)));
        let startTime = null;

        function step(timestamp){
            if(!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * (target - start) + start);
            el.textContent = current.toLocaleString('ru-RU');
            if(progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('ru-RU');
        }
        requestAnimationFrame(step);
    });
}

// Use intersection observer to trigger when metrics-card visible
(function(){
    const card = document.querySelector('.metrics-card');
    if(!card) return animateCounters();
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                animateCounters();
                io.disconnect();
            }
        });
    }, { threshold: 0.3 });
    io.observe(card);
})();

// Mobile navigation toggle
(function(){
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if(!toggle || !nav) return;

    function setOpen(open){
        if(open){
            nav.classList.add('open');
            toggle.setAttribute('aria-expanded','true');
        } else {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded','false');
        }
    }

    toggle.addEventListener('click', function(e){
        const isOpen = nav.classList.contains('open');
        setOpen(!isOpen);
    });

    // Close when clicking a nav link
    nav.addEventListener('click', function(e){
        if(e.target.classList.contains('nav-link')) setOpen(false);
    });

    // Close when clicking outside
    document.addEventListener('click', function(e){
        if(!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
})();

// Small accessibility: keyboard trigger for buttons to show a ripple when activated via Enter/Space
document.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
        const active = document.activeElement;
        if(active && active.classList && active.classList.contains('btn')){
            // create centered ripple
            const rect = active.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height) * 1.2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width/2 - size/2) + 'px';
            ripple.style.top = (rect.height/2 - size/2) + 'px';
            active.appendChild(ripple);
            setTimeout(()=> ripple.remove(), 700);
        }
    }
});

// Scroll-to-form for CTAs
(function(){
    const demoBtn = document.getElementById('demoBtn');
    const pilotBtn = document.getElementById('pilotBtn');
    const getStarted = document.getElementById('getStarted');
    const form = document.getElementById('demoForm');
    function go(){ if(form) form.scrollIntoView({behavior:'smooth', block:'center'}); }
    if(demoBtn) demoBtn.addEventListener('click', go);
    if(pilotBtn) pilotBtn.addEventListener('click', go);
    if(getStarted) getStarted.addEventListener('click', go);
})();

// Form handling (mock submit)
(function(){
    const form = document.getElementById('demoForm');
    const msg = document.getElementById('formMessage');
    const clear = document.getElementById('clearForm');
    if(!form) return;

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        if(!name || !email){
            msg.textContent = 'Пожалуйста, заполните имя и email.';
            msg.style.color = 'var(--accent-b)';
            return;
        }
        // Simulate network request
        msg.style.color = 'var(--primary)';
        msg.textContent = 'Отправка...';
        setTimeout(()=>{
            msg.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
            form.reset();
        }, 900);
    });
    if(clear){ clear.addEventListener('click', ()=>{ form.reset(); msg.textContent = ''; }); }
})();

// Chart.js placeholder
(function(){
    const ctx = document.getElementById('trendChart');
    if(!ctx || typeof Chart === 'undefined') return;
    const labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'];
    const data = {
        labels,
        datasets: [
            { label: 'Продажи (ед.)', data: [120, 150, 170, 200, 230, 260, 300], borderColor: 'rgba(38,198,218,0.95)', backgroundColor: 'rgba(38,198,218,0.12)', tension: 0.35, fill: true },
            { label: 'Запросы в категории', data: [80, 90, 120, 150, 190, 210, 240], borderColor: 'rgba(255,107,107,0.95)', backgroundColor: 'rgba(255,107,107,0.08)', tension: 0.35, fill: true }
        ]
    };
    new Chart(ctx, { type: 'line', data, options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } } } });
})();
