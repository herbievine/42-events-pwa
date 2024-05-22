import { useQuery } from "@tanstack/react-query";

export function useEvents() {
	const { data, isLoading } = useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const token = localStorage.getItem('token');
	
			if (!token) {
				throw new Error('No token found')
			}
			
			const res = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
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
