import React from 'react';
import AdvancedAnalytics from './AdvancedAnalytics';
import AnalyticsCharts from './AnalyticsCharts';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsAndBudgetModule() {
  return (
    <div className="flex flex-col gap-6 h-full animate-slide-in pb-8">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
         <div className="p-3 rounded-xl bg-purple-100 text-purple-600 shadow-sm">
            <BarChart3 size={20} />
         </div>
         <div>
           <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">Analytics & Budget</h2>
           <p className="text-base text-slate-500 font-medium">Deep dive into ward finances, public sentiment, and issue resolution metrics</p>
         </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* We reuse the AnalyticsCharts which contains the Sanctioned Ward Budget and Resolution Rates */}
        <div className="w-full">
           <AnalyticsCharts />
        </div>
        
        {/* We include AdvancedAnalytics which contains Fund Utilization and Sentiment */}
        <div className="w-full">
           <AdvancedAnalytics />
        </div>
      </div>
    </div>
  );
}
