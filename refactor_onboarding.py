import re

def refactor():
    with open('src/app/actions.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # updateOnboardingProgress
    content = content.replace(
"""export async function updateOnboardingProgress(step: number, data?: any) {
  const db = readDB();
  
  if (!db.user_profile) {
    db.user_profile = { onboarding_status: 'pending', onboarding_step: 1 };
  }
  
  db.user_profile.onboarding_step = step;
  
  if (data?.role) db.user_profile.role = data.role;
  
  if (data?.company) {
    db.user_company = { ...db.user_company, ...data.company };
  }
  
  writeDB(db);
  revalidatePath('/');
  return db.user_profile;
}""",
"""export async function updateOnboardingProgress(step: number, data?: any) {
  const user = await getUserProfile();
  if (!user.is_authenticated) throw new Error('Unauthorized');
  
  const db = readDB();
  let userProfile = db.users?.find((u: any) => u.id === user.id);
  if (!userProfile) return null;
  
  userProfile.onboarding_step = step;
  
  if (data?.role) userProfile.role = data.role;
  
  if (data?.company) {
    let company = db.companies?.find((c: any) => c.user_id === user.id);
    if (!company) {
      if (!db.companies) db.companies = [];
      company = { id: generateId(), user_id: user.id };
      db.companies.push(company);
    }
    Object.assign(company, data.company);
  }
  
  writeDB(db);
  revalidatePath('/');
  return userProfile;
}"""
    )

    # completeOnboarding
    content = content.replace(
"""export async function completeOnboarding() {
  const db = readDB();
  if (!db.user_profile) {
    db.user_profile = { onboarding_status: 'pending', onboarding_step: 1 };
  }
  db.user_profile.onboarding_status = 'completed';
  writeDB(db);
  revalidatePath('/');
  return db.user_profile;
}""",
"""export async function completeOnboarding() {
  const user = await getUserProfile();
  if (!user.is_authenticated) throw new Error('Unauthorized');
  
  const db = readDB();
  let userProfile = db.users?.find((u: any) => u.id === user.id);
  if (!userProfile) return null;
  
  userProfile.onboarding_status = 'completed';
  writeDB(db);
  revalidatePath('/');
  return userProfile;
}"""
    )

    # getUserCompany
    content = content.replace(
"""export async function getUserCompany() {
  const db = readDB();
  return db.user_company;
}""",
"""export async function getUserCompany() {
  const user = await getUserProfile();
  if (!user.is_authenticated) return null;
  const db = readDB();
  return (db.companies || []).find((c: any) => c.user_id === user.id) || null;
}"""
    )

    with open('src/app/actions.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    refactor()
