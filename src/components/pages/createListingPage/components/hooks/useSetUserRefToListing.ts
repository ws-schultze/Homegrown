import { SetStateAction, useEffect } from "react";
import { useUserContext } from "../../../../../UserProvider";
import { useNavigate } from "react-router";

/**
 * Set the userId to the listing. If the user is not signed in,
 * redirect them to the sign in page.
 * @param setLoading (value: SetStateAction<boolean>) => void,
 * @param handleUserId (userId: string) => void
 */
export default function useSetUserRefToListing(
  setLoading: (value: SetStateAction<boolean>) => void,
  handleUserId: (userId: string) => void
) {
  const { userId, isAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();

  // Add userId to state
  useEffect(() => {
    setLoading(true);
    if (isAuthenticated && userId && !isLoading) {
      //   setState((s) => ({
      //     ...s,
      //     userRef: {
      //       ...s.userRef,
      //       uid: userId,
      //     },
      //   }));
      handleUserId(userId);
      setLoading(false);
    } else if (!isAuthenticated && !isLoading) {
      navigate("/sign-in");
      setLoading(false);
    }
  }, [isAuthenticated, userId, handleUserId, isLoading, navigate, setLoading]);
}
