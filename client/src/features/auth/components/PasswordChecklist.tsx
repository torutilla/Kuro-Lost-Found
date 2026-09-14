import { passwordRules } from "../utils/validation.ts";
import PasswordChecklistItem from "./PasswordChecklistItem.tsx";

function PasswordChecklist({ text }: { text: string }) {
  return (
    <div className="grid grid-cols-2 w-full">
      {passwordRules.map((rule) => {
        const invalid = rule.isInvalid(text);
        return (
          <PasswordChecklistItem
            key={rule.id}
            type={invalid ? "error" : "success"}
            description={rule.message}
          />
        );
      })}
    </div>
  );
}

export default PasswordChecklist;
