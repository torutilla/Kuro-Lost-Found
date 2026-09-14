import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";

type LabeledIconProps = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  label: string;
};
function LabeledIcon({ icon: Icon, label }: LabeledIconProps) {
  return (
    <div className="flex gap-1 items-center">
      <Icon fontSize="inherit" />
      <p>{label}</p>
    </div>
  );
}

export default LabeledIcon;
