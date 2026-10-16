import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import soberanaLogo from '../recursos/soberana.svg'
import featuredImage from '../recursos/destacada.png'
import grayGlitch from '../recursos/Vector.svg'
import denseGlitch from '../recursos/Vector-1.svg'
import blueIntervention from '../recursos/Vector-2.svg'
import darkGlitch from '../recursos/Vector-3.svg'
import yellowIntervention from '../recursos/Vector-5.svg'
import orangeIntervention from '../recursos/Vector-7.svg'
import bulletinSymbol from '../recursos/Boletín corporeo oficial.svg'
import archiveSymbol from '../recursos/archivo publico.svg'
import cabinetSymbol from '../recursos/gabinete de asuntos vocales.svg'
import agendaSymbol from '../recursos/agenda soberana.svg'
import './styles.css'

const events = [
  {
    id: 1,
    date: '2026-10-17',
    title: 'Laboratorio de intervención',
    place: 'Embajada',
    mode: 'Presencial',
    time: '11:00',
    description: 'Encuentro de trabajo abierto para pensar prácticas de intervención cultural y comunitaria.',
  },
  {
    id: 2,
    date: '2026-10-22',
    title: 'Intervención en el espacio público',
    place: 'Calle',
    mode: 'Convocatoria abierta',
    time: '17:30',
    description: 'Acción colectiva para activar nuevas conversaciones en el espacio público.',
  },
  {
    id: 3,
    date: '2026-10-27',
    title: 'Gabinete de Asuntos Vocales',
    place: 'Digital',
    mode: 'Nuevo episodio',
    time: '20:00',
    description: 'Estreno de una nueva conversación audiovisual del Gabinete de Asuntos Vocales.',
  },
]

const areas = [
  { symbol: bulletinSymbol, name: 'Boletín Oficial', description: 'Comunicados y novedades.', actions: ['Descargar última edición'] },
  { symbol: archiveSymbol, name: 'Archivo Público', description: 'Libros, películas y documentales.', actions: [] },
  { symbol: cabinetSymbol, name: 'Gabinete de Asuntos Vocales', description: 'Programas audiovisuales.', actions: ['Ver episodios'] },
  { symbol: agendaSymbol, name: 'Agenda Soberana', description: '', actions: [] },
]

const searchItems = [
  { type: 'Boletín Oficial', date: '2026-10-12', title: 'Comunicado institucional de octubre', text: 'Actualización sobre actividades y programas de Soberana.' },
  { type: 'Archivo Público', date: '2026-09-28', title: 'Cuaderno de cultura pública', text: 'Publicación de consulta abierta sobre prácticas culturales.' },
  { type: 'Gabinete de Asuntos Vocales', date: '2026-10-06', title: 'Conversaciones sobre la voz común', text: 'Episodio audiovisual del Gabinete.' },
  ...events.map((event) => ({ type: 'Agenda', date: event.date, title: event.title, text: `${event.place} · ${event.mode}` })),
]

const sectionInfo = {
  'Institucional': 'Información provisoria sobre la misión, los principios y la organización de Soberana.',
  'Boletín Oficial': 'Comunicados, novedades y publicaciones oficiales de la plataforma.',
  'Archivo Público': 'Colección abierta de libros, películas, documentos y registros culturales.',
  'Gabinete de Asuntos Vocales': 'Programas y conversaciones audiovisuales sobre cultura y comunidad.',
  'Biblioteca': 'Selección de libros, ensayos y publicaciones disponibles para consulta.',
  'Filmoteca': 'Películas y registros audiovisuales organizados para su consulta pública.',
  'Último programa': 'Acceso al episodio más reciente del Gabinete de Asuntos Vocales.',
  'Convocatorias': 'Llamados abiertos y oportunidades de participación en actividades.',
  'Contenidos': 'Publicaciones y producciones reunidas por Soberana.',
  'Participación': 'Formas de sumarse a los programas y actividades de la plataforma.',
  'Contacto': 'Canales provisorios de comunicación con el equipo de Soberana.',
}

function formatDate(value, options = { day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('es-AR', options).format(new Date(`${value}T12:00:00`))
}

function Arrow({ direction = 'right', className = '' }) {
  return <span className={`ui-arrow ${className}`.trim()} aria-hidden="true">{direction === 'left' ? '<-' : '->'}</span>
}

function getAreaHref(name) {
  const params = new URLSearchParams()
  if (name === 'Agenda' || name === 'Agenda Soberana') {
    params.set('view', 'agenda')
  } else {
    params.set('view', 'section')
    params.set('name', name)
  }
  return `?${params.toString()}`
}

function getInitialRoute() {
  const params = new URLSearchParams(window.location.search)
  const requestedView = params.get('view')
  const requestedSection = params.get('name')
  if (requestedView === 'agenda') return { view: 'agenda', section: null }
  if (requestedView === 'section' && requestedSection) return { view: 'section', section: requestedSection }
  return { view: 'home', section: null }
}

function useGlitchEffect() {
  useEffect(() => {
    const selector = 'button:not(:disabled), .skip-link, .area-card'
    const hoverQuery = window.matchMedia('(hover: hover)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const createLayer = (target, tone) => {
      const layer = document.createElement('div')
      const computed = getComputedStyle(target)
      layer.className = `glitch-visual-layer glitch-visual-layer--${tone}`
      layer.setAttribute('aria-hidden', 'true')
      layer.setAttribute('inert', '')
      Object.assign(layer.style, {
        display: computed.display === 'inline-flex' ? 'flex' : computed.display,
        alignItems: computed.alignItems,
        justifyContent: computed.justifyContent,
        flexDirection: computed.flexDirection,
        gap: computed.gap,
        padding: computed.padding,
        borderTop: computed.borderTop,
        borderRight: computed.borderRight,
        borderBottom: computed.borderBottom,
        borderLeft: computed.borderLeft,
        borderRadius: computed.borderRadius,
        background: computed.background,
        boxShadow: computed.boxShadow,
        color: computed.color,
        font: computed.font,
        lineHeight: computed.lineHeight,
        textAlign: computed.textAlign,
        whiteSpace: computed.whiteSpace,
      })

      for (const child of target.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('glitch-visual-layer')) continue
        layer.appendChild(child.cloneNode(true))
      }
      layer.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
      layer.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((element) => {
        element.setAttribute('tabindex', '-1')
        element.removeAttribute('href')
        element.removeAttribute('name')
      })
      return layer
    }

    const trigger = (target) => {
      if (!target || target.classList.contains('is-glitching')) return
      if (motionQuery.matches) {
        target.classList.add('glitch-static-response')
        window.setTimeout(() => target.classList.remove('glitch-static-response'), 400)
        return
      }

      target.classList.add('is-glitching')
      const cyanLayer = createLayer(target, 'cyan')
      const orangeLayer = createLayer(target, 'orange')
      target.append(cyanLayer, orangeLayer)
      window.setTimeout(() => {
        cyanLayer.remove()
        orangeLayer.remove()
        target.classList.remove('is-glitching')
      }, 430)
    }

    const onPointerOver = (event) => {
      if (!hoverQuery.matches) return
      const target = event.target.closest?.(selector)
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return
      trigger(target)
    }

    const onFocusIn = (event) => {
      if (!event.target.matches?.(':focus-visible')) return
      trigger(event.target.closest(selector))
    }

    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('focusin', onFocusIn)
      document.querySelectorAll('.glitch-visual-layer').forEach((layer) => layer.remove())
    }
  }, [])
}

function App() {
  useGlitchEffect()
  const initialRoute = useRef(getInitialRoute())
  const [view, setView] = useState(initialRoute.current.view)
  const [section, setSection] = useState(initialRoute.current.section)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalEvent, setModalEvent] = useState(null)
  const modalRef = useRef(null)
  const lastTrigger = useRef(null)

  const navigateHome = () => {
    setView('home')
    setSection(null)
    setMenuOpen(false)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateSection = (name) => {
    if (name === 'Agenda' || name === 'Agenda Soberana') {
      setView('agenda')
      setSection(null)
    } else {
      setView('section')
      setSection(name)
    }
    setMenuOpen(false)
    window.history.pushState({}, '', getAreaHref(name))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEvent = (event, trigger) => {
    lastTrigger.current = trigger
    setModalEvent(event)
  }

  const closeEvent = () => {
    setModalEvent(null)
    requestAnimationFrame(() => lastTrigger.current?.focus())
  }

  useEffect(() => {
    if (!modalEvent) return
    modalRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeEvent()
      if (event.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [modalEvent])

  useEffect(() => {
    const restoreRoute = () => {
      const route = getInitialRoute()
      setView(route.view)
      setSection(route.section)
      setMenuOpen(false)
    }
    window.addEventListener('popstate', restoreRoute)
    return () => window.removeEventListener('popstate', restoreRoute)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <Header onHome={navigateHome} onNavigate={navigateSection} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main">
        <div className="page-glitches" aria-hidden="true">
          <img className="page-glitch glitch-one" src={grayGlitch} alt="" />
          <img className="page-glitch glitch-two" src={denseGlitch} alt="" />
          <img className="page-glitch glitch-three" src={darkGlitch} alt="" />
          <img className="page-glitch glitch-four" src={grayGlitch} alt="" />
          <img className="page-glitch glitch-five" src={denseGlitch} alt="" />
        </div>
        {view === 'home' && <Home onNavigate={navigateSection} onOpenEvent={openEvent} />}
        {view === 'agenda' && <FullAgenda onHome={navigateHome} onOpenEvent={openEvent} />}
        {view === 'section' && <SectionView name={section} onHome={navigateHome} />}
      </main>
      <Footer onNavigate={navigateSection} onHome={navigateHome} />
      {modalEvent && <EventModal event={modalEvent} onClose={closeEvent} modalRef={modalRef} />}
    </>
  )
}

function Header({ onHome, onNavigate, menuOpen, setMenuOpen }) {
  const links = ['Institucional', 'Boletín Oficial', 'Archivo Público', 'Gabinete de Asuntos Vocales', 'Agenda']
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="wordmark" onClick={onHome} aria-label="Soberana, ir al inicio"><img src={soberanaLogo} alt="" /></button>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>
          <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
          <span className="menu-icon" aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
        <nav id="main-nav" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
          {links.map((link) => <button key={link} onClick={() => onNavigate(link)}>{link}</button>)}
        </nav>
      </div>
    </header>
  )
}

function Home({ onNavigate, onOpenEvent }) {
  return (
    <>
      <section className="announcement" aria-label="Destacado" style={{ backgroundImage: `url(${featuredImage})` }}>
        <div className="announcement-interventions" aria-hidden="true">
          <img className="intervention intervention-blue" src={blueIntervention} alt="" />
          <img className="intervention intervention-yellow" src={yellowIntervention} alt="" />
          <img className="intervention intervention-orange" src={orangeIntervention} alt="" />
        </div>
        <div className="container announcement-grid">
          <div className="quote-panel">
            <blockquote>“Necesitamos una instancia de imaginación, de creatividad, de pensar cómo debería ser ese futuro que podríamos tener”</blockquote>
            <p className="quote-attribution">María Florencia Alcaraz, periodista y cofundadora de Ni Una Menos</p>
          </div>
        </div>
      </section>

      <div className="container home-content">
        <section className="areas" aria-labelledby="areas-title">
          <h2 id="areas-title" className="sr-only">Áreas de contenido</h2>
          <div className="areas-grid">
            {areas.map((area) => <AreaCard key={area.name} area={area} onNavigate={onNavigate} />)}
          </div>
        </section>

        <AgendaCalendar onNavigate={onNavigate} onOpenEvent={onOpenEvent} />
        <Search />
      </div>
    </>
  )
}

function AreaCard({ area, onNavigate }) {
  const downloadSample = () => {
    const sample = 'SOBERANA — BOLETÍN OFICIAL\nEdición de muestra para evaluación del prototipo.\nOctubre de 2026.\n\nEste archivo no constituye una publicación oficial.'
    const url = URL.createObjectURL(new Blob([sample], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'soberana-boletin-edicion-de-muestra.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleAction = (action) => {
    if (action === 'Descargar última edición') downloadSample()
    else onNavigate(area.name)
  }

  const handlePrimaryNavigation = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(area.name)
  }

  return (
    <article className="area-card">
      <span className="area-symbol" aria-hidden="true"><img src={area.symbol} alt="" /></span>
      <div className="area-body">
        <h3><a className="area-primary-link" href={getAreaHref(area.name)} onClick={handlePrimaryNavigation}>{area.name} <Arrow className="area-arrow" /></a></h3>
        {area.description && <p>{area.description}</p>}
      </div>
      {area.actions.length > 0 && (
        <div className="area-actions">
          {area.actions.map((action) => <button key={action} className="text-link" onClick={() => handleAction(action)}>{action} <Arrow className="area-arrow" /></button>)}
        </div>
      )}
    </article>
  )
}

function AgendaCalendar({ onNavigate, onOpenEvent }) {
  const [month, setMonth] = useState(new Date(2026, 9, 1))
  const [selectedDate, setSelectedDate] = useState('2026-10-15')
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const mondayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7
  const cells = [...Array(mondayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  while (cells.length % 7) cells.push(null)
  const selectedEvents = events.filter((event) => event.date === selectedDate)
  const today = '2026-10-15'
  const rawMonthLabel = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(month)
  const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1)

  const moveMonth = (offset) => {
    const next = new Date(year, monthIndex + offset, 1)
    setMonth(next)
    setSelectedDate(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`)
  }

  return (
    <section className="agenda-section" aria-labelledby="agenda-title">
      <div className="agenda-titlebar">
        <h2 id="agenda-title">Agenda Soberana</h2>
        <span className="agenda-mark" aria-hidden="true">10—26</span>
      </div>
      <div className="agenda-content">
        <div className="calendar-panel">
          <div className="calendar-controls">
            <h3 aria-live="polite">{monthLabel}</h3>
            <div>
              <button className="icon-button" onClick={() => moveMonth(-1)} aria-label="Mes anterior"><Arrow direction="left" /></button>
              <button className="icon-button" onClick={() => moveMonth(1)} aria-label="Mes siguiente"><Arrow /></button>
            </div>
          </div>
          <div className="calendar" role="grid" aria-label={`Calendario de ${monthLabel}`}>
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <div className="weekday" role="columnheader" key={day}>{day}</div>)}
            {cells.map((day, index) => {
              if (!day) return <div className="calendar-empty" key={`empty-${index}`} role="gridcell" />
              const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const hasEvent = events.some((event) => event.date === date)
              const classes = ['calendar-day', selectedDate === date && 'selected', today === date && 'today'].filter(Boolean).join(' ')
              return (
                <button key={date} className={classes} role="gridcell" aria-selected={selectedDate === date} aria-label={`${day} de ${monthLabel}${hasEvent ? ', con actividades' : ''}`} onClick={() => setSelectedDate(date)}>
                  <span>{day}</span>{hasEvent && <i aria-hidden="true" />}
                </button>
              )
            })}
          </div>
          <div className="day-status" aria-live="polite">
            <p className="eyebrow">Día seleccionado · {formatDate(selectedDate)}</p>
            {selectedEvents.length ? selectedEvents.map((event) => <EventRow key={event.id} event={event} onOpen={onOpenEvent} compact />) : <p className="empty-message">No hay actividades programadas para este día.</p>}
          </div>
        </div>

        <div className="upcoming-panel">
          <div className="upcoming-heading">
            <p className="eyebrow">Octubre 2026</p>
            <h3>Próximas actividades</h3>
          </div>
          <div className="event-list">
            {events.map((event) => <EventRow key={event.id} event={event} onOpen={onOpenEvent} />)}
          </div>
          <button className="button-outline full-button" onClick={() => onNavigate('Agenda')}>Ver calendario completo <Arrow /></button>
        </div>
      </div>
    </section>
  )
}

function EventRow({ event, onOpen, compact = false }) {
  return (
    <article className={compact ? 'event-row compact-event' : 'event-row'}>
      <time dateTime={event.date} className="event-date"><strong>{formatDate(event.date, { day: '2-digit' })}</strong><span>{formatDate(event.date, { month: 'short' }).replace('.', '')}</span></time>
      <div className="event-copy">
        <h4>{event.title}</h4>
        <p>{event.place} <span aria-hidden="true">·</span> {event.mode}</p>
      </div>
      <button className="event-open" onClick={(e) => onOpen(event, e.currentTarget)} aria-label={`Ver detalle de ${event.title}`}><Arrow /></button>
    </article>
  )
}

function Search() {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('Todas')
  const [date, setDate] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [results, setResults] = useState(null)

  const submit = (event) => {
    event.preventDefault()
    const normalized = query.trim().toLocaleLowerCase('es')
    setResults(searchItems.filter((item) => {
      const matchesText = !normalized || `${item.title} ${item.text}`.toLocaleLowerCase('es').includes(normalized)
      const matchesArea = area === 'Todas' || item.type === area
      const matchesDate = !date || item.date === date
      return matchesText && matchesArea && matchesDate
    }))
  }

  return (
    <section className="search-section" aria-labelledby="search-title">
      <div className="section-heading">
        <h2 id="search-title">Buscador general</h2>
      </div>
      <form onSubmit={submit} className="search-form">
        <label className="sr-only" htmlFor="general-search">Buscar publicaciones, documentos o actividades</label>
        <input id="general-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar publicaciones, documentos o actividades" />
        <button className="button-dark" type="submit">Buscar <Arrow /></button>
      </form>
      <button className="filter-toggle" type="button" aria-expanded={advanced} aria-controls="advanced-filters" onClick={() => setAdvanced(!advanced)}>Filtros avanzados <span aria-hidden="true">{advanced ? '−' : '+'}</span></button>
      {advanced && (
        <div className="filters" id="advanced-filters">
          <div>
            <label htmlFor="area-filter">Área</label>
            <select id="area-filter" value={area} onChange={(e) => setArea(e.target.value)}>
              {['Todas', 'Boletín Oficial', 'Archivo Público', 'Gabinete de Asuntos Vocales', 'Agenda'].map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date-filter">Fecha</label>
            <input id="date-filter" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      )}
      {results !== null && (
        <div className="search-results" aria-live="polite">
          <p className="result-count">{results.length ? `${results.length} resultado${results.length === 1 ? '' : 's'}` : 'No se encontraron resultados'}</p>
          {results.length === 0 && <p>Probá con otros términos o modificá los filtros seleccionados.</p>}
          {results.map((item) => (
            <article key={`${item.type}-${item.title}`}>
              <p className="eyebrow">{item.type} · {formatDate(item.date)}</p>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function FullAgenda({ onHome, onOpenEvent }) {
  return (
    <div className="container inner-view">
      <button className="back-link" onClick={onHome}><Arrow direction="left" /> Volver al inicio</button>
      <header className="inner-heading">
        <h1>Agenda Soberana</h1>
        <p>Todos los encuentros, estrenos y actividades de octubre de 2026.</p>
      </header>
      <div className="full-agenda-list">
        {events.map((event) => <EventRow key={event.id} event={event} onOpen={onOpenEvent} />)}
      </div>
    </div>
  )
}

function SectionView({ name, onHome }) {
  return (
    <div className="container inner-view">
      <button className="back-link" onClick={onHome}><Arrow direction="left" /> Volver al inicio</button>
      <header className="inner-heading">
        <h1>{name}</h1>
        <p>{sectionInfo[name] || 'Este contenido estará disponible en la próxima etapa del proyecto.'}</p>
      </header>
      <div className="placeholder-content">
        <h2>Contenido en preparación</h2>
      </div>
    </div>
  )
}

function EventModal({ event, onClose, modalRef }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex="-1" ref={modalRef}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar detalle">×</button>
        <p className="eyebrow">{formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h2 id="modal-title">{event.title}</h2>
        <div className="modal-meta"><span>{event.time} h</span><span>{event.place}</span><span>{event.mode}</span></div>
        <p>{event.description}</p>
        <button className="button-dark" onClick={onClose}>Cerrar</button>
      </section>
    </div>
  )
}

function Footer({ onNavigate, onHome }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <button className="footer-wordmark" onClick={onHome} aria-label="Soberana, ir al inicio"><img src={soberanaLogo} alt="" /></button>
        <nav aria-label="Navegación institucional">
          {['Institucional', 'Contenidos', 'Participación', 'Contacto'].map((link) => <button key={link} onClick={() => onNavigate(link)}>{link}</button>)}
        </nav>
        <p>Plataforma pública de contenidos culturales.</p>
      </div>
    </footer>
  )
}

createRoot(document.getElementById('root')).render(<App />)
