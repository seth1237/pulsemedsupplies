export const SITE_URL = 'https://www.pulsemedsolutionslimited.co.ke'
export const SITE_NAME = 'Pulsemed Solutions Limited'
export const SITE_SHORT_NAME = 'Pulsemed'
export const SITE_TAGLINE = 'Laboratory and medical equipment supplier in Kenya'

export const SITE_DESCRIPTION =
  'Pulsemed Solutions Limited supplies laboratory analysers, microscopes, autoclaves, and medical equipment to hospitals, diagnostic centres, and labs across Kenya. Installation, commissioning, and biomedical support from Nairobi.'

export const SITE_KEYWORDS = [
  'laboratory equipment Kenya',
  'lab equipment Nairobi',
  'medical laboratory supplies Kenya',
  'hematology analyser Kenya',
  'chemistry analyser Kenya',
  'microscope supplier Kenya',
  'autoclave Kenya',
  'hospital equipment Kenya',
  'Pulsemed Solutions Limited',
  'medical equipment Kenya',
]

export const OG_IMAGE = '/og.png'
export const LOGO_SQUARE_PATH = '/logos/logopulsemedsquare.png'

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

export function sortDepartmentsLabFirst(departments: string[]): string[] {
  const unique = Array.from(new Set(departments.filter(Boolean)))
  unique.sort((a, b) => {
    const aLab = isLabDepartment(a) ? 0 : 1
    const bLab = isLabDepartment(b) ? 0 : 1
    if (aLab !== bLab) return aLab - bLab
    return a.localeCompare(b)
  })
  return unique
}

export function sortProductsLabFirst<T extends { department: string }>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const aLab = isLabDepartment(a.department) ? 0 : 1
    const bLab = isLabDepartment(b.department) ? 0 : 1
    if (aLab !== bLab) return aLab - bLab
    return 0
  })
}
