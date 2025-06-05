import { useConfirmation } from "@/providers/confirmation-dialog-provider";

export const useConfirm = () => {
  const { fire } = useConfirmation();
  
  return {
    fire,
  };
};