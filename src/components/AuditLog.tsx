
import React from 'react';
import { useAudit } from '@/contexts/AuditContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, History } from 'lucide-react';
import { useState } from 'react';

export const AuditLog: React.FC = () => {
  const { auditLog, revertSingleChange } = useAudit();
  const [formData, setFormData] = useState({}); // This would come from your main form context in a real implementation

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const getSectionBadgeColor = (section: string) => {
    if (section.includes('Reverted')) return 'secondary';
    if (section.includes('Employment')) return 'default';
    if (section.includes('Second job')) return 'outline';
    if (section.includes('Additional')) return 'destructive';
    return 'default';
  };

  return (
    <div className="p-8 max-md:px-5">
      <div className="flex items-center gap-2 text-base text-black font-normal mb-4">
        <History className="w-4 h-4" />
        <h1 className="text-[#165788] text-[22px] font-medium">Audit Log</h1>
      </div>
      
      <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.05)] bg-white p-6 rounded">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Track all changes made to the Income & Employment details. You can revert individual changes or see the complete history.
          </p>
          
          {auditLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No changes have been made yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      {formatTimestamp(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSectionBadgeColor(entry.section)}>
                        {entry.section}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.field}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={entry.oldValue}>
                      {entry.oldValue || <span className="text-gray-400 italic">Empty</span>}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={entry.newValue}>
                      {entry.newValue || <span className="text-gray-400 italic">Empty</span>}
                    </TableCell>
                    <TableCell>{entry.user}</TableCell>
                    <TableCell>
                      {!entry.section.includes('Reverted') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revertSingleChange(entry.id, formData, setFormData)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Revert
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};
