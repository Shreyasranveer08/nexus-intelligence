import { getReports, getCompetitors } from '@/app/actions'
import ReportsDashboard from '@/components/reports/ReportsDashboard'

export default async function ReportsPage() {
  const reports = await getReports()
  const competitors = await getCompetitors()

  return <ReportsDashboard reports={reports} competitors={competitors} />
}
