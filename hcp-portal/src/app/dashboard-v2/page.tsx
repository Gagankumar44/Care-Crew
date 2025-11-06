'use client'

/**
 * Dashboard V2 - Explicit V2 route
 * This route always renders the new design
 * Accessible at /dashboard-v2
 */

import { AppLayoutV2 } from '@/layouts/AppLayoutV2'
import { DashboardV2Content } from './DashboardV2Content'

export default function DashboardV2Page() {
  return (
    <AppLayoutV2>
      <DashboardV2Content />
    </AppLayoutV2>
  )
}
