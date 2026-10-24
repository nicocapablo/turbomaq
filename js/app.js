(function () {
  const app = document.getElementById("app");
  const modal = document.getElementById("modal");
  const WRONG_KEY = "tfi-wrong-ids";

  const state = {
    view: "home",
    mode: null,
    list: [],
    index: 0,
    picked: null,
    revealed: false,
    answers: [],
    timer: null,
    seconds: 70 * 60,
    timerOn: false,
    problem: null,
    step: 0,
    picks: [],
    showExplain: false,
    filter: "todos"
  };

  function wrongIds() {
    try { return JSON.parse(localStorage.getItem(WRONG_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function remember(id, ok) {
    if (!id || String(id).indexOf("gen-") === 0) return;
    let ids = wrongIds();
    if (ok) ids = ids.filter((x) => x !== id);
    else if (ids.indexOf(id) < 0) ids.push(id);
    localStorage.setItem(WRONG_KEY, JSON.stringify(ids));
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function clock(sec) {
    const s = Math.max(0, sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function stopTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    state.timerOn = false;
  }

  function startTimer() {
    stopTimer();
    state.seconds = 70 * 60;
    state.timerOn = true;
    state.timer = setInterval(() => {
      state.seconds -= 1;
      const el = document.getElementById("clock");
      if (el) {
        el.textContent = clock(state.seconds);
        if (state.seconds < 300) el.classList.add("warn");
      }
      if (state.seconds <= 0) stopTimer();
    }, 1000);
  }

  function goHome() {
    stopTimer();
    state.view = "home";
    render();
  }

  function render() {
    if (state.view === "home") renderHome();
    else if (state.view === "setup-test") renderSetup();
    else if (state.view === "question") renderQuestion();
    else if (state.view === "results") renderResults();
    else if (state.view === "problem-menu") renderProblemMenu();
    else if (state.view === "problem") renderProblem();
    else if (state.view === "problem-end") renderProblemEnd();
  }

  function renderHome() {
    const n = TFIBank.QUESTIONS.length;
    const fails = wrongIds().length;
    app.innerHTML = `
      <section class="hero">
        <p class="kicker">ETSEIB · MUEI · 10 abril 2026</p>
        <h1>Turbomáquinas de flujo incompresible</h1>
        <p class="lede">Genera exámenes del banco, responde y, si fallas, te explica el concepto antes que la cuenta. En el ejercicio escribes el resultado, como en el papel. El formulario está siempre arriba.</p>
      </section>
      <div class="grid">
        <button class="card" id="go-practica">
          <p class="kicker">Una a una</p>
          <h2>Práctica</h2>
          <p>Tocas una opción y queda elegida: si está bien, «Muy bien»; si no, la explicación al momento. ${n} preguntas fijas, más cálculos nuevos.</p>
        </button>
        <button class="card" id="go-examen">
          <p class="kicker">20 preguntas · +1 / −1/3</p>
          <h2>Examen</h2>
          <p>El modelo de 2026, uno de exámenes anteriores, o una mezcla. Cada toque se corrige al momento y la nota sale al final.</p>
        </button>
        <button class="card" id="go-problema">
          <p class="kicker">75 min · la bomba</p>
          <h2>Ejercicio</h2>
          <p>Escribes los números. El modelo de 2026, uno parecido, la central de 2024, o solo el apartado que se te atasca.</p>
        </button>
      </div>
      <p class="muted small" style="margin-top:18px">${fails ? "Tienes " + fails + " para repasar. En práctica puedes pedir solo esas." : "Cuando falles alguna, quedará guardada en este navegador para repasarla."}</p>`;
    document.getElementById("go-practica").onclick = () => { state.mode = "practica"; state.filter = "todos"; state.view = "setup-test"; render(); };
    document.getElementById("go-examen").onclick = () => { state.mode = "examen"; state.view = "setup-test"; render(); };
    document.getElementById("go-problema").onclick = () => { state.view = "problem-menu"; render(); };
  }

  function renderSetup() {
    if (state.mode === "examen") {
      app.innerHTML = `
        <div class="panel">
          <p class="kicker">Examen</p>
          <h2 style="font-family:var(--serif);font-weight:560;margin-top:4px">Qué quieres que salga</h2>
          <p class="muted">Como en el final: acierto +1, fallo −1/3, en blanco 0. 70 minutos si dejas el reloj. Las preguntas del modelo mantienen el orden de las opciones del PDF.</p>
          <div class="grid" style="margin-top:14px">
            <button class="card" data-exam="modelo"><h2>Modelo 2026</h2><p>Las 20 del 10/04/26, en otro orden.</p></button>
            <button class="card" data-exam="anteriores"><h2>Exámenes anteriores</h2><p>20 sacadas de enero y julio de 2023.</p></button>
            <button class="card" data-exam="mix"><h2>Mezcla nueva</h2><p>Banco más cálculos con otros números. Cada vez es otro examen.</p></button>
          </div>
          <p style="margin-top:14px"><button class="btn btn-line" id="back">Volver</button></p>
        </div>`;
      app.querySelectorAll("[data-exam]").forEach((btn) => {
        btn.onclick = () => startExam(btn.getAttribute("data-exam"));
      });
    } else {
      const sources = ["todos"].concat(TFIBank.sources().filter((s) => s !== "Cálculo generado"));
      const fails = wrongIds().length;
      app.innerHTML = `
        <div class="panel">
          <p class="kicker">Práctica</p>
          <h2 style="font-family:var(--serif);font-weight:560;margin-top:4px">De dónde salen las preguntas</h2>
          <div class="chips" id="chips">
            ${sources.map((s) => `<button class="chip ${s === state.filter ? "on" : ""}" data-s="${esc(s)}">${s === "todos" ? "Todo el banco" : esc(s)}</button>`).join("")}
            <button class="chip" data-s="Cálculo generado">Cálculos nuevos</button>
            <button class="chip" data-s="falladas" ${fails ? "" : "disabled"}>Las que he fallado (${fails})</button>
          </div>
          <button class="btn btn-primary" id="startp">Empezar</button>
          <button class="btn btn-line" id="back">Volver</button>
        </div>`;
      app.querySelectorAll(".chip").forEach((chip) => {
        chip.onclick = () => {
          state.filter = chip.getAttribute("data-s");
          render();
        };
      });
      document.getElementById("startp").onclick = startPractice;
    }
    document.getElementById("back").onclick = goHome;
  }

  function startExam(kind) {
    state.list = TFIBank.makeExam(kind);
    state.index = 0;
    state.picked = null;
    state.revealed = false;
    state.answers = state.list.map(() => null);
    state.view = "question";
    state.examKind = kind;
    startTimer();
    render();
  }

  function startPractice() {
    let list;
    if (state.filter === "falladas") {
      const ids = wrongIds();
      list = TFIBank.QUESTIONS.filter((item) => ids.indexOf(item.id) >= 0);
      if (!list.length) {
        goHome();
        return;
      }
    } else if (state.filter === "Cálculo generado") {
      list = TFIBank.makeGenerated(12);
    } else {
      list = TFIBank.pool(state.filter);
    }
    state.list = list.map((item) => TFIBank.prepare(item, true));
    for (let i = state.list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = state.list[i];
      state.list[i] = state.list[j];
      state.list[j] = tmp;
    }
    state.index = 0;
    state.picked = null;
    state.revealed = false;
    state.showExplain = false;
    state.answers = [];
    state.view = "question";
    render();
  }

  function current() { return state.list[state.index]; }

  function renderQuestion() {
    const item = current();
    const exam = state.mode === "examen";
    const letters = ["a", "b", "c", "d", "e"];
    const total = state.list.length;
    const locked = exam
      ? state.answers[state.index] !== null && state.answers[state.index] !== undefined
      : state.revealed;
    app.innerHTML = `
      <div class="q-meta">
        <span>${esc(item.source)} · ${esc(item.topic)}</span>
        <span>${exam ? `<span class="timer" id="clock">${clock(state.seconds)}</span> · ` : ""}Pregunta ${state.index + 1} de ${total}</span>
      </div>
      <div class="progress"><div style="width:${(state.index / total) * 100}%"></div></div>
      ${exam ? `<div class="navmap">${state.list.map((_, i) => `<button class="dot ${i === state.index ? "now" : ""} ${state.answers[i] === null || state.answers[i] === undefined ? "blank" : "done"}" data-jump="${i}">${i + 1}</button>`).join("")}</div>` : ""}
      <article class="panel">
        <p class="prompt">${esc(item.prompt)}</p>
        <div class="options" id="opts">
          ${item.options.map((text, i) => `<button class="opt ${state.picked === i ? "sel" : ""}" data-i="${i}"><span class="letter">${letters[i]})</span>${esc(text)}</button>`).join("")}
        </div>
        <div id="feedback"></div>
        <div class="row actions" style="margin-top:14px">
          ${exam
            ? `<button class="btn btn-line" id="blank" ${locked ? "disabled" : ""}>En blanco</button>
               <button class="btn btn-line" id="prev" ${state.index === 0 ? "disabled" : ""}>Anterior</button>
               <button class="btn btn-primary" id="next">${state.index === total - 1 ? "Terminar" : "Siguiente"}</button>`
            : `<button class="btn btn-primary" id="nextq" ${state.revealed ? "" : "disabled"}>Siguiente</button>
               <button class="btn btn-line" id="home">Salir</button>`}
        </div>
      </article>`;

    app.querySelectorAll(".opt").forEach((btn) => {
      btn.onclick = () => {
        if (locked) return;
        state.picked = Number(btn.getAttribute("data-i"));
        if (exam) {
          state.answers[state.index] = state.picked;
          remember(current().id, state.picked === current().answer);
        }
        gradePractice();
      };
    });
    if (exam) {
      app.querySelectorAll("[data-jump]").forEach((btn) => {
        btn.onclick = () => {
          state.index = Number(btn.getAttribute("data-jump"));
          state.picked = state.answers[state.index];
          render();
        };
      });
      document.getElementById("blank").onclick = () => {
        if (locked) return;
        state.answers[state.index] = null;
        state.picked = null;
        if (state.index < total - 1) state.index += 1;
        state.picked = state.answers[state.index];
        render();
      };
      document.getElementById("prev").onclick = () => {
        state.index -= 1;
        state.picked = state.answers[state.index];
        render();
      };
      document.getElementById("next").onclick = () => {
        if (state.index === total - 1) finishExam();
        else {
          state.index += 1;
          state.picked = state.answers[state.index];
          render();
        }
      };
    } else {
      document.getElementById("nextq").onclick = () => {
        if (state.index >= total - 1) {
          if (state.filter === "Cálculo generado") startPractice();
          else goHome();
        } else {
          state.index += 1;
          state.picked = null;
          state.revealed = false;
          state.showExplain = false;
          render();
        }
      };
      document.getElementById("home").onclick = goHome;
    }
    if (locked) paintFeedback();
  }

  function gradePractice() {
    if (state.picked === null || state.picked === undefined) return;
    state.revealed = true;
    const item = current();
    const ok = state.picked === item.answer;
    remember(item.id, ok);
    state.showExplain = !ok;
    render();
  }

  function paintFeedback() {
    const item = current();
    const ok = state.picked === item.answer;
    const box = document.getElementById("feedback");
    const letters = ["a", "b", "c", "d", "e"];
    app.querySelectorAll(".opt").forEach((btn) => {
      const i = Number(btn.getAttribute("data-i"));
      if (i === item.answer) btn.classList.add("ok");
      else if (i === state.picked && !ok) btn.classList.add("bad");
    });
    if (ok && !state.showExplain) {
      box.innerHTML = `<div class="banner good"><h3>Muy bien</h3><p>Esta está pillada.</p><button class="btn btn-line" id="want">Quiero la explicación</button></div>`;
      document.getElementById("want").onclick = () => { state.showExplain = true; render(); };
    } else {
      box.innerHTML = `<div class="banner ${ok ? "good" : "bad"}">
        <h3>${ok ? "Muy bien" : "Esta no."}</h3>
        ${ok ? "" : `<p>La correcta es la ${letters[item.answer]}). Te explico el concepto y, al final, por qué sale esa.</p>`}
        <div class="explain">${item.explain}</div>
      </div>`;
    }
    const banner = box.querySelector(".banner");
    if (banner) banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function finishExam() {
    stopTimer();
    const detail = state.list.map((item, i) => {
      const pick = state.answers[i];
      const blank = pick === null || pick === undefined;
      const ok = !blank && pick === item.answer;
      if (!blank) remember(item.id, ok);
      return { item, pick, blank, ok };
    });
    state.detail = detail;
    state.view = "results";
    render();
  }

  function renderResults() {
    const d = state.detail;
    const good = d.filter((x) => x.ok).length;
    const bad = d.filter((x) => !x.ok && !x.blank).length;
    const blank = d.filter((x) => x.blank).length;
    const score = good - bad / 3;
    const over = d.length;
    const letters = ["a", "b", "c", "d", "e"];
    app.innerHTML = `
      <div class="panel">
        <p class="kicker">Resultado</p>
        <p class="score">${score.toFixed(2).replace(".", ",")} / ${over}</p>
        <p class="muted">Nota sobre 10: ${(10 * score / over).toFixed(2).replace(".", ",")}. Acierto +1, fallo −1/3, en blanco 0.</p>
        <div class="statgrid">
          <div class="stat"><b>${good}</b> aciertos</div>
          <div class="stat"><b>${bad}</b> fallos</div>
          <div class="stat"><b>${blank}</b> en blanco</div>
        </div>
        <div class="row">
          <button class="btn btn-primary" id="again">Otro examen</button>
          <button class="btn btn-line" id="home">Inicio</button>
        </div>
      </div>
      <div id="review" style="margin-top:14px;display:flex;flex-direction:column;gap:10px"></div>`;
    const review = document.getElementById("review");
    d.forEach((row, i) => {
      const el = document.createElement("article");
      el.className = "panel";
      const status = row.blank ? "En blanco" : row.ok ? "Muy bien" : "Fallo";
      el.innerHTML = `
        <p class="q-meta"><span>${i + 1}. ${esc(row.item.source)}</span><span>${status}</span></p>
        <p class="prompt" style="font-size:1.05rem">${esc(row.item.prompt)}</p>
        <p>${row.blank ? "No respondiste." : "Elegiste la " + letters[row.pick] + ")."} La correcta es la ${letters[row.item.answer]}).</p>
        <div class="explain-slot"></div>`;
      const slot = el.querySelector(".explain-slot");
      if (row.ok) {
        const b = document.createElement("button");
        b.className = "btn btn-line";
        b.textContent = "Quiero la explicación";
        b.onclick = () => { slot.innerHTML = `<div class="explain">${row.item.explain}</div>`; b.remove(); };
        slot.appendChild(b);
      } else {
        slot.innerHTML = `<div class="banner bad"><h3>${row.blank ? "En blanco cuenta como que no estaba." : "Esta no."}</h3><div class="explain">${row.item.explain}</div></div>`;
      }
      review.appendChild(el);
    });
    document.getElementById("again").onclick = () => { state.view = "setup-test"; render(); };
    document.getElementById("home").onclick = goHome;
  }

  function startProblem(kind) {
    state.problem = TFIProblem.build(kind);
    state.step = 0;
    state.picks = state.problem.steps.map(() => null);
    state.checked = state.problem.steps.map(() => false);
    state.stepOk = state.problem.steps.map(() => false);
    state.typed = state.problem.steps.map((s) => (s.fields || []).map(() => ""));
    state.explainOpen = state.problem.steps.map(() => false);
    state.pKind = kind;
    state.view = "problem";
    render();
  }

  function parseNum(raw) {
    if (raw == null) return NaN;
    const t = String(raw).trim().replace(/\s/g, "").replace(",", ".");
    if (!t || t === "-" || t === "." || t === "-.") return NaN;
    return Number(t);
  }

  function fieldMatches(raw, field) {
    const got = parseNum(raw);
    return Number.isFinite(got) && Math.abs(got - field.value) <= field.tol + 1e-9;
  }

  function renderProblemMenu() {
    app.innerHTML = `
      <div class="panel">
        <p class="kicker">Ejercicio</p>
        <h2 style="font-family:var(--serif);font-weight:560;margin-top:4px">Elige qué practicar</h2>
        <p class="muted">Los cálculos se escriben, con coma o con punto. El dibujo del rodete se toca, porque un móvil no puede corregir un croquis. Si fallas, sale el concepto y el número. El formulario sigue arriba.</p>
      </div>
      <div class="grid" style="margin-top:14px">
        <button class="card" data-k="p1"><p class="kicker">Modelo 10/04/2026</p><h2>Permiso 1</h2><p>Voluta, triángulos, par, semejanza y el circuito con la curva del fabricante.</p></button>
        <button class="card" data-k="p2"><p class="kicker">Modelo 10/04/2026</p><h2>Permiso 2</h2><p>El mismo enunciado, con otras rpm, otra cota y la bomba 120/12.</p></button>
        <button class="card" data-k="p3"><p class="kicker">Modelo 10/04/2026</p><h2>Permiso 3</h2><p>El mismo enunciado otra vez. La impulsión es la larga, 22 500 m, y la bomba es la 120/20.</p></button>
        <button class="card" data-k="random"><p class="kicker">Mismo tipo</p><h2>Uno parecido</h2><p>Los mismos dibujos, con rpm, cota y tubería distintas. Cada vez sale otro.</p></button>
        <button class="card" data-k="y2024"><p class="kicker">Examen anterior</p><h2>Central reversible</h2><p>09/01/2024. Resistente, semejanza del punto de corte, potencias, NPSH y cota de aspiración.</p></button>
      </div>
      <div class="panel" style="margin-top:14px">
        <p class="kicker">Apartados sueltos</p>
        <h2 style="font-family:var(--serif);font-weight:560;margin-top:4px">Repetir solo una cosa</h2>
        <p class="muted">Números nuevos cada vez. Para el trozo que se atasca, sin hacer el problema entero.</p>
        <div class="chips">
          <button class="chip" data-k="drill:triangulo">Triángulo</button>
          <button class="chip" data-k="drill:par">Par</button>
          <button class="chip" data-k="drill:semejanza">Semejanza</button>
          <button class="chip" data-k="drill:cruce">Cruce H-Q</button>
          <button class="chip" data-k="drill:npsh">Cota NPSH</button>
        </div>
      </div>
      <p style="margin-top:14px"><button class="btn btn-line" id="back">Inicio</button></p>`;
    app.querySelectorAll("[data-k]").forEach((btn) => {
      btn.onclick = () => startProblem(btn.getAttribute("data-k"));
    });
    document.getElementById("back").onclick = goHome;
  }

  function renderProblem() {
    const p = state.problem;
    const s = p.steps[state.step];
    const letters = ["a", "b", "c", "d"];
    const checked = state.checked[state.step];
    const nums = s.kind === "number";
    const body = nums
      ? `<div class="numgrid">${s.fields.map((f, i) => {
          const raw = state.typed[state.step][i] || "";
          const mark = checked ? (fieldMatches(raw, f) ? "ok" : "bad") : "";
          const mode = f.value < 0 ? "text" : "decimal";
          return `<label class="numfield"><span>${esc(f.label)}${f.unit ? " (" + esc(f.unit) + ")" : ""}</span><input class="${mark}" data-i="${i}" inputmode="${mode}" enterkeyhint="done" autocomplete="off" ${checked ? "disabled" : ""} value="${esc(raw)}"></label>`;
        }).join("")}</div>`
      : `<div class="options">${s.options.map((text, i) => {
          let mark = state.picks[state.step] === i ? "sel" : "";
          if (checked && i === s.answer) mark += " ok";
          else if (checked && i === state.picks[state.step] && !state.stepOk[state.step]) mark += " bad";
          return `<button class="opt ${mark}" data-i="${i}" ${checked ? "disabled" : ""}><span class="letter">${letters[i]})</span>${esc(text)}</button>`;
        }).join("")}</div>`;
    const last = state.step === p.steps.length - 1;
    app.innerHTML = `
      <div class="q-meta">
        <span>${esc(p.title)} · ${esc(s.part)}</span>
        <span>Paso ${state.step + 1} de ${p.steps.length}</span>
      </div>
      <div class="progress"><div style="width:${(state.step / p.steps.length) * 100}%"></div></div>
      <article class="panel">
        <p class="kicker">${esc(s.title)}</p>
        <p class="prompt">${esc(s.prompt)}</p>
        ${(s.images || []).map((src) => `<figure class="figure"><img src="${src}" alt="Figura del enunciado"><figcaption class="caption">Figura del enunciado.</figcaption></figure>`).join("")}
        ${body}
        <div id="pfeedback"></div>
        <div class="row actions" style="margin-top:14px">
          <button class="btn btn-line" id="pprev" ${state.step === 0 ? "disabled" : ""}>Anterior</button>
          ${nums && !checked ? `<button class="btn btn-primary" id="check">Comprobar</button>` : ""}
          <button class="btn btn-primary" id="pnext" ${checked ? "" : "disabled"}>${last ? "Ver cómo ha quedado" : "Siguiente"}</button>
        </div>
      </article>
      <p style="margin-top:12px"><button class="btn btn-line" id="pmenu">Elegir otro problema</button></p>`;
    if (nums && !checked) {
      app.querySelectorAll(".numfield input").forEach((input) => {
        input.oninput = () => {
          state.typed[state.step][Number(input.getAttribute("data-i"))] = input.value;
        };
        input.onkeydown = (ev) => { if (ev.key === "Enter") checkNumbers(); };
      });
      document.getElementById("check").onclick = checkNumbers;
      const first = app.querySelector(".numfield input");
      if (first) first.focus();
    }
    if (!nums) {
      app.querySelectorAll(".opt").forEach((btn) => {
        btn.onclick = () => {
          if (state.checked[state.step]) return;
          const i = Number(btn.getAttribute("data-i"));
          state.picks[state.step] = i;
          state.checked[state.step] = true;
          state.stepOk[state.step] = i === s.answer;
          render();
        };
      });
    }
    if (checked) paintProblemFeedback();
    document.getElementById("pprev").onclick = () => { state.step -= 1; render(); };
    document.getElementById("pnext").onclick = () => {
      if (!state.checked[state.step]) return;
      if (last) {
        state.view = "problem-end";
        render();
      } else {
        state.step += 1;
        render();
      }
    };
    document.getElementById("pmenu").onclick = () => { state.view = "problem-menu"; render(); };
  }

  function checkNumbers() {
    const s = state.problem.steps[state.step];
    if (state.checked[state.step] || s.kind !== "number") return;
    app.querySelectorAll(".numfield input").forEach((input) => {
      state.typed[state.step][Number(input.getAttribute("data-i"))] = input.value;
    });
    const raws = state.typed[state.step];
    state.checked[state.step] = true;
    state.stepOk[state.step] = s.fields.every((f, i) => fieldMatches(raws[i], f));
    render();
  }

  function paintProblemFeedback() {
    const s = state.problem.steps[state.step];
    const ok = state.stepOk[state.step];
    const box = document.getElementById("pfeedback");
    const letters = ["a", "b", "c", "d"];
    if (ok && !state.explainOpen[state.step]) {
      box.innerHTML = `<div class="banner good"><h3>Muy bien</h3><p>Esta está pillada.</p><button class="btn btn-line" id="want">Quiero la explicación</button></div>`;
      document.getElementById("want").onclick = () => { state.explainOpen[state.step] = true; render(); };
    } else {
      const hint = !ok && s.kind === "number"
        ? `<p>El resultado es ${esc(s.expected)}.</p>`
        : (!ok ? `<p>La correcta es la ${letters[s.answer]}).</p>` : "");
      box.innerHTML = `<div class="banner ${ok ? "good" : "bad"}">
        <h3>${ok ? "Muy bien" : "Esta no."}</h3>
        ${ok ? "" : `<p>${s.kind === "number" ? "Vamos al concepto, y de ahí al número." : "Vamos al concepto, y de ahí a la respuesta."}</p>`}
        ${hint}
        <div class="explain">${s.explain}</div>
      </div>`;
    }
    const banner = box.querySelector(".banner");
    if (banner) banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function againLabel() {
    const k = String(state.pKind || "");
    if (k.indexOf("drill:") === 0) return "Otro con otros números";
    if (k === "random") return "Otra variante";
    if (k === "y2024") return "Repetir este problema";
    return "Repetir este permiso";
  }

  function renderProblemEnd() {
    const p = state.problem;
    const letters = ["a", "b", "c", "d"];
    const rows = p.steps.map((s, i) => ({ s, pick: state.picks[i], ok: !!state.stepOk[i] }));
    const good = rows.filter((r) => r.ok).length;
    app.innerHTML = `
      <div class="panel">
        <p class="kicker">${esc(p.title)}</p>
        <p class="score">${good} / ${rows.length}</p>
        <p class="muted">${good === rows.length ? "Muy bien. Este ejercicio, entero." : "Abajo está cada paso. Donde has fallado, el concepto y la cuenta. Donde has acertado, la explicación solo si la pides."}</p>
        <div class="row">
          <button class="btn btn-primary" id="same">${againLabel()}</button>
          <button class="btn btn-line" id="menu">Elegir otro</button>
          <button class="btn btn-line" id="home">Inicio</button>
        </div>
      </div>
      <div id="steps" style="margin-top:14px;display:flex;flex-direction:column;gap:10px"></div>`;
    const box = document.getElementById("steps");
    rows.forEach((row, i) => {
      const el = document.createElement("article");
      el.className = "panel";
      let line = "Los números entran.";
      if (!row.ok && row.s.kind === "number") line = "Lo escrito no cuadra. " + row.s.expected + ".";
      else if (row.ok && row.s.kind !== "number") line = "Has elegido la opción buena.";
      else if (!row.ok) line = "Elegiste la " + letters[row.pick] + "). La buena era la " + letters[row.s.answer] + ").";
      el.innerHTML = `
        <p class="q-meta"><span>${i + 1}. ${esc(row.s.part)} · ${esc(row.s.title)}</span><span>${row.ok ? "Muy bien" : "Fallo"}</span></p>
        <p>${esc(line)}</p>
        <div class="slot"></div>`;
      const slot = el.querySelector(".slot");
      if (row.ok) {
        const b = document.createElement("button");
        b.className = "btn btn-line";
        b.textContent = "Quiero la explicación";
        b.onclick = () => { slot.innerHTML = `<div class="explain">${row.s.explain}</div>`; b.remove(); };
        slot.appendChild(b);
      } else {
        slot.innerHTML = `<div class="banner bad"><h3>Esta no.</h3><div class="explain">${row.s.explain}</div></div>`;
      }
      box.appendChild(el);
    });
    document.getElementById("same").onclick = () => startProblem(state.pKind);
    document.getElementById("menu").onclick = () => { state.view = "problem-menu"; render(); };
    document.getElementById("home").onclick = goHome;
  }

  document.getElementById("open-form").onclick = () => { modal.hidden = false; };
  document.getElementById("close-form").onclick = () => { modal.hidden = true; };
  modal.addEventListener("click", (ev) => { if (ev.target === modal) modal.hidden = true; });
  document.getElementById("go-home").onclick = goHome;

  render();
})();
