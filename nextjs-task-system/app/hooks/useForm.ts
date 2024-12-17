import { useState } from 'react';


export const useForm = (initialState: any = {}) => {

    const [formState, setFormState] = useState(initialState);

    const onChangeInput = (event: any) => {
        const field = event.target.name;
        const value = event.target.value;
  
        setFormState({
          ...formState,
          [field]:value
        });
      }


  return {
    ...formState,
    formState,
    setFormState,
    onChangeInput,
  }
}