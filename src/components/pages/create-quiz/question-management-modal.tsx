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
  const [shouldDisplayQuestionForm, setShouldDisplayQuestionForm] =
    useState(false);

  const [updatingQuestionWithIndex, setUpdatingQuestionWithIndex] =
    useState<number>();

  function exitQuestionForm() {
    setShouldDisplayQuestionForm(false);
    setUpdatingQuestionWithIndex(undefined);
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="flex flex-col mx-auto w-[960px] h-[672px] rounded bg-white">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <Dialog.Title className="text-slate-800 font-bold text-xl">
              Manage questions
            </Dialog.Title>
            <button type="button" onClick={onClose}>
              <X className="w-5 h-5 text-slate-600" weight="bold" />
            </button>
          </div>

          {shouldDisplayQuestionForm ? (
            <QuestionForm
              onQuestionSaved={exitQuestionForm}
              onCancel={exitQuestionForm}
              updatingQuestionWithIndex={updatingQuestionWithIndex}
            />
          ) : (
            <QuestionList
              onClickNewQuestion={() => setShouldDisplayQuestionForm(true)}
              onClickEditQuestion={(index) => {
                setUpdatingQuestionWithIndex(index);
                setShouldDisplayQuestionForm(true);
              }}
            />
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
