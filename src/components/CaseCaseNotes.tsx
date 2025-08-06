
import React from 'react';
import { useCaseNotes } from '../contexts/CaseNotesContext';

export const CaseCaseNotes: React.FC = () => {
  const { caseNotes } = useCaseNotes();

  return (
    <div className="w-full text-sm font-normal mt-2">
      <h3 className="text-[#165788] self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 text-lg font-medium pt-2 pb-1">
        Case notes
      </h3>
      {caseNotes.map((note, index) => (
        <div key={index} className="w-full">
          <div className="text-[#505A5F] self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 italic pr-4 pt-2 pb-1">
            {note.author} {note.date}
          </div>
          <div className="text-black self-stretch flex-1 shrink basis-[0%] w-full gap-2.5 pr-4 py-2">
            {note.content}
          </div>
          {note.reasonCodes && note.reasonCodes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pr-4">
              {note.reasonCodes.map((code, codeIndex) => (
                <div key={codeIndex} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
                  <span>{code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
