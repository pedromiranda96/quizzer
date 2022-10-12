import { Trash } from "phosphor-react";
import { KeyboardEvent, useState } from "react";

import { Question } from "app/context/question-management-context";

type QuestionFormProps = {
  onQuestionSaved: (question: Question, index?: number) => void;
  onCancel: () => void;
};

const MIN_QUESTION_ANSWERS = 2;
const NO_ANSWER_SELECTED = -1;

export function QuestionForm({ onQuestionSaved, onCancel }: QuestionFormProps) {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] =
    useState(NO_ANSWER_SELECTED);

  function deleteAnswer(index: number) {
    setAnswers((answers) => answers.filter((_, i) => i !== index));

    if (correctAnswerIndex == index) {
      setCorrectAnswerIndex(NO_ANSWER_SELECTED);
    } else if (correctAnswerIndex > index) {
      setCorrectAnswerIndex((correctAnswerIndex) => correctAnswerIndex - 1);
    }
  }

  function onAnswerInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (answer.length > 0) {
        if (
          !answers.some((ans) => ans.toLowerCase() === answer.toLowerCase())
        ) {
          setAnswers((answers) => [...answers, answer]);
        }

        setAnswer("");
      }
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex flex-col px-4 pt-4 pb-8">
          <h1 className="text slate-700 text-lg font-bold">
            Create a new question
          </h1>
          <p className="text-slate-600 font-medium leading-3">
            Create as many as you want, with as many answers as you want
          </p>
        </div>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1">
            <span className="text-slate-800 font-semibold">Your question</span>
            <textarea
              rows={1}
              className="text-sm border border-slate-300 rounded resize-y"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-slate-800 font-semibold">
              Write a possible answer
            </span>
            <span className="text-slate-500 text-sm font-semibold">
              {
                "Press ENTER once you're done to add the answer to the list of options"
              }
            </span>
            <textarea
              rows={1}
              className="mt-1 text-sm border border-slate-300 rounded resize-y"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onAnswerInputKeyDown}
            />
          </div>
        </div>

        {answers.length === 0 ? (
          <div className="flex px-4 mt-8">
            <span className="bg-slate-100 text-slate-600 font-medium text-center py-4 flex-1">
              {"Create answers for your question"}
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col mt-8 px-4">
              <span className="text-slate-500 text-sm font-semibold">
                Click one of the answers to mark it as the correct one.
              </span>
              <span className="text-slate-500 text-sm font-semibold">
                {
                  "Don't worry about the order of the answers. They will be shuffled differently for each person that takes your quiz"
                }
              </span>
            </div>

            {/* answers */}
            <div className="flex flex-col gap-1 p-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between gap-2 transition-colors ${
                    correctAnswerIndex !== index
                      ? "bg-slate-200 text-slate-800"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <button
                    type="button"
                    className="flex-1 text-left min-w-0 break-words p-2 font-medium"
                    onClick={() => setCorrectAnswerIndex(index)}
                  >
                    {answer}
                  </button>
                  <button
                    type="button"
                    className={`mt-2 mr-2 transition-colors ${
                      correctAnswerIndex === index
                        ? "hover:text-green-900"
                        : "hover:text-red-800"
                    }`}
                    onClick={() => deleteAnswer(index)}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex p-4 justify-end gap-2 border-t">
        <button
          type="button"
          className="px-4 py-2 bg-red-700 text-white text-sm font-bold rounded hover:bg-red-900 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-800 disabled:bg-slate-400 transition-colors"
          disabled={
            text.trimStart().length === 0 ||
            answers.length < MIN_QUESTION_ANSWERS ||
            correctAnswerIndex == NO_ANSWER_SELECTED
          }
          onClick={() => onQuestionSaved({ text, answers, correctAnswerIndex })}
        >
          Create question
        </button>
      </div>
    </>
  );
}
