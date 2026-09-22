import Button from "./Button.jsx";
import Modal from "./Modal.jsx";

function ConfirmDialog({
  cancelLabel = "Cancel",
  children,
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
  open,
  title,
}) {
  return (
    <Modal onClose={onCancel} open={open} title={title}>
      <p className="text-sm leading-6 text-slate-600">{children}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onCancel} variant="secondary">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} variant="danger">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
