# School Visitor Management / 校园访客管理

A reusable Microsoft 365 visitor-management configuration template maintained by Lemex Wang. It documents Forms, SharePoint Lists, Power Automate and Teams workflows for school visitor invitations, bilingual registration, host approval, and guard check-in/check-out.

This is a sanitized public extract of an internally developed project. It includes configuration and a local validator; it does not include a deployable Power Automate solution package. Tenant provisioning and end-to-end acceptance testing are required.

## Included workflows

- English staff invitation requests and Chinese-English visitor registration.
- Reusable invitation links with a 24-hour validity window.
- Duplicate-event protection using FormsEventKey.
- Host approval routing and approval timeout handling.
- Approval emails, gate check-in/check-out, and emergency on-site views.
- Chinese-first guard labels and Teams Adaptive Card examples.
- Vehicle registration and a configurable safeguarding acknowledgement.

## Validate

Requires Node.js 18 or later. No package installation is needed.

```sh
node scripts/validate-config.mjs
```

## Adapt and deploy

See [deployment guide](docs/deployment.md) and [acceptance checks](docs/acceptance.md). All form IDs, question IDs, logos, addresses and mailbox values are placeholders. Replace them in your own private deployment configuration and update the corresponding validator checks. Question ID placeholders must be replaced separately for each question.

The public extract excludes production data, screenshots, organization branding, internal logs and private Git history. No production deployment or adoption metrics are claimed for this public template.

## Maintainer

Lemex Wang (GitHub: lemexwang). Maintenance includes workflow configuration, validation rules, defect fixes, bilingual interfaces and implementation documentation.

## License

MIT. See [LICENSE](LICENSE).
