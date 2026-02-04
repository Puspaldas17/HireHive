import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Filter } from 'lucide-react';
import { JobStatus } from '@/lib/types';

const jobStatusOptions: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected", "OnHold"];

export interface FilterOptions {
  status?: JobStatus;
  company?: string;
  jobRole?: string;
  startDate?: string;
  endDate?: string;
  minSalary?: string;
  maxSalary?: string;
  hasInterview?: boolean;
  hasResume?: boolean;
  hasNotes?: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClear: () => void;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClear,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '');

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={hasActiveFilters ? 'border-primary' : ''}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {hasActiveFilters && <span className="ml-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Active</span>}
      </Button>
    );
  }

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Advanced Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="filter-status">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) =>
              handleFilterChange('status', value || undefined)
            }
          >
            <SelectTrigger id="filter-status" className="text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {jobStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="filter-company">Company</Label>
          <Input
            id="filter-company"
            placeholder="Filter by company..."
            value={filters.company || ''}
            onChange={(e) => handleFilterChange('company', e.target.value || undefined)}
            className="text-sm"
          />
        </div>

        {/* Job Role */}
        <div className="space-y-2">
          <Label htmlFor="filter-role">Job Role</Label>
          <Input
            id="filter-role"
            placeholder="Filter by role..."
            value={filters.jobRole || ''}
            onChange={(e) => handleFilterChange('jobRole', e.target.value || undefined)}
            className="text-sm"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="filter-start">From Date</Label>
          <Input
            id="filter-start"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            className="text-sm"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="filter-end">To Date</Label>
          <Input
            id="filter-end"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            className="text-sm"
          />
        </div>

        {/* Min Salary */}
        <div className="space-y-2">
          <Label htmlFor="filter-min-salary">Min Salary</Label>
          <Input
            id="filter-min-salary"
            type="number"
            placeholder="e.g., 100000"
            value={filters.minSalary || ''}
            onChange={(e) => handleFilterChange('minSalary', e.target.value || undefined)}
            className="text-sm"
          />
        </div>

        {/* Max Salary */}
        <div className="space-y-2">
          <Label htmlFor="filter-max-salary">Max Salary</Label>
          <Input
            id="filter-max-salary"
            type="number"
            placeholder="e.g., 300000"
            value={filters.maxSalary || ''}
            onChange={(e) => handleFilterChange('maxSalary', e.target.value || undefined)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 mb-4">
        <Label>Additional Filters</Label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasInterview || false}
              onChange={(e) => handleFilterChange('hasInterview', e.target.checked || undefined)}
              className="rounded border-border"
            />
            <span className="text-sm">Has Interview Scheduled</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasResume || false}
              onChange={(e) => handleFilterChange('hasResume', e.target.checked || undefined)}
              className="rounded border-border"
            />
            <span className="text-sm">Has Resume</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasNotes || false}
              onChange={(e) => handleFilterChange('hasNotes', e.target.checked || undefined)}
              className="rounded border-border"
            />
            <span className="text-sm">Has Notes</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onClear();
            setIsOpen(false);
          }}
        >
          Clear All
        </Button>
        <Button
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
