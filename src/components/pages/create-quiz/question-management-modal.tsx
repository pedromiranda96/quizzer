import { Dialog } from "@headlessui/react";
import { X } from "phosphor-react";
import { useState } from "react";

import { QuestionForm } from "./question-form";
import { QuestionList } from "./question-list";

type QuestionManagementModalProps = {
  open: boolean;
  onClose: () => void;
};

export function QuestionManagementModal({
  open,
  onClose,
}: QuestionManagementModalProps) {
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="flex flex-col mx-auto w-[960px] h-[672px] rounded bg-white">
          {/* Dialog header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <Dialog.Title className="text-slate-800 font-bold text-xl">
              Manage questions
            </Dialog.Title>
            <button type="button" onClick={onClose}>
              <X className="w-5 h-5 text-slate-600" weight="bold" />
            </button>
          </div>

          {creatingQuestion ? (
            <QuestionForm
              onQuestionSaved={() => setCreatingQuestion(false)}
              onCancel={() => setCreatingQuestion(false)}
            />
          ) : (
            <QuestionList
              onClickNewQuestion={() => setCreatingQuestion(true)}
            />
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
