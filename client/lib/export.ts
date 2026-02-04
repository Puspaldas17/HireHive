import { JobApplication } from '@/lib/types';
import { formatDate } from '@/lib/utils';

/**
 * Export applications to CSV format
 */
export function exportToCSV(applications: JobApplication[], filename: string = 'job_applications.csv') {
  // Prepare CSV headers
  const headers = [
    'Company',
    'Job Role',
    'Status',
    'Applied Date',
    'Updated Date',
    'Interview Date',
    'Salary',
    'Job URL',
    'Notes',
  ];

  // Prepare CSV rows
  const rows = applications.map((app) => [
    escapeCSVField(app.company),
    escapeCSVField(app.jobRole),
    app.status,
    formatDate(app.applicationDate),
    formatDate(app.lastUpdated),
    app.interviewDate ? formatDate(app.interviewDate) : '',
    escapeCSVField(app.salary || ''),
    escapeCSVField(app.jobUrl || ''),
    escapeCSVField(app.notes || ''),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Download the file
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export a single application as a text report
 */
export function exportApplicationReport(app: JobApplication, filename: string = 'application_report.txt') {
  const report = `
JOB APPLICATION REPORT
======================================

Company: ${app.company}
Job Role: ${app.jobRole}
Status: ${app.status}

DATES:
Applied: ${formatDate(app.applicationDate)}
Updated: ${formatDate(app.lastUpdated)}
${app.interviewDate ? `Interview: ${formatDate(app.interviewDate)}\n` : ''}
COMPENSATION:
${app.salary ? `Salary: ${app.salary}\n` : ''}
LINKS:
${app.jobUrl ? `Job Posting: ${app.jobUrl}\n` : ''}
NOTES:
${app.notes || 'No notes'}

STATUS HISTORY:
${
  app.statusHistory
    ?.map((entry) => `- ${entry.status} (${formatDate(entry.changedAt)})`)
    .join('\n') || 'No history'
}

ACTIVITY LOG:
${
  app.activities
    ?.slice(0, 10)
    .map((activity) => `- ${activity.description} (${formatDate(activity.timestamp)})`)
    .join('\n') || 'No activities'
}
  `.trim();

  downloadFile(report, filename, 'text/plain');
}

/**
 * Generate and download a summary report
 */
export function exportSummaryReport(
  applications: JobApplication[],
  filename: string = 'job_search_summary.txt'
) {
  const totalApps = applications.length;
  const byStatus = {
    Applied: applications.filter((a) => a.status === 'Applied').length,
    Interview: applications.filter((a) => a.status === 'Interview').length,
    Offer: applications.filter((a) => a.status === 'Offer').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
    OnHold: applications.filter((a) => a.status === 'OnHold').length,
  };

  const successRate = totalApps > 0 ? Math.round((byStatus.Offer / totalApps) * 100) : 0;

  const report = `
JOB SEARCH SUMMARY REPORT
======================================

Generated: ${new Date().toLocaleString()}

OVERVIEW:
- Total Applications: ${totalApps}
- Success Rate: ${successRate}%
- Offers Received: ${byStatus.Offer}

STATUS BREAKDOWN:
- Applied: ${byStatus.Applied}
- Interviews: ${byStatus.Interview}
- Offers: ${byStatus.Offer}
- Rejected: ${byStatus.Rejected}
- On Hold: ${byStatus.OnHold}

RECENT APPLICATIONS:
${applications
  .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
  .slice(0, 10)
  .map(
    (app) =>
      `${app.company} - ${app.jobRole}
  Status: ${app.status}
  Applied: ${formatDate(app.applicationDate)}`
  )
  .join('\n\n')}
  `.trim();

  downloadFile(report, filename, 'text/plain');
}

/**
 * Helper function to escape CSV fields
 */
function escapeCSVField(field: string): string {
  // If field contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
