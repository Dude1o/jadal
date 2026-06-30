import { useEffect, useState } from "react";

export const useFormKey = (data: any) => {
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (data) {
      setFormKey((prev) => prev + 1);
    }
  }, [data]);

  return formKey;
};
