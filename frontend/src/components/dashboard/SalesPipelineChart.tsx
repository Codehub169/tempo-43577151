import React from 'react';
import { Card } from '../ui/Card'; // Assuming Card component is in ../ui/Card
import { LightBulbIcon } from '@heroicons/react/24/outline';

export interface PipelineStageData {
  id: string;
  name: string;
  value: number;
  count: number;
  color: string; // e.g., 'bg-blue-500', 'bg-green-500'
}

interface SalesPipelineChartProps {
  data: PipelineStageData[];
  currencySymbol?: string;
  title?: string;
}

const SalesPipelineChart: React.FC<SalesPipelineChartProps> = ({
  data,
  currencySymbol = '$',
  title = 'Sales Pipeline Overview',
}) => {
  if (!data || data.length === 0) {
    return (
      <Card title={title} variant="glass">
        <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
          <LightBulbIcon className="h-12 w-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" />
          <p>No sales pipeline data available yet.</p>
          <p className="text-sm">Start adding opportunities to see your pipeline.</p>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((stage) => stage.value), 0);

  return (
    <Card title={title} variant="glass">
      <div className="p-4 md:p-6 space-y-4">
        {data.map((stage) => (
          <div key={stage.id} className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                {stage.name} ({stage.count})
              </span>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                {currencySymbol}
                {stage.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="h-3 md:h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-80 ${stage.color}`}
                style={{ width: maxValue > 0 ? `${(stage.value / maxValue) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SalesPipelineChart;
