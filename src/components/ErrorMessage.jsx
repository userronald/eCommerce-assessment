import Button from "./Button.jsx";

function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div
      aria-live="assertive"
      className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-900"
      role="alert"
    >
      <p className="font-semibold">Unable to load this content</p>
      <p className="mt-1 text-sm text-rose-800" id="error-message">
        {message}
      </p>
      {onRetry && (
        <Button
          className="mt-4"
          onClick={onRetry}
          size="sm"
          variant="secondary"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
