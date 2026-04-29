type ErrorMessageProps = {
  text: string;
};

export function ErrorMessage({ text }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span aria-hidden="true">!</span>
      {text}
    </div>
  );
}
