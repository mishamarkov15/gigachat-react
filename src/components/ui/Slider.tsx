import type { CSSProperties, InputHTMLAttributes } from "react";

type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> & {
  label: string;
  value: number;
};

export function Slider({ label, value, ...props }: SliderProps) {
  const min = Number(props.min ?? 0);
  const max = Number(props.max ?? 100);
  const progress = ((value - min) / (max - min)) * 100;
  const sliderStyle = {
    "--slider-progress": `${Math.max(0, Math.min(100, progress))}%`
  } as CSSProperties;

  return (
    <label className="field field--slider">
      <span className="field__label">
        {label}
        <strong>{Number.isInteger(value) ? value : value.toFixed(2)}</strong>
      </span>
      <input
        className="slider"
        style={sliderStyle}
        type="range"
        value={value}
        {...props}
      />
    </label>
  );
}
