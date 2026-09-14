import useUser from "@shared/hooks/useUser.tsx";
import PostPetForm from "../components/layout/PostPetForm.tsx";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/hooks/useToast.tsx";

function PostPetPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const onSuccess = () => {
    navigate("/");
    showToast("Pet successfully posted.", "success");
  };
  return <PostPetForm authUserId={user.id} onSuccess={onSuccess} />;
}

export default PostPetPage;
