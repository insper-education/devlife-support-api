import { useLocation } from "react-router";

export default (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};
