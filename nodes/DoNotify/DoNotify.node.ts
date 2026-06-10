import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class DoNotify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DoNotify',
		name: 'doNotify',
		icon: 'file:donotify.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Schedule and place automated voice-call reminders with DoNotify',
		defaults: {
			name: 'DoNotify',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'doNotifyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Reminder', value: 'reminder' },
					{ name: 'Account', value: 'account' },
				],
				default: 'reminder',
			},

			// ----- Reminder operations -----
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['reminder'] } },
				options: [
					{
						name: 'Create (Schedule)',
						value: 'create',
						action: 'Schedule a reminder call',
						description: 'Schedule a voice-call reminder for a future time',
						routing: { request: { method: 'POST', url: '/api/reminders' } },
					},
					{
						name: 'Call Now',
						value: 'callNow',
						action: 'Place a reminder call now',
						description: 'Place an immediate voice-call reminder',
						routing: { request: { method: 'POST', url: '/api/call-now' } },
					},
				],
				default: 'create',
			},

			// ----- Account operations -----
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'Get Usage',
						value: 'getUsage',
						action: 'Get plan usage',
						description: 'Return plan, monthly limit, used and remaining reminders',
						routing: { request: { method: 'GET', url: '/api/usage' } },
					},
					{
						name: 'Get Profile',
						value: 'getProfile',
						action: 'Get the account profile',
						description: 'Return the authenticated DoNotify user',
						routing: { request: { method: 'GET', url: '/api/user' } },
					},
				],
				default: 'getUsage',
			},

			// ----- Shared field: Title (create + callNow) -----
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['reminder'], operation: ['create', 'callNow'] } },
				description: 'What the call announces it is reminding you about',
				routing: { send: { type: 'body', property: 'title' } },
			},

			// ----- Create-only field: Call At -----
			{
				displayName: 'Call At',
				name: 'callAt',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['reminder'], operation: ['create'] } },
				description: 'When to place the call. Must be in the future.',
				routing: { send: { type: 'body', property: 'call_at' } },
			},

			// ----- Optional fields (create + callNow) -----
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['reminder'], operation: ['create', 'callNow'] } },
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						typeOptions: { rows: 2 },
						default: '',
						description: 'Extra detail spoken after the title',
						routing: { send: { type: 'body', property: 'description' } },
					},
					{
						displayName: 'Event Time',
						name: 'eventTime',
						type: 'dateTime',
						default: '',
						description:
							'The time of the actual event (defaults to Call At). Only used when scheduling.',
						displayOptions: { show: { '/operation': ['create'] } },
						routing: { send: { type: 'body', property: 'event_time' } },
					},
				],
			},
		],
	};
}
