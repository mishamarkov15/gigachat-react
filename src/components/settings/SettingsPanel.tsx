import { FormEvent, useEffect, useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { defaultSettings } from "../../types/settings";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { Toggle } from "../ui/Toggle";

type SettingsPanelProps = {
  isOpen: boolean;
  isDarkTheme: boolean;
  onClose: () => void;
  onThemeChange: (isDark: boolean) => void;
};

export function SettingsPanel({
  isOpen,
  isDarkTheme,
  onClose,
  onThemeChange
}: SettingsPanelProps) {
  const { settings, updateSettings } = useChatStore();
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSettings(draft);
    onClose();
  };

  return (
    <div className="settings-layer">
      <button
        aria-label="Закрыть настройки"
        className="settings-layer__backdrop"
        onClick={onClose}
      />
      <form className="settings-panel" onSubmit={handleSubmit}>
        <header className="settings-panel__header">
          <h2>Настройки</h2>
          <Button aria-label="Закрыть" onClick={onClose} variant="ghost">
            x
          </Button>
        </header>

        <label className="field">
          <span className="field__label">Модель</span>
          <select
            onChange={(event) =>
              setDraft({ ...draft, model: event.target.value })
            }
            value={draft.model}
          >
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </label>

        <Slider
          label="Temperature"
          max={2}
          min={0}
          onChange={(event) =>
            setDraft({ ...draft, temperature: Number(event.target.value) })
          }
          step={0.1}
          value={draft.temperature}
        />
        <Slider
          label="Top-P"
          max={1}
          min={0}
          onChange={(event) =>
            setDraft({ ...draft, topP: Number(event.target.value) })
          }
          step={0.05}
          value={draft.topP}
        />

        <label className="field">
          <span className="field__label">Max Tokens</span>
          <input
            min={1}
            onChange={(event) =>
              setDraft({ ...draft, maxTokens: Number(event.target.value) })
            }
            type="number"
            value={draft.maxTokens}
          />
        </label>

        <label className="field">
          <span className="field__label">Repetition Penalty</span>
          <input
            max={2}
            min={0}
            onChange={(event) =>
              setDraft({
                ...draft,
                repetitionPenalty: Number(event.target.value)
              })
            }
            step={0.1}
            type="number"
            value={draft.repetitionPenalty}
          />
        </label>

        <label className="field">
          <span className="field__label">System Prompt</span>
          <textarea
            onChange={(event) =>
              setDraft({ ...draft, systemPrompt: event.target.value })
            }
            rows={5}
            value={draft.systemPrompt}
          />
        </label>

        <Toggle
          checked={draft.stream}
          label="Streaming"
          onChange={(stream) => setDraft({ ...draft, stream })}
        />

        <Toggle
          checked={isDarkTheme}
          label="Тёмная тема"
          onChange={onThemeChange}
        />

        <footer className="settings-panel__footer">
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
          <Button
            onClick={() => setDraft(defaultSettings)}
            type="button"
            variant="secondary"
          >
            Сбросить
          </Button>
        </footer>
      </form>
    </div>
  );
}
