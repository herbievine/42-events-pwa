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

		const url = new URL('https://api.intra.42.fr/oauth/token');

		url.searchParams.append('grant_type', 'authorization_code');
		url.searchParams.append('client_id', import.meta.env.VITE_FORTY_TWO_API_CLIENT);
		url.searchParams.append('client_secret', import.meta.env.VITE_FORTY_TWO_API_SECRET);
		url.searchParams.append('code', code);
		url.searchParams.append('redirect_uri', `${import.meta.env.VITE_BASE_URL}/auth/callback`);
		url.searchParams.append('state', state!);

		const res = await fetch(url.href, {
			method: 'POST',
		});

		const data = await res.json()

		if (res.status !== 200 || !data?.access_token) {
			throw new Error(data.error_description ?? 'Failed to login')
		}

		localStorage.setItem('token', data.access_token)

		redirect({
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
