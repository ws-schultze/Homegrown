import { useEffect } from "react";
import { useParams } from "react-router";

/**
 * Listen for changes in params.pageNumber and when there is a change
 * update the redux state.
 * @param handleCurrentPageNumber (num: number) => void
 */
export default function useCurrentPageNumber(
  handleCurrentPageNumber: (num: number) => void
) {
  const params = useParams();
  const currentPageNumber = Number(params.pageNumber);

  useEffect(() => {
    handleCurrentPageNumber(currentPageNumber);
  }, [currentPageNumber]);
}
