import { useEffect } from "react";
import { Boundaries } from "../../../../types/index";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { setPlace } from "../../../shared/listingFilters/placeFilter/placeFilterSlice";
import { useNavigate } from "react-router";

function useRemoveBoundaryBtnClick(
  map: google.maps.Map,
  hideBoundaryBtn: HTMLButtonElement,
  boundaries: Boundaries,
  dispatch: Dispatch<AnyAction>
): null {
  const navigate = useNavigate();

  useEffect(() => {
    const listener = hideBoundaryBtn.addEventListener("click", () => {
      if (boundaries) {
        boundaries.postalCodeBoundaries.style = null;
        boundaries.countyBoundaries.style = null;
        boundaries.stateBoundaries.style = null;
        boundaries.countryBoundaries.style = null;
        boundaries.cityBoundaries.style = null;
        // boundariesRef.current = null;
      }
      map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
      dispatch(setPlace(undefined));
      navigate("", { replace: true });
    });
  }, [map, hideBoundaryBtn, boundaries, dispatch, navigate]);

  return null;
}

export default useRemoveBoundaryBtnClick;
