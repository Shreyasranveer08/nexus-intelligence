import { getUserProfile } from '@/app/actions'
import OnboardingFlow from '@/components/OnboardingFlow'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const userProfile = await getUserProfile()

  if (!userProfile?.is_authenticated) {
    redirect('/auth/login')
  }

  if (userProfile?.onboarding_status === 'completed') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
      <OnboardingFlow initialStep={userProfile?.onboarding_step || 1} />
    </div>
  )
}
