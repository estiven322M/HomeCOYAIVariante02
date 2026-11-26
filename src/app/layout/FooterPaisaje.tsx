import type { ReactNode } from 'react'

/**
 * Paisaje del pie («Dosel al atardecer»): decorativo, en SVG inline. Alto reservado por CSS (120 px en móvil, 200 desde
 * md); en móvil todo es el dibujo de escritorio a 0,6 (menos el sol, a 34 px).
 *
 * - Dosel: tres capas de <pattern> SIN viewBox: la tesela se repite a tamaño real y nunca se estira. x="50%" la centra.
 * - Figuras: un <svg> por figura, de tamaño fijo, anclado abajo y colocado en % dentro de una caja centrada de 72 rem.
 *   Al cambiar el ancho solo cambia su posición horizontal.
 * - El orden en el DOM es el orden de apilado: el dosel frontal tapa las bases.
 *
 * Peso: este marcado va en cada página prerenderizada; una prueba lo limita a 15 KB.
 */

/** Tesela de una capa: lomas (`q`) desde y=`valle` que vuelven a la misma altura al final, y relleno hasta abajo. */
const DOSEL = [
  {
    id: 'pie-dosel-lejos',
    ancho: 720,
    color: 'fill-verde-hoja',
    d: 'M0 126q20-31 42-3q23-27 52 2q14-24 31-2q30-33 64-1q22-22 44 2q17-34 43-1q31-26 58 3q13-24 29-1q25-35 55-3q24-24 50 2q18-30 40 0q33-29 68 2q15-26 34-3q22-31 48 1q27-25 62 2V200H0Z',
  },
  {
    id: 'pie-dosel-medio',
    ancho: 700,
    color: 'fill-chagra',
    d: 'M0 160q18-28 39-3q15-22 30 2q27-30 55-2q20-27 42 1q16-19 33-1q29-34 60 0q23-23 46 3q13-25 28-2q26-29 54 1q19-21 38-1q24-33 51 2q17-22 35-2q31-27 64 3q14-23 29-2q21-29 43 1q22-24 53 0V200H0Z',
  },
  {
    id: 'pie-dosel-frente',
    ancho: 560,
    color: 'fill-huito',
    d: 'M0 190q13-18 28-1q18-23 37 1q10-17 22-1q22-25 46 0q16-18 33 2q19-26 40-2q12-16 25 1q24-21 49-1q15-24 32-1q21-19 43 2q11-20 24-2q23-25 48 0q17-17 35 1q14-22 29-1q20-20 41 2q12-16 28 0V200H0Z',
  },
] as const

function Dosel({ capa }: { capa: (typeof DOSEL)[number] }) {
  return (
    // En móvil la capa se dibuja más ancha y se escala a 0,6 desde la esquina inferior izquierda: el centro no se mueve.
    // Los 4 px de más cubren la última columna: con el ancho justo, el redondeo dejaba una línea de cielo a la derecha.
    <svg className="absolute bottom-0 left-0 h-[200px] w-[calc(166.667%+4px)] origin-bottom-left scale-60 md:w-full md:scale-100">
      <pattern id={capa.id} x="50%" width={capa.ancho} height="200" patternUnits="userSpaceOnUse">
        <path className={capa.color} d={capa.d} />
      </pattern>
      <rect width="100%" height="200" fill={`url(#${capa.id})`} />
    </svg>
  )
}

/** Caja donde se colocan las figuras: el ancho máximo del contenido del pie. */
function Figuras({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0 mx-auto max-w-6xl">{children}</div>
}

const FIGURA = 'absolute bottom-0 -translate-x-1/2'

function Palma({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 136" className={`${FIGURA} ${className}`}>
      <path className="fill-chagra" d="M30.8 16h2.4l.8 120h-4Z" />
      <path
        className="fill-chagra"
        d="M32 16Q17 7 2 21Q19 15 32 18ZM32 16Q24 3 10 4Q23 7 31 18ZM32 16Q32 4 24 0Q29 8 30 17ZM32 16Q35 5 41 1Q36 10 34 17ZM32 16Q45 6 58 7Q44 9 33 18ZM32 16Q50 12 63 22Q46 16 32 18ZM32 17Q44 22 49 33Q40 23 31 19ZM32 17Q23 20 17 32Q27 26 34 19Z"
      />
    </svg>
  )
}

/**
 * Ceiba: tronco grueso con raíces tablares y copa ancha en capas (verde claro detrás, chagra delante) sobre ramas en
 * abanico. Tronco en huito para que se separe del dosel medio. Las raíces se abren por encima del dosel frontal, y entre
 * una aleta y otra se ve el follaje.
 */
function Ceiba() {
  return (
    <svg
      viewBox="0 -8 220 172"
      className={`${FIGURA} left-[21%] h-[103.2px] w-[132px] md:left-[16.2%] md:h-[172px] md:w-[220px]`}
    >
      {/* Capa trasera de la copa */}
      <path
        className="fill-verde-hoja"
        d="M14 52q-12-3-8-13q4-9 17-7q3-13 21-12q6-12 24-9q9-12 28-9q14-11 31-2q19-8 31 5q18-2 22 11q17 0 18 12q18 3 13 15q-4 11-24 9q-14 8-30 1q-16 9-34 1q-16 8-32 0q-18 9-35 1q-18 7-30-2q-8 4-12-1Z"
      />
      {/* Ramas, tronco y raíces tablares */}
      <path
        className="fill-huito"
        d="M99 106V82q-8-12-35-20l2-4q24 5 35 15q0-13-10-25l5-3q10 11 13 26q5-17 18-28l4 3q-12 14-10 32q10-13 38-19l1 5q-27 8-39 22v24q2 31 41 46v13H58v-13q39-15 41-46Z"
      />
      {/* Huecos entre las aletas: dejan ver el follaje de atrás */}
      <path
        className="fill-chagra"
        d="M102 118q-2 27-26 46h14q12-20 12-46ZM118 118q2 27 26 46h-14q-12-20-12-46ZM110 128l-5 36h10Z"
      />
      {/* Canto iluminado de las aletas exteriores */}
      <path
        className="fill-none stroke-verde-hoja"
        strokeWidth="1.5"
        d="M96.5 124Q91 143 60 154.500M123.500 124Q129 143 160 154.500"
      />
      {/* Capas delanteras: tres masas de follaje a distinta altura, con huecos de cielo entre ellas */}
      <path
        className="fill-chagra"
        d="M20 67q-14 1-14-9q1-9 14-9q4-10 19-8q10-9 24-2q15-3 17 8q11 3 7 12q-5 9-19 6q-11 7-24 2q-14 6-24 0ZM139 66q-12-4-6-13q4-8 16-6q8-10 24-5q15-4 21 7q15 1 17 11q1 10-15 10q-10 7-23 2q-13 6-22-1q-7 2-12-5ZM71 38q-11-5-3-13q6-6 15-3q4-12 22-9q14-9 28 1q16-3 18 9q13 4 6 13q-8 8-22 3q-10 9-24 4q-14 6-24-3q-9 3-16-2Z"
      />
    </svg>
  )
}

/**
 * Maloca: techo de palma con hileras de hojas, alero y, desde md, la entrada. La pared baja hasta el borde inferior, por
 * debajo del valle más hondo del dosel frontal (sin huecos en la base). Se dibuja DESPUÉS del dosel frontal: pared y
 * dosel son del mismo color y así la entrada queda entera a cualquier ancho.
 */
function Maloca() {
  return (
    <svg
      viewBox="0 0 170 116"
      className={`${FIGURA} left-[64%] h-[69.6px] w-[102px] md:left-[62.3%] md:h-[116px] md:w-[170px]`}
    >
      <path className="fill-huito" d="M83.8 2h2.4l.3 10q47 29 76 66q-8 2-15 2v36H22V80q-7 0-15-2q29-37 76-66Z" />
      {/* Hileras de palma: cada una es un fleco de hojas cortas (lomas pequeñas), no una línea lisa. */}
      <g className="fill-none stroke-verde-hoja" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M65 31q3 6 7 1q3 6 6 1q3 6 7 1q3 5 7-1q3 5 6-1q3 5 7-1" />
        <path d="M45 48q4 7 8 2q4 7 8 2q4 7 8 1q4 7 8 1q4 6 8 0q4 6 8 0q4 6 8-1q4 6 8-1q4 5 8-2q4 5 8-2" />
        <path
          className="max-md:hidden"
          d="M26.5 65q4 7 9 3q4 7 9 2q4 7 9 2q4 7 9 1q4 7 9 1q4 6 9 0q4 6 9 0q4 6 9 0q4 6 9-1q4 5 9-1q4 5 9-2q4 5 9-2q4 4 9-3"
        />
      </g>
      {/* Alero: el borde del techo sobresale de la pared */}
      <path
        className="fill-none stroke-tierra-suave opacity-70"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M8 78q77 10 154 0"
      />
      {/* Entrada */}
      <path className="fill-ocre opacity-80 max-md:hidden" d="M78 101V90q7-9 14 0v11Z" />
    </svg>
  )
}

const AVE = 'M1 6q4.500-6 9 0q4.500-6 9 0'

function Ave({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 8" className={`absolute -translate-x-1/2 max-md:hidden ${className}`}>
      <path className="fill-none stroke-huito" strokeWidth="1.5" strokeLinecap="round" d={AVE} />
    </svg>
  )
}

export function FooterPaisaje() {
  const [lejos, medio, frente] = DOSEL
  return (
    <div aria-hidden className="relative h-[120px] overflow-hidden bg-tierra-suave md:h-[200px]">
      <Figuras>
        {/* El sol nunca crece: 34 px en móvil, 68 desde md. */}
        <svg
          viewBox="0 0 68 68"
          className="absolute left-[77%] top-[17px] size-[34px] -translate-x-1/2 md:left-[81.4%] md:top-[38px] md:size-[68px]"
        >
          <circle className="fill-ocre" cx="34" cy="34" r="34" />
        </svg>
        <Ave className="left-[1.4%] top-[60px] w-[21px]" />
        <Ave className="left-[4.3%] top-[48px] w-[17px]" />
        <Ave className="left-[94.5%] top-[54px] w-[17px]" />
      </Figuras>
      <Dosel capa={lejos} />
      <Figuras>
        <Palma className="left-[36.2%] h-[136px] w-[64px] max-md:hidden" />
        <Palma className="left-[40.2%] h-[112px] w-[52.700px] max-md:hidden" />
        <Palma className="left-[85%] h-[75.900px] w-[35.700px] md:left-[91%] md:h-[126.500px] md:w-[59.500px]" />
      </Figuras>
      <Dosel capa={medio} />
      <Figuras>
        <Ceiba />
      </Figuras>
      <Dosel capa={frente} />
      <Figuras>
        <Maloca />
      </Figuras>
      {/* Evita una línea de cielo entre el dibujo y el cuerpo del pie con zoom fraccionario. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-huito" />
    </div>
  )
}
