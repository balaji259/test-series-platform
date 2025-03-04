import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const handleFocus = () => console.log("Tab in focus");
    const handleBlur = () => alert("No switching allowed!");

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return <div>Test Interface</div>;
};

export default Test;
