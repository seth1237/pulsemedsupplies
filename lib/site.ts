export const SITE_URL = 'https://www.pulsemedsolutionslimited.co.ke'
export const SITE_NAME = 'Pulsemed Solutions Limited'
export const SITE_SHORT_NAME = 'Pulsemed'
export const SITE_TAGLINE = 'Medical and hospital equipment supplier in Kenya'

export const SITE_DESCRIPTION =
  'Pulsemed Solutions Limited supplies medical equipment for every hospital department — theatre, ICU, triage, maternity, wards, laboratory, radiology, and dental — to facilities across Kenya. Installation, commissioning, and biomedical support from Nairobi.'

export const SITE_KEYWORDS = [
  'medical equipment Kenya',
  'hospital equipment Kenya',
  'medical equipment supplier Nairobi',
  'theatre equipment Kenya',
  'ICU equipment Kenya',
  'maternity and neonatal equipment Kenya',
  'laboratory equipment Kenya',
  'radiology equipment Kenya',
  'dental equipment Kenya',
  'Pulsemed Solutions Limited',
]

export const OG_IMAGE = '/og.png'
export const LOGO_SQUARE_PATH = '/logos/pulsemed-logo-square.png'

export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function isLabDepartment(name: string): boolean {
  return /lab(oratory)?/i.test(name)
}

export function matchesDepartmentFilter(department: string, filter: string): boolean {
  if (!filter || filter === 'All') return true
  const dept = department.toLowerCase().trim()
  const selected = filter.toLowerCase().trim()
  if (selected === 'lab' || selected === 'laboratory') {
    return isLabDepartment(department)
  }
  if (dept === selected) return true

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const deptNorm = normalize(department)
  const filterNorm = normalize(filter)
  if (!deptNorm || !filterNorm) return false
  if (deptNorm === filterNorm) return true
  if (deptNorm.includes(filterNorm) || filterNorm.includes(deptNorm)) return true

  const aliases: Record<string, string[]> = {
    triage: ['triage', 'triage and emergency', 'emergency'],
    icu: ['icu', 'icu setup', 'intensive care'],
    laboratory: ['lab', 'laboratory'],
    "doctor's room": ['doctors room', 'doctor room', 'consultation'],
    'maternity and neonatal': ['maternity', 'neonatal', 'maternity neonatal'],
  }

  for (const group of Object.values(aliases)) {
    const filterInGroup = group.some(
      (alias) => filterNorm === alias || filterNorm.includes(alias) || alias.includes(filterNorm),
    )
    const deptInGroup = group.some(
      (alias) => deptNorm === alias || deptNorm.includes(alias) || alias.includes(deptNorm),
    )
    if (filterInGroup && deptInGroup) return true
  }

  return false
}

export function sortDepartments(departments: string[]): string[] {
  return Array.from(new Set(departments.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}
