import re

def refactor():
    with open('src/app/actions.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. addCompetitor
    content = content.replace(
        "export async function addCompetitor(name: string, urls: { url: string, type: string }[]) {\n  const db = readDB()",
        "export async function addCompetitor(name: string, urls: { url: string, type: string }[]) {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) throw new Error('Unauthorized')\n  const db = readDB()"
    )
    content = content.replace(
        "    id: compId,\n    name,",
        "    id: compId,\n    user_id: user.id,\n    name,"
    )
    content = content.replace(
        "    id: generateId(),\n    competitor_id: compId,",
        "    id: generateId(),\n    user_id: user.id,\n    competitor_id: compId,"
    )

    # 2. getCompetitors
    content = content.replace(
        "export async function getCompetitors(statusFilter: 'active' | 'archived' | 'all' = 'active') {\n  const db = readDB()",
        "export async function getCompetitors(statusFilter: 'active' | 'archived' | 'all' = 'active') {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) return []\n  const db = readDB()"
    )
    content = content.replace(
        "let competitorsWithUrls = db.competitors.map((comp: any) => ({",
        "let competitorsWithUrls = db.competitors.filter((c: any) => c.user_id === user.id).map((comp: any) => ({"
    )

    # 3. archiveCompetitor
    content = content.replace(
        "export async function archiveCompetitor(id: string) {\n  const db = readDB()",
        "export async function archiveCompetitor(id: string) {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) throw new Error('Unauthorized')\n  const db = readDB()"
    )
    content = content.replace(
        "const comp = db.competitors.find((c: any) => c.id === id)",
        "const comp = db.competitors.find((c: any) => c.id === id && c.user_id === user.id)"
    )

    # 4. restoreCompetitor
    content = content.replace(
        "export async function restoreCompetitor(id: string) {\n  const db = readDB()",
        "export async function restoreCompetitor(id: string) {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) throw new Error('Unauthorized')\n  const db = readDB()"
    )

    # 5. deleteCompetitorHard
    content = content.replace(
        "export async function deleteCompetitorHard(id: string) {\n  const db = readDB()",
        "export async function deleteCompetitorHard(id: string) {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) throw new Error('Unauthorized')\n  const db = readDB()"
    )
    content = content.replace(
        "db.competitors.filter((c: any) => c.id !== id)",
        "db.competitors.filter((c: any) => !(c.id === id && c.user_id === user.id))"
    )
    content = content.replace(
        "db.tracked_urls.filter((u: any) => u.competitor_id !== id)",
        "db.tracked_urls.filter((u: any) => !(u.competitor_id === id && u.user_id === user.id))"
    )

    # 6. getIntelligenceFeed
    content = content.replace(
        "export async function getIntelligenceFeed() {\n  const db = readDB()",
        "export async function getIntelligenceFeed() {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) return []\n  const db = readDB()"
    )
    content = content.replace(
        "const activeInsights = db.synthesized_insights.filter((insight: any) => \n    db.competitors.some((c: any) => c.id === insight.competitor_id && (c.status === 'active' || !c.status))\n  )",
        "const activeInsights = db.synthesized_insights.filter((insight: any) => \n    (insight.user_id === user.id || !insight.user_id) && db.competitors.some((c: any) => c.id === insight.competitor_id && (c.status === 'active' || !c.status) && c.user_id === user.id)\n  )"
    )

    # 7. getReports
    content = content.replace(
        "export async function getReports() {\n  const db = readDB()",
        "export async function getReports() {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) return []\n  const db = readDB()"
    )
    content = content.replace(
        "return db.intelligence_reports.sort",
        "return (db.intelligence_reports || []).filter((r: any) => r.user_id === user.id).sort"
    )

    # 8. getDashboardStats
    content = content.replace(
        "export async function getDashboardStats() {\n  const db = readDB()",
        "export async function getDashboardStats() {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) return { competitorsCount: 0, urlsCount: 0, highImpactCount: 0, chartData: [] }\n  const db = readDB()"
    )
    content = content.replace(
        "const competitorsCount = db.competitors?.length || 0;\n  const urlsCount = db.tracked_urls?.length || 0;\n  \n  const activeInsights = db.synthesized_insights?.filter((insight: any) => \n    db.competitors.some((c: any) => c.id === insight.competitor_id && (c.status === 'active' || !c.status))\n  ) || [];",
        "const userCompetitors = (db.competitors || []).filter((c: any) => c.user_id === user.id);\n  const competitorsCount = userCompetitors.length;\n  const urlsCount = (db.tracked_urls || []).filter((u: any) => u.user_id === user.id).length;\n  \n  const activeInsights = (db.synthesized_insights || []).filter((insight: any) => \n    (insight.user_id === user.id || !insight.user_id) && userCompetitors.some((c: any) => c.id === insight.competitor_id && (c.status === 'active' || !c.status))\n  ) || [];"
    )

    # 9. getExecutionPlans
    content = content.replace(
        "export async function getExecutionPlans() {\n  const db = readDB();",
        "export async function getExecutionPlans() {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) return []\n  const db = readDB();"
    )
    content = content.replace(
        "return (db.execution_plans || []).sort",
        "return (db.execution_plans || []).filter((p: any) => p.user_id === user.id).sort"
    )

    # 10. getExecutionPlan
    content = content.replace(
        "export async function getExecutionPlan(id: string) {\n  const db = readDB();",
        "export async function getExecutionPlan(id: string) {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) return null\n  const db = readDB();"
    )
    content = content.replace(
        "return (db.execution_plans || []).find((p: any) => p.id === id)",
        "return (db.execution_plans || []).find((p: any) => p.id === id && p.user_id === user.id)"
    )

    # 11. generateExecutionPlan
    content = content.replace(
        "export async function generateExecutionPlan(actionId: string, title: string, description: string) {\n  const db = readDB();",
        "export async function generateExecutionPlan(actionId: string, title: string, description: string) {\n  const user = await getUserProfile()\n  if (!user.is_authenticated) throw new Error('Unauthorized')\n  const db = readDB();"
    )
    content = content.replace(
        "const existing = (db.execution_plans || []).find((p: any) => p.source_action_id === actionId);",
        "const existing = (db.execution_plans || []).find((p: any) => p.source_action_id === actionId && p.user_id === user.id);"
    )
    content = content.replace(
        "id: 'ep_' + Math.random().toString(36).substring(2, 9),\n    source_action_id: actionId,",
        "id: 'ep_' + Math.random().toString(36).substring(2, 9),\n    user_id: user.id,\n    source_action_id: actionId,"
    )

    with open('src/app/actions.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    refactor()
