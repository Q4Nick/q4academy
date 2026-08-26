import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import {
  CENTER,
  COMPOSITE_GEOMETRY,
  COMPOSITE_TRACKING,
  EQI_COMPOSITES,
  EQI_CORE,
  EQI_NEUTRAL,
  EQI_WELLBEING,
  EQI_WHEEL_TEXT,
  RADII,
  RIM_LABELS,
  VIEWBOX,
  WELLBEING_LABELS,
  compositeFontSize,
  subLabelLayouts,
  subNames,
  type ArcDef,
  type SubLabelLayout,
} from "@/lib/eqiWheel";

/**
 * Interactive EQ-i 2.0 wheel.
 *
 * The whole drawing is rendered declaratively, so it is present in the
 * pre-rendered HTML and readable without JavaScript. Interaction is layered on
 * top: the default (nothing selected) state is what gets baked into the static
 * file, which is also what React renders on its first pass in the browser.
 */

const HEART_ID = EQI_WELLBEING.id;

/** Text following a curved baseline defined in <defs>. */
function ArcText({
  arc,
  children,
  ...rest
}: { arc: ArcDef; children: string } & React.SVGProps<SVGTextElement>) {
  return (
    <text textAnchor="middle" dominantBaseline="central" {...rest}>
      <textPath href={`#${arc.id}`} startOffset="50%">
        {children}
      </textPath>
    </text>
  );
}

/** One subscale band label: a single line, or two when it would get too small. */
function SubLabel({
  layout,
  band,
  color,
}: {
  layout: SubLabelLayout;
  band: (typeof COMPOSITE_GEOMETRY)[number]["bands"][number];
  color: string;
}) {
  const style = { fill: color, fontWeight: 700 } as const;
  const size = layout.fontSize.toFixed(2);

  if (layout.lines.length === 1) {
    return (
      <ArcText arc={band.single} fontSize={size} style={style}>
        {layout.lines[0]}
      </ArcText>
    );
  }

  return (
    <>
      <ArcText arc={band.first} fontSize={size} style={style}>
        {layout.lines[0]}
      </ArcText>
      <ArcText arc={band.second} fontSize={size} style={style}>
        {layout.lines[1]}
      </ArcText>
    </>
  );
}

/**
 * `wide` is only set by the desktop tree. The mobile tree renders inside a
 * narrow phone shell, and `?view=mobile` can show that shell on a desktop
 * viewport — where Tailwind's `lg:` rules would otherwise still fire and push
 * this block straight out of the shell.
 */
export function EqiWheel({
  wide = false,
  defaultSelected = null,
  heading,
  intro,
  value,
  onChange,
}: {
  wide?: boolean;
  /**
   * Composite pinned on first render (and returned to by Esc / the reset
   * button). It is part of the pre-rendered HTML, so it must be a constant –
   * never something derived from the viewport, the clock or storage.
   */
  defaultSelected?: string | null;
  /** Override the built-in heading (pass null to drop it entirely). */
  heading?: string | null;
  /** Override the built-in intro paragraph (pass null to drop it entirely). */
  intro?: string | null;
  /**
   * Controlled selection. Pass both `value` and `onChange` to let something
   * outside the wheel (the subscale grid) drive it; leave both out and the
   * wheel keeps its own state.
   */
  value?: string | null;
  onChange?: (id: string | null) => void;
}) {
  const { lang } = useLang();
  const text = EQI_WHEEL_TEXT[lang];
  const compositeSize = compositeFontSize(lang).toFixed(2);
  const subLayouts = subLabelLayouts(lang);

  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultSelected);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const controlled = value !== undefined && onChange !== undefined;
  const selected = controlled ? value : uncontrolled;
  const setSelected = (next: string | null) => {
    if (controlled) onChange(next);
    else setUncontrolled(next);
  };

  const headingText = heading === undefined ? text.heading : heading;
  const introText = intro === undefined ? text.intro : intro;

  // Hover only previews while nothing is pinned by a click.
  const active = selected ?? hovered;

  useEffect(() => {
    if (selected === defaultSelected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(defaultSelected);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, defaultSelected, controlled, onChange]);

  const toggle = (id: string) =>
    setSelected(selected === id ? defaultSelected : id);

  const selectedComposite =
    selected === null || selected === HEART_ID
      ? null
      : (EQI_COMPOSITES.find((c) => c.id === selected) ?? null);

  const accent =
    selectedComposite?.color ?? (selected === HEART_ID ? EQI_CORE : EQI_NEUTRAL);

  /** A segment fades out when something else is active. */
  const segmentOpacity = (id: string) =>
    // The heart never dims – it belongs to the whole model.
    active === null || active === id || id === HEART_ID ? 1 : 0.22;

  // On large screens this block steps outside the ~768px article column, the
  // way the e-learning does it, so the wheel and its explanation fit next to
  // each other. Kept inside the column they stack, which forced you to scroll
  // down to read and back up to click the next scale.
  return (
    <div
      className={`not-prose my-12 ${
        wide
          ? "lg:relative lg:left-1/2 lg:w-[min(1160px,calc(100vw-4rem))] lg:max-w-none lg:-translate-x-1/2"
          : ""
      }`}
    >
      {/* The heading has to line up with the article's other headings. Below
          `lg` this block still sits inside the text column, so plain
          left-alignment is enough; once it has broken out, this box reproduces
          the article column's own width and padding so the left edges match. */}
      <div className={wide ? "lg:mx-auto lg:max-w-3xl lg:px-8" : ""}>
        {headingText !== null && (
          <h3 className="text-2xl sm:text-3xl font-bold text-q4-dark">
            {headingText}
          </h3>
        )}
        {introText !== null && (
          <p className="mt-3 max-w-3xl text-slate-600 leading-relaxed">
            {introText}
          </p>
        )}

        {/* Legend doubles as a keyboard-friendly way to pick a scale. */}
        <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 lg:mt-4">
          {EQI_COMPOSITES.map((comp) => {
            const on = selected === comp.id;
            return (
              <li key={comp.id} className="m-0 p-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(comp.id)}
                  onMouseEnter={() => setHovered(comp.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] bg-white px-3.5 py-1.5 text-[13.5px] font-semibold text-slate-700 transition-all hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    borderColor: on ? comp.color : "#dbe3ef",
                    boxShadow: on ? `0 0 0 3px ${comp.color}1f` : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 flex-none rounded-full"
                    style={{ background: comp.color }}
                  />
                  {comp.name[lang]}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Stacked on narrow screens; roughly 75/25 side by side once the block
          has broken out of the text column. */}
      <div
        className={`mt-5 grid gap-6 lg:mt-4 ${
          wide
            ? "lg:grid-cols-[minmax(0,2.5fr)_minmax(330px,1fr)] lg:items-start"
            : ""
        }`}
      >
        {/* ---------------- wheel ---------------- */}
        {/* The wheel is capped against the viewport height as well, so it stays
            fully visible on a laptop screen. The operating tip sits with the
            wheel rather than in the panel: it describes the wheel, and moving
            it here keeps the panel short enough to fit beside it. */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
            <svg
              viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
              role="application"
              aria-label={text.svgLabel}
              className="mx-auto block h-auto w-full max-w-[720px] lg:max-w-[min(720px,calc(100vh-18rem))]"
            >
              <defs>
                <radialGradient
                  id="eqi-grad-rim"
                  gradientUnits="userSpaceOnUse"
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADII.rimOuter}
                >
                  <stop
                    offset={RADII.rimInner / RADII.rimOuter}
                    stopColor="#e9f1fa"
                  />
                  <stop offset={1} stopColor="#d3e3f4" />
                </radialGradient>

                <radialGradient
                  id="eqi-grad-heart"
                  gradientUnits="userSpaceOnUse"
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADII.heart}
                >
                  <stop offset={0} stopColor="#2a55ad" />
                  <stop offset={1} stopColor="#12327c" />
                </radialGradient>

                {EQI_COMPOSITES.map((comp) => (
                  <radialGradient
                    key={`gc-${comp.id}`}
                    id={`eqi-grad-comp-${comp.id}`}
                    gradientUnits="userSpaceOnUse"
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={RADII.compOuter}
                  >
                    <stop
                      offset={RADII.compInner / RADII.compOuter}
                      stopColor={comp.dark}
                    />
                    <stop offset={1} stopColor={comp.color} />
                  </radialGradient>
                ))}

                {EQI_COMPOSITES.map((comp) => (
                  <radialGradient
                    key={`gs-${comp.id}`}
                    id={`eqi-grad-sub-${comp.id}`}
                    gradientUnits="userSpaceOnUse"
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={RADII.subOuter}
                  >
                    <stop
                      offset={RADII.subInner / RADII.subOuter}
                      stopColor="#ffffff"
                    />
                    <stop offset={1} stopColor={comp.light} />
                  </radialGradient>
                ))}

                {/* Curved baselines for every piece of text on the wheel. */}
                {RIM_LABELS.map((a) => (
                  <path key={a.id} id={a.id} d={a.d} fill="none" />
                ))}
                {WELLBEING_LABELS.map((a) => (
                  <path key={a.id} id={a.id} d={a.d} fill="none" />
                ))}
                {COMPOSITE_GEOMETRY.map((geom) => (
                  <g key={geom.id}>
                    <path id={geom.label.id} d={geom.label.d} fill="none" />
                    {geom.bands.map((band) => (
                      <g key={band.single.id}>
                        <path id={band.single.id} d={band.single.d} fill="none" />
                        <path id={band.first.id} d={band.first.d} fill="none" />
                        <path id={band.second.id} d={band.second.d} fill="none" />
                      </g>
                    ))}
                  </g>
                ))}
              </defs>

              {/* outer rim */}
              <g aria-hidden="true">
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADII.rimOuter}
                  fill="url(#eqi-grad-rim)"
                  stroke="#7ea6d4"
                  strokeWidth={1.8}
                />
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADII.rimInner}
                  fill="#ffffff"
                  stroke="#8fb2d9"
                  strokeWidth={1.4}
                />
                {RIM_LABELS.map((a) => (
                  <ArcText
                    key={a.id}
                    arc={a}
                    fontSize={17}
                    style={{
                      fill: "#1c4a91",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                    }}
                  >
                    {a.kind === "outer" ? text.rimOuter : text.rimInner}
                  </ArcText>
                ))}
              </g>

              {/* white well-being ring */}
              <g aria-hidden="true">
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADII.wbOuter}
                  fill="#ffffff"
                  stroke="#c3d6ee"
                  strokeWidth={1}
                />
                {WELLBEING_LABELS.map((a) => (
                  <ArcText
                    key={a.id}
                    arc={a}
                    fontSize={10.5}
                    style={{
                      fill: "#42597c",
                      fontWeight: 700,
                      letterSpacing: "0.11em",
                    }}
                  >
                    {text.wellbeingRing}
                  </ArcText>
                ))}
              </g>

              {/* segments */}
              <g style={{ filter: "drop-shadow(0 4px 10px rgba(23,59,143,.16))" }}>
                {COMPOSITE_GEOMETRY.map((geom, i) => {
                  const comp = EQI_COMPOSITES[i];
                  const isActive = active === comp.id;
                  const opacity = segmentOpacity(comp.id);
                  const label = comp.name[lang].toUpperCase();

                  return (
                    // The coloured ring AND its three subscale bands form a
                    // single control: clicking anywhere in the segment selects
                    // the composite scale, and the whole segment is one tab stop.
                    // Keeping them apart would leave the bands mouse-only.
                    <g
                      key={comp.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${text.compositeLabel} ${comp.name[lang]}: ${subNames(comp, lang).join(", ")}`}
                      aria-pressed={selected === comp.id}
                      className="cursor-pointer transition-opacity duration-200 focus:outline-none"
                      style={{ opacity }}
                      onClick={() => toggle(comp.id)}
                      onMouseEnter={() => setHovered(comp.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setFocused(comp.id)}
                      onBlur={() => setFocused(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(comp.id);
                        }
                      }}
                    >
                      {/* three subscale bands; their names are already in the
                          group's accessible label, so hide them from readers */}
                      {geom.bands.map((band, si) => (
                        <g key={band.single.id} aria-hidden="true">
                          <path
                            d={band.path}
                            fill={`url(#eqi-grad-sub-${comp.id})`}
                            stroke="#ffffff"
                            strokeWidth={1.4}
                          />
                          <SubLabel
                            layout={subLayouts[i][si]}
                            band={band}
                            color={comp.dark}
                          />
                        </g>
                      ))}

                      <path
                        d={geom.path}
                        fill={`url(#eqi-grad-comp-${comp.id})`}
                        stroke={
                          isActive || focused === comp.id ? EQI_CORE : "#ffffff"
                        }
                        strokeWidth={
                          focused === comp.id ? 4 : isActive ? 3.2 : 1.4
                        }
                      />
                      {focused === comp.id && (
                        <path
                          d={geom.path}
                          aria-hidden="true"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth={7}
                          strokeDasharray="6 5"
                          pointerEvents="none"
                        />
                      )}
                      {focused === comp.id && (
                        <path
                          d={geom.path}
                          aria-hidden="true"
                          fill="none"
                          stroke={EQI_CORE}
                          strokeWidth={3.5}
                          strokeDasharray="6 5"
                          pointerEvents="none"
                        />
                      )}
                      <ArcText
                        aria-hidden="true"
                        arc={geom.label}
                        fontSize={compositeSize}
                        style={{
                          fill: "#ffffff",
                          fontWeight: 800,
                          letterSpacing: COMPOSITE_TRACKING,
                        }}
                      >
                        {label}
                      </ArcText>
                    </g>
                  );
                })}

                {/* heart – Well-Being */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={EQI_WELLBEING.name[lang]}
                  aria-pressed={selected === HEART_ID}
                  className="cursor-pointer focus:outline-none"
                  onClick={() => toggle(HEART_ID)}
                  onMouseEnter={() => setHovered(HEART_ID)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setFocused(HEART_ID)}
                  onBlur={() => setFocused(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(HEART_ID);
                    }
                  }}
                >
                  <circle
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={RADII.heartRing}
                    fill="#e7eef9"
                    stroke="#ffffff"
                    strokeWidth={1.4}
                  />
                  <circle
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={RADII.heart}
                    fill="url(#eqi-grad-heart)"
                    stroke="#ffffff"
                    strokeWidth={
                      focused === HEART_ID ? 5 : active === HEART_ID ? 4 : 2
                    }
                  />
                  {focused === HEART_ID && (
                    <circle
                      aria-hidden="true"
                      cx={CENTER.x}
                      cy={CENTER.y}
                      r={RADII.heartRing + 4}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={7}
                      strokeDasharray="6 5"
                      pointerEvents="none"
                    />
                  )}
                  {focused === HEART_ID && (
                    <circle
                      aria-hidden="true"
                      cx={CENTER.x}
                      cy={CENTER.y}
                      r={RADII.heartRing + 4}
                      fill="none"
                      stroke={EQI_CORE}
                      strokeWidth={3.5}
                      strokeDasharray="6 5"
                      pointerEvents="none"
                    />
                  )}
                  <text
                    x={CENTER.x}
                    y={CENTER.y - 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={16}
                    style={{ fill: "#ffffff", fontWeight: 800 }}
                  >
                    <tspan x={CENTER.x}>{text.heartLine1}</tspan>
                    <tspan x={CENTER.x} dy={19}>
                      {text.heartLine2}
                    </tspan>
                  </text>
                </g>
              </g>
            </svg>
          </div>
          <p className="m-0 px-2 text-center text-[12.5px] leading-relaxed text-slate-500">
            {text.tip}
          </p>
        </div>

        {/* ---------------- explanation panel ---------------- */}
        {/* Once the block is side by side, the panel travels with the reader:
            whichever part of the wheel is on screen, the explanation for the
            segment they just clicked is next to it. That removes the up-and-down
            scrolling for good, instead of trying to squeeze the whole section
            into one screen height. */}
        <aside
          className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-4 ${
            wide
              ? "lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
              : ""
          }`}
        >
          <h4 className="m-0 text-[15px] font-bold uppercase tracking-[0.06em] text-slate-500">
            {text.selectionLabel}
          </h4>

          {/* Two columns only while the panel is stacked under the wheel and
              therefore full width. From lg the panel is a narrow side column,
              so it goes back to a single column – Tailwind's breakpoints
              measure the VIEWPORT width, not this element. */}
          <div
            className={`mt-4 grid gap-5 lg:gap-4 ${
              selectedComposite && wide
                ? "md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:grid-cols-1"
                : "grid-cols-1"
            }`}
          >
            <div
              className="rounded-2xl bg-slate-50 p-5 border-l-[5px] lg:p-4"
              style={{ borderLeftColor: accent }}
              aria-live="polite"
            >
              {selectedComposite ? (
                <>
                  <span className="block hyphens-auto break-words text-xl sm:text-2xl lg:text-lg font-extrabold leading-tight text-q4-dark">
                    {selectedComposite.name[lang]}
                  </span>
                  <span
                    className="mt-1.5 mb-3 block text-xs font-extrabold uppercase tracking-[0.06em]"
                    style={{ color: selectedComposite.color }}
                  >
                    {text.compositeLabel} · {selectedComposite.question[lang]}
                  </span>
                  <span className="block leading-relaxed text-slate-700 lg:text-[15px] lg:leading-[1.5]">
                    {selectedComposite.explanation[lang]}
                  </span>
                </>
              ) : selected === HEART_ID ? (
                <>
                  <span className="block text-xl sm:text-2xl lg:text-lg font-extrabold leading-tight text-q4-dark">
                    {EQI_WELLBEING.name[lang]}
                  </span>
                  <span
                    className="mt-1.5 mb-3 block text-xs font-extrabold uppercase tracking-[0.06em]"
                    style={{ color: EQI_CORE }}
                  >
                    {EQI_WELLBEING.question[lang]}
                  </span>
                  <span className="block leading-relaxed text-slate-700 lg:text-[15px] lg:leading-[1.5]">
                    {EQI_WELLBEING.explanation[lang]}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-xl sm:text-2xl lg:text-lg font-extrabold leading-tight text-q4-dark">
                    {text.emptyTitle}
                  </span>
                  <span className="mt-3 block leading-relaxed text-slate-700 lg:text-[15px] lg:leading-[1.5]">
                    {text.emptyBody}
                  </span>
                </>
              )}
            </div>

            {selectedComposite && (
              <div>
                <span className="mb-2.5 block text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-slate-500">
                  {text.subsHeading}
                </span>
                {/* One card per row. This column is only about a third of the
                    panel, so a column count keyed to the VIEWPORT width (rather
                    than the column's own width) squeezed long names such as
                    "Interpersoonlijke relaties" straight out of their card. */}
                <ul className="grid list-none grid-cols-1 gap-2 p-0">
                  {selectedComposite.subs.map((sub) => (
                    <li
                      key={sub.name.nl}
                      className="hyphens-auto break-words rounded-xl border border-slate-200 border-l-4 bg-white px-3 py-2.5 text-[14.5px] text-slate-800 lg:py-2"
                      style={{ borderLeftColor: selectedComposite.color }}
                    >
                      {sub.name[lang]}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 mb-0 text-[12.5px] leading-relaxed text-slate-500 lg:mt-2 lg:text-[11.5px]">
                  {text.subsNote}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 lg:mt-3">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="w-full whitespace-nowrap rounded-xl border-[1.5px] px-4 py-2.5 font-bold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto sm:px-8 lg:w-full"
              style={{ borderColor: EQI_CORE, color: EQI_CORE }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = EQI_CORE;
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
                e.currentTarget.style.color = EQI_CORE;
              }}
            >
              {text.reset}
            </button>
          </div>
        </aside>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
        {text.trademark}
      </p>
    </div>
  );
}
