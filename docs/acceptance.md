# Acceptance checks

These are test scenarios, not claims of completed production tests. Use synthetic identities and visitor data.

- Local validator succeeds after configuration changes.
- Staff form is English-only; visitor messages are Chinese-first bilingual.
- A new invitation produces a link, routes to the correct host and expires after 24 hours.
- Multiple applications can use an unexpired invitation without sharing approval results.
- Duplicate Forms events do not create duplicate applications or approvals.
- Unexpected application creation errors remain visible as failures.
- Approved, rejected and timed-out applications receive the correct independent statuses.
- Invalid/expired invitations and malformed registrations do not reach approval.
- Guard views show approved visitors; arrival/departure updates affect the emergency list correctly.
- Unauthorized users cannot read visitor records or use guard functions.
- Vehicle and non-vehicle branches both reach the safeguarding acknowledgement.
- Notifications and email links are validated using synthetic records.
