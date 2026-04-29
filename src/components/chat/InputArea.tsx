import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";

type InputAreaProps = {
  onSubmit: (value: string) => void;
};

export function InputArea({ onSubmit }: InputAreaProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = value.trim().length > 0;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

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
      <Button aria-label="Прикрепить изображение" type="button" variant="ghost">
        img
      </Button>
      <textarea
        aria-label="Сообщение"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение"
        ref={textareaRef}
        rows={1}
        value={value}
      />
      <Button type="button" variant="secondary">
        Стоп
      </Button>
      <Button disabled={!canSubmit} type="submit" variant="primary">
        Отправить
      </Button>
    </form>
  );
}
