/* Ejercicio largo del modelo 10/04/2026 y variantes con los mismos dibujos. */
(function () {
  const G = 9.81;
  const RHO = 1000;
  const D1 = 0.08, B1 = 0.06, D2 = 0.2, B2 = 0.02;
  const DPIPE = 0.1;

  const PUMPS = {
    "120/07": {
      H: [[0, 22.5], [40, 21], [80, 19], [120, 16.5], [140, 15.0], [160, 13.5], [180, 12]],
      NPSH: [[50, 1.1], [100, 1.7], [140, 2.2], [160, 3.2], [180, 6]],
      P: [[50, 0.45], [100, 0.52], [140, 0.58], [160, 0.6], [180, 0.62]]
    },
    "120/12": {
      H: [[0, 32], [40, 30], [80, 27.5], [120, 24.8], [160, 21], [180, 19.5]],
      NPSH: [[50, 1.0], [100, 1.4], [140, 2.0], [180, 6]],
      P: [[50, 0.75], [100, 0.88], [140, 0.98], [180, 1.1]]
    },
    "120/20": {
      H: [[0, 40.5], [40, 38], [80, 35.5], [120, 33], [160, 29.5], [180, 28]],
      NPSH: [[50, 1.4], [100, 2.5], [140, 5], [180, 12]],
      P: [[50, 1.1], [100, 1.35], [140, 1.5], [180, 1.65]]
    }
  };

  const OFFICIAL = {
    p1: { title: "Perm 1 · 10/04/2026", A: 25.15, B: 181.98, n: 1500, Q: 0.1, beta: 35, etav: 0.8, etam: 0.9, Hreal: 6, z: 11, Lasp: 10, Limp: 2205, f: 0.04, pump: "120/07", red: 0.29 },
    p2: { title: "Perm 2 · 10/04/2026", A: 32.31, B: 206.24, n: 1700, Q: 0.1, beta: 35, etav: 0.8, etam: 0.9, Hreal: 11, z: 23, Lasp: 10, Limp: 2160, f: 0.04, pump: "120/12", red: 0.40 },
    p3: { title: "Perm 3 · 10/04/2026", A: 40.35, B: 230.50, n: 1900, Q: 0.1, beta: 35, etav: 0.8, etam: 0.9, Hreal: 16, z: 29, Lasp: 10, Limp: 22500, f: 0.04, pump: "120/20", red: 0.33 }
  };

  function interp(pts, x) {
    if (x <= pts[0][0]) return lerp(pts[0], pts[1], x);
    if (x >= pts[pts.length - 1][0]) return lerp(pts[pts.length - 2], pts[pts.length - 1], x);
    for (let i = 0; i < pts.length - 1; i++) {
      if (x >= pts[i][0] && x <= pts[i + 1][0]) return lerp(pts[i], pts[i + 1], x);
    }
    return pts[pts.length - 1][1];
  }
  function lerp(a, b, x) {
    const t = (x - a[0]) / (b[0] - a[0]);
    return a[1] + t * (b[1] - a[1]);
  }
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function nfmt(x, d) {
    return x.toFixed(d).replace(".", ",");
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function kfOf(f, L) {
    return 8 * f * L / (Math.PI ** 2 * DPIPE ** 5 * G);
  }
  function kSingular() {
    return 8 / (Math.PI ** 2 * DPIPE ** 4 * G);
  }

  function solveKinematics(s) {
    const beta = s.beta * Math.PI / 180;
    const w = s.n * 2 * Math.PI / 60;
    const U1 = w * (D1 / 2);
    const U2 = w * (D2 / 2);
    const Cm1 = s.Q / (Math.PI * D1 * B1);
    const Cm2 = s.Q / (Math.PI * D2 * B2);
    const C1 = Cm1;
    const W1 = Math.hypot(U1, C1);
    const beta1 = Math.atan2(Cm1, U1) * 180 / Math.PI;
    const Cu2 = U2 - Cm2 / Math.tan(beta);
    const C2 = Math.hypot(Cm2, Cu2);
    const W2 = Math.hypot(Cm2, U2 - Cu2);
    const alpha2 = Math.atan2(Cm2, Cu2) * 180 / Math.PI;
    const Hth = (U2 * Cu2) / G;
    const torque = (RHO * G * s.Q * Hth) / (s.etam * w);
    const lam = 1.75;
    const n2 = 0.8 * s.n;
    const w2 = n2 * 2 * Math.PI / 60;
    const U2s = w2 * (D2 * lam / 2);
    const Cm2s = s.Q / (Math.PI * D2 * lam * B2 * lam);
    const Cu2s = U2s - Cm2s / Math.tan(beta);
    const Hsim = (U2s * Cu2s) / G;
    return { w, U1, U2, Cm1, Cm2, C1, W1, beta1, Cu2, C2, W2, alpha2, Hth, torque, Hsim, n2, U2s, Cm2s, Cu2s };
  }

  function solveCircuit(s) {
    const pump = PUMPS[s.pump];
    const L = s.Lasp + s.Limp;
    const kf = kfOf(s.f, L);
    const ks = kSingular() * 2;
    const Hsys = (q) => s.z + (kf + ks) * q * q;
    let best = null;
    for (let qL = 20; qL <= 180; qL += 0.25) {
      const q = qL / 60000;
      const hp = interp(pump.H, qL);
      const hs = Hsys(q);
      const err = Math.abs(hp - hs);
      if (!best || err < best.err) best = { err, qL, hp, hs, q };
    }
    const qL = best.qL;
    const q = best.q;
    const H = best.hp;
    const PkW = interp(pump.P, qL);
    const eta = (RHO * G * q * H) / (PkW * 1000);
    const npsh = interp(pump.NPSH, Math.max(qL, pump.NPSH[0][0]));
    const hfAsp = kfOf(s.f, s.Lasp) * q * q;
    const hatm = (1e5 - 2340) / (RHO * G);
    const zmax = hatm - hfAsp - npsh;
    const q2 = q * (1 - s.red);
    const q2L = q2 * 60000;
    const H2 = interp(pump.H, q2L);
    const hf2 = kfOf(s.f, L) * q2 * q2;
    const hValve = H2 - s.z - hf2;
    const alpha = (2 * kSingular() * q2 * q2) / hValve;
    const npsh2 = interp(pump.NPSH, Math.max(q2L, pump.NPSH[0][0]));
    return { L, kf, qL, q, H, hs: best.hs, PkW, eta, npsh, hfAsp, hatm, zmax, q2, q2L, H2, hf2, hValve, alpha, npsh2 };
  }

  function randomSpec() {
    const pumps = ["120/07", "120/12", "120/20"];
    const pump = pick(pumps);
    let n, beta, Q, Cu2;
    for (let k = 0; k < 30; k++) {
      n = pick([1200, 1350, 1500, 1650, 1800, 1900]);
      beta = pick([30, 32, 35, 38, 40, 45]);
      Q = pick([0.08, 0.09, 0.1, 0.11, 0.12]);
      const w = n * 2 * Math.PI / 60;
      const U2 = w * (D2 / 2);
      const Cm2 = Q / (Math.PI * D2 * B2);
      Cu2 = U2 - Cm2 / Math.tan(beta * Math.PI / 180);
      if (Cu2 > 1) break;
    }
    const w = n * 2 * Math.PI / 60;
    const U2 = w * (D2 / 2);
    const Hth = U2 * Cu2 / G;
    const A = (U2 * U2) / G;
    const B = (A - Hth) / Q;
    const qL = pick([70, 80, 90, 100, 110, 120, 130, 140]);
    const Hp = interp(PUMPS[pump].H, qL);
    const z = Math.max(6, Math.round((Hp - pick([3, 4, 5, 6])) * 2) / 2);
    const f = 0.04;
    const q = qL / 60000;
    const ks = kSingular() * 2;
    const need = Math.max(Hp - z, 0.4);
    const kf = (need / (q * q)) - ks;
    let L = Math.max(80, Math.round(kf / kfOf(f, 1)));
    const Lasp = 10;
    const Limp = Math.max(40, L - Lasp);
    return {
      title: "Variante generada",
      A: Math.round(A * 100) / 100,
      B: Math.round(B * 100) / 100,
      n, Q, beta,
      etav: 0.8, etam: 0.9,
      Hreal: Math.round(Hth * pick([0.75, 0.82, 0.88]) * 10) / 10,
      z, Lasp, Limp, f, pump,
      red: pick([0.25, 0.29, 0.33, 0.4])
    };
  }

  function uniqueOptions(correctText, alts) {
    const seen = new Set([correctText]);
    const opts = [{ text: correctText, ok: true }];
    alts.forEach((t) => {
      if (!seen.has(t) && opts.length < 4) {
        seen.add(t);
        opts.push({ text: t, ok: false });
      }
    });
    while (opts.length < 4) opts.push({ text: "Ninguna de las otras", ok: false });
    return shuffle(opts);
  }

  function step(part, title, prompt, images, options, explain) {
    const answer = options.findIndex((o) => o.ok);
    return { kind: "choice", part, title, prompt, images, options: options.map((o) => o.text), answer, explain };
  }

  function numField(label, value, unit, decimals, tol) {
    const t = tol == null ? Math.max(Math.abs(value) * 0.03, 0.05) : tol;
    return { label, value, unit, decimals, tol: t };
  }

  function numStep(part, title, prompt, images, fields, explain) {
    return {
      kind: "number",
      part, title, prompt, images, fields, explain,
      expected: fields.map((f) => f.label + " = " + nfmt(f.value, f.decimals) + " " + f.unit).join(" · ")
    };
  }

  function triSVG(u, cu, cm) {
    const W = 360, H = 210, pad = 36;
    const max = Math.max(u, cm, 1);
    const sx = (W - 2 * pad) / max;
    const sy = (H - 2 * pad) / max;
    const s = Math.min(sx, sy);
    const x0 = pad, y0 = H - pad;
    const X = (vx) => x0 + vx * s;
    const Y = (vy) => y0 - vy * s;
    const line = (x1, y1, x2, y2, color) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.4" marker-end="url(#ah)"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img">
      <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="context-stroke"/></marker></defs>
      <rect width="100%" height="100%" fill="#fff"/>
      ${line(X(0), Y(0), X(u), Y(0), "#1d4e89")}
      ${line(X(0), Y(0), X(cu), Y(cm), "#0e5c52")}
      ${line(X(u), Y(0), X(cu), Y(cm), "#9c332c")}
      <text x="${X(u / 2)}" y="${Y(0) + 18}" font-size="13" fill="#1d4e89">U</text>
      <text x="${X(cu / 2) - 8}" y="${Y(cm / 2) - 6}" font-size="13" fill="#0e5c52">C</text>
      <text x="${X((u + cu) / 2) + 8}" y="${Y(cm / 2)}" font-size="13" fill="#9c332c">W</text>
    </svg>`;
  }

  function build(kind) {
    if (kind === "y2024") return build2024();
    if (typeof kind === "string" && kind.indexOf("drill:") === 0) return buildDrill(kind.slice(6));
    const spec = kind === "random" ? randomSpec() : Object.assign({}, OFFICIAL[kind]);
    if (spec.Hreal >= spec.A - spec.B * spec.Q) spec.Hreal = Math.round((spec.A - spec.B * spec.Q) * 0.8 * 10) / 10;
    const k = solveKinematics(spec);
    const c = solveCircuit(spec);
    const fig = ["assets/fig/figuras_rodet.jpg"];
    const chart = ["assets/fig/curvas_bomba.jpg"];
    const beta = spec.beta;

    const datos1 = `Agua, ρ = 1000 kg/m³. D₁ = 0,08 m, b₁ = 0,06 m, D₂ = 0,20 m, b₂ = 0,02 m. Girando a ${spec.n} rpm, con Qₜₕ = ${nfmt(spec.Q, 2)} m³/s y β₂ del fluido = ${beta}°. La curva teórica es Hₜₕ = ${nfmt(spec.A, 2)} − ${nfmt(spec.B, 2)} Qₜₕ.`;
    const datos2 = `Modelo ${spec.pump}. z inferior = 0 m, z superior = ${nfmt(spec.z, 1)} m. D = 0,10 m, L aspiración = ${spec.Lasp} m, L impulsión = ${spec.Limp} m, f = 0,04. Kₛ = 2/α (α = 1 con la válvula abierta del todo). Patm = 10⁵ Pa, Pvapor = 2340 Pa.`;

    const s1 = step("Parte 1 · Rodete", "Sentido de giro",
      "Mira la voluta de la izquierda. El canal espiral crece hasta la salida de arriba y la lengüeta queda a la derecha del rodete. ¿Hacia dónde tiene que girar?",
      fig,
      uniqueOptions("Antihorario: el área de la voluta crece en el sentido de giro", [
        "Horario: el fluido se recogería contra la lengüeta",
        "Da igual: una voluta funciona en los dos sentidos",
        "No gira el rodete: el fluido lo mueve la gravedad"
      ]),
      `<p>La voluta es un difusor que va abriéndose. El rodete tiene que empujar el agua hacia esa sección creciente, si no, choca contra la lengüeta y la máquina no se parece en nada a la del dibujo.</p>
       <p>En esta carcasa el crecimiento va en sentido antihorario y la salida está arriba. Ese es el sentido de giro.</p>
       <img src="assets/fig/sol_dibujo.jpg" alt="Dibujo resuelto del rodete" style="width:100%;border-radius:12px"/>
       <p>En el dibujo resuelto del enunciado se ve el mismo sentido, la entrada por el ojo y la salida a la voluta.</p>`);

    const s2 = step("Parte 1 · Rodete", "Por dónde pasa el agua y qué cara empuja",
      "En diseño, con ese sentido de giro, ¿qué recorrido y qué cara de presión son los buenos?",
      fig,
      uniqueOptions("Entra axial por el ojo, cruza el rodete y sale radial a la voluta. La cara de presión es la que va delante, la que empuja el fluido.", [
        "Entra por la tubería de impulsión y sale por el ojo.",
        "Entra por el ojo, pero la cara de presión es la de atrás del álabe.",
        "Entra radial desde la voluta y la presión está en las dos caras por igual."
      ]),
      `<p>Una centrífuga aspira por el ojo (el agujero del centro) en dirección axial. Dentro del rodete el flujo se vuelve radial y sale al canal espiral. La sección de en medio del dibujo es justo ese camino: ojo → canales → voluta → brida de arriba.</p>
       <p>La cara de presión es la que «va delante» en el sentido de giro: es la que le está dando cantidad de movimiento al fluido. La otra es la de succión. Si las intercambias, el triángulo de velocidades te sale del revés.</p>`);

    const s3 = step("Parte 1 · Rodete", "Incidencia y desviación",
      "El enunciado pide la incidencia en condición de diseño y una desviación un poco positiva. ¿Qué significa eso?",
      fig,
      uniqueOptions("En diseño la incidencia es 0. Desviación positiva: el fluido sale con β mayor que el del álabe y C₂ᵤ baja.", [
        "En diseño la incidencia es grande y positiva, para que haya choque.",
        "La desviación positiva aumenta C₂ᵤ y por tanto la altura de Euler.",
        "Incidencia y desviación son el mismo ángulo, uno a la entrada y otro a la salida, y no cambian C₂ᵤ."
      ]),
      `<p>Incidencia es la diferencia entre el ángulo del flujo relativo y el del álabe a la entrada. En diseño el flujo entra alineado: i = 0. Si no, hay choque y el rendimiento hidráulico cae. Por eso el BEP es, entre otras cosas, «flujo bien orientado».</p>
       <p>A la salida, con un número finito de álabes el fluido no copia el álabe: se desvía. Desviación positiva quiere decir que sale más abierto (β del flujo mayor que β del álabe). Eso recorta la componente tangencial C₂ᵤ. Y como la altura de Euler, sin prerrotación, es U₂ C₂ᵤ / g, menos C₂ᵤ es menos altura. La desviación no «añade» energía: la quita respecto al álabe infinito.</p>`);

    const s4 = numStep("Parte 1 · Triángulos", "Velocidad de arrastre",
      datos1 + " Escribe U₁ y U₂.",
      [],
      [numField("U₁", k.U1, "m/s", 2, 0.15), numField("U₂", k.U2, "m/s", 2, 0.25)],
      `<p>U es la velocidad del propio álabe, no la del agua. U = ω R, con ω = 2πn/60 y R el radio, no el diámetro.</p>
       <p>ω = 2π · ${spec.n} / 60. R₁ = 0,04 m y R₂ = 0,10 m.</p>
       <p>U₁ = ${nfmt(k.U1, 2)} m/s y U₂ = ${nfmt(k.U2, 2)} m/s.</p>
       <p>El fallo típico es usar el diámetro en vez del radio: te dobla las dos. El otro es confundir U con la velocidad meridiana del caudal.</p>`);

    const s5 = numStep("Parte 1 · Triángulos", "Entrada, sin prerrotación",
      "En diseño la entrada es radial: el agua no llega girando. α₁ = 90°. Escribe C₁, β₁ (desde la tangente) y W₁.",
      [],
      [
        numField("C₁", k.C1, "m/s", 2, 0.15),
        numField("β₁", k.beta1, "°", 1, 0.8),
        numField("W₁", k.W1, "m/s", 2, 0.2)
      ],
      `<p>Sin prerrotación, C₁ᵤ = 0. Toda la velocidad absoluta es meridiana, así que α₁ = 90° y C₁ = Cₘ₁.</p>
       <p>Cₘ₁ = Q / (π D₁ b₁) = ${nfmt(spec.Q, 2)} / (π · 0,08 · 0,06) = ${nfmt(k.Cm1, 2)} m/s.</p>
       <p>El triángulo de entrada es rectángulo: W₁ = √(U₁² + C₁²) = ${nfmt(k.W1, 2)} m/s, y tan β₁ = Cₘ₁ / U₁, así que β₁ = ${nfmt(k.beta1, 1)}°.</p>
       <p>Ese β₁ es el que tiene que tener el álabe si quieres incidencia nula. No es el complementario: en esta asignatura β se mide desde la tangente, no desde el radio.</p>
       ${triSVG(k.U1, 0, k.Cm1)}`);

    const s6 = numStep("Parte 1 · Triángulos", "Salida, con β₂ = " + beta + "°",
      "A la salida el enunciado te da el ángulo de la velocidad relativa. Escribe C₂, W₂ y α₂ (desde la tangente).",
      [],
      [
        numField("C₂", k.C2, "m/s", 2, 0.2),
        numField("W₂", k.W2, "m/s", 2, 0.25),
        numField("α₂", k.alpha2, "°", 1, 0.8)
      ],
      `<p>β₂ se mide desde la tangente. En el triángulo, tan β₂ = Cₘ₂ / (U₂ − C₂ᵤ). Despejando, C₂ᵤ = U₂ − Cₘ₂ / tan β₂.</p>
       <p>Cₘ₂ = Q / (π D₂ b₂) = ${nfmt(k.Cm2, 2)} m/s. Con β₂ = ${beta}°, C₂ᵤ = ${nfmt(k.Cu2, 2)} m/s.</p>
       <p>C₂ = √(Cₘ₂² + C₂ᵤ²) = ${nfmt(k.C2, 2)} m/s. W₂ = √(Cₘ₂² + (U₂ − C₂ᵤ)²) = ${nfmt(k.W2, 2)} m/s. α₂ = arctan(Cₘ₂ / C₂ᵤ) = ${nfmt(k.alpha2, 1)}°.</p>
       <p>Comprueba de Euler: Hₜₕ = U₂ C₂ᵤ / g = ${nfmt(k.Hth, 2)} m. La recta del enunciado en este caudal da lo mismo (${nfmt(spec.A - spec.B * spec.Q, 2)} m). Si no te coincide, el triángulo está mal cerrado.</p>
       ${triSVG(k.U2, k.Cu2, k.Cm2)}`);

    const s7 = numStep("Parte 1 · Par", "Par en el eje",
      `La bomba, diseñada para Qₜₕ = ${nfmt(spec.Q, 2)} m³/s, una vez construida tiene ηᵥ = ${nfmt(spec.etav, 2)}, ηₘ = ${nfmt(spec.etam, 2)} y una altura real de ${nfmt(spec.Hreal, 1)} m. Escribe el par en el eje, en N·m.`,
      [],
      [numField("Par", k.torque, "N·m", 1, Math.max(0.8, k.torque * 0.02))],
      `<p>El par sale de la potencia mecánica y de la velocidad de giro: M = Pₘₑc / ω. No sale de la altura real sola.</p>
       <p>La potencia que de verdad se le entrega al fluido que atraviesa el rodete es la de Euler: Pₜₕ = ρ g Qₜₕ Hₜₕ. Aquí Qₜₕ sigue siendo ${nfmt(spec.Q, 2)} m³/s (el rendimiento volumétrico dice que el caudal útil es menor, Q = ηᵥ Qₜₕ, pero por el rodete pasa Qₜₕ).</p>
       <p>Hₜₕ = ${nfmt(k.Hth, 2)} m. El rendimiento mecánico es lo que se pierde en disco, cojinetes y juntas antes de que esa potencia llegue al fluido: Pₘₑc = Pₜₕ / ηₘ.</p>
       <p>Pₘₑc = ${nfmt(RHO * G * spec.Q * k.Hth / spec.etam, 0)} W, ω = ${nfmt(k.w, 2)} rad/s, así que M = ${nfmt(k.torque, 2)} N·m.</p>
       <p>La altura real de ${nfmt(spec.Hreal, 1)} m sirve para el rendimiento hidráulico, ηₕ = H / Hₜₕ = ${nfmt(spec.Hreal / k.Hth, 3)}, pero no cambia el par si ya usas Hₜₕ y ηₘ. Dos trampas: dividir ω usando n en rpm sin el 2π, o usar el caudal útil en la potencia de Euler.</p>`);

    const hSimShut = (k.U2s * k.U2s) / G;
    const s8 = numStep("Parte 1 · Semejanza", "Bomba geométricamente semejante",
      `Misma familia, dimensiones un 75 % mayores (factor 1,75) y velocidad un 20 % menor. Mismo caudal teórico ${nfmt(spec.Q, 2)} m³/s y el mismo β₂ = ${beta}°. Escribe la altura teórica nueva, en m.`,
      [],
      [numField("Hₜₕ", k.Hsim, "m", 1, Math.max(0.6, k.Hsim * 0.02))],
      `<p>Ojo: el caudal nuevo no es el homólogo. Has cambiado tamaño y revoluciones, pero te obligan a seguir pasando ${nfmt(spec.Q, 2)} m³/s. El coeficiente de caudal ya no es el mismo, así que no vale multiplicar la altura vieja por (n₂/n₁)² (D₂/D₁)² y ya está.</p>
       <p>Hay que rehacer el triángulo. D₂' = 0,20 · 1,75, b₂' escala igual, n' = 0,8 · ${spec.n} = ${nfmt(k.n2, 0)} rpm.</p>
       <p>U₂' = ${nfmt(k.U2s, 2)} m/s, Cₘ₂' = ${nfmt(k.Cm2s, 2)} m/s, C₂ᵤ' = U₂' − Cₘ₂' / tan ${beta}° = ${nfmt(k.Cu2s, 2)} m/s.</p>
       <p>Hₜₕ' = U₂' C₂ᵤ' / g = ${nfmt(k.Hsim, 2)} m.</p>
       <p>Si transformas la recta entera con las leyes de semejanza y luego entras en Q = ${nfmt(spec.Q, 2)}, sale lo mismo. Lo que no vale es quedarte solo con el término de caudal cero (te saldría ${nfmt(hSimShut, 1)} m) ni aplicar la semejanza al punto de ${nfmt(k.Hth, 1)} m como si el caudal también escalara.</p>`);

    const qShow = Math.round(c.qL * 10) / 10;
    const s9 = numStep("Parte 2 · Circuito", "Punto de funcionamiento",
      datos2 + " La válvula de salida está abierta al 100 %. Calcula la curva resistente, crúzala con el modelo " + spec.pump + " y escribe el caudal en L/min y la altura en m. Una lectura a ojo de la gráfica, a unos litros de diferencia, cuenta como buena.",
      chart,
      [numField("Q", qShow, "L/min", 0, 8), numField("H", c.H, "m", 1, 1.5)],
      `<p>La bomba da la altura de su curva. El circuito pide Hᵣ = (z₂ − z₁) + pérdidas de tubería + pérdida de la válvula. El punto de trabajo es el cruce, no el caudal de diseño de la parte 1 (eso era otra bomba).</p>
       <p>Con α = 1, Kₛ = 2. En esta tubería el caudal es pequeño y c²/2g es de milímetros: manda la fricción de los ${c.L} m de tubo.</p>
       <p>Hᵣ ≈ ${nfmt(spec.z, 1)} + ${Math.round(c.kf + kSingular() * 2)} Q², con Q en m³/s. Al cruzar con la curva ${spec.pump} sale Q ≈ ${nfmt(qShow, 1)} L/min y H ≈ ${nfmt(c.H, 1)} m. La resistente en ese punto vale ${nfmt(c.hs, 1)} m: tienen que coincidir.</p>
       <p>En el examen se hace a mano: calculas dos o tres puntos de Hᵣ, los pintas encima de la gráfica y lees el corte. No apliques semejanza aquí: la curva del fabricante ya es la real.</p>`);

    const s10 = numStep("Parte 2 · Circuito", "Potencia y rendimiento",
      "En el mismo punto, la potencia es la de la curva de abajo (shaft power) del modelo " + spec.pump + ". Escribe la potencia en kW y el rendimiento (0 a 1, no en %).",
      chart,
      [numField("P", c.PkW, "kW", 2, 0.08), numField("η", c.eta, "", 2, 0.06)],
      `<p>La potencia no se inventa con ρgQH y un rendimiento supuesto: en esta parte el fabricante te la da en la gráfica inferior. En Q ≈ ${nfmt(qShow, 0)} L/min el modelo ${spec.pump} anda por ${nfmt(c.PkW, 2)} kW.</p>
       <p>El rendimiento es la potencia hidráulica útil partida por esa potencia de eje: η = ρ g Q H / P. Con Q en m³/s (pásalo desde L/min dividiendo entre 60 000) sale η ≈ ${nfmt(c.eta, 2)}.</p>
       <p>Si lees la gráfica un poco más arriba o más abajo, 0,55 o 0,62 siguen siendo la misma lectura. No es 0,9: esta bomba, en este circuito tan resistente, no está en el óptimo.</p>`);

    const s11 = numStep("Parte 2 · Cavitación", "Cota máxima de la bomba",
      "¿Hasta qué cota, por encima del depósito inferior, puedes subir la bomba sin que cavite? Usa el NPSH de la curva en el caudal que acabas de obtener. Escríbela en m.",
      chart,
      [numField("z máx", c.zmax, "m", 1, 0.5)],
      `<p>Cavita cuando el NPSH disponible baja del requerido. El requerido se lee en la curva: en este caudal, NPSHᵣₑq ≈ ${nfmt(c.npsh, 2)} m. No es un número de la parte 1.</p>
       <p>NPSH_d = (Pₐₜₘ − Pᵥ)/(ρg) + (z_depósito − z_bomba) − pérdidas de la aspiración. El depósito inferior está a 0 y a la atmósfera.</p>
       <p>(Pₐₜₘ − Pᵥ)/(ρg) = ${nfmt(c.hatm, 2)} m. La aspiración solo tiene ${spec.Lasp} m, así que la pérdida ahí es ${nfmt(c.hfAsp, 3)} m: casi nada. La tubería de impulsión, por larga que sea, no entra en el NPSH.</p>
       <p>En el límite, z_bomba = ${nfmt(c.hatm, 2)} − ${nfmt(c.hfAsp, 3)} − ${nfmt(c.npsh, 2)} = ${nfmt(c.zmax, 2)} m.</p>
       <p>Si te olvidas de restar el NPSHᵣₑq te sale la cota atmosférica, unos ${nfmt(c.hatm, 1)} m, y esa bomba ya estaría cavitando.</p>`);

    const aShow = c.alpha;
    const s12 = numStep("Parte 2 · Regulación", "Cerrar la válvula",
      `Quieres bajar el caudal un ${Math.round(spec.red * 100)} %. Escribe la apertura α (Kₛ = 2/α). Sale un número muy pequeño: la válvula queda casi cerrada.`,
      chart,
      [numField("α", aShow, "", 4, Math.max(Math.abs(aShow) * 0.45, 0.0003))],
      `<p>El caudal nuevo es el ${Math.round((1 - spec.red) * 100)} % del anterior: Q' ≈ ${nfmt(c.q2L, 1)} L/min. En la curva ${spec.pump}, la bomba da ahí H ≈ ${nfmt(c.H2, 1)} m. Sube, porque en una centrífuga a menos caudal hay más altura.</p>
       <p>Esa altura de más, respecto a cota + fricción de tubería, la tiene que comerse la válvula: hᵥ ≈ ${nfmt(c.hValve, 2)} m. Con c tan pequeña en un tubo de 0,1 m, hace falta un Kₛ enorme. Como Kₛ = 2/α, α sale ${nfmt(aShow, 4)}. Traducción física: la válvula queda prácticamente cerrada. No es un 0,5 ni un 0,2.</p>`);

    const s13 = step("Parte 2 · Regulación", "Qué pasa con la cavitación",
      "Con la válvula de impulsión más cerrada y el caudal más bajo, el riesgo de cavitación…",
      chart,
      [
        { text: "Baja: la válvula no está en la aspiración, y tanto el NPSH disponible como el requerido mejoran.", ok: true },
        { text: "Sube, porque cerrar cualquier válvula acerca la cavitación.", ok: false },
        { text: "No cambia: el NPSH solo depende de la cota geométrica.", ok: false },
        { text: "Sube, porque la altura de la bomba aumenta y eso resta NPSH.", ok: false }
      ],
      `<p>La cavitación no empeora. La válvula está en la impulsión, así que no suma pérdida en la aspiración. Al bajar el caudal bajan un poco las pérdidas de aspiración (NPSH disponible sube) y, en la curva, el NPSH requerido también baja (pasa de ${nfmt(c.npsh, 2)} m a unos ${nfmt(c.npsh2, 2)} m). Las dos cosas alejan la cavitación. Cerrar la impulsión no es lo mismo que estrangular la aspiración.</p>`);

    return {
      title: spec.title,
      pump: spec.pump,
      steps: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13]
    };
  }

  function build2024() {
    const Q1 = 70, H1 = 394.9, Q2 = 120, H2 = 404.4;
    const k = (H2 - H1) / (Q2 * Q2 - Q1 * Q1);
    const Ho = H1 - k * Q1 * Q1;
    const Qop = 100, Hop = 400;
    const etah = 0.9, etav = 0.99, etam = 0.98, etamot = 0.97;
    const Ph = RHO * G * Qop * Hop / 1e6;
    const Pmec = Ph / (etah * etav * etam);
    const Pe = Pmec / etamot;
    const D = 5, Prel = 200000, Pv = 2340, Patm = 101300;
    const c = Qop / (Math.PI * (D / 2) * (D / 2));
    const npshd = (Prel + Patm - Pv) / (RHO * G) + (c * c) / (2 * G);
    const npshr = 18.5;
    const f = 0.06, L = 100;
    const hf = (8 * f * L * Qop * Qop) / (Math.PI * Math.PI * Math.pow(D, 5) * G);
    const zb = -hf - Prel / (RHO * G) - (c * c) / (2 * G);

    const s1 = numStep("Resistente", "Ajustar Hᵣ = H₀ + k Q²",
      "En el ensayo a 375 rpm, con la turbina parada y la válvula abierta, se han medido (Q, H) = (70 m³/s, 394,9 m) y (120 m³/s, 404,4 m). Escribe H₀ y k de la resistente Hᵣ = H₀ + k Q², con Q en m³/s.",
      [],
      [numField("H₀", Ho, "m", 1, 1), numField("k", k, "s²/m⁵", 4, 0.00015)],
      `<p>Dos puntos determinan la parábola. Restando: H₂ − H₁ = k (Q₂² − Q₁²).</p>
       <p>9,5 = k (14400 − 4900) → k = 0,001 s²/m⁵. Luego H₀ = 394,9 − 0,001 · 70² = 390 m.</p>
       <p>No es una recta. Y el término constante no es la altura geométrica sola: a caudal cero la columna ya está cargada por el nivel del embalse superior.</p>`);

    const s2 = step("Semejanza", "Al bajar a 360 rpm",
      "La bomba pasa de 375 a 360 rpm. El punto de corte anterior era, leído en la gráfica, Q = 100 m³/s y H = 400 m. ¿Qué puedes hacer con las leyes de semejanza?",
      [],
      [
        { text: "Nada sobre ese punto: el corte nuevo no es el homólogo. Hay que transformar la curva entera y volver a cortar la resistente.", ok: true },
        { text: "Q' = 100 · (360/375) y H' = 400 · (360/375)². El corte escala igual que un punto homólogo.", ok: false },
        { text: "La altura no cambia porque la resistente es la misma. Solo baja el caudal con las rpm.", ok: false },
        { text: "Q y H se mantienen: 15 rpm no se notan en una máquina de este tamaño.", ok: false }
      ],
      `<p>Un punto homólogo conserva el coeficiente de caudal. Al cambiar n, el caudal homólogo también cambia. El circuito, en cambio, sigue pidiendo el mismo H para el mismo Q: la resistente no escala.</p>
       <p>Por eso el corte nuevo no es la imagen por semejanza del corte viejo. En el examen, al hacerlo sobre la figura, el corte a 360 rpm queda cerca de Q = 80 m³/s y H = 396 m, no en 100 · 360/375.</p>
       <p>La solución manuscrita de ese día lo avisa: el punto equivalente no es el homólogo.</p>`);

    const s3 = numStep("Potencia", "En el punto leído Q = 100 m³/s, H = 400 m",
      "ηₕ = 0,90, ηᵥ = 0,99, ηₘ = 0,98. Escribe la potencia hidráulica útil y la potencia mecánica en el eje, en MW.",
      [],
      [numField("P hidráulica", Ph, "MW", 1, 4), numField("P mecánica", Pmec, "MW", 1, 5)],
      `<p>La útil es la que se le da al agua: Pₕ = ρ g Q H = 1000 · 9,81 · 100 · 400 = ${nfmt(Ph, 1)} MW.</p>
       <p>En el eje hay que meter más, porque se pierden fugas, rozamiento y el salto que no llega a ser altura útil. η_global = ηₕ ηᵥ ηₘ = ${nfmt(etah * etav * etam, 3)}.</p>
       <p>Pₘₑc = Pₕ / η_global = ${nfmt(Pmec, 1)} MW. Dividir solo por ηₕ se deja fuera disco y fugas.</p>`);

    const s4 = numStep("Potencia", "Potencia eléctrica",
      "El motor tiene η = 0,97. Escribe la potencia eléctrica absorbida, en MW.",
      [],
      [numField("P eléctrica", Pe, "MW", 1, 5)],
      `<p>El motor tampoco es perfecto: Pₑ = Pₘₑc / 0,97 = ${nfmt(Pe, 1)} MW. Es la cifra que paga la instalación, no la que gana el agua.</p>`);

    const s5 = numStep("Cavitación", "NPSH en la aspiración de 5 m",
      "En ese punto, a la entrada de la bomba (D = 5 m) la presión relativa es 200 kPa. Pᵥ = 2340 Pa y Pₐₜₘ = 101,3 kPa. El NPSH requerido, leído en la curva, es 18,5 m. Escribe el NPSH disponible.",
      [],
      [numField("NPSH disponible", npshd, "m", 1, 0.6)],
      `<p>NPSH_d = (P_abs − Pᵥ)/(ρg) + c²/(2g). La cota de velocidad no es despreciable en un tubo de 5 m a 100 m³/s: c = Q/A = ${nfmt(c, 2)} m/s y c²/2g ≈ ${nfmt(c * c / (2 * G), 2)} m.</p>
       <p>P_abs = 200 kPa + 101,3 kPa. Sale NPSH_d ≈ ${nfmt(npshd, 2)} m, por encima de 18,5 m: no cavita.</p>
       <p>Si usas la presión relativa sin sumar la atmósfera, te quedas corto unos 10 m y declaras cavitación donde no la hay.</p>`);

    const s6 = step("Cavitación", "¿Cavita?",
      "Con NPSH disponible ≈ " + nfmt(npshd, 1) + " m y NPSH requerido = 18,5 m…",
      [],
      [
        { text: "No cavita: disponible mayor que requerido.", ok: true },
        { text: "Cavita, porque 18,5 m ya es un NPSH alto para cualquier bomba.", ok: false },
        { text: "Cavita, porque la presión a la entrada está por debajo de la atmosférica.", ok: false },
        { text: "No se puede saber sin el rendimiento.", ok: false }
      ],
      `<p>El criterio es uno: cavita cuando NPSH_d &lt; NPSH_req. Aquí ${nfmt(npshd, 1)} &gt; 18,5, así que no. El requerido es una característica de la bomba (ensayo, caída de altura del 3 %), no un juicio de si 18 m "parece mucho".</p>`);

    const s7 = numStep("Aspiración", "Cota del eje de la bomba",
      "Aspiración de L = 100 m, D = 5 m, f = 0,06, mismo caudal de 100 m³/s, misma presión relativa de 200 kPa a la entrada. El depósito inferior está a cota 0 y a la atmósfera. Escribe la cota del eje z_b (negativa si queda bajo el agua). Trabaja la presión de entrada en relativo, como indica la nota del examen.",
      [],
      [numField("z_b", zb, "m", 1, 1.5)],
      `<p>Pérdida en el tubo: h_f = 8 f L Q² / (π² D⁵ g) = ${nfmt(hf, 2)} m.</p>
       <p>Bernoulli entre la superficie (z = 0, V = 0, P relativa = 0) y la entrada de la bomba, con la presión en relativo: 0 − h_f = z_b + P_rel/(ρg) + c²/(2g).</p>
       <p>P_rel/(ρg) = ${nfmt(Prel / (RHO * G), 2)} m y c²/(2g) = ${nfmt(c * c / (2 * G), 2)} m, así que z_b = −${nfmt(-zb, 1)} m. La bomba queda sumergida: sin esa cota negativa no llegas a 200 kPa relativos a la entrada.</p>`);

    return {
      title: "Central reversible · 09/01/2024",
      pump: "",
      steps: [s1, s2, s3, s4, s5, s6, s7]
    };
  }

  function buildDrill(topic) {
    let n = 1200, D2 = 0.2, b2 = 0.02, Q = 0.02, beta = 35;
    let w = 1, U2 = 1, Cm2 = 1, Cu2 = 1, Hth = 1, C2 = 1, W2 = 1, alpha2 = 45;
    for (let i = 0; i < 40; i++) {
      n = 1000 + Math.floor(Math.random() * 800);
      D2 = [0.18, 0.2, 0.22, 0.26][Math.floor(Math.random() * 4)];
      b2 = [0.015, 0.018, 0.02, 0.025][Math.floor(Math.random() * 4)];
      Q = [0.012, 0.015, 0.018, 0.02][Math.floor(Math.random() * 4)];
      beta = [30, 35, 40, 45][Math.floor(Math.random() * 4)];
      w = 2 * Math.PI * n / 60;
      U2 = w * (D2 / 2);
      Cm2 = Q / (Math.PI * D2 * b2);
      const tb = beta * Math.PI / 180;
      Cu2 = U2 - Cm2 / Math.tan(tb);
      Hth = U2 * Cu2 / G;
      C2 = Math.hypot(Cm2, Cu2);
      W2 = Cm2 / Math.sin(tb);
      alpha2 = Math.atan2(Cm2, Cu2) * 180 / Math.PI;
      if (Cu2 > 1.5 && Hth > 4) break;
    }
    const tb = beta * Math.PI / 180;
    let title = "Apartado suelto";
    let stepOne = null;

    if (topic === "triangulo") {
      title = "Apartado suelto · triángulo de salida";
      stepOne = numStep("Triángulo", "Cierra la salida",
        `Centrífuga radial, sin prerrotación a la entrada. n = ${n} rpm, D₂ = ${nfmt(D2, 3)} m, b₂ = ${nfmt(b2, 3)} m, Q = ${nfmt(Q, 3)} m³/s, β₂ = ${beta}° medido desde la tangente. Escribe U₂, C₂ᵤ y Hₜₕ.`,
        [],
        [
          numField("U₂", U2, "m/s", 2, 0.2),
          numField("C₂ᵤ", Cu2, "m/s", 2, 0.25),
          numField("Hₜₕ", Hth, "m", 2, Math.max(0.3, Math.abs(Hth) * 0.03))
        ],
        `<p>U₂ = ω R₂, ω = 2πn/60, R₂ = D₂/2. Sale U₂ = ${nfmt(U2, 2)} m/s.</p>
         <p>Cₘ₂ = Q / (π D₂ b₂) = ${nfmt(Cm2, 2)} m/s. Con β₂ desde la tangente, C₂ᵤ = U₂ − Cₘ₂ / tan β₂ = ${nfmt(Cu2, 2)} m/s.</p>
         <p>Euler, entrada sin giro: Hₜₕ = U₂ C₂ᵤ / g = ${nfmt(Hth, 2)} m. C₂ valdría ${nfmt(C2, 2)} m/s y W₂ ${nfmt(W2, 2)} m/s; α₂ = ${nfmt(alpha2, 1)}°.</p>`);
    } else if (topic === "par") {
      const etam = 0.9;
      const Pth = RHO * G * Q * Hth;
      const Pmec = Pth / etam;
      const M = Pmec / w;
      title = "Apartado suelto · par";
      stepOne = numStep("Par", "Par en el eje",
        `Hₜₕ = ${nfmt(Hth, 2)} m a Qₜₕ = ${nfmt(Q, 3)} m³/s, n = ${n} rpm, ηₘ = 0,90. Escribe el par, en N·m.`,
        [],
        [numField("Par", M, "N·m", 1, Math.max(0.5, Math.abs(M) * 0.03))],
        `<p>Pₜₕ = ρ g Q Hₜₕ = ${nfmt(Pth, 0)} W. El eje tiene que dar más: Pₘₑc = Pₜₕ / ηₘ = ${nfmt(Pmec, 0)} W.</p>
         <p>M = Pₘₑc / ω, con ω = 2πn/60 = ${nfmt(w, 2)} rad/s. M = ${nfmt(M, 2)} N·m. Usar rpm en el denominador sin pasar a rad/s lo multiplica por unos 9,5.</p>`);
    } else if (topic === "semejanza") {
      const n2 = Math.round(n * 0.85);
      const D2b = D2 * 1.4;
      const b2b = b2 * 1.4;
      const Cm = Q / (Math.PI * D2b * b2b);
      const U = (2 * Math.PI * n2 / 60) * (D2b / 2);
      const Cu = U - Cm / Math.tan(tb);
      const Hs = U * Cu / G;
      title = "Apartado suelto · semejanza";
      stepOne = numStep("Semejanza", "Mismo caudal, otra máquina",
        `La bomba de antes (D₂ = ${nfmt(D2, 3)} m, n = ${n} rpm, β₂ = ${beta}°) se sustituye por una semejante con D₂ un 40 % mayor y n un 15 % menor, pero obligada al mismo Q = ${nfmt(Q, 3)} m³/s. Escribe la Hₜₕ nueva.`,
        [],
        [numField("Hₜₕ", Hs, "m", 1, Math.max(0.4, Math.abs(Hs) * 0.03))],
        `<p>No escales la altura vieja: el caudal no es el homólogo. Rehaces el triángulo con D₂' = ${nfmt(D2b, 3)} m, b₂' en la misma proporción y n' = ${n2} rpm.</p>
         <p>U₂' = ${nfmt(U, 2)} m/s, Cₘ₂' = ${nfmt(Cm, 2)} m/s, C₂ᵤ' = ${nfmt(Cu, 2)} m/s, Hₜₕ' = U Cᵤ / g = ${nfmt(Hs, 2)} m.</p>`);
    } else if (topic === "npsh") {
      const hatm = (101300 - 2340) / (RHO * G);
      const npsh = 2 + Math.random() * 4;
      const hf = Math.random() * 0.8;
      const zmax = hatm - hf - npsh;
      title = "Apartado suelto · cota NPSH";
      stepOne = numStep("NPSH", "Cota máxima",
        `Depósito de aspiración abierto, a cota 0. (Pₐₜₘ − Pᵥ)/(ρg) = ${nfmt(hatm, 2)} m. Pérdidas de la aspiración = ${nfmt(hf, 2)} m. NPSH requerido, leído en la curva, = ${nfmt(npsh, 2)} m. ¿A qué cota máxima puedes poner la bomba?`,
        [],
        [numField("z máx", zmax, "m", 2, 0.15)],
        `<p>En el límite, NPSH_d = NPSH_req. NPSH_d = (Pₐₜₘ − Pᵥ)/(ρg) − z_bomba − h_aspiración.</p>
         <p>z = ${nfmt(hatm, 2)} − ${nfmt(hf, 2)} − ${nfmt(npsh, 2)} = ${nfmt(zmax, 2)} m. La impulsión no entra. Si no restas el NPSH requerido, dejas la bomba en cota atmosférica y cavita.</p>`);
    } else {
      const A = 28 + Math.random() * 18;
      const B = 80 + Math.random() * 80;
      const z = 8 + Math.random() * 14;
      const kq = 4000 + Math.random() * 12000;
      const disc = A - z;
      const Qs = Math.sqrt(disc / (B + kq));
      const Hs = A - B * Qs * Qs;
      title = "Apartado suelto · cruce H-Q";
      stepOne = numStep("Cruce", "Punto de funcionamiento",
        `La bomba da H = ${nfmt(A, 2)} − ${nfmt(B, 1)} Q². El circuito pide Hᵣ = ${nfmt(z, 2)} + ${nfmt(kq, 0)} Q², con Q en m³/s. Escribe Q en L/s y H en m.`,
        [],
        [numField("Q", Qs * 1000, "L/s", 2, 0.4), numField("H", Hs, "m", 2, 0.3)],
        `<p>En el cruce las dos alturas coinciden: ${nfmt(A, 2)} − ${nfmt(B, 1)} Q² = ${nfmt(z, 2)} + ${nfmt(kq, 0)} Q².</p>
         <p>Q² = (${nfmt(A, 2)} − ${nfmt(z, 2)}) / (${nfmt(B, 1)} + ${nfmt(kq, 0)}) → Q = ${nfmt(Qs * 1000, 2)} L/s y H = ${nfmt(Hs, 2)} m.</p>
         <p>No es el caudal de máximo rendimiento ni el de caudal cero. Es el único punto en el que la bomba da exactamente lo que el circuito pide.</p>`);
    }

    return { title, pump: "", drill: topic, steps: [stepOne] };
  }

  window.TFIProblem = { build, build2024, buildDrill };
})();
