type DropdownItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
};

export function DropdownItem({ children, onClick, danger }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition ${
        danger ? "text-red-400" : "text-white/80"
      }`}
    >
      {children}
    </button>
  );
}
