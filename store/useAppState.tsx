import { MenuItem } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';


const defaultState: any = {
  cart :[],
};

export const APP_STATE_KEY = ['appState'];

// Hook to access app-wide state
export function useAppState() {
  const queryClient = useQueryClient();

  // Get current state
  const { data: state } = useQuery({
    queryKey: APP_STATE_KEY,
    queryFn: () => defaultState,
    staleTime: Infinity,
  });
  
  const actions = {
  
    resetCart : () => queryClient.setQueryData(APP_STATE_KEY, (old:any) =>{
      return old.cart = []
    }),
    addItemToCart: (item : Partial<MenuItem>) =>
      queryClient.setQueryData(APP_STATE_KEY, (old:any) => {

       return { ...old,
        cart: [...old.cart, item]
       
        }
      }),

      removeItemFromCart: (id: string) =>
        queryClient.setQueryData(APP_STATE_KEY, (old: any) => {
          
          const removeOneItem = (cart: any[], id: string) => {
            let removed = false;
            return cart.filter((ci) => {
              if (!removed && ci.id === id) {
                removed = true; 
                return false;
              }
              return true; 
            });
          };

          return {
            ...old,
            cart: old?.cart ? removeOneItem(old.cart, id) : [],
          };
  }),


    reset: () => queryClient.setQueryData(APP_STATE_KEY, defaultState),
  };

  return { state, ...actions };
}
