import { useEffect } from "react";
import { useUserContext } from "../../../../../UserProvider";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

/**
 * Set the userId to the listing. If the user is not signed in,
 * redirect them to the sign in page.
 * @param setLoading (value: SetStateAction<boolean>) => void,
 * @param handleUserId (userId: string) => void
 */
export default function useSetUserRefToListing(
  handleLoading: (loading: boolean) => void,
  handleUserId: (userId: string) => void
) {
  const { userId, isAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();

  useEffect(
    () => {
      handleLoading(true);
      if (isAuthenticated && userId && !isLoading) {
        handleUserId(userId);
        handleLoading(false);
      } else if (!isAuthenticated && !isLoading) {
        navigate("/sign-in");
        handleLoading(false);
        toast.warn("You must be signed in to create a listing.");
      }
    },
    /**
     * Adding more deps will cause an infinite loop
     */
    //@ts-ignore
    [isAuthenticated, userId]
  );
}
