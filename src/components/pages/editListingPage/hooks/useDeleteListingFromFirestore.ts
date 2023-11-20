import { useDispatch } from "react-redux";
import { Params, useNavigate } from "react-router";
import { setLoading } from "../editListingPageSlice";
import { Images } from "../../../../types";
import deleteImageFromFirestore from "../../utils/deleteImageFromFirestore";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase.config";
import { toast } from "react-toastify";

export default function useDeleteListingFromFirestore(
  images: Images,
  params: Readonly<Params<string>>
) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function deleteListingFromFirestore() {
    if (window.confirm("Are you sure that you want to delete this listing?")) {
      dispatch(setLoading(true));

      // Delete images from the listing from storage
      await Promise.all(
        images.value.map((image) => deleteImageFromFirestore(image))
      ).catch((error) => {
        dispatch(setLoading(false));
        console.error(
          "An error occurred while attempting to delete the listing's images from the database,",
          error
        );
        return;
      });

      // Delete the listing from firestore
      if (params.listingId) {
        await deleteDoc(doc(db, "listings", params.listingId));
      } else {
        throw new Error("Whoops, no listing ID found in params");
      }

      navigate("/profile");
      toast.success("Listing Successfully Deleted");
    }
  }

  return { deleteListingFromFirestore };
}
