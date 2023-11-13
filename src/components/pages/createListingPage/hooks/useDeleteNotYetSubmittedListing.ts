import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { reset } from "../createListingPageSlice";

export default function useDeleteNotYetSubmittedListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function deleteNotYetSubmittedListing() {
    if (window.confirm("Delete your progress, are you sure?")) {
      dispatch(reset);
      navigate("/profile");
    }
  }

  return { deleteNotYetSubmittedListing };
}
