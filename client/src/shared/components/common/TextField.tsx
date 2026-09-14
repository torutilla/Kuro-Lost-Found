import clsx from "clsx";
type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  label?: string | null;
};
function TextField({ error, label, children, ...props }: TextFieldProps) {
  return (
    <div className="grid items-start w-full">
      {label && (
        <label htmlFor={props.id} className="text-accent">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          className={clsx(
            `relative w-full rounded-lg p-2 no-default-appearance
            border selection:bg-secondary selection:text-white
            focus:outline focus:ring-1`,
            {
              "bg-error/20 placeholder:text-error/20 focus:ring-error text-error border-error/20":
                !!error,
              "focus:ring-primary bg-neutral-200 placeholder:text-neutral-400 border-neutral-300":
                !error,
            },
          )}
        ></input>
        {children}
      </div>
      <p
        className={clsx("text-xs transition-all duration-300 ease-in-out", {
          "text-error translate-y-0 opacity-100": !!error,
          "text-transparent -translate-y-1 opacity-0": !error,
        })}
      >
        {error || "\u00A0"}
      </p>
    </div>
  );
}

export default TextField;
