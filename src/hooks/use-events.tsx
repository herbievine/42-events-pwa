import { useQuery } from "@tanstack/react-query";
import { useUser } from "./use-user";

export function useEvents() {
	const { user } = useUser()

	const { data, isLoading } = useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const token = localStorage.getItem('token');
	
			if (!token) {
				throw new Error('No token found')
			} else if (!user) {
				throw new Error('No user found')
			}

			const campusId = user.campus[0].id;
	
			const res = await fetch(`https://api.intra.42.fr/v2/campus/${campusId}/events`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
	
			if (res.status !== 200) {
				throw new Error('Failed to fetch user')
			}
	
			return res.json();
		} 
	})

	return {
		events: data ?? null,
		isLoading,
	}
}
