type EmptyStateProps = {
  text?: string;
};

export function EmptyState({ text = "Начните новый диалог" }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        G
      </div>
      <p>{text}</p>
    </div>
  );
}
