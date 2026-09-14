type FormProps = {
  children?: React.ReactNode;
  disabled?: boolean;
} & React.FormHTMLAttributes<HTMLFormElement>;
function Form({ children, disabled = false, ...props }: FormProps) {
  return (
    <form className="w-full h-full" {...props}>
      <fieldset
        disabled={disabled}
        className="flex flex-col justify-evenly gap-2 h-full w-full items-center"
      >
        {children}
      </fieldset>
    </form>
  );
}

export default Form;
