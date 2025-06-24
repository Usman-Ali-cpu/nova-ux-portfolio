
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatPace } from '@/utils/helpers';
import { RunRegistration } from '@/types';
import WhatsAppGroupInvite from './WhatsAppGroupInvite';

interface ParticipantsListProps {
  participants: RunRegistration[];
  runTitle: string;
  onExportCSV?: () => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, runTitle, onExportCSV }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Participants ({participants.length})</h3>
        <div className="flex gap-2">
          <WhatsAppGroupInvite 
            participants={participants}
            runTitle={runTitle}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            className="text-sm"
          >
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pace</TableHead>
              <TableHead>Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.length > 0 ? (
              participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.userName}</TableCell>
                  <TableCell>{participant.userEmail}</TableCell>
                  <TableCell>{formatPace(participant.userPace)}</TableCell>
                  <TableCell>
                    {new Date(participant.registeredAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No participants yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ParticipantsList;
