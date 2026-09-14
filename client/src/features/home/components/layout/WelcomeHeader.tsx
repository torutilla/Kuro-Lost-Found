import Button from "@shared/components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

function WelcomeHeader({ name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <div className="text-3xl font-bold flex flex-col items-center text-center">
      <p className="text-secondary">{`Welcome back, ${name}!`}</p>
      <div className="font-normal text-lg">
        <p>Lost a pet? Found a pet?</p>
        <p>Help reunite pets with owners.</p>
        <div className="w-fit"></div>
        <div className="my-2">
          <Button onClick={() => navigate("/post")}>Report a Pet</Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeHeader;
