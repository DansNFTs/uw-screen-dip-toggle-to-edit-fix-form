import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ChevronDown, X, Plus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCaseNotes, type CaseNote } from '../contexts/CaseNotesContext';
import { useAudit } from '../contexts/AuditContext';

interface PolicyRule {
  id: string;
  rule: string;
  status: 'Accepted' | 'Referred' | 'Declined';
  reasonCodes?: string[];
}

const policyRules: PolicyRule[] = [
  {
    id: '2',
    rule: 'R010 No Trace',
    status: 'Referred'
  }
];

const reasonCodes = [
  'Good credit score',
  'Non fault adverse credit',
  'Straight balance remortgage'
];

export const EditablePolicyRulesNotesPage: React.FC = () => {
  const { toast } = useToast();
  const { caseNotes, addCaseNote, setCaseNotes } = useCaseNotes();
  const { addAuditEntry } = useAudit();
  const [rules, setRules] = useState<PolicyRule[]>(policyRules);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PolicyRule | null>(null);
  const [selectedReasonCode, setSelectedReasonCode] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [caseDecision, setCaseDecision] = useState<'pending' | 'approved' | 'declined'>('pending');

  // Calculate case decision based on policy rules
  useEffect(() => {
    const hasDeclined = rules.some(rule => rule.status === 'Declined');
    const allAccepted = rules.every(rule => rule.status === 'Accepted');
    
    if (hasDeclined) {
      setCaseDecision('declined');
    } else if (allAccepted) {
      setCaseDecision('approved');
    } else {
      setCaseDecision('pending');
    }
  }, [rules]);

  const handleAccept = (rule: PolicyRule) => {
    setSelectedRule(rule);
    setIsReasonModalOpen(true);
  };

  const handleDecline = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    // Add audit entry for policy rule decline
    addAuditEntry(
      `Policy Rule ${rule.rule}`,
      rule.status,
      'Declined',
      'Policy Rules'
    );

    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, status: 'Declined' as const, reasonCodes: [] } : r
    ));

    // Add system case note for decline
    addCaseNote({
      author: 'System',
      content: `Policy rule ${rule.rule} declined`,
      type: 'system',
      ruleId: rule.id
    });

    toast({
      title: "Policy rule declined",
      description: "The policy rule has been declined successfully.",
    });
  };

  const handleChangeDecision = (rule: PolicyRule) => {
    if (rule.status === 'Accepted') {
      // Add audit entry for reverting to referred
      addAuditEntry(
        `Policy Rule ${rule.rule}`,
        'Accepted',
        'Referred',
        'Policy Rules'
      );

      // Change from accepted back to referred
      setRules(prev => prev.map(r => 
        r.id === rule.id ? { ...r, status: 'Referred' as const, reasonCodes: [] } : r
      ));

      // Remove any system case notes for this rule
      setCaseNotes(prev => prev.filter(note => !(note.type === 'system' && note.ruleId === rule.id)));

      toast({
        title: "Decision changed",
        description: "The policy rule decision has been reverted to referred status.",
      });
    } else if (rule.status === 'Declined') {
      // Add audit entry for reverting to referred
      addAuditEntry(
        `Policy Rule ${rule.rule}`,
        'Declined',
        'Referred',
        'Policy Rules'
      );

      // Change from declined back to referred
      setRules(prev => prev.map(r => 
        r.id === rule.id ? { ...r, status: 'Referred' as const } : r
      ));

      // Remove any system case notes for this rule
      setCaseNotes(prev => prev.filter(note => !(note.type === 'system' && note.ruleId === rule.id)));

      toast({
        title: "Decision changed",
        description: "The policy rule decision has been reverted to referred status.",
      });
    }
  };

  const getAvailableReasonCodes = () => {
    if (!selectedRule) return reasonCodes;
    const usedCodes = selectedRule.reasonCodes || [];
    return reasonCodes.filter(code => !usedCodes.includes(code));
  };

  const handleApplyReasonCode = () => {
    if (selectedRule && selectedReasonCode) {
      const existingReasonCodes = selectedRule.reasonCodes || [];
      const updatedReasonCodes = [...existingReasonCodes, selectedReasonCode];

      // Add audit entry for reason code application
      addAuditEntry(
        `Policy Rule ${selectedRule.rule} - Reason Code`,
        existingReasonCodes.join(', ') || 'None',
        updatedReasonCodes.join(', '),
        'Policy Rules'
      );

      // Add audit entry for status change to accepted
      if (selectedRule.status !== 'Accepted') {
        addAuditEntry(
          `Policy Rule ${selectedRule.rule}`,
          selectedRule.status,
          'Accepted',
          'Policy Rules'
        );
      }

      setRules(prev => prev.map(rule => 
        rule.id === selectedRule.id 
          ? { ...rule, status: 'Accepted' as const, reasonCodes: updatedReasonCodes } 
          : rule
      ));

      // Update the selected rule state for the modal
      setSelectedRule(prev => prev ? { ...prev, reasonCodes: updatedReasonCodes } : null);

      // Find existing system case note for this rule or create new one
      const existingSystemNote = caseNotes.find(note => 
        note.type === 'system' && note.ruleId === selectedRule.id
      );

      if (existingSystemNote) {
        // Update existing system note with new reason codes
        setCaseNotes(prev => prev.map(note => 
          note.id === existingSystemNote.id 
            ? { 
                ...note, 
                content: `Policy rule ${selectedRule.rule} accepted`,
                reasonCodes: updatedReasonCodes
              }
            : note
        ));
      } else {
        // Create new system case note
        addCaseNote({
          author: 'System',
          content: `Policy rule ${selectedRule.rule} accepted`,
          type: 'system',
          reasonCodes: updatedReasonCodes,
          ruleId: selectedRule.id
        });
      }

      setSelectedReasonCode('');

      toast({
        title: "Reason code applied",
        description: "The reason code has been applied to the policy rule.",
      });
    }
  };

  const removeReasonCode = (codeToRemove: string) => {
    if (selectedRule) {
      const oldReasonCodes = selectedRule.reasonCodes || [];
      const updatedReasonCodes = oldReasonCodes.filter(code => code !== codeToRemove);
      
      // Add audit entry for reason code removal
      addAuditEntry(
        `Policy Rule ${selectedRule.rule} - Reason Code`,
        oldReasonCodes.join(', '),
        updatedReasonCodes.join(', ') || 'None',
        'Policy Rules'
      );

      setRules(prev => prev.map(rule => 
        rule.id === selectedRule.id 
          ? { ...rule, reasonCodes: updatedReasonCodes, status: updatedReasonCodes.length > 0 ? 'Accepted' as const : 'Referred' as const } 
          : rule
      ));

      // Update the selected rule state for the modal
      setSelectedRule(prev => prev ? { ...prev, reasonCodes: updatedReasonCodes } : null);

      // Update or remove the system case note
      const systemNote = caseNotes.find(note => note.type === 'system' && note.ruleId === selectedRule.id);
      
      if (systemNote) {
        if (updatedReasonCodes.length === 0) {
          // Remove the system note if no reason codes left
          setCaseNotes(prev => prev.filter(note => note.id !== systemNote.id));
        } else {
          // Update the system note with remaining reason codes
          setCaseNotes(prev => prev.map(note => 
            note.id === systemNote.id 
              ? { ...note, reasonCodes: updatedReasonCodes }
              : note
          ));
        }
      }
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add audit entry for new case note
      addAuditEntry(
        'Case Note',
        '',
        newNote.trim(),
        'Policy Rules - Case Notes'
      );

      addCaseNote({
        author: 'Current User',
        content: newNote.trim(),
        type: 'user'
      });

      setNewNote('');
      setIsAddNoteModalOpen(false);

      toast({
        title: "Case note added",
        description: "Your case note has been added successfully.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600';
      case 'Declined':
        return 'text-red-600';
      case 'Referred':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCaseDecisionColor = () => {
    switch (caseDecision) {
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'declined':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-400';
    }
  };

  const getCaseDecisionText = () => {
    switch (caseDecision) {
      case 'approved':
        return 'Approve case';
      case 'declined':
        return 'Case declined';
      default:
        return 'Pending decisions';
    }
  };

  return (
    <div className="flex-1">
      <div className="p-6">
        <div className="w-full space-y-8">
          {/* Policy Rules Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-semibold text-[#165788]">Policy Rules</h1>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Refer rule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <ChevronDown className="w-4 h-4" />
                    </TableCell>
                    <TableCell className="font-medium">
                      {rule.rule}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusColor(rule.status)}>
                        {rule.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {rule.status === 'Referred' ? (
                          <>
                            <Button
                              onClick={() => handleDecline(rule.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              ✕ Decline
                            </Button>
                            <Button
                              onClick={() => handleAccept(rule)}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              ✓ Accept
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleChangeDecision(rule)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Change decision
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Case Decision Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-[#165788] mb-4">Case decision</h2>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="text-gray-600 border-gray-200"
                disabled={caseDecision !== 'declined'}
              >
                Decline Case
              </Button>
              <Button 
                className={`text-white ${getCaseDecisionColor()}`}
                disabled={caseDecision === 'pending'}
              >
                {getCaseDecisionText()}
              </Button>
            </div>
          </div>

          {/* Case Notes Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#165788]">Case notes</h2>
              <Button 
                onClick={() => setIsAddNoteModalOpen(true)}
                className="bg-[#165788] hover:bg-[#134567] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a case note
              </Button>
            </div>
            <div className="space-y-4">
              {caseNotes.map((note) => (
                <div key={note.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500 italic">
                      {note.author} {note.date}
                    </div>
                    {note.type === 'system' && (
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                        System
                      </Badge>
                    )}
                  </div>
                  <div className="text-gray-700">{note.content}</div>
                  {note.reasonCodes && note.reasonCodes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.reasonCodes.map((code, index) => (
                        <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Updated Reason Code Modal */}
      <Dialog open={isReasonModalOpen} onOpenChange={setIsReasonModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {selectedRule?.rule} - Accept actions
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReasonModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Apply reason code</label>
              <Select value={selectedReasonCode} onValueChange={setSelectedReasonCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select an option" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableReasonCodes().map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Applied reason codes as removable lozenges in the modal */}
            {selectedRule && selectedRule.reasonCodes && selectedRule.reasonCodes.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">Applied reason codes</label>
                <div className="flex flex-wrap gap-2">
                  {selectedRule.reasonCodes.map((code, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                      <X 
                        className="w-3 h-3 mr-2 cursor-pointer hover:text-red-600" 
                        onClick={() => removeReasonCode(code)}
                      />
                      <span>{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsReasonModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyReasonCode}
                disabled={!selectedReasonCode}
                className="flex-1 bg-[#165788] hover:bg-[#134567] text-white"
              >
                Apply Reason code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={isAddNoteModalOpen} onOpenChange={setIsAddNoteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Add Case Note
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddNoteModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your case note here..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="flex-1 bg-[#165788] hover:bg-[#134567] text-white"
              >
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
