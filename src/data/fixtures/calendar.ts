import type { CalendarEntry, SeasonalTip } from '@/types'

export const fixtureCalendarEntries: CalendarEntry[] = [
  { id: 'cal-1', date: '2026-05-07', title: 'Giessplan umsetzen', type: 'task', projectId: 'proj-1', color: 'blue' },
  { id: 'cal-2', date: '2026-05-12', title: 'Setzlinge einpflanzen', type: 'task', projectId: 'proj-1', groupId: 'g-1', color: 'blue' },
  { id: 'cal-3', date: '2026-05-14', title: 'Giessplan erstellen', type: 'task', projectId: 'proj-1', color: 'blue' },
  { id: 'cal-4', date: '2026-05-15', title: 'Pflanzaktion Beet 2', type: 'milestone', projectId: 'proj-1', color: 'violet' },
  { id: 'cal-5', date: '2026-05-18', title: 'Unkraut jäten (Woche 20)', type: 'task', projectId: 'proj-1', groupId: 'g-3', color: 'blue' },
  { id: 'cal-6', date: '2026-05-23', title: 'Setzlinge abhärten', type: 'task', projectId: 'proj-1', color: 'blue' },
  { id: 'cal-7', date: '2026-05-25', title: 'Schädlinge beobachten', type: 'task', projectId: 'proj-1', groupId: 'g-1', color: 'blue' },
  { id: 'cal-8', date: '2026-05-01', title: 'Tomaten ins Freiland setzen', type: 'seasonal', color: 'green' },
  { id: 'cal-9', date: '2026-05-10', title: 'Kartoffeln anhäufeln', type: 'seasonal', color: 'green' },
  { id: 'cal-10', date: '2026-05-20', title: 'Erdbeeren ernten', type: 'seasonal', color: 'green' },
  // June entries
  { id: 'cal-11', date: '2026-06-01', title: 'Sommerrückschnitt Kräuter', type: 'seasonal', color: 'green' },
  { id: 'cal-12', date: '2026-06-15', title: 'Erste Ernte Rübli (geplant)', type: 'milestone', projectId: 'proj-1', color: 'violet' },
]

export const fixtureSeasonalTips: SeasonalTip[] = [
  { id: 'st-1', month: 5, text: 'Tomaten und Gurken können jetzt ins Freiland gesetzt werden.' },
  { id: 'st-2', month: 5, text: 'Kartoffeln anhäufeln für besseren Ertrag.' },
  { id: 'st-3', month: 5, text: 'Erdbeeren beginnen zu reifen – Ernte vorbereiten.' },
  { id: 'st-4', month: 6, text: 'Regelmässig giessen bei warmen Temperaturen.' },
  { id: 'st-5', month: 6, text: 'Unkraut rechtzeitig entfernen, bevor es Samen bildet.' },
  { id: 'st-6', month: 7, text: 'Erste Ernte einbringen und dokumentieren.' },
  { id: 'st-7', month: 8, text: 'Herbstgemüse aussäen (Nüsslisalat, Spinat).' },
  { id: 'st-8', month: 9, text: 'Kompost anlegen aus Gartenabfällen.' },
  { id: 'st-9', month: 10, text: 'Beete winterfest machen.' },
]
