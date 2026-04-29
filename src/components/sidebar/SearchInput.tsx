type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="search-input">
      <span className="visually-hidden">Поиск по чатам</span>
      <input
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по чатам"
        type="search"
        value={value}
      />
    </label>
  );
}
