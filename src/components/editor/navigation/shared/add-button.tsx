import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AddButtonProperties = {
  add: () => void;
  isAdding: boolean;
  text?: string;
};

export const AddButton: React.FC<AddButtonProperties> = ({
  add,
  isAdding,
  text = "add",
}) => {
  return (
    <button
      disabled={isAdding}
      onClick={add}
      className="m-1 flex cursor-pointer items-center rounded-lg px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    >
      <FontAwesomeIcon icon={faPlus} />
      <span className="ml-3 text-sm font-medium">
        {isAdding ? "..." : text}
      </span>
    </button>
  );
};
