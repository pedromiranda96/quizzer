import { createContext, ReactNode, useContext, useState } from "react";

export type Question = {
  text: string;
  answers: string[];
  correctAnswerIndex: number;
};

type QuestionManagementContextData = {
  questions: Question[];
  addQuestion(data: Question): void;
  updateQuestion(index: number, data: Question): void;
  deleteQuestion(index: number): void;
  moveQuestionUp(index: number): void;
  moveQuestionDown(index: number): void;
};

type QuestionManagementContextProviderProps = {
  children: ReactNode;
};

const QuestionManagementContext = createContext(
  {} as QuestionManagementContextData
);

export function QuestionManagementProvider({
  children,
}: QuestionManagementContextProviderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);

  function addQuestion(data: Question) {
    setQuestions((qs) => [...qs, data]);
  }

  function updateQuestion(index: number, data: Question) {
    setQuestions((qs) => {
      const copy = Array.from(qs);
      copy[index] = data;

      return copy;
    });
  }

  function deleteQuestion(index: number) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  function moveQuestionUp(index: number) {
    setQuestions((qs) => {
      const copy = Array.from(qs);
      [copy[index], copy[index - 1]] = [copy[index - 1], copy[index]];

      return copy;
    });
  }

  function moveQuestionDown(index: number) {
    setQuestions((qs) => {
      const copy = Array.from(qs);
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];

      return copy;
    });
  }

  return (
    <QuestionManagementContext.Provider
      value={{
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        moveQuestionUp,
        moveQuestionDown,
      }}
    >
      {children}
    </QuestionManagementContext.Provider>
  );
}

export function useQuestionManagement() {
  return useContext(QuestionManagementContext);
}
