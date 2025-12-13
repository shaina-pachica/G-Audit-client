import { useMutation } from "@tanstack/react-query";
import loginUser from "./loginUser";

export function useLogin(){
    const mutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }): Promise<{ accessToken: string, roles: ("Owner" | "Employee")[] }> => loginUser(username, password),
  });

  return {
    ...mutation,
    isPending: mutation.isPending,
  };
}