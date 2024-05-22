import { useQuery } from "@tanstack/react-query";

export function useUser() {
	const { data, isLoading } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			const token = localStorage.getItem('token');
	
			if (!token) {
				throw new Error('No token found')
			}
	
			const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
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
		user: data ?? null,
		isLoading,
	}
}
