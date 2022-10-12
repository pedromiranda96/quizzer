import {
  ArrowCircleDown,
  ArrowCircleUp,
  CheckCircle,
  Pencil,
  Trash,
  XCircle,
} from "phosphor-react";

import { useQuestionManagement } from "app/context/question-management-context";

type QuestionListProps = {
  onClickNewQuestion: () => void;
};

// TODO: Implement update question
export function QuestionList({ onClickNewQuestion }: QuestionListProps) {
  const { questions, moveQuestionUp, moveQuestionDown, deleteQuestion } =
    useQuestionManagement();

  function promptDeleteQuestion(index: number) {
    if (confirm("This action cannot be undone.")) {
      deleteQuestion(index);
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {questions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col">
            <h1 className="text slate-700 text-lg font-bold">
              {"You haven't created any questions yet"}
            </h1>
            <p className="text-slate-500 font-medium">
              Click{" "}
              <span className="text-indigo-800 font-bold">New question</span> to
              start creating one
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col p-4">
              <h1 className="text slate-700 text-lg font-bold">
                Created questions
              </h1>
              <p className="text-slate-600 font-medium leading-4">
                {"Here are the questions you've come up with so far:"}
              </p>
            </div>

            <ol className="flex flex-col gap-2 px-4 pb-4">
              {questions.map((question, questionIndex) => (
                <li
                  key={questionIndex}
                  className="flex gap-2 items-start bg-slate-100 p-4 rounded"
                >
                  <span className="font-semibold text-slate-800 min-w-0 break-words shrink-0">
                    {questionIndex + 1}.
                  </span>
                  <div className="flex-1 flex flex-col min-w-0 break-words">
                    <span className="font-semibold text-slate-800">
                      {question.text}
                    </span>
                    <ol className="flex flex-col mt-4 gap-4 break-words flex-wrap">
                      {question.answers.map((answerText, answerIndex) => (
                        <li
                          key={answerIndex}
                          className="flex items-start gap-2 w-full"
                        >
                          {answerIndex === question.correctAnswerIndex ? (
                            <CheckCircle className="w-4 h-4 bg-green-500 rounded-full text-white shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 bg-slate-400 rounded-full text-white shrink-0" />
                          )}

                          <span className="text-sm font-medium text-slate-700 min-w-0 break-words leading-none">
                            {answerText}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div className="flex items-center justify-end gap-2 mt-4 border-slate-300 pt-2">
                      <button type="button" title="Edit question">
                        <Pencil
                          className="w-5 h-5 text-slate-500 hover:text-indigo-600 transition-colors"
                          weight="bold"
                        />
                      </button>
                      <button
                        type="button"
                        title="Move question up"
                        className="group"
                        disabled={questionIndex === 0}
                        onClick={() => moveQuestionUp(questionIndex)}
                      >
                        <ArrowCircleUp
                          className="w-5 h-5 text-slate-500 hover:text-indigo-600 group-disabled:text-slate-300 transition-colors"
                          weight="bold"
                        />
                      </button>
                      <button
                        type="button"
                        title="Move question down"
                        className="group"
                        disabled={questionIndex === questions.length - 1}
                        onClick={() => moveQuestionDown(questionIndex)}
                      >
                        <ArrowCircleDown
                          className="w-5 h-5 text-slate-500 hover:text-indigo-600 group-disabled:text-slate-300 transition-colors"
                          weight="bold"
                        />
                      </button>
                      <button
                        type="button"
                        title="Delete question"
                        onClick={() => promptDeleteQuestion(questionIndex)}
                      >
                        <Trash
                          className="w-5 h-5 text-slate-500 hover:text-indigo-600 transition-colors"
                          weight="bold"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <div className="flex p-4 justify-end gap-2 border-t">
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-800 transition-colors"
          onClick={onClickNewQuestion}
        >
          New question
        </button>
      </div>
    </>
  );
}
