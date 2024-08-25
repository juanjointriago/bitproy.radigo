import { useState } from 'react';

export const useForm = <T extends Object>(initState: T) => {
  const [state, setState] = useState(initState);

  const onChange = <K extends Object>(value: K, field: keyof T) => {
    setState({
      ...state,
      [field]: value,
    });
  };
  const setFormValue = (form: T) => {
    setState({
      ...state,
      ...form,
    });
  };

  const setFormValueAll = (form: T) => {
    setState(form);
  };
  const updateData = <K extends Object>(newData: T) => {
    setState(newData);
  };
  return {
    ...state,
    form: state,
    onChange,
    setFormValue,
    setFormValueAll,
    updateData,
  };
};
