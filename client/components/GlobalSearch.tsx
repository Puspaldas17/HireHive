import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { JobApplication } from '@/lib/types';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GlobalSearchProps {
  applications: JobApplication[];
  onSearch?: (results: JobApplication[]) => void;
}

export function GlobalSearch({ applications, onSearch }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JobApplication[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      onSearch?.([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = applications.filter((app) => {
      const companyMatch = app.company.toLowerCase().includes(searchQuery);
      const roleMatch = app.jobRole.toLowerCase().includes(searchQuery);
      const notesMatch = app.notes.toLowerCase().includes(searchQuery);
      const salaryMatch = app.salary?.toLowerCase().includes(searchQuery);

      return companyMatch || roleMatch || notesMatch || salaryMatch;
    });

    setResults(filtered);
    onSearch?.(filtered);
  }, [query, applications, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search applications..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.slice(0, 10).map((app) => (
                <Link
                  key={app.id}
                  to={`/application/${app.id}`}
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="block p-3 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {app.company}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {app.jobRole}
                      </p>
                    </div>
                    <span className={cn(
                      'text-xs font-medium px-2 py-1 rounded whitespace-nowrap',
                      {
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': app.status === 'Applied',
                        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300': app.status === 'Interview',
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': app.status === 'Offer',
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': app.status === 'Rejected',
                        'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300': app.status === 'OnHold',
                      }
                    )}>
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
              {results.length > 10 && (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  +{results.length - 10} more results
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>No applications found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
