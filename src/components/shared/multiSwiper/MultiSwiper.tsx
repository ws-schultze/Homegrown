import { useState } from "react";

// import "./styles.css";
// import "swiper/css";
// import "swiper/css/free-mode";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
// // import "../../../css/home-page-swiper.css";

// import { useNavigate } from "react-router";
// import { useAppSelector } from "../../../redux/hooks";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Swiper as SwiperClass } from "swiper/types";
// import {
//   Detail,
//   MainSlide,
//   MainSlideDetails,
//   MainSlideImg,
//   Wrapper,
// } from "./styledComponents";
// import Error from "../error/Error";

// export default function MultiSwiper() {
//   const commonState = useAppSelector((state) => state.common);
//   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

//   const navigate = useNavigate();

//   if (commonState.listings.length < 1) {
//     return <Error />;
//   }

//   return (
//     <Wrapper>
//       <Swiper
//         loop={true}
//         spaceBetween={10}
//         navigation={true}
//         thumbs={{ swiper: thumbsSwiper }}
//         modules={[]}
//         className="big-swiper"
//       >
//         {commonState.listings.map((listing, index) => (
//           <SwiperSlide key={index}>
//             <MainSlide>
//               <MainSlideImg
//                 src={listing.data.uploads.images.value[0].url}
//                 alt={"listing"}
//                 onClick={() =>
//                   navigate(
//                     `/explore-listings/details/${listing.data.address.formattedAddress.value}/${listing.id}`
//                   )
//                 }
//               />
//             </MainSlide>
//             <MainSlideDetails>
//               <Detail>
//                 {listing.data.basicInfo.price.shortFormatted}{" "}
//                 {listing.data.basicInfo.forSaleOrRent.value?.id === "for-rent"
//                   ? " / Month"
//                   : null}
//               </Detail>
//               <Detail>
//                 {listing.data.basicInfo.listingKind.value?.label}{" "}
//                 {listing.data.basicInfo.forSaleOrRent.value?.label}
//               </Detail>
//               <Detail>
//                 {listing.data.apartment
//                   ? listing.data.apartment.bedrooms.number
//                   : listing.data.apartmentBuilding
//                   ? listing.data.apartmentBuilding.bedrooms.number
//                   : listing.data.condo
//                   ? listing.data.condo.bedrooms.number
//                   : listing.data.land
//                   ? `${listing.data.land.acres} Acres`
//                   : listing.data.manufacturedHome
//                   ? listing.data.manufacturedHome.bedrooms.number
//                   : listing.data.multiFamilyHome
//                   ? listing.data.multiFamilyHome.bedrooms.number
//                   : listing.data.multiFamilyHomeUnit
//                   ? listing.data.multiFamilyHomeUnit.bedrooms.number
//                   : listing.data.singleFamilyHome
//                   ? listing.data.singleFamilyHome.bedrooms.number
//                   : ""}{" "}
//                 Bed
//                 {" ~ "}
//                 {listing.data.apartment
//                   ? listing.data.apartment.fullBathrooms.number +
//                     listing.data.apartment.halfBathrooms.number * 0.5
//                   : listing.data.apartmentBuilding
//                   ? listing.data.apartmentBuilding.fullBathrooms.number +
//                     listing.data.apartmentBuilding.halfBathrooms.number * 0.5
//                   : listing.data.condo
//                   ? listing.data.condo.fullBathrooms.number +
//                     listing.data.condo.halfBathrooms.number * 0.5
//                   : listing.data.manufacturedHome
//                   ? listing.data.manufacturedHome.fullBathrooms.number +
//                     listing.data.manufacturedHome.halfBathrooms.number * 0.5
//                   : listing.data.multiFamilyHome
//                   ? listing.data.multiFamilyHome.fullBathrooms.number +
//                     listing.data.multiFamilyHome.halfBathrooms.number * 0.5
//                   : listing.data.multiFamilyHomeUnit
//                   ? listing.data.multiFamilyHomeUnit.fullBathrooms.number +
//                     listing.data.multiFamilyHomeUnit.halfBathrooms.number * 0.5
//                   : listing.data.singleFamilyHome
//                   ? listing.data.singleFamilyHome.fullBathrooms.number +
//                     listing.data.singleFamilyHome.halfBathrooms.number * 0.5
//                   : ""}{" "}
//                 Bath
//                 {" ~ "}
//                 {listing.data.apartment
//                   ? listing.data.apartment.squareFeet.number
//                   : listing.data.apartmentBuilding
//                   ? listing.data.apartmentBuilding.squareFeet.number
//                   : listing.data.condo
//                   ? listing.data.condo.squareFeet.number
//                   : listing.data.manufacturedHome
//                   ? listing.data.manufacturedHome.squareFeet.number
//                   : listing.data.multiFamilyHome
//                   ? listing.data.multiFamilyHome.squareFeet.number
//                   : listing.data.multiFamilyHomeUnit
//                   ? listing.data.multiFamilyHomeUnit.squareFeet.number
//                   : listing.data.singleFamilyHome
//                   ? listing.data.singleFamilyHome.squareFeet.number
//                   : ""}{" "}
//                 Sqft
//               </Detail>
//               <Detail>{listing.data.address.formattedAddress.value}</Detail>
//             </MainSlideDetails>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//       {/* <Swiper
//         onSwiper={setThumbsSwiper} // BUG: React strict mode breaks this feature
//         navigation={false}
//         loop={true}
//         spaceBetween={10}
//         slidesPerView={5}
//         freeMode={true}
//         watchSlidesProgress={true}
//         modules={[FreeMode, Navigation, Thumbs]}
//         className="small-swiper"
//       >
//         {commonState.listings.map((listing, index) => (
//           <SwiperSlide key={index}>
//             <img
//               src={listing.data.uploads.images.value[0].url}
//               alt={"listing"}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper> */}
//     </Wrapper>
//   );
// }
