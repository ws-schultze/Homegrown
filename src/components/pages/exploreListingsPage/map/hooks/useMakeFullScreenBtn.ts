import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeMapFullScreenControls } from "../mapHelpers";
import { setMapIsFullScreen } from "../../exploreListingsPageSlice";

export default function useMakeFullScreenBtn({
  mapRef,
  screenSize,
}: {
  mapRef: React.MutableRefObject<google.maps.Map | undefined>;
  screenSize: string | undefined;
}) {
  const dispatch = useDispatch;
  useEffect(() => {
    makeMapFullScreenControls(mapRef.current, () =>
      // @ts-ignore
      dispatch(setMapIsFullScreen())
    );
    // @ts-ignore
  }, [mapRef.current, dispatch, screenSize]);
}
