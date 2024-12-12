import React from 'react';
import { GroupDashboard } from '@/app/components/GroupDashboard';

const GroupDashboardPage = ({ params }: { params: { groupId: string } }) => {

  return (
    <div className="flex">
        <GroupDashboard groupId={params.groupId} />
    </div>
  )
}

export default GroupDashboardPage