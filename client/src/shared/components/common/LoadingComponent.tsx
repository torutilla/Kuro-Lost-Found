import { Circle } from "@mui/icons-material";
function LoadingComponent() {
  return (
    <div className="flex items-end gap-0.5 loading" aria-label="Loading">
      <Circle sx={{ fontSize: 6 }} />
      <Circle sx={{ fontSize: 6 }} />
      <Circle sx={{ fontSize: 6 }} />
    </div>
  );
}

export default LoadingComponent;
