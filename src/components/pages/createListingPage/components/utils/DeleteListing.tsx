import React from "react";
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router';
// import { useAppSelector } from '../../../../../redux/hooks';

// export default function DeleteListing() {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const pageState = useAppSelector(s=>s.createListingPage)

//     function deleteNotYetSubmittedListing() {
//         if (window.confirm("Delete your progress, are you sure?")) {
//           // localStorage.removeItem("unfinished-listing");
//           // setState(initListingData);
//           dispatch(reset);
//           navigate("/profile");
//         }
//       }

//       async function deleteListingFromDB() {
//         if (window.confirm("Are you sure that you want to delete this listing?")) {
//           dispatch(setLoading(true));

//           // Delete images from the listing from storage
//           await Promise.all(
//             pageState.listing.uploads.images.value.map((image) =>
//               deleteImageFromFirestore(image)
//             )
//           ).catch((error) => {
//             dispatch(setLoading(false));
//             console.error(
//               "An error occurred while attempting to delete the listing's images from the database,",
//               error
//             );
//             return;
//           });

//           // Delete the listing from firestore
//           if (params.listingId) {
//             await deleteDoc(doc(db, "listings", params.listingId));
//           } else {
//             throw new Error("Whoops, no listing ID found in params");
//           }

//           navigate("/profile");
//           toast.success("Listing Successfully Deleted");
//         }
//       }
//   return (
//     <div>deleteListing</div>
//   )
// }
