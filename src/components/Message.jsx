// One small component for success / error / info messages.
export default function Message({ type = "info", title, children }) {
  if (!children && !title) return null;
  return (
    <div className={"message message-" + type} role={type === "error" ? "alert" : "status"}>
      {title && <strong>{title}</strong>}
      {children && <div>{children}</div>}
    </div>
  );
}
