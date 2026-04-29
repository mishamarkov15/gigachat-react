type ToggleProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
    </label>
  );
}
