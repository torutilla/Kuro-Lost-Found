import Divider from "@shared/components/common/Divider.tsx";

function OrDivider() {
  return (
    <div className="flex w-full items-center gap-3">
      <Divider />
      <p className="text-xs font-medium tracking-widest text-neutral-400">
        OR
      </p>
      <Divider />
    </div>
  );
}

export default OrDivider;
