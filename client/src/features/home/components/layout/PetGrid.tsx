import { cn } from "@shared/index.ts";
import { PetSchema, type Pet } from "../../schema/petSchema.ts";
import PetCard from "../common/PetCard.tsx";

type PetGridProps = {
  pets: Pet[];
};

function PetGrid({ pets }: PetGridProps) {
  return (
    <div className={cn("grid content-start gap-4 grid-cols-1 mobilelg:grid-cols-2")}>
      {pets.map((pet, index) => {
        const validatedPet = PetSchema.parse(pet);
        return <PetCard key={validatedPet.id + index} pet={validatedPet} />;
      })}
    </div>
  );
}

export default PetGrid;

