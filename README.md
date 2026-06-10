# n8n-nodes-donotify

This is an n8n community node. It lets you use [DoNotify](https://donotifys.com) in your n8n workflows.

DoNotify places **automated voice-call reminders** — a real phone call so you (or your contacts) never miss meetings, medications, or appointments. This node lets workflows schedule those calls, place one immediately, and check plan usage.

[n8n](https://n8n.io) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Example](#example-workflow) · [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n docs.

- **n8n Cloud / verified:** search for **DoNotify** in the nodes panel and add it (available once the node is verified).
- **Self-hosted:** go to **Settings → Community Nodes → Install**, enter `n8n-nodes-donotify`, and confirm.

## Credentials

You need a DoNotify account with an active subscription and a personal access token.

1. Sign in at [donotifys.com](https://donotifys.com).
2. Go to **Profile → API Tokens** and create a token. **Copy it — it's shown only once.**
3. In n8n, create a **DoNotify API** credential:
   - **Base URL:** `https://donotifys.com` (default)
   - **API Token:** the token you copied

n8n validates the token against `GET /api/usage` when you save.

## Operations

### Reminder
- **Create (Schedule)** — schedule a voice-call reminder for a future time.
  - `Title` (required), `Call At` (required, must be in the future), optional `Description` and `Event Time`.
- **Call Now** — place an immediate voice call.
  - `Title` (required), optional `Description`. Requires a phone number on your DoNotify profile.

### Account
- **Get Usage** — returns your plan, monthly limit, used, remaining, and whether a phone number is set.
- **Get Profile** — returns the authenticated DoNotify user.

### Notes & errors
- Times use ISO-8601 (n8n date/time values work directly).
- Common API responses surfaced as node errors: **401** invalid token · **403** no active subscription · **422** phone number not set · **429** monthly reminder limit reached.

## Example workflow

**"Call me 30 minutes before a high-priority task":** Schedule Trigger / your app → **DoNotify → Reminder → Create** with `Title = {{$json.task}}` and `Call At = {{$json.due.minus(30, 'minutes')}}`.

## Resources

- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)
- [DoNotify](https://donotifys.com)

## License

[MIT](LICENSE)
