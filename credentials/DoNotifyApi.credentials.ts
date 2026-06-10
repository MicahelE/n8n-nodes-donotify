import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DoNotifyApi implements ICredentialType {
	name = 'doNotifyApi';

	displayName = 'DoNotify API';

	documentationUrl = 'https://donotifys.com';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://donotifys.com',
			placeholder: 'https://donotifys.com',
			description: 'Your DoNotify base URL, without a trailing slash',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'A personal access token from DoNotify. Create one at Profile → API Tokens (it is shown only once).',
		},
	];

	// Sends the token as a Bearer header on every request.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	// Lets n8n validate the credential when the user saves it.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/usage',
			// Force a JSON 401 on a bad token instead of a 302 redirect to login.
			headers: { Accept: 'application/json' },
		},
	};
}
