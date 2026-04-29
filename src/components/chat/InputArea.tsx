import { KeyboardEvent, useState } from "react";
import { Button } from "../ui/Button";

type InputAreaProps = {
  isLoading: boolean;
  onStop: () => void;
  onSubmit: (value: string) => void;
};

export function InputArea({ isLoading, onStop, onSubmit }: InputAreaProps) {
  const [value, setValue] = useState("");
  const canSubmit = value.trim().length > 0 && !isLoading;

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit(value.trim());
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="input-area"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Button
        aria-label="Прикрепить изображение"
        className="input-area__attach"
        type="button"
        variant="ghost"
      >
        <span aria-hidden="true">📎</span>
      </Button>
      <textarea
        aria-label="Сообщение"
        disabled={isLoading}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "GigaChat отвечает..." : "Введите сообщение"}
        rows={2}
        value={value}
      />
      {isLoading ? (
        <Button
          className="input-area__action"
          onClick={onStop}
          type="button"
          variant="secondary"
        >
          Стоп
        </Button>
      ) : (
        <Button
          className="input-area__action"
          disabled={!canSubmit}
          type="submit"
          variant="primary"
        >
          Отправить
        </Button>
      )}
    </form>
  );
}
