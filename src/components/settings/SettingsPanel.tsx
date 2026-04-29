import { useState } from "react";
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
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-layer">
      <button
        aria-label="Закрыть настройки"
        className="settings-layer__backdrop"
        onClick={onClose}
      />
      <aside className="settings-panel">
        <header className="settings-panel__header">
          <h2>Настройки</h2>
          <Button aria-label="Закрыть" onClick={onClose} variant="ghost">
            x
          </Button>
        </header>

        <label className="field">
          <span className="field__label">Модель</span>
          <select defaultValue="GigaChat-Pro">
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
          onChange={(event) => setTemperature(Number(event.target.value))}
          step={0.1}
          value={temperature}
        />
        <Slider
          label="Top-P"
          max={1}
          min={0}
          onChange={(event) => setTopP(Number(event.target.value))}
          step={0.05}
          value={topP}
        />

        <label className="field">
          <span className="field__label">Max Tokens</span>
          <input defaultValue={2048} min={1} type="number" />
        </label>

        <label className="field">
          <span className="field__label">System Prompt</span>
          <textarea
            defaultValue="Ты полезный ассистент для учебного проекта."
            rows={5}
          />
        </label>

        <Toggle
          checked={isDarkTheme}
          label="Тёмная тема"
          onChange={onThemeChange}
        />

        <footer className="settings-panel__footer">
          <Button onClick={onClose} variant="primary">
            Сохранить
          </Button>
          <Button variant="secondary">Сбросить</Button>
        </footer>
      </aside>
    </div>
  );
}
