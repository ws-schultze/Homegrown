import { Image, ListingData, Uploads } from "../../../../../types/index";
import { db } from "../../../../../firebase.config";
import { ReactComponent as BellSVG } from "../../assets/bell-regular.svg";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../redux/hooks";
import { setCurrentPageNumber, setLoading } from "../../createListingPageSlice";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import makeFileNameForUpload from "../../../utils/makeFileNameForUpload";
import { toast } from "react-toastify";
import useDeleteNotYetSubmittedListing from "../../hooks/useDeleteNotYetSubmittedListing";
import useDeleteListingFromFirestore from "../../hooks/useDeleteListingFromFirestore";
import styles from "../../styles.module.scss";
import { FormProps } from "../../types/formProps";
import { useEffect } from "react";

interface Props extends FormProps {
  /**
   * <uploads> are stored in CreateListingPage state because they contain files
   * which are non serializable.
   */
  uploads: Uploads;
}

export default function ReviewForm(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageState = useAppSelector((s) => s.createListingPage);
  const params = useParams();

  const { deleteNotYetSubmittedListing } = useDeleteNotYetSubmittedListing();
  const { deleteListingFromFirestore } = useDeleteListingFromFirestore(
    pageState.listing.uploads.images,
    params
  );

  function goToPage(num: number) {
    navigate(`/create-listing/${num}`);
  }

  // function deleteNotYetSubmittedListing() {
  //   if (window.confirm("Delete your progress, are you sure?")) {
  //     // localStorage.removeItem("unfinished-listing");
  //     // setState(initListingData);
  //     dispatch(reset);
  //     navigate("/profile");
  //   }
  // }

  // async function deleteListingFromDB() {
  //   if (window.confirm("Are you sure that you want to delete this listing?")) {
  //     dispatch(setLoading(true));

  //     // Delete images from the listing from storage
  //     await Promise.all(
  //       pageState.listing.uploads.images.value.map((image) =>
  //         deleteImageFromFirestore(image)
  //       )
  //     ).catch((error) => {
  //       dispatch(setLoading(false));
  //       console.error(
  //         "An error occurred while attempting to delete the listing's images from the database,",
  //         error
  //       );
  //       return;
  //     });

  //     // Delete the listing from firestore
  //     if (params.listingId) {
  //       await deleteDoc(doc(db, "listings", params.listingId));
  //     } else {
  //       throw new Error("Whoops, no listing ID found in params");
  //     }

  //     navigate("/profile");
  //     toast.success("Listing Successfully Deleted");
  //   }
  // }

  /**
   * Handle the forms submission
   * @param e FormEvent - submit state
   */
  async function handleSubmit() {
    dispatch(setLoading(true));

    /**
     * Store an image in firestore
     * @param file File
     * @returns {file: undefined, url: string} of Image
     */
    async function storeImage(file: File): Promise<Image> {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = makeFileNameForUpload(
          pageState.listing.userRef.uid,
          file.name
        );
        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        if (!pageState.listing.userRef.uid) {
          throw new Error("Bad userRef.uid");
        } else if (!file.name) {
          throw new Error("Bad file.name");
        } else if (!fileName) {
          throw new Error("Bad fileName.");
        } else if (!storageRef) {
          throw new Error("Bad storageRef.");
        } else if (!uploadTask) {
          throw new Error("Bad uploadTask.");
        }

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve({ name: fileName, url: downloadURL });
            });
          }
        );
      });
    }

    const _images = await Promise.all(
      pageState.listing.uploads.images.value.map((image) =>
        storeImage(image.file!)
      )
    ).catch(() => {
      setLoading(false);
      toast.warn("All images must be 2MB or less.");
      console.warn("All images must be 2MB or less, image upload failed.");
      return;
    });

    let formDataCopy: ListingData = { ...pageState.listing };

    if (_images && _images.length > 0) {
      formDataCopy = {
        ...pageState.listing,
        uploads: {
          ...pageState.listing.uploads,
          images: {
            ...pageState.listing.uploads.images,
            value: _images,
          },
        },
        timestamp: serverTimestamp(),
      };

      /**
       * Upload formDataCopy to Firestore
       */
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);

      /**
       * Listing form data submitted successfully
       */

      dispatch(setLoading(false));
      toast.success("Listing Created");
      localStorage.removeItem("unfinished-listing");
      navigate(
        `/explore-listings/details/${formDataCopy.address.formattedAddress.value}/${docRef.id}`
      );
    } else {
      toast.warn("Uploading at least one image is required!");
      setLoading(false);
      throw new Error("Uploading at least one image is required!");
    }
  }

  useEffect(() => {}, []);

  return (
    <form>
      <section>
        <div className={styles.notice}>
          <BellSVG />
          Review any parts of this listing before submission, if you want to.
        </div>

        {/* Page 1 -- User Acknowledgment */}
        <div className={styles.review_row}>
          1. Notice
          <button className="btn" type="button" onClick={() => goToPage(1)}>
            Review
          </button>
        </div>

        {/* Page 2 -- Basic Info */}
        <div className={styles.review_row}>
          2. Basics
          <button className="btn" type="button" onClick={() => goToPage(2)}>
            Review
          </button>
        </div>

        {/* Page 3 -- Listing Address */}
        <div className={styles.review_row}>
          3. Address
          <button className={"btn"} type="button" onClick={() => goToPage(3)}>
            Review
          </button>
        </div>

        {/* Page 4 -- Lister */}
        <div className={styles.review_row}>
          4. Listed by
          <button className="btn" type="button" onClick={() => goToPage(4)}>
            Review
          </button>
        </div>

        {/* Page 5 -- Listing Kind */}
        <div className={styles.review_row}>
          5. Features
          <button className="btn" type="button" onClick={() => goToPage(5)}>
            Review
          </button>
        </div>

        {/* Page 6 -- Images */}
        <div className={styles.review_row}>
          6. Images
          <button className="btn" type="button" onClick={() => goToPage(6)}>
            Review
          </button>
        </div>
      </section>

      <>
        {pageState.editListing === true ? (
          <div className={styles.review_bottom_btns}>
            <button type="button" className={styles.btn} onClick={handleSubmit}>
              Submit Update
            </button>
            <button className={styles.btn} onClick={() => navigate("/profile")}>
              Cancel Update
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={deleteListingFromFirestore}
            >
              Delete Listing
            </button>
          </div>
        ) : (
          <div className={styles.two_btn_row}>
            <button type="button" className={styles.btn} onClick={handleSubmit}>
              Submit Listing
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={deleteNotYetSubmittedListing}
            >
              Delete Listing
            </button>
          </div>
        )}
      </>
    </form>
  );
}
