export function formatMemberMeta(employeeCode, departmentName, teamName) {
  const org = [departmentName, teamName].filter(Boolean).join(' > ') || teamName || departmentName || ''
  return [employeeCode, org].filter(Boolean).join(' · ')
}
