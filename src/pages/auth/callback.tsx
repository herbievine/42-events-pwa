import { createRoute, useLoaderData, redirect } from "@tanstack/react-router";
import { rootRoute } from "../__root";

export const callbackRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/auth/callback",
	loader: async () => {
		const code = new URLSearchParams(window.location.search).get('code')
		const state = new URLSearchParams(window.location.search).get('state')

		if (!code) {
			throw new Error('No code found')
		}

		const url = new URL(`${import.meta.env.VITE_API_URL}/auth/token`);

		url.searchParams.append('code', code);
		url.searchParams.append('state', state!);

		const res = await fetch(url.href, {
			method: 'POST',
		});

		const data = await res.json()

		if (res.status !== 200 || !data?.access_token) {
			throw new Error(data.error_description ?? 'Failed to login')
		}

		localStorage.setItem('token', data.access_token)

		throw redirect({
			to: '/',
		});
	},
	component: CallbackPage,
});

function CallbackPage() {
	const data = useLoaderData({
		from: "/auth/callback"
	})

	return (
    <div>
			<h1>
      Login
    </h1>
		<pre>{JSON.stringify(data)}</pre>
		</div>
  );
}
