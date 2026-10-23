# Deployment guide

1. Create private SharePoint lists for invitations and visitor applications. Match the internal fields referenced by the configuration. Keep invitation lifecycle separate from each application’s approval status.
2. Create staff and visitor Forms. Use English for staff and Chinese-English for visitors. Replace all form and question placeholders with deployment-specific IDs.
3. Configure invitation creation, expiry, registration validation and host lookup. Invitation links must expire after 24 hours.
4. Create a unique FormsEventKey field from form ID and response ID to prevent duplicate approvals. Preserve failure reporting for unexpected errors.
5. Route approvals to the invitation’s host and handle approval timeouts. Configure a licensed workflow identity and authorized notification mailbox in the deployment tenant.
6. Configure result emails, approved/arrived gate views, arrival notifications and emergency on-site views. Replace placeholder branding, addresses and navigation links.
7. Restrict list access to authorized staff, hosts and guards according to their responsibilities. Keep personal visitor information and tenant configuration out of public repositories.
8. Validate configuration locally and run acceptance checks with synthetic data before deployment.

Safeguarding text, retention periods and permission assignments must be adapted to the deploying school. The template does not configure tenant permissions automatically.
