import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from './lib/dates.js'
import { boundedDate, calendarDays, moveCalendarDay, moveCalendarMonth } from './lib/calendar.js'
import './date-picker.css'

const months = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, index, 1))))
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function Calendar({ id, label, value, min, max, today, onSelect, onDone }) {
  const [focused, setFocused] = useState(() => boundedDate(value || today, min, max))
  const focusDay = useRef(true)
  const dayButtons = useRef(new Map())
  const year = Number(focused.slice(0, 4))
  const month = Number(focused.slice(5, 7)) - 1
  const years = Array.from({ length: Number(max.slice(0, 4)) - Number(min.slice(0, 4)) + 1 }, (_, index) => Number(min.slice(0, 4)) + index)

  useEffect(() => {
    if (focusDay.current) dayButtons.current.get(focused)?.focus({ preventScroll: true })
  }, [focused])

  function navigate(offset, moveFocus = false) {
    focusDay.current = moveFocus
    const next = moveCalendarMonth(focused, offset, min, max)
    setFocused(next)
    onSelect(next)
  }

  function dayKey(event) {
    const weekday = new Date(`${focused}T12:00:00Z`).getUTCDay()
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday }
    if (event.key in offsets) {
      event.preventDefault()
      focusDay.current = true
      setFocused(moveCalendarDay(focused, offsets[event.key], min, max))
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      navigate((event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1), true)
    }
  }

  return <div id={`${id}-calendar`} className="date-calendar" role="dialog" aria-label={`${label} calendar`}>
    <div className="calendar-scroll">
    <div className="calendar-heading">
      <div className="calendar-selects">
        <span className="calendar-select"><select aria-label="Month" value={month} onChange={(event) => navigate(Number(event.target.value) - month)}>
          {months.map((name, index) => <option key={name} value={index} disabled={`${year}-${String(index + 1).padStart(2, '0')}` < min.slice(0, 7) || `${year}-${String(index + 1).padStart(2, '0')}` > max.slice(0, 7)}>{name}</option>)}
        </select><ChevronDown size={13} aria-hidden="true" /></span>
        <span className="calendar-select"><select aria-label="Year" value={year} onChange={(event) => navigate((Number(event.target.value) - year) * 12)}>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select><ChevronDown size={13} aria-hidden="true" /></span>
      </div>
      <div className="calendar-navigation">
        <button type="button" aria-label="Previous month" disabled={focused.slice(0, 7) <= min.slice(0, 7)} onClick={() => navigate(-1)}><ChevronLeft size={17} aria-hidden="true" /></button>
        <button type="button" aria-label="Next month" disabled={focused.slice(0, 7) >= max.slice(0, 7)} onClick={() => navigate(1)}><ChevronRight size={17} aria-hidden="true" /></button>
      </div>
    </div>
    <p className="calendar-sr-only" aria-live="polite">{months[month]} {year}</p>
    <div className="calendar-weekdays" aria-hidden="true">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-days" role="group" aria-label={`${months[month]} ${year} dates`}>
      {calendarDays(focused).map((day) => <button type="button" key={day} ref={(element) => { if (element) dayButtons.current.set(day, element); else dayButtons.current.delete(day) }}
        className={`calendar-day${day.slice(0, 7) !== focused.slice(0, 7) ? ' is-outside' : ''}${day === value ? ' is-selected' : ''}`}
        aria-label={formatDate(day)} aria-pressed={day === value} aria-current={day === today ? 'date' : undefined}
        tabIndex={day === focused ? 0 : -1} disabled={day < min || day > max}
        onKeyDown={dayKey} onClick={() => { focusDay.current = true; setFocused(day); onSelect(day) }}>{Number(day.slice(8))}</button>)}
    </div>
    </div>
    <div className="calendar-footer"><span>Choose month, day & year</span><div className="calendar-actions"><button type="button" disabled={today < min || today > max} onClick={() => { focusDay.current = true; setFocused(today); onSelect(today) }}>Today</button><button type="button" className="calendar-done" onClick={onDone}>Done</button></div></div>
  </div>
}

export default function DatePicker({ id, name, label, value, min, max, today, onChange, describedBy, invalid }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const host = useRef(null)
  const trigger = useRef(null)
  const tabbing = useRef(false)

  useLayoutEffect(() => {
    if (!open) return
    const calendar = host.current.querySelector('.date-calendar')
    function position() {
      const rect = trigger.current.getBoundingClientRect()
      const viewport = window.visualViewport
      const height = viewport?.height || window.innerHeight
      const offset = viewport?.offsetTop || 0
      const below = Math.max(0, height + offset - rect.bottom - 18)
      const above = Math.max(0, rect.top - offset - 18)
      const naturalHeight = calendar.querySelector('.calendar-scroll').scrollHeight + calendar.querySelector('.calendar-footer').offsetHeight + 2
      const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
      const upward = !compact && below < naturalHeight && above >= naturalHeight
      const inline = compact || (below < naturalHeight && !upward)
      const workspace = host.current.closest('.sticky-preview-title, .sticky-moon-title')
      const heading = workspace?.querySelector('h1')
      const preview = workspace?.querySelector('.mobile-preview')
      const pinnedHeight = heading && getComputedStyle(heading).position === 'sticky'
        ? heading.getBoundingClientRect().height + (preview && getComputedStyle(preview).position === 'sticky' ? preview.getBoundingClientRect().height : 0)
        : 0
      // Reserve space for the pinned title/model, leaving Done on screen while
      // dates scroll inside the calendar on short phones and landscape views.
      const availableHeight = Math.max(100, height - pinnedHeight - 24)
      calendar.dataset.placement = inline ? 'inline' : upward ? 'above' : 'below'
      calendar.style.maxHeight = `${Math.min(availableHeight, 440)}px`
      calendar.style.scrollMarginTop = `${pinnedHeight + 12}px`
      calendar.style.top = upward ? 'auto' : 'calc(100% + 10px)'
      calendar.style.bottom = upward ? 'calc(100% + 10px)' : 'auto'
    }
    position()
    const frame = requestAnimationFrame(() => calendar.scrollIntoView({ block: 'nearest', behavior: 'instant' }))
    window.addEventListener('resize', position)
    window.visualViewport?.addEventListener('resize', position)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', position)
      window.visualViewport?.removeEventListener('resize', position)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    let gesture
    function start(event) {
      tabbing.current = false
      gesture = !host.current.contains(event.target) ? { id: event.pointerId, x: event.clientX, y: event.clientY, scroll: window.scrollY, moved: false } : null
    }
    function move(event) {
      if (gesture?.id === event.pointerId && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 10) gesture.moved = true
    }
    function end(event) {
      if (gesture?.id === event.pointerId && !gesture.moved && Math.abs(window.scrollY - gesture.scroll) < 2 && !host.current.contains(event.target)) setOpen(false)
      gesture = null
    }
    function cancel() { gesture = null }
    document.addEventListener('pointerdown', start, { passive: true })
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerup', end, { passive: true })
    document.addEventListener('pointercancel', cancel, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', start)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', end)
      document.removeEventListener('pointercancel', cancel)
    }
  }, [open])

  function close() {
    setOpen(false)
    trigger.current.focus({ preventScroll: true })
  }

  return <div ref={host} className="date-picker" onKeyDown={(event) => {
    tabbing.current = event.key === 'Tab'
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close() }
  }} onBlur={(event) => {
    if (tabbing.current && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <input type="hidden" name={name} value={value} />
    <button ref={trigger} id={id} type="button" className="date-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-calendar` : undefined} aria-describedby={[`${id}-value`, describedBy].filter(Boolean).join(' ')} aria-invalid={invalid} onClick={() => { if (!open) setDraft(boundedDate(value || today, min, max)); setOpen(!open) }}>
      <CalendarDays size={19} strokeWidth={1.5} aria-hidden="true" /><span id={`${id}-value`}>{value ? formatDate(value) : 'Choose a date'}</span><ChevronDown className="date-chevron" size={16} aria-hidden="true" />
    </button>
    {open && <Calendar id={id} label={label} value={draft} min={min} max={max} today={today} onSelect={setDraft} onDone={() => { onChange(draft); close() }} />}
  </div>
}
