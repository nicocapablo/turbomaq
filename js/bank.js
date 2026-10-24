/* Banco de test: modelo 2026, exámenes anteriores y cálculos nuevos. */
(function () {
  const G = 9.81;

  function q(id, source, topic, prompt, options, answer, explain) {
    return { id, source, topic, prompt, options, answer, explain };
  }

  const QUESTIONS = [
    q("m26-1", "Modelo 2026", "Bombas axiales",
      "Escolliu l’opció falsa en referència a la corba característica d’una bomba axial.",
      [
        "En cas de tenir àleps regulables, hi ha tantes corbes característiques com posicions dels àleps.",
        "La corba H-Q (altura-cabal) és generalment estable per tot el rang de funcionament.",
        "La potència mecànica pot ser elevada a cabals baixos i, per aquest motiu, no es recomana arrancar la bomba amb vàlvula tancada.",
        "La corba H-Q representa l’altura real de la bomba en funció del cabal útil."
      ], 1,
      "<p>Una axial no se comporta como una centrífuga. En la centrífuga la altura cae suave al subir el caudal y la potencia crece con Q: por eso se arranca con la válvula cerrada. En la axial la curva H-Q suele tener una silla a caudales bajos (un tramo inestable) y la potencia es grande precisamente cuando hay poco caudal.</p><p>Los álabes regulables sí multiplican las curvas: cada ángulo es otra máquina. Y H-Q, por definición de curva característica, es altura real frente a caudal útil.</p><p>La frase falsa es la de la curva «estable en todo el rango». Ese es el comportamiento que no tiene.</p>"),

    q("m26-2", "Modelo 2026", "Cavitación",
      "Quina és la funció de l’inductor en una bomba centrífuga?",
      [
        "Augmentar la pressió a l’entrada de la bomba per tal de reduir la cavitació.",
        "Augmentar la pressió a la sortida de la bomba per tal de reduir la cavitació.",
        "Augmentar la velocitat del flux i disminuir la pressió a la sortida de la bomba.",
        "Disminuir la velocitat del flux i augmentar la pressió a la sortida de la bomba."
      ], 0,
      "<p>El inductor es un rodete axial pequeño puesto delante del rodete centrífugo, en la aspiración. No está ahí para «dar más altura» a la salida. Está para subir un poco la presión justo en el ojo, que es donde el NPSH aprieta y donde nace la cavitación.</p><p>Si subes la presión a la entrada del rodete principal, te alejas de la presión de vapor. Esa es toda su función. Bajar la presión o actuar en la salida iría en contra de lo que se quiere evitar.</p>"),

    q("m26-3", "Modelo 2026", "Pérdidas",
      "Escolliu la resposta falsa. Quan treballem a cabals baixos (per sota del punt de disseny QBEP) en una bomba centrífuga:",
      [
        "Tots els rendiments (hidràulic, volumètric i mecànic) disminueixen respecte el BEP.",
        "Les pèrdues per fricció a l’interior del rodet disminueixen respecte el BEP.",
        "Les pèrdues per xoc a l’entrada del rodet augmenten respecte el BEP.",
        "Podem tenir pèrdues per recirculació a l’entrada del rodet."
      ], 0,
      "<p>Por debajo del punto de diseño pasan tres cosas distintas y conviene no mezclarlas. La fricción dentro de los canales va como kQ²: a menos caudal, menos pérdida por rozamiento. El choque hace lo contrario: el agua ya no entra alineada con el álabe y esa pérdida sube. Y si el caudal es muy bajo aparece recirculación a la entrada, con un vórtice que disipa energía.</p><p>Eso está en los apuntes casi con estas palabras. El rendimiento que se hunde por ese motivo es el hidráulico. El volumétrico lo marcan las fugas por las juntas y el mecánico, la fricción de disco (va con ω³D⁵, no con «estar a la izquierda del BEP»). Meter los tres en el mismo saco y decir que todos bajan es la frase que no se sostiene.</p>"),

    q("m26-4", "Modelo 2026", "Cavitación",
      "Quina condició s’ha de complir en una bomba perquè aparegui cavitació?",
      [
        "NPSHd > −NPSHreq",
        "NPSHd < NPSHreq",
        "NPSHd > NPSHreq",
        "NPSHd < −NPSHreq"
      ], 1,
      "<p>NPSH disponible es lo que el circuito le ofrece a la bomba en la brida de aspiración, por encima de la presión de vapor. NPSH requerido es lo que la bomba necesita para no cavitar: lo da el fabricante y crece con el caudal.</p><p>Hay cavitación cuando lo que hay es menos de lo que hace falta: NPSHd &lt; NPSHreq. Si es mayor, todavía no. Los signos negativos no significan nada físico: un NPSH no se compara «al revés».</p>"),

    q("m26-5", "Modelo 2026", "Cavitación",
      "Quines de les següents opcions permet augmentar l’NPSH disponible (NPSHd) a l’entrada d’una bomba instal·lada en un circuit de bombeig entre dos dipòsits?",
      [
        "Augmentar la cota d’instal·lació de la bomba respecte el dipòsit inferior.",
        "Disminuir el nivell de líquid del dipòsit inferior.",
        "Pressuritzar el dipòsit superior.",
        "Disminuir la temperatura del fluid."
      ], 3,
      "<p>El NPSH disponible, con el depósito de aspiración abajo, es la presión del depósito, menos la de vapor, más la altura de líquido que tienes encima de la bomba, menos las pérdidas de la aspiración.</p><p>Subir la bomba o bajar el nivel del depósito inferior te quita altura de aspiración: el NPSH baja. Presurizar el depósito de arriba empuja la impulsión, no la aspiración. Bajar la temperatura baja la presión de vapor, y eso sí deja más margen antes de que el agua hierva. Esa es la que sube el NPSHd.</p>"),

    q("m26-6", "Modelo 2026", "Cavitación",
      "Escolliu l’opció correcta sobre l’NPSH requerit (NPSHreq) d’una bomba.",
      [
        "L’NPSHreq defineix l’NPSH màxim per evitar tenir qualsevol tipus de cavitació a la bomba.",
        "L’NPSHreq sempre disminueix a mesura que augmenta el cabal que circula per la bomba.",
        "L’NPSHreq se sol determinar a partir de mesures experimentals en bancs d’assaig.",
        "L’NPSHreq depèn de la bomba i del circuit a on vagi instal·lada."
      ], 2,
      "<p>El NPSH requerido es una característica de la bomba, no del circuito. El circuito pone el disponible. Y no es «el máximo para que no haya ni una burbuja»: el valor de catálogo suele ser el de cavitación desarrollada, cuando la altura ya ha caído un 3 %. La cavitación incipiente aparece antes.</p><p>Tampoco baja al subir el caudal: la curva de NPSH sube con Q, porque las velocidades en el ojo suben. Se mide en banco, bajando el nivel o la presión de aspiración hasta que la altura cae ese 3 %, a caudal constante.</p>"),

    q("m26-7", "Modelo 2026", "Acoplamiento",
      "Tenim un circuit de bombeig amb una bomba centrífuga que treballa en un punt (H, Q), amb Q més gran que 0. Mantenint el mateix circuit, s’hi instal·la una segona bomba idèntica en sèrie i el sistema passa a (H′, Q′). Escolliu l’opció correcta.",
      [
        "H′ = 2H i Q′ = Q",
        "H′ = H i Q′ = 2Q",
        "H′ = 2H i Q′ = 2Q",
        "Cap de les anteriors és correcte."
      ], 3,
      "<p>Dos bombas en serie, a un mismo caudal, suman alturas. La curva conjunta es el doble de alta. Pero el circuito no se ha movido: sigue siendo la misma parábola. El cruce nuevo no es el punto viejo con la altura doblada, porque a ese caudal el circuito no pide 2H.</p><p>Tampoco es el doble de caudal a la misma altura: eso sería el cuento del paralelo, y ni siquiera el paralelo cae exactamente en 2Q si la resistente sube con Q². El punto nuevo tiene más caudal y más altura que el original, sin ser el doble de las dos cosas. Por eso no vale ninguna de las tres igualdades.</p>"),

    q("m26-8", "Modelo 2026", "Semejanza",
      "Tenim una bomba centrífuga amb H = 20 − 10 Q². Una bomba geomètricament semblant gira al doble de velocitat i té un diàmetre igual al 50 % de l’original. Quina corba li correspon?",
      [
        "H′ = 20 − 160 Q′²",
        "H′ = 20 − 40 Q′²",
        "H′ = 20 − 10 Q′²",
        "H′ = 20 − 80 Q′²"
      ], 0,
      "<p>En semejanza, el caudal escala con n D³ y la altura con n² D². Aquí n′/n = 2 y D′/D = 0,5, así que Q′/Q = 2 · 0,5³ = 0,25 y H′/H = 4 · 0,25 = 1. La altura de los puntos homólogos no cambia; el caudal se queda en la cuarta parte.</p><p>Si en la curva vieja un punto tiene caudal Q y altura H, en la nueva el mismo punto homólogo está en Q′ = Q/4, con la misma H. Sustituye Q = 4 Q′ en H = 20 − 10 Q² y te queda H′ = 20 − 10 · 16 Q′² = 20 − 160 Q′².</p><p>No es la misma curva: aunque el coeficiente de la altura «parezca» igual, el caudal se ha comprimido y el término en Q² se dispara.</p>"),

    q("m26-9", "Modelo 2026", "Regulación",
      "La bomba H = 20 − 10 Q² treballa en un circuit H = 10 + 15 Q². Es vol el nou punt Q′ = 0,50 m³/s i H′ = 17,5 m. Quina opció el permet?",
      [
        "Instal·lar una vàlvula en bypass que recirculi un cabal de 0,232 m³/s.",
        "Instal·lar una vàlvula en sèrie que introdueixi unes pèrdues addicionals hᵥ = 15 Q².",
        "Fer girar la bomba a una velocitat n′ = 1,2 n, mantenint el mateix circuit.",
        "Instal·lar una segona bomba idèntica en sèrie, mantenint el mateix circuit."
      ], 1,
      "<p>Primero mira si la bomba, tal como es, pasa por ese punto. A Q = 0,50, H = 20 − 10 · 0,25 = 17,5 m. Sí: el punto está sobre la curva de la bomba. El circuito original, en ese caudal, solo pide 10 + 15 · 0,25 = 13,75 m. Faltan 3,75 m de pérdida para que el circuito también pase por ahí.</p><p>Una válvula en serie con hᵥ = 15 Q² aporta, a Q = 0,50, justo 3,75 m. El circuito nuevo es 10 + 30 Q² y corta a la bomba en (0,50; 17,5).</p><p>Subir a 1,2 n cambia la curva a H = 28,8 − 10 Q² y el corte con el circuito viejo no es ese punto. Otra bomba en serie tampoco. El bypass reparte caudales; no es la forma de clavar este punto de la bomba.</p>"),

    q("m26-10", "Modelo 2026", "Pérdidas",
      "En quina de les següents turbomàquines les pèrdues per fricció als discs solen ser comparativament més importants?",
      [
        "Bombes axials",
        "Bombes semiaxials",
        "Bombes centrífugues per a altures baixes",
        "Bombes centrífugues per a altures elevades"
      ], 3,
      "<p>La fricción de disco es el rozamiento del fluido atrapado entre la cara del rodete y la carcasa. Crece muy fuerte con el diámetro y con la velocidad: la potencia va como ω³ D⁵. No le quita altura al fluido que pasa por los canales; le quita rendimiento mecánico.</p><p>Eso pesa cuando el disco es grande para la altura que da la máquina, o sea en centrífugas de mucha altura (velocidad específica baja, D grande). En una axial casi no hay «disco» radial. En una centrífuga de poca altura el efecto, en proporción, es menor.</p>"),

    q("m26-11", "Modelo 2026", "Difusor",
      "En una bomba centrífuga ideal amb difusor, quin és l’efecte principal del difusor?",
      [
        "Augmentar la velocitat del flux",
        "Reduir la pressió estàtica",
        "Transformar energia cinètica en energia de pressió",
        "Augmentar la velocitat tangencial"
      ], 2,
      "<p>A la salida del rodete el agua lleva mucha velocidad absoluta, sobre todo si los álabes empujan fuerte. Esa energía cinética, si no la recuperas, se pierde en la descarga. El difusor es un conducto que se abre: frena el fluido con cuidado y, por Bernoulli, esa caída de velocidad se convierte en presión estática.</p><p>No acelera, no baja la presión y no aumenta la componente tangencial. Hace el trabajo contrario: ordena el flujo y cambia cinética por presión.</p>"),

    q("m26-12", "Modelo 2026", "Triángulos",
      "En un triangle de velocitats, si augmenta la velocitat meridiana mantenint la velocitat de rotació constant:",
      [
        "L’angle β disminueix",
        "L’angle β augmenta",
        "L’angle α disminueix sempre",
        "No afecta els angles"
      ], 1,
      "<p>En esta asignatura β es el ángulo de la velocidad relativa medido desde la dirección tangencial, la de U. En el triángulo, tan β = Cₘ / (U − Cᵤ). U no cambia, porque la velocidad de giro no cambia.</p><p>Si crece la componente meridiana, el triángulo se hace más alto y β se abre: el flujo relativo se acerca más a la dirección radial. No es verdad que α baje siempre (α depende de cómo esté Cᵤ) ni que los ángulos se queden quietos.</p>"),

    q("m26-13", "Modelo 2026", "Axiales",
      "Quina és la funció d’una directriu a la sortida en una màquina generadora axial?",
      [
        "Augmentar C₃ᵤ",
        "Aconseguir flux axial i recuperar pressió",
        "Fer W₂ = 0",
        "Reduir U₂"
      ], 1,
      "<p>Una bomba o un ventilador axial deja, a la salida del rodete, una componente tangencial: el fluido sale girando. Esa giro no te hace ninguna falta en la tubería y además es energía cinética que puedes recuperar.</p><p>La directriz de salida endereza el flujo (lo deja axial, Cᵤ hacia cero) y, al frenar esa componente, sube la presión estática. No aumenta el giro residual, no anula la velocidad relativa y no cambia U, que la marca el eje.</p>"),

    q("m26-14", "Modelo 2026", "Triángulos",
      "Quin és l’efecte de la desviació en un rodet centrífug?",
      [
        "Augmenta C₂ᵤ",
        "No afecta",
        "Redueix C₂ᵤ",
        "Augmenta U₂"
      ], 2,
      "<p>Con infinitos álabes el fluido saldría exactamente en la dirección del álabe. Con los álabes que de verdad hay, el flujo se queda un poco corto: se desvía. Sale con menos giro del que el álabe pretendía.</p><p>Menos giro de salida es menos C₂ᵤ. Y como Hₜₕ = (U₂ C₂ᵤ − U₁ C₁ᵤ) / g, la altura teórica baja respecto al álabe infinito. U₂ no se entera: es ωR, y el eje sigue igual.</p>"),

    q("m26-15", "Modelo 2026", "Inestabilidad",
      "Quina condició (encara que no sigui suficient) s’ha de donar per tenir rotating stall o despreniment rotatiu?",
      [
        "Cabal per sobre de disseny en algunes turbomàquines",
        "Punt de màxim rendiment en algunes turbomàquines",
        "Cabal per sota de disseny en algunes turbomàquines",
        "Només es dona en turbines Pelton"
      ], 2,
      "<p>El desprendimiento rotativo aparece cuando algún canal del rodete entra en pérdida y esa pérdida se va corriendo de un canal al siguiente. Para que un álabe entre en pérdida hace falta incidencia fuerte, y eso ocurre cuando el caudal está por debajo del de diseño: el triángulo de entrada ya no coincide con el álabe.</p><p>No es una cosa del punto de máximo rendimiento, ni de ir sobrado de caudal, ni exclusiva de la Pelton (en la Pelton ni siquiera hay canales de ese tipo). Hace falta caudal bajo; con eso solo no basta, pero sin eso no arranca.</p>"),

    q("m26-16", "Modelo 2026", "Ventiladores",
      "En un ventilador centrífug amb àleps corbats cap endavant, quina afirmació és correcta?",
      [
        "Per a un mateix diàmetre i velocitat de gir, acostuma a donar menys cabal que un de àleps corbats cap enrere.",
        "El fluid surt del rodet amb una component de velocitat absoluta elevada.",
        "Sempre té millor rendiment que un ventilador amb àleps corbats cap enrere.",
        "S’utilitza principalment per a salts elevats i cabals petits."
      ], 1,
      "<p>Álabe hacia adelante quiere decir β₂ &gt; 90°: la velocidad relativa sale «a favor» de U y la velocidad absoluta de salida se dispara. Por eso C₂ es grande. Hace falta una voluta que recupere esa cinética, y aun así el rendimiento suele ser peor que el del álabe hacia atrás, que es el que se usa cuando importan el salto y el rendimiento.</p><p>El de adelante se usa para mucho caudal y poca presión, a menudo más compacto, no para saltos altos y caudales pequeños. Y desde luego no da menos caudal que el de atrás a igualdad de D y n: da más energía específica precisamente por ese C₂ᵤ grande.</p>"),

    q("m26-17", "Modelo 2026", "Euler",
      "En un rodet centrífug, considerant l’equació d’Euler, quina diferència conceptual hi ha entre àleps infinits i àleps finits?",
      [
        "En ambdós casos la component tangencial de la velocitat absoluta a la sortida és la mateixa.",
        "Amb àleps infinits, el flux segueix exactament la direcció dels àleps i es compleix el triangle de velocitats ideal.",
        "Amb àleps finits, no es pot aplicar l’equació d’Euler.",
        "Amb àleps infinits, la velocitat meridiana és nul·la."
      ], 1,
      "<p>Euler se cumple siempre: la energía por unidad de masa es U₂ C₂ᵤ − U₁ C₁ᵤ, con las velocidades que de verdad hay. No hace falta que los álabes sean infinitos para escribirla.</p><p>Lo que cambia es el triángulo. Con infinitos álabes el fluido no tiene por dónde escurrirse y sigue el álabe: el triángulo es el ideal y C₂ᵤ es el del metal. Con álabes finitos hay desviación, C₂ᵤ es menor y la altura baja. La velocidad meridiana no se anula en ningún caso: es la que lleva el caudal, Cₘ = Q / (π D b).</p>"),

    q("m26-18", "Modelo 2026", "Turbinas",
      "Quina afirmació és certa sobre una turbina de reacció?",
      [
        "El cabal és constant.",
        "Només transfereix energia cinètica.",
        "Hi ha caiguda de pressió.",
        "Està a pressió atmosfèrica."
      ], 2,
      "<p>Reacción quiere decir que parte de la caída de presión ocurre dentro del rodete, no solo en el inyector. El fluido entra al álabe con presión y sale con menos: hay un grado de reacción mayor que cero. Francis y Kaplan son de reacción.</p><p>La que solo intercambia energía cinética, y además trabaja a la atmósfera, es la de acción: la Pelton. «El caudal es constante» no define nada de esto.</p>"),

    q("m26-19", "Modelo 2026", "Cálculo",
      "Turbina hidràulica axial de reacció: n = 128 rpm, diàmetre mig 1,80 m, diàmetre exterior 2,40 m, diàmetre del cub 1,20 m, Q = 18,7 m³/s. La velocitat absoluta entra amb 20° respecte la direcció tangencial i a la sortida no hi ha component tangencial. Quina és l’alçada teòrica intercanviada al rodet?",
      ["9,3 m", "13,9 m", "18,6 m", "24,1 m"], 2,
      "<p>En una turbina, Euler da la altura que el rodete le saca al agua: Hₜₕ = (U₁ C₁ᵤ − U₂ C₂ᵤ) / g. Te dicen que a la salida el flujo es axial, así que C₂ᵤ = 0 y solo queda U₁ C₁ᵤ / g. U se toma en el diámetro medio.</p><p>U₁ = π · 1,80 · 128 / 60 = 12,06 m/s. El área de paso es la corona: π/4 · (2,40² − 1,20²) = 3,393 m². Cₘ = 18,7 / 3,393 = 5,51 m/s.</p><p>20° es desde la tangente, así que C₁ᵤ = Cₘ / tan 20° = 15,14 m/s. Hₜₕ = 12,06 · 15,14 / 9,81 = 18,6 m. La mitad, 9,3 m, sale si usas el radio como si fuera el diámetro o si olvidas pasar el ángulo a la componente tangencial.</p>"),

    q("m26-20", "Modelo 2026", "Cálculo",
      "Bomba centrífuga ideal, sense prerotació i amb entrada radial. n = 1146 rpm, D₂ = 0,40 m, b₂ = 0,08 m, Q = 0,60 m³/s, β₂f = 45°. Quina és l’alçada teòrica transferida?",
      ["22,0 m", "30,6 m", "44,0 m", "57,0 m"], 2,
      "<p>Entrada radial y sin prerrotación: C₁ᵤ = 0. Toda la altura de Euler está en la salida, Hₜₕ = U₂ C₂ᵤ / g.</p><p>U₂ = π · 0,40 · 1146 / 60 = 24,0 m/s. Cₘ₂ = 0,60 / (π · 0,40 · 0,08) = 5,97 m/s. Con β₂ = 45° medido desde la tangente, tan β₂ = 1 y C₂ᵤ = U₂ − Cₘ₂ = 18,03 m/s.</p><p>Hₜₕ = 24,0 · 18,03 / 9,81 = 44,0 m. Si te olvidas de restar Cₘ₂ y usas C₂ᵤ = U₂, te vas a U₂²/g ≈ 59 m, que no está ni en las opciones limpias; 22 m es la mitad, el fallo de usar el radio como diámetro.</p>"),

    q("e23-4", "Examen 24/01/2023", "Cavitación",
      "Per evitar el risc de cavitació en una bomba:",
      [
        "És convenient reduir la cota de la bomba i augmentar el diàmetre de la canonada d’aspiració.",
        "És convenient augmentar la cota de la bomba i augmentar el diàmetre de la canonada d’aspiració.",
        "És convenient augmentar la cota de la bomba i disminuir el diàmetre de la canonada d’aspiració.",
        "És convenient disminuir la cota de la bomba i disminuir el diàmetre de la canonada d’aspiració."
      ], 0,
      "<p>Para no cavitar hay que subir el NPSH disponible o, si pudieras, bajar el requerido. Sin cambiar de bomba, juegas con el disponible.</p><p>Bajar la cota de la bomba la acerca al depósito de aspiración: ganas altura de líquido. Aumentar el diámetro de aspiración baja la velocidad y, con ella, la pérdida de carga de esa tubería. Las dos cosas suman. Subir la bomba o estrechar la aspiración hacen lo contrario.</p>"),

    q("e23-12", "Examen 24/01/2023", "Turbinas",
      "En una turbina Francis sempre es compleix:",
      [
        "Les components meridianes de les velocitats absolutes són iguals, Cₘ₁ = Cₘ₂.",
        "La velocitat del rodet a l’entrada és igual a la de sortida, u₁ = u₂.",
        "a i b són certes.",
        "Cap de les anteriors."
      ], 3,
      "<p>Una Francis no es un tubo de sección constante. El agua entra a un diámetro grande, con mucho U, y sale más adentro, hacia el tubo de aspiración, con otro diámetro y otra anchura de canal. Por eso u₁ no es u₂: si lo fueran, estarías describiendo una axial.</p><p>Tampoco Cₘ₁ = Cₘ₂. La componente meridiana es caudal entre área de paso, y el área a la entrada del rodete no tiene por qué ser la de salida. Las dos frases fallan, así que no «siempre» se cumple ninguna.</p>"),

    q("e23-13", "Examen 24/01/2023", "Turbinas",
      "Pel que fa a la formació de la torxa al tub d’aspiració:",
      [
        "És més probable en una turbina Francis que en una Kaplan.",
        "És més probable en una Kaplan que en una Francis.",
        "És més probable en una Pelton que en una Kaplan.",
        "Cap de les anteriors."
      ], 0,
      "<p>La torxa es el vórtice que se forma en el tubo de aspiración cuando el agua sale del rodete todavía girando. Aparece sobre todo a carga parcial, cuando C₂ᵤ no es cero.</p><p>La Kaplan puede cerrar los álabes y seguir cerca del diseño en un rango ancho de caudales, así que ese giro residual se controla mejor. La Francis tiene la geometría fija: en cuanto te alejas del caudal de diseño, el tubo de aspiración ve la torxa antes. La Pelton ni tiene tubo de aspiración en carga: el rodete trabaja a la atmósfera.</p>"),

    q("e23-14", "Examen 24/01/2023", "Turbinas",
      "El rendiment hidràulic en una turbina es defineix com:",
      [
        "El quocient entre el salt brut i el salt net.",
        "El quocient entre el salt net i el salt brut.",
        "El quocient entre el salt net i el salt brut menys les pèrdues del circuit.",
        "Cap de les anteriors."
      ], 3,
      "<p>El salto bruto es la diferencia de cotas de los depósitos. El salto neto es lo que de verdad llega a la máquina, bruto menos pérdidas de los conductos. Ninguno de los dos cocientes es el rendimiento hidráulico del rodete.</p><p>El rendimiento hidráulico compara la altura que el rodete intercambia por Euler con el salto neto: ηₕ = Hᵤ / Hₙ. Las opciones hablan solo de saltos de la instalación, sin esa altura intercambiada. Por eso no vale ninguna.</p>"),

    q("e23-15", "Examen 24/01/2023", "Turbinas",
      "Una condició de disseny d’una turbina Pelton és:",
      [
        "Cᵤ₂ = 0.",
        "Cₘ₂ = 0.",
        "C₁ = u / 2.",
        "Cap de les anteriors."
      ], 3,
      "<p>En una Pelton el máximo rendimiento sale cuando la cuchara corre a la mitad de la velocidad del chorro: u = C₁ / 2, o sea C₁ = 2u. La opción que pone C₁ = u/2 está dada la vuelta.</p><p>Cᵤ₂ = 0 es la condición de salida axial de una turbina de reacción, no de una Pelton. Y Cₘ₂ = 0 no es una condición de diseño del chorro. La condición buena no está escrita, así que la respuesta es «ninguna de las anteriores».</p>"),

    q("e23-16", "Examen 24/01/2023", "Turbinas",
      "A quina condició de càrrega treballa una turbina Francis que gira a 600 rpm, amb Q = 2 m³/s i sense desviació a la sortida? D₂ = 0,3 m, b₂ = 0,2 m, β₂ àlep = 45°.",
      ["Càrrega parcial", "Sobrecàrrega", "Punt de disseny", "No es pot saber"], 1,
      "<p>Sin desviación, el flujo sigue al álabe: β₂ del agua es 45°. U₂ = π · 0,3 · 600 / 60 = 9,42 m/s. Cₘ₂ = 2 / (π · 0,3 · 0,2) = 10,61 m/s.</p><p>Con β medido desde la tangente, la componente tangencial de la velocidad relativa es Cₘ / tan β = 10,61 m/s, mayor que U. Entonces C₂ᵤ = U − Wᵤ sale negativa: el agua gira en contra del rodete a la salida.</p><p>Eso no es el diseño. En diseño, en una Francis, se busca salida sin ese giro (o el giro justo del punto de proyecto). Un Cₘ tan grande respecto a U quiere decir que está pasando más caudal del que el álabe de 45° puede tragar alineado: es sobrecarga, no carga parcial.</p>"),

    q("e23-17", "Examen 24/01/2023", "Cálculo",
      "Quin cabal real passa per l’interior del rodet d’una turbina que gira a 900 rpm i fa un parell a l’eix de 53051,65 N·m? Salt brut 60 m, pèrdues als conductes 2 m, ηₕ = 0,93, ηₘ = 0,97, ηᵥ = 0,95, ηₑ = 0,98.",
      ["9,74 m³/s", "8,35 m³/s", "7,95 m³/s", "10,25 m³/s"], 0,
      "<p>El par y las revoluciones te dan la potencia mecánica, no el caudal. ω = 900 · 2π / 60 = 94,25 rad/s, así que Pₘₑc = 53051,65 · 94,25 = 5,00 MW. El salto neto es 60 − 2 = 58 m: las pérdidas de conducto no las ve el rodete como salto útil.</p><p>Pₘₑc = ρ g Q Hₙ ηₕ ηᵥ ηₘ. Despejando, el caudal del circuito es 5·10⁶ / (1000 · 9,81 · 58 · 0,93 · 0,97 · 0,95) = 10,25 m³/s. Ese 10,25 es el que circula por la instalación.</p><p>El que pide el enunciado es el que pasa por dentro del rodete. El rendimiento volumétrico es justamente el cociente entre esos dos: Qᵣₒdₑₜ = ηᵥ · Q = 0,95 · 10,25 = 9,74 m³/s. Quedarte en 10,25 es olvidar que parte del caudal no cruza el rodete.</p>"),

    q("e23-18", "Examen 24/01/2023", "Cálculo",
      "Ventilador axial: D punta = 2,3 m, D base = 1,5 m, Q = 6500 m³/min, n = 950 rpm. A la sortida dels àleps, C = 85 m/s i l’altura teòrica és 500 m d’aire. Entrada axial. Quin increment de pressió estàtica dona el rodet? (ρ aire ≈ 1,2 kg/m³).",
      ["2786 Pa", "236 Pa", "28459 Pa", "0 Pa"], 0,
      "<p>La altura teórica de Euler es energía total por unidad de peso: incluye lo que se ha vuelto presión y lo que se ha quedado en velocidad. Si quieres solo la presión estática, tienes que quitar el aumento de energía cinética.</p><p>Entrada axial: C₁ es la velocidad meridiana. El área de la corona es π/4 · (2,3² − 1,5²) = 2,388 m² y Q = 6500/60 = 108,3 m³/s, así que C₁ = Cₘ = 45,4 m/s. C₂ = 85 m/s.</p><p>Δp / ρ = g Hₜₕ − (C₂² − C₁²) / 2 = 9,81 · 500 − (85² − 45,4²) / 2 = 2322 J/kg. Con ρ = 1,2, Δp = 2786 Pa. Si multiplicas ρ g H sin restar la cinética te vas a unos 5900 Pa y no aciertas la opción; 0 Pa sería decir que todo se ha ido en velocidad, y no es el caso.</p>"),

    q("e23-19", "Examen 24/01/2023", "Cálculo",
      "Una bomba aspira Q = 0,02 m³/s d’un dipòsit tancat i està 5 m per sobre de la superfície lliure. L aspiració = 30 m, f = 0,004, D = 0,1 m, Pᵥ = 2300 Pa, Pₐₜₘ = 1 bar. Si el NPSH disponible és 7 m, a quina pressió relativa està el dipòsit?",
      ["23911 Pa", "99850 Pa", "52148 Pa", "1200 Pa"], 0,
      "<p>El NPSH disponible de un depósito cerrado es (P_depósito − Pᵥ)/(ρg) + (z_depósito − z_bomba) − pérdidas de aspiración. Aquí z_bomba − z_superficie = 5 m, así que el término de cotas vale −5 m. Y te dicen que ese NPSH es 7 m: hay que despejar la presión del depósito.</p><p>La pérdida de aspiración, con f L Q², sale unos 0,40 m, y la presión de vapor son 2300/9810 ≈ 0,23 m. Juntando: 7 = P/(ρg) − 0,23 − 5 − 0,40. P/(ρg) ≈ 12,63 m, P absoluta ≈ 123900 Pa. La relativa, restando 1 bar, es unos 23900 Pa.</p><p>99850 Pa sería olvidar que te piden la relativa y devolver casi la atmosférica. El 5 m de altura de la bomba resta: sin ese término la presión te sale mucho más baja.</p>"),

    q("e23-20", "Examen 24/01/2023", "Semejanza",
      "Un model de ventilador de D = 5 cm té rendiment global 0,85. El prototip té D = 2 m, impulsa 4000 m³/h d’aire i dona 25 m d’aigua. La llei d’escala és (1 − ηₚ)/(1 − ηₘ) = (Dₘ/Dₚ)^0,25. Quina potència consumeix el prototip? (ρ aire no fa falta: 25 m.c.a. és una pressió.)",
      ["290 kW", "270 kW", "310 kW", "200 kW"], 0,
      "<p>El rendimiento no se conserva al saltar de escala: el modelo es pequeño y el prototipo, grande, pierde menos en proporción. (Dₘ/Dₚ) = 0,05/2 = 0,025. Elevado a 0,25 da 0,398. Entonces 1 − ηₚ = 0,15 · 0,398 y ηₚ ≈ 0,94.</p><p>«25 m de columna de agua» no es una altura de aire: es una presión, Δp = 25 · 1000 · 9,81 = 2,453·10⁵ Pa. Q = 4000/3600 = 1,111 m³/s. La potencia hidráulica es Q · Δp = 272,5 kW. La de eje es esa partida por el rendimiento: 272,5 / 0,94 ≈ 290 kW.</p><p>Si usas ρ del aire y 25 m como altura de aire, la potencia te sale en cientos de vatios y ninguna opción encaja. El enunciado dice metros de agua a propósito.</p>"),

    q("r23-1", "Reevaluación 03/07/2023", "Ventiladores",
      "Quan es parla de ventiladors ens referim a:",
      [
        "Turbomàquina generadora de flux incompressible.",
        "Turbomàquina generadora de flux compressible.",
        "Turbomàquina receptora de flux incompressible.",
        "Turbomàquina receptora de flux compressible."
      ], 0,
      "<p>Generadora quiere decir que le entrega energía al fluido: bombas y ventiladores. Receptora quiere decir que se la quita: turbinas. El ventilador mueve aire o gas, pero el salto de presión es lo bastante pequeño como para tratar el fluido como incompresible. Si la compresibilidad manda, ya estás en un compresor, y eso es otra asignatura.</p>"),

    q("r23-2", "Reevaluación 03/07/2023", "Turbinas",
      "L’energia per unitat de pes que una turbina hidràulica pot teòricament extreure d’un fluid s’anomena:",
      ["Salt net", "Salt brut", "Altura d’elevació", "Cota piezomètrica"], 0,
      "<p>El salto bruto es la diferencia geométrica entre depósitos. Por el camino, en la tubería forzada, se pierde carga. Lo que la turbina puede llegar a extraer es lo que queda en la máquina: el salto neto.</p><p>La altura de elevación es el nombre de la energía que aporta una bomba, no una turbina. La cota piezométrica es solo presión más cota, sin la historia energética de la máquina.</p>"),

    q("r23-3", "Reevaluación 03/07/2023", "Circuitos",
      "La corba resistent d’un sistema de bombeig simple entre dos dipòsits oberts a l’atmosfera, sense pèrdues singulars locals, es calcula com:",
      [
        "Diferència de cotes entre superfícies lliures + pèrdues per fricció a les canonades + pèrdues per difusió.",
        "Diferència de cotes entre les bases dels dipòsits + fricció + difusió.",
        "Diferència de cotes entre superfícies lliures + pèrdues per difusió, sense fricció.",
        "Diferència entre la base del dipòsit superior i la superfície del inferior + fricció + difusió."
      ], 0,
      "<p>La resistente es lo que el circuito le exige a la bomba para cada caudal. Entre dos depósitos abiertos, la cota que cuenta es la de las superficies libres, no la del fondo del depósito: el fondo no es por donde sale el agua hacia la tubería en el balance de energía.</p><p>Aunque el enunciado diga que no hay pérdidas singulares de válvulas, a la salida el chorro se frena contra el depósito grande y esa energía cinética no se recupera: es la pérdida por difusión. Y la fricción de la tubería, f L c²/(2g), va siempre. Las tres piezas son cota de láminas libres, fricción y difusión.</p>"),

    q("r23-4", "Reevaluación 03/07/2023", "Semejanza",
      "Quan s’aplica la semblança a les màquines hidràuliques, en els rangs de funcionament normals s’observa que:",
      [
        "Reynolds i rugositat relativa són constants.",
        "Reynolds i rugositat relativa no són constants.",
        "El coeficient de pressió i Reynolds són constants.",
        "El coeficient de pressió i el coeficient de cabal són constants."
      ], 3,
      "<p>Semejanza, en el rango normal de estas máquinas, quiere decir que dos puntos homólogos comparten los coeficientes adimensionales: el de caudal φ = Q / (n D³) y el de presión ψ = gH / (n² D²). De ahí salen las leyes de afinidad. En ese rango (Reynolds alto) esos coeficientes se mantienen, y por eso puedes pasar de una curva a otra.</p><p>Reynolds no se conserva al cambiar tamaño o velocidad, y la rugosidad relativa tampoco si la rugosidad absoluta no escala con D. Esa es la razón de que el rendimiento sí cambie un poco con la escala. Pero lo que la semejanza da por constante, y lo que se observa en el rango normal, son los coeficientes de presión y de caudal.</p>"),

    q("r23-5", "Reevaluación 03/07/2023", "Difusor",
      "Per dissenyar bé el difusor d’una bomba centrífuga, en quina direcció l’orientaries?",
      ["La de C a la sortida", "La de W a la sortida", "La de U a la sortida", "La de W a l’entrada"], 0,
      "<p>El difusor recoge el agua que ya ha salido del rodete. El agua, respecto a la carcasa fija, se mueve con la velocidad absoluta C, no con la relativa W (esa es respecto al álabe, que se está yendo) ni con U (esa es la del metal).</p><p>Si orientas los álabes del difusor como C₂, el flujo entra sin choque y el conducto puede frenarlo y pasar cinética a presión. Orientarlo como W sería diseñar otro rodete, no un difusor.</p>"),

    q("r23-6", "Reevaluación 03/07/2023", "Ventiladores",
      "En ventiladors centrífugs, l’angle β de sortida de l’àlep pot estar:",
      [
        "Tant per sota de 90° com per sobre de 90°.",
        "Només per sota de 90°.",
        "Només per sobre de 90°.",
        "Només igual a 90°."
      ], 0,
      "<p>β₂, desde la tangente, clasifica el álabe. Menor que 90°: curvado hacia atrás, el de mejor rendimiento. Igual a 90°: radial. Mayor que 90°: curvado hacia adelante, mucho caudal y mucha velocidad absoluta de salida, peor rendimiento. Los tres existen en ventiladores. No hay un único rango.</p>"),

    q("r23-7", "Reevaluación 03/07/2023", "Semejanza",
      "Bomba H = 100 − 2000 Q². Se’n fa una de semblant que gira un 35 % més lenta i és un 13 % més petita. El circuit és H = 40 + 300 Q². Quin cabal dona?",
      ["No dona cap cabal", "0,162 m³/s", "0,224 m³/s", "0,050 m³/s"], 0,
      "<p>n′/n = 0,65 y D′/D = 0,87. El caudal homólogo escala con 0,65 · 0,87³ ≈ 0,428 y la altura con 0,65² · 0,87² ≈ 0,320. La curva nueva es H′ ≈ 32,0 − 3490 Q². El término independiente ya es 32 m, y el circuito a caudal cero pide 40 m.</p><p>La bomba, incluso parada de caudal, no llega a la cota del circuito. No hay cruce: 32 − 3490 Q² = 40 + 300 Q² no tiene solución real. No es un caudal pequeño; es que la máquina se ha quedado corta.</p>"),

    q("r23-8", "Reevaluación 03/07/2023", "Cálculo",
      "Bomba axial: Q = 78 m³/h, D cub = 45 mm, D punta = 138 mm, n = 789 rpm. A D = 93 mm l’àlep surt a 43° i el fluid es desvia 7°. Quin angle d’entrada han de tenir les directrius de sortida en aquest diàmetre?",
      ["45,2°", "22,9°", "36,0°", "90°"], 0,
      "<p>La directriz fija tiene que recibir el flujo absoluto, no el relativo. Primero el triángulo del rodete a ese diámetro, y de ahí sale α₂, que es el ángulo de entrada de la directriz.</p><p>La desviación de 7° abre el flujo respecto al álabe: β del fluido = 43° − 7° = 36°. Cₘ = Q / área de la corona = (78/3600) / (π/4 · (0,138² − 0,045²)) = 1,62 m/s. U a 93 mm es π · 0,093 · 789 / 60 = 3,84 m/s.</p><p>C₂ᵤ = U − Cₘ / tan 36° = 1,61 m/s. α₂ = arctan(Cₘ / C₂ᵤ) = 45,2°. 36° es el β del fluido, que es lo que tiene el álabe, no la directriz. 90° sería creer que la salida ya es axial sin directriz.</p>"),

    q("r23-9", "Reevaluación 03/07/2023", "Cálculo",
      "Una bomba impulsa 1250 m³/h. D aspiració = 0,50 m, D impulsió = 0,45 m, z entrada = 2 m, z sortida = 2,3 m, p relativa entrada = −0,82 bar, p relativa sortida = 11,6 bar. Energia específica aportada al fluid?",
      ["1245,8 m²/s²", "127 m²/s²", "693,7 m²/s²", "70,7 m²/s²"], 0,
      "<p>Energía específica es por unidad de masa, en J/kg o m²/s², no la altura en metros. Entre las bridas: e = (p₂ − p₁)/ρ + (c₂² − c₁²)/2 + g (z₂ − z₁).</p><p>Q = 1250/3600 = 0,347 m³/s. c₁ = 1,77 m/s y c₂ = 2,18 m/s: la cinética casi no aporta. g Δz = 2,9. El salto de presión es 11,6 − (−0,82) = 12,42 bar = 1,242·10⁶ Pa, y dividido entre 1000 da 1242 m²/s². Suma: 1245,8 m²/s².</p><p>127 m sería el resultado si te quedas en altura (divides otra vez entre g) y encima lo llamas energía específica. Las unidades del enunciado te avisan.</p>"),

    q("r23-10", "Reevaluación 03/07/2023", "Semejanza",
      "Màquina amb rendiment 72 % a un cabal. Una de semblant, un 75 % més gran i un 30 % més ràpida, al punt homòleg. Amb (1 − ηₚ)/(1 − ηₘ) = (Dₘ/Dₚ)^0,25, quin rendiment aproximat té?",
      ["76 %", "72 %", "54 %", "23 %"], 0,
      "<p>En el punto homólogo los coeficientes de caudal y de altura coinciden, pero el rendimiento mejora un poco al crecer la máquina, porque Reynolds sube y la rugosidad relativa baja. La fórmula de escala del curso solo depende del diámetro, no de las revoluciones.</p><p>Un 75 % más grande es Dₚ = 1,75 Dₘ, así que Dₘ/Dₚ = 0,571. Elevado a 0,25 da 0,87. 1 − ηₚ = (1 − 0,72) · 0,87 = 0,243, y ηₚ ≈ 76 %. Quedarte en 72 % es negar el efecto de escala. 54 % o 23 % sería empeorar la máquina grande, al revés de lo que pasa.</p>"),

    q("r23-11", "Reevaluación 03/07/2023", "Construcción",
      "Es vol mantenir l’empenta axial d’una bomba en valors reduïts. Quina triaries?",
      ["Multicel·lular", "De doble entrada", "Amb directrius a l’entrada", "Rodet obert"], 1,
      "<p>La empenta axial es la fuerza con la que la presión empuja el rodete hacia la aspiración. Duele en el cojinete. La forma clásica de equilibrarla sin complicar el cojinete es el rodete de doble entrada: dos ojos, dos flujos opuestos, y las fuerzas axiales se cancelan.</p><p>Multicelular apila escalones y suele aumentar el problema axial si no lo equilibras aparte. Las directrices de entrada ordenan el flujo; no anulan esa fuerza. El rodete abierto cambia las fugas y la fricción, no el equilibrio axial.</p>"),

    q("r23-12", "Reevaluación 03/07/2023", "Pérdidas",
      "Quina afirmació sobre les juntes és certa?",
      [
        "Augmenten el rendiment mecànic.",
        "Augmenten el rendiment hidràulic.",
        "Augmenten el cabal que passa pel rodet.",
        "Augmenten el rendiment volumètric."
      ], 3,
      "<p>La junta (el anillo de cierre entre rodete y carcasa) existe para que el agua a presión no se cuele de vuelta a la aspiración. Menos fuga significa que una fracción mayor del caudal que atraviesa el rodete sale de verdad por la impulsión: sube el rendimiento volumétrico, ηᵥ = Q / Qₜₕ.</p><p>No sube el mecánico: al contrario, la junta roza un poco y ese rozamiento es una pérdida mecánica. Tampoco cambia el rendimiento hidráulico, que va de alturas, ni aumenta el caudal por el rodete: lo que hace es que se escape menos.</p>"),

    q("r23-13", "Reevaluación 03/07/2023", "Cavitación",
      "En un banc es vol el NPSHreq de cavitació desenvolupada, a un cabal fix. Quin criteri serveix?",
      [
        "Mirar o escoltar quan apareixen les primeres bombolles.",
        "Mirar només un manòmetre a l’entrada.",
        "Veure quan l’altura d’elevació cau al voltant d’un 3 %, amb el cabal constant.",
        "No es pot determinar en un laboratori."
      ], 2,
      "<p>Hay dos NPSH que la gente mezcla. El de cavitación incipiente es cuando nacen las primeras burbujas: se ve o se oye, y el número es más alto. El de cavitación desarrollada, el que publican los fabricantes como NPSHreq, es otro: se baja la aspiración, se mantiene el caudal, y se apunta el NPSH en el momento en que la altura de la bomba ya ha caído un 3 %.</p><p>Un manómetro suelto a la entrada no te dice eso si no lo cruzas con la altura que está dando la bomba. Y sí se mide en laboratorio: es exactamente para lo que está el banco de cavitación.</p>"),

    q("r23-14", "Reevaluación 03/07/2023", "Cavitación",
      "La bomba instal·lada cavita i no en pots canviar la màquina. Quina mesura és la bona?",
      [
        "Canonada nova de més diàmetre i pujar la cota de la bomba.",
        "Canonada nova de més diàmetre i més rugosa.",
        "Escalfar el líquid.",
        "Pujar el nivell del dipòsit inferior, omplint-lo amb més aigua."
      ], 3,
      "<p>Si cavita, NPSHd se ha quedado por debajo del requerido. Sin cambiar de bomba, hay que subir el disponible. Subir el nivel del depósito de aspiración aumenta la altura de líquido sobre la bomba: es la medida limpia.</p><p>Más diámetro de aspiración también ayudaría, pero la opción que lo acompaña de «subir la bomba» se come esa mejora, porque alejas la bomba del agua. Más rugosidad aumenta pérdidas. Calentar sube la presión de vapor y acerca la cavitación.</p>"),

    q("r23-15", "Reevaluación 03/07/2023", "Contexto",
      "Quina situació encaixa millor amb el paper de la hidràulica?",
      [
        "Amb més solar i eòlica, la hidràulica deixarà de ser necessària.",
        "Creixeran les fòssils i no les renovables.",
        "Es pot funcionar només amb solar i eòlica perquè són molt predictibles.",
        "La hidràulica compensa la impredictibilitat de la solar i l’eòlica."
      ], 3,
      "<p>Solar y eólica no se programan: hay cuando hay. Una central hidráulica, y sobre todo una reversible, puede guardar el exceso y devolverlo cuando no hay sol ni viento. No sustituye a las otras renovables: las respalda. Decir que son «muy predecibles» o que la hidráulica sobra es justo el error de concepto.</p>"),

    q("r23-16", "Reevaluación 03/07/2023", "Turbinas",
      "Què passa si es redueix molt la potència d’una Francis respecte del punt de disseny?",
      [
        "No passa res: està pensada per regular potència.",
        "Una Francis no pot treballar fora del punt de disseny.",
        "Per la component tangencial de sortida apareix una torxa estreta.",
        "Per la component tangencial de sortida apareix una torxa ampla, amb prerotació."
      ], 3,
      "<p>Bajar mucho la potencia es irse a carga parcial: pasa poco caudal para el álabe que tienes. A la salida queda una componente tangencial grande, el agua sigue girando, y en el tubo de aspiración esa rotación se enrolla en una torxa ancha, con prerrotación.</p><p>No es que la Francis «no pueda» salir del diseño: puede, y se regula, pero paga ese vórtice. La torxa estreta, con el giro al revés, es más propia de la sobrecarga. A potencia muy reducida la imagen es la torxa amplia.</p>"),

    q("r23-17", "Reevaluación 03/07/2023", "Turbinas",
      "Una central fa 292 GWh a l’any, unes 8 h al dia, 365 dies. El cabal mitjà a la turbina és 10 m³/s. Quina màquina encaixa?",
      ["Pelton", "Francis", "Kaplan", "No es pot determinar"], 0,
      "<p>292 GWh en 8 · 365 = 2920 h son 100 MW eléctricos. Con 10 m³/s, la potencia hidráulica del orden de 100 MW pide un salto ρgQH ≈ P/η. Aunque el rendimiento sea alto, H sale del orden de 1000 m o más.</p><p>Salto de unos mil metros y caudal moderado es territorio Pelton: velocidad específica baja, chorro e inyector. Una Kaplan quiere poco salto y mucho caudal. Una Francis se queda en saltos intermedios. Con estos dos datos el tipo queda decidido.</p>"),

    q("r23-18", "Reevaluación 03/07/2023", "Cálculo",
      "Francis en disseny: P elèctrica = 45 MW, salt 100 m, η generador = 0,98, η turbina = 0,85. Secció de sortida 5 m², diàmetre de sortida 1 m, 10 parells de pols, 50 Hz (n = f/p). Sense desviació a la sortida, amb quin β s’han dissenyat els àleps de sortida? (sortida sense component tangencial absoluta.)",
      ["35°", "30°", "45°", "50°"], 0,
      "<p>Diez pares de polos y 50 Hz: n = 50/10 = 5 rev/s = 300 rpm. U₂ = π · 1 · 300 / 60 = 15,71 m/s.</p><p>La potencia mecánica es 45/0,98 MW y la hidráulica que atraviesa la máquina, 45/(0,98 · 0,85) = 54,0 MW. Q = P / (ρ g H) = 54,0·10⁶ / (9810 · 100) = 55,1 m³/s. Cₘ₂ = Q / A = 55,1 / 5 = 11,0 m/s.</p><p>En diseño, sin desviación y con salida axial, C₂ᵤ = 0. Entonces el relativo cierra contra U: tan β₂ = Cₘ / U = 11,0 / 15,71 = 0,70, y β₂ = 35°. 45° saldría si Cₘ y U fueran iguales, y no lo son.</p>"),

    q("r23-19", "Reevaluación 03/07/2023", "Cálculo",
      "Bomba H = 130 − 0,2 Q² (H en m, Q en L/s), regulada a 20 L/s. NPSHᵣ ≈ K₁ Cₘ₁²/(2g) + K₂ W₁²/(2g), amb K₁ = K₂ = 1. n = 1500 rpm, D₁ = 0,1 m, b₁ = 0,02 m, entrada radial. Quin és el NPSHᵣ?",
      ["1,6 m", "3,6 m", "7,6 m", "4,2 m"], 3,
      "<p>Esta fórmula es la estimación clásica del NPSH requerido: un término con la velocidad meridiana de entrada y otro con la relativa, porque las dos fijan la depresión en el álabe.</p><p>Q = 0,020 m³/s. U₁ = π · 0,1 · 1500 / 60 = 7,85 m/s. Cₘ₁ = 0,020 / (π · 0,1 · 0,02) = 3,18 m/s. Entrada radial: W₁ = √(U₁² + Cₘ₁²) = 8,47 m/s.</p><p>NPSHᵣ = (3,18² + 8,47²) / (2 · 9,81) = 4,2 m. Si solo pones la meridiana te quedas cerca de 0,5 m; si olvidas el 2 de 2g, te vas al doble.</p>"),

    q("r23-20", "Reevaluación 03/07/2023", "Cálculo",
      "NPSHreq = 6 m a Q = 15 L/s. D = 0,2 m, L aspiració = 10 m, L impulsió = 2340 m, f = 0,03. Pₐₜₘ = 100350 Pa, Pᵥ = 2300 Pa, z del dipòsit = 100 m. Cota màxima de la bomba?",
      ["96 m", "186 m", "104 m", "100 m"], 2,
      "<p>La cota máxima es la del límite NPSHd = NPSHreq. NPSHd = (Pₐₜₘ − Pᵥ)/(ρg) + (z_depósito − z_bomba) − pérdida solo de la aspiración.</p><p>(Pₐₜₘ − Pᵥ)/(ρg) = (100350 − 2300)/9810 = 10,0 m. La aspiración tiene 10 m y el caudal es 0,015 m³/s en un tubo de 0,2 m: la pérdida es de un par de centímetros. La impulsión de 2340 m no entra. Estaría entrando si la válvula o el rozamiento estuvieran antes de la bomba.</p><p>z_bomba = 100 + 10 − 6 = 104 m. 100 m es dejar la bomba a la cota del depósito y olvidar el margen atmosférico. 96 m es restar el NPSH al revés.</p>")
  ];

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function nfmt(x, d) { return x.toFixed(d).replace(".", ","); }

  function withOptions(item, doShuffle) {
    const packed = item.options.map((text, i) => ({ text, ok: i === item.answer }));
    const arr = doShuffle ? shuffle(packed) : packed.slice();
    return Object.assign({}, item, {
      options: arr.map((o) => o.text),
      answer: arr.findIndex((o) => o.ok)
    });
  }

  function choice(correct, alts, digits) {
    const key = (v) => v.toFixed(digits);
    const texts = [key(correct)];
    alts.forEach((v) => {
      if (texts.length < 4 && texts.indexOf(key(v)) < 0 && isFinite(v)) texts.push(key(v));
    });
    let k = 0;
    while (texts.length < 4 && k < 6) {
      const junk = correct * (1.3 + 0.2 * k);
      if (texts.indexOf(key(junk)) < 0) texts.push(key(junk));
      k++;
    }
    const opts = texts.map((t) => t.replace(".", ","));
    return { options: opts, answer: 0 };
  }

  function genEuler() {
    for (let t = 0; t < 25; t++) {
      const n = pick([960, 1146, 1200, 1450, 1500, 1800]);
      const D = pick([0.25, 0.32, 0.4, 0.5]);
      const b = pick([0.03, 0.04, 0.05, 0.08]);
      const Q = pick([0.08, 0.12, 0.2, 0.3, 0.45]);
      const beta = pick([30, 35, 40, 45, 50]) * Math.PI / 180;
      const U = Math.PI * D * n / 60;
      const Cm = Q / (Math.PI * D * b);
      const Cu = U - Cm / Math.tan(beta);
      if (Cu < 1) continue;
      const H = U * Cu / G;
      const ch = choice(H, [U * U / G, U * (U - Cm) / G, U * Cm / G, H / 2], 1);
      return q("gen-euler-" + Math.random().toString(36).slice(2, 7), "Cálculo generado", "Cálculo",
        `Bomba centrífuga ideal, entrada radial y sin prerrotación. n = ${n} rpm, D₂ = ${nfmt(D, 2)} m, b₂ = ${nfmt(b, 2)} m, Q = ${nfmt(Q, 2)} m³/s, β₂ = ${Math.round(beta * 180 / Math.PI)}° desde la tangente. ¿Altura teórica?`,
        ch.options.map((s) => s + " m"), ch.answer,
        `<p>Sin prerrotación, C₁ᵤ = 0 y toda la altura está en la salida: Hₜₕ = U₂ C₂ᵤ / g.</p>
         <p>U₂ = π D n / 60 = ${nfmt(U, 2)} m/s. Cₘ₂ = Q /(π D b) = ${nfmt(Cm, 2)} m/s. C₂ᵤ = U₂ − Cₘ₂ / tan β₂ = ${nfmt(Cu, 2)} m/s.</p>
         <p>Hₜₕ = ${nfmt(U, 2)} · ${nfmt(Cu, 2)} / 9,81 = ${nfmt(H, 1)} m. U₂²/g = ${nfmt(U * U / G, 1)} m sería suponer que el agua sale con toda la velocidad del álabe, sin restar la meridiana.</p>`);
    }
    return null;
  }

  function genAxial() {
    const n = pick([100, 125, 150, 187, 214]);
    const Dext = pick([1.6, 2.0, 2.4, 3.0]);
    const Dhub = Math.round(Dext * pick([0.4, 0.45, 0.5]) * 100) / 100;
    const Dm = (Dext + Dhub) / 2;
    const Q = pick([8, 12, 18, 25, 40]);
    const ang = pick([15, 18, 20, 25, 30]);
    const U = Math.PI * Dm * n / 60;
    const A = Math.PI / 4 * (Dext * Dext - Dhub * Dhub);
    const Cm = Q / A;
    const Cu = Cm / Math.tan(ang * Math.PI / 180);
    const H = U * Cu / G;
    const ch = choice(H, [H / 2, U * Cm / G, U * U / G, Cm * Cu / G], 1);
    return q("gen-ax-" + Math.random().toString(36).slice(2, 7), "Cálculo generado", "Cálculo",
      `Turbina axial de reacción. n = ${n} rpm, D exterior = ${nfmt(Dext, 2)} m, D cubo = ${nfmt(Dhub, 2)} m, Q = ${nfmt(Q, 1)} m³/s. La velocidad absoluta entra a ${ang}° de la tangente y a la salida no hay componente tangencial. ¿Altura teórica en el diámetro medio?`,
      ch.options.map((s) => s + " m"), ch.answer,
      `<p>Salida axial: C₂ᵤ = 0, así que Hₜₕ = U Cᵤ / g en el diámetro medio Dₘ = ${nfmt(Dm, 2)} m. U = ${nfmt(U, 2)} m/s.</p>
       <p>Cₘ = Q / área de la corona = ${nfmt(Cm, 2)} m/s. Como el ángulo es desde la tangente, Cᵤ = Cₘ / tan ${ang}° = ${nfmt(Cu, 2)} m/s.</p>
       <p>Hₜₕ = ${nfmt(H, 1)} m. La mitad sale si tomas el radio por el diámetro.</p>`);
  }

  function genSim(attempt) {
    const ntry = attempt || 0;
    if (ntry > 12) return null;
    const A = pick([20, 30, 40, 50, 80]);
    const B = pick([8, 10, 15, 25, 40]);
    const nr = pick([0.8, 1.25, 1.5, 2]);
    const dr = pick([0.5, 0.8, 1.25, 1.5, 1.75]);
    const Qp = pick([0.2, 0.3, 0.4, 0.5]);
    const kq = nr * dr ** 3;
    const kh = nr ** 2 * dr ** 2;
    const H = kh * (A - B * (Qp / kq) ** 2);
    if (H < 1) return genSim(ntry + 1);
    const onlyA = kh * A;
    const wrongExp = (nr ** 2 * dr ** 2) * (A - B * (Qp / (nr * dr ** 2)) ** 2);
    const same = A - B * Qp * Qp;
    const ch = choice(H, [onlyA, wrongExp, same, H * nr], 1);
    return q("gen-sim-" + Math.random().toString(36).slice(2, 7), "Cálculo generado", "Semejanza",
      `La bomba H = ${A} − ${B} Q² (SI) tiene una semejante con n′/n = ${nfmt(nr, 2)} y D′/D = ${nfmt(dr, 2)}. ¿Qué altura da a Q′ = ${nfmt(Qp, 2)} m³/s?`,
      ch.options.map((s) => s + " m"), ch.answer,
      `<p>Q escala con n D³ y H con n² D². Aquí k_Q = ${nfmt(kq, 3)} y k_H = ${nfmt(kh, 3)}. El punto de la máquina nueva a caudal Q′ es homólogo del caudal Q = Q′ / k_Q de la vieja.</p>
       <p>H′ = k_H · ( ${A} − ${B} (Q′/k_Q)² ) = ${nfmt(H, 1)} m.</p>
       <p>${nfmt(onlyA, 1)} m es quedarte solo con el término de caudal cero, como si Q′ no restara. La curva no se evalúa en el mismo Q numérico de la máquina original.</p>`);
  }

  function genTorque() {
    const n = pick([1000, 1200, 1450, 1500, 1800]);
    const Q = pick([0.05, 0.08, 0.1, 0.15]);
    const H = pick([8, 12, 18, 25, 40]);
    const etam = pick([0.85, 0.9, 0.95]);
    const w = n * 2 * Math.PI / 60;
    const M = (1000 * G * Q * H) / (etam * w);
    const ch = choice(M, [M * etam, M / (2 * Math.PI), M * etam * etam, M * 0.8], 1);
    return q("gen-par-" + Math.random().toString(36).slice(2, 7), "Cálculo generado", "Cálculo",
      `Bomba con Qₜₕ = ${nfmt(Q, 2)} m³/s, Hₜₕ = ${nfmt(H, 1)} m, ηₘ = ${nfmt(etam, 2)}, n = ${n} rpm. Entrada sin prerrotación. ¿Par en el eje?`,
      ch.options.map((s) => s + " N·m"), ch.answer,
      `<p>La potencia de Euler es la que recibe el fluido que cruza el rodete: Pₜₕ = ρ g Qₜₕ Hₜₕ. El eje tiene que aportar más, porque el rendimiento mecánico se pierde en disco y cojinetes: Pₘₑc = Pₜₕ / ηₘ.</p>
       <p>M = Pₘₑc / ω, y ω = 2πn/60 = ${nfmt(w, 2)} rad/s, no n en rpm. Sale M = ${nfmt(M, 1)} N·m.</p>
       <p>Multiplicar por ηₘ en vez de dividir te deja el par pequeño: estarías diciendo que el rozamiento aporta energía.</p>`);
  }

  function genCross() {
    const A = pick([25, 40, 60, 80]);
    const B = pick([10, 20, 40, 80]);
    const H0 = pick([8, 12, 15, 20]);
    const K = pick([10, 20, 30, 50]);
    if (A <= H0) return genCross();
    const Q = Math.sqrt((A - H0) / (B + K));
    const H = A - B * Q * Q;
    const ch = choice(Q, [Math.sqrt((A - H0) / B), Math.sqrt(A / (B + K)), Q * 2, Math.sqrt((A - H0) / K)], 3);
    return q("gen-cruce-" + Math.random().toString(36).slice(2, 7), "Cálculo generado", "Circuitos",
      `Bomba H = ${A} − ${B} Q² y circuito H = ${H0} + ${K} Q², en SI. ¿En qué caudal trabajan?`,
      ch.options.map((s) => s + " m³/s"), ch.answer,
      `<p>El punto de funcionamiento es el cruce, no el caudal de máximo rendimiento ni el de cota cero. Iguala las dos curvas: ${A} − ${B} Q² = ${H0} + ${K} Q².</p>
       <p>Q² = (${A} − ${H0}) / (${B} + ${K}), Q = ${nfmt(Q, 3)} m³/s. La altura en ese punto es ${nfmt(H, 1)} m, por si quieres comprobar que las dos expresiones dan lo mismo.</p>
       <p>Olvidar el término ${K} Q² del circuito, o el ${B} Q² de la bomba, mueve el caudal. En serie o en paralelo la idea es la misma: se cruzan curva de máquina y curva de instalación.</p>`);
  }

  function genNpsh() {
    const Q = pick([0.01, 0.015, 0.02, 0.03]);
    const D = pick([0.1, 0.15, 0.2]);
    const L = pick([8, 12, 20, 40]);
    const f = pick([0.02, 0.03, 0.04]);
    const npsh = pick([3, 4, 5, 6]);
    const z0 = pick([0, 4, 10]);
    const hf = 8 * f * L * Q * Q / (Math.PI ** 2 * D ** 5 * G);
    const hatm = (1e5 - 2300) / (1000 * G);
    const zmax = z0 + hatm - hf - npsh;
    const ch = choice(zmax, [z0 + hatm, z0 + hatm - npsh, zmax - hatm, z0], 2);
    return q("gen-npsh-" + Math.random().toString(36).slice(2, 7), "Cálculo generado", "Cavitación",
      `NPSHreq = ${npsh} m a Q = ${nfmt(Q, 3)} m³/s. Depósito abierto a cota ${z0} m, Patm = 10⁵ Pa, Pv = 2300 Pa. Aspiración: L = ${L} m, D = ${nfmt(D, 2)} m, f = ${nfmt(f, 2)}. ¿Cota máxima de la bomba?`,
      ch.options.map((s) => s + " m"), ch.answer,
      `<p>En el límite, el disponible iguala al requerido. NPSHd = (Patm − Pv)/(ρg) + (z_depósito − z_bomba) − h de aspiración.</p>
       <p>(Patm − Pv)/(ρg) = ${nfmt(hatm, 2)} m. La pérdida de los ${L} m de aspiración es ${nfmt(hf, 3)} m. La impulsión, si la hubiera, no se resta aquí.</p>
       <p>z_máx = ${z0} + ${nfmt(hatm, 2)} − ${nfmt(hf, 3)} − ${npsh} = ${nfmt(zmax, 2)} m. Dejar la bomba a la cota del depósito olvida el colchón de la atmósfera y el NPSH que la bomba se come.</p>`);
  }

  const GENERATORS = [genEuler, genAxial, genSim, genTorque, genCross, genNpsh];

  function makeGenerated(n) {
    const out = [];
    let guard = 0;
    while (out.length < n && guard < 40) {
      const fn = GENERATORS[out.length % GENERATORS.length];
      const item = fn();
      if (item) out.push(item);
      guard++;
    }
    return out;
  }

  function sources() {
    return ["Modelo 2026", "Examen 24/01/2023", "Reevaluación 03/07/2023", "Cálculo generado"];
  }

  function makeExam(mode) {
    if (mode === "modelo") {
      return shuffle(QUESTIONS.filter((item) => item.source === "Modelo 2026")).map((item) => withOptions(item, false));
    }
    if (mode === "anteriores") {
      const pool = QUESTIONS.filter((item) => item.source !== "Modelo 2026");
      return shuffle(pool).slice(0, Math.min(20, pool.length)).map((item) => withOptions(item, true));
    }
    const fixed = shuffle(QUESTIONS).slice(0, 12).map((item) => withOptions(item, true));
    const gen = makeGenerated(8).map((item) => withOptions(item, true));
    return shuffle(fixed.concat(gen));
  }

  function pool(source) {
    if (!source || source === "todos") return QUESTIONS.slice();
    if (source === "Cálculo generado") return makeGenerated(12);
    return QUESTIONS.filter((item) => item.source === source);
  }

  window.TFIBank = {
    QUESTIONS,
    sources,
    makeExam,
    pool,
    prepare: withOptions,
    makeGenerated
  };
})();
