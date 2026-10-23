import { readFileSync } from 'node:fs';

const config = JSON.parse(
  readFileSync(new URL('./visitor-management-config.json', import.meta.url), 'utf8')
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function toMinutes(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  assert(match, `Invalid time option: ${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

assert(config.localization.defaultLocale === 'zh-CN', 'Default locale must be zh-CN');
assert(config.localization.visitorFacing.mode === 'bilingual', 'Visitor-facing content must be bilingual');
assert(config.localization.visitorFacing.order[0] === 'zh-CN', 'Visitor-facing Chinese text must appear first');
assert(config.localization.guardFacing.mode === 'chinesePrimary', 'Guard-facing content must be Chinese-primary');
assert(
  config.localization.adminInternal.mode === 'englishStableValues',
  'Admin/internal status values must remain English-stable'
);

assert(config.localization.staffFacing.mode === 'englishOnly', 'Staff-facing Form A must be English-only');
assert(
  config.localization.staffFacing.languages[0] === 'en',
  'Staff-facing Form A must use English'
);

const timeOptions = config.formA.timeOptions;
assert(Array.isArray(timeOptions), 'formA.timeOptions must be an array');
assert(timeOptions.length === 22, 'formA.timeOptions must contain 22 half-hour slots');
assert(timeOptions[0] === '07:30', 'First time option must be 07:30');
assert(timeOptions.at(-1) === '18:00', 'Last time option must be 18:00');

const minutes = timeOptions.map(toMinutes);
for (let index = 1; index < minutes.length; index += 1) {
  assert(minutes[index] - minutes[index - 1] === 30, 'Time options must use 30-minute steps');
}

for (const question of config.formA.timeQuestions) {
  assert(question.type === 'choice', `${question.name} must be a choice question`);
  assert(question.display === 'dropdown', `${question.name} must display as dropdown`);
  assert(question.freeTextAllowed === false, `${question.name} must not allow free text`);
}

assert(config.formA.confirmationMessage?.en, 'formA.confirmationMessage.en is required');
assert(
  !config.formA.confirmationMessage.en.toLowerCase().includes('shortly'),
  'formA confirmation must not promise immediate delivery'
);
assert(
  !/[\u4e00-\u9fff]/.test(config.formA.confirmationMessage.en),
  'formA confirmation must be English-only'
);

const invitationLinkQuestion = config.formA.invitationLinkQuestion;
assert(invitationLinkQuestion?.name, 'formA.invitationLinkQuestion.name is required');
assert(invitationLinkQuestion?.type === 'choice', 'formA.invitationLinkQuestion must be a choice question');
assert(
  invitationLinkQuestion.options?.[0]?.label,
  'formA.invitationLinkQuestion must define at least one option label'
);
assert(
  invitationLinkQuestion.name === 'Visitor Invitation link',
  'formA invitation link question must be English-only'
);
assert(
  invitationLinkQuestion.options[0].label === 'Generate Invitation link',
  'Form A invitation link option must be English-only'
);
assert(
  !/[\u4e00-\u9fff]/.test(config.formA.name),
  'Form A title must be English-only'
);

assert(config.formB.confirmationMessage?.bilingual, 'formB.confirmationMessage.bilingual is required');
assert(config.formB.optionalFieldInstruction?.bilingual, 'formB.optionalFieldInstruction.bilingual is required');

const safeguarding = config.formB.visitorSafeguarding;
assert(safeguarding?.noticeReference === 'VIS-SG-01', 'Safeguarding notice reference must be VIS-SG-01');
assert(safeguarding?.questionPosition === 'final', 'Safeguarding acknowledgement must be the final question');
assert(safeguarding?.question?.type === 'choice', 'Safeguarding acknowledgement must be a choice question');
assert(safeguarding?.question?.display === 'singleChoice', 'Safeguarding acknowledgement must allow one choice only');
assert(safeguarding?.question?.required === true, 'Safeguarding acknowledgement must be required');
assert(
  safeguarding?.question?.options?.length === 1,
  'Safeguarding acknowledgement must contain exactly one confirmation option'
);
assert(
  safeguarding?.branching?.vehicleNo?.includes('Visitor Safeguarding Acknowledgement'),
  'The no-vehicle branch must reach the safeguarding acknowledgement'
);
assert(
  safeguarding?.branching?.vehicleYes?.endsWith('Visitor Safeguarding Acknowledgement'),
  'The vehicle branch must end at the safeguarding acknowledgement'
);

assert(config.branding?.primaryColor === '#9E1422', 'branding.primaryColor must be #9E1422');
assert(config.branding?.forms?.themeImage === 'none', 'Forms must not use a Style theme wallpaper image');
assert(
  config.branding?.email?.crestUrl === 'https://example.com/assets/school-logo.svg',
  'Email crest must use the configured placeholder logo URL'
);
assert(
  config.branding?.email?.headerBackground === '#9E1422',
  'Email header background must be template accent #9E1422'
);
assert(
  config.emailTemplates?.designSystem?.headerBackground === '#9E1422',
  'emailTemplates.designSystem.headerBackground must be #9E1422'
);

for (const question of config.formB.optionalQuestions ?? []) {
  assert(question.instruction, `${question.name} must include optional-field instruction`);
  assert(question.required === false, `${question.name} must remain optional`);
}

assert(
  config.powerAutomate.vis01.expressions.expireAtMvp === 'addHours(utcNow(), 24)',
  'Visitor invitation links must expire 24 hours after creation'
);
const reusePolicy = config.powerAutomate.vis02.invitationReusePolicy;
assert(reusePolicy?.reusableWithinExpiry === true, 'Visitor invitation links must be reusable within their validity window');
assert(
  reusePolicy?.invitationStatusOwnership?.includes('Expired, Cancelled, or Error'),
  'InviteStatus must represent shared-link lifecycle rather than an individual application result'
);
assert(
  reusePolicy?.applicationStatusOwnership?.includes('VisitorApplications'),
  'Approval results must be written only to the current VisitorApplications item'
);
const idempotency = config.powerAutomate.vis02.idempotency;
assert(idempotency?.field === 'FormsEventKey', 'VIS-02 must persist FormsEventKey');
assert(idempotency?.enforceUniqueValues === true, 'FormsEventKey must enforce unique values');
assert(
  idempotency?.keyExpression?.includes("body/resourceData/responseId") &&
    idempotency.keyExpression.includes(config.branding.forms.formsBId),
  'FormsEventKey must combine the exact Form B ID with the trigger ResponseId'
);
assert(
  !idempotency.notAKey.includes('ResponseId'),
  'ResponseId must remain part of the idempotency key'
);
const duplicateHandling = idempotency.duplicateFailureHandling;
assert(
  duplicateHandling?.runAfterCreateItem?.includes('Failed') &&
    duplicateHandling.runAfterCreateItem.includes('TimedOut'),
  'Duplicate handling must run after Create item fails or times out'
);
assert(
  duplicateHandling?.detectExpression?.includes("[FormsEventKey]") &&
    duplicateHandling.duplicateTerminateStatus === 'Succeeded',
  'FormsEventKey duplicates must terminate as Succeeded'
);
assert(
  duplicateHandling?.unexpectedFailureTerminateStatus === 'Failed' &&
    duplicateHandling.unexpectedFailureCode === 'UnexpectedCreateItemFailure',
  'Unexpected Create item failures must remain Failed'
);
assert(
  duplicateHandling?.approvalRunAfter === 'Handle duplicate Forms event = Skipped',
  'Normal approval must run only when duplicate handling is skipped'
);
const timeoutHandling = config.powerAutomate.vis02.approvalTimeoutHandling;
assert(timeoutHandling?.timeoutIso8601 === 'P28D', 'VIS-02 approval timeout must be P28D');
assert(
  timeoutHandling?.timeoutActionRunAfter === 'Start and wait for an approval = TimedOut' &&
    timeoutHandling.timeoutTerminateStatus === 'Succeeded',
  'Approval timeout must terminate the run as Succeeded'
);
assert(
  timeoutHandling?.approvalOutcomeRunAfter === 'Approval timeout handled = Skipped',
  'Approval outcome branches must run only when timeout handling is skipped'
);
assert(
  config.powerAutomate.vis02.approvalIdentity?.platformRule?.includes('flow creator'),
  'Approvals sender identity boundary must be documented'
);
assert(
  config.powerAutomate.vis02.expressions.getInvitationFilter.includes("InviteStatus eq 'Created'") &&
    config.powerAutomate.vis02.expressions.getInvitationFilter.includes('ExpireAt ge utcNow()'),
  'VIS-02 invitation lookup must require an active, unexpired shared link'
);
for (const removed of config.formB.removedQuestions ?? []) {
  assert(removed.powerAutomateFollowUp, `${removed.name} must document Power Automate follow-up`);
}

for (const removed of config.powerAutomate.vis02.removedFormMappings ?? []) {
  assert(removed.sharePointField && removed.previousFormsKey, 'Each removedFormMappings entry must name the SharePoint field and previous Forms key');
}

assert(
  (config.powerAutomate.vis02.pendingTenantUpdates ?? []).length >= 7 ||
    (config.powerAutomate.vis02.completedTenantUpdates ?? []).length >= 1,
  'vis02 must list pending tenant updates after Form B field removal, or completedTenantUpdates after save'
);

const requiredInviteStatuses = ['Created', 'Submitted', 'Approved', 'Rejected', 'Expired', 'Cancelled', 'Error'];
for (const status of requiredInviteStatuses) {
  assert(config.statusValues.inviteStatus.includes(status), `Missing InviteStatus: ${status}`);
}

const requiredApprovalStatuses = ['Pending', 'Approved', 'Rejected', 'Arrived', 'Left', 'Expired', 'Cancelled', 'Exception'];
for (const status of requiredApprovalStatuses) {
  assert(config.statusValues.approvalStatus.includes(status), `Missing ApprovalStatus: ${status}`);
  assert(config.statusValues.displayLabels[status], `Missing Chinese display label for ApprovalStatus: ${status}`);
}

for (const action of ['search', 'checkIn', 'checkOut', 'blockEntry', 'emergencyList']) {
  assert(config.statusValues.guardActionLabels[action], `Missing Chinese guard action label: ${action}`);
}

const card = config.adaptiveCards.gateApprovedVisitor;
assert(card.type === 'AdaptiveCard', 'Gate card must be an AdaptiveCard');
assert(card.version === '1.2', 'Gate card must use Adaptive Card version 1.2 for Teams mobile');

for (const block of card.body) {
  if (block.type === 'TextBlock') {
    assert(block.wrap === true, `TextBlock must wrap: ${block.text}`);
  }
}

const facts = card.body.find((block) => block.type === 'FactSet')?.facts ?? [];
assert(facts.length > 0, 'Gate card must include a FactSet');
for (const fact of facts) {
  assert(fact.title && fact.value, 'Each FactSet entry must include title and value');
  assert(!/[A-Za-z]{4,}/.test(fact.title), `Gate card fact title should be Chinese-primary: ${fact.title}`);
}

for (const [key, view] of Object.entries(config.sharePointViews)) {
  assert(view.name, `SharePoint view ${key} must have a Chinese display name`);
  assert(view.displayLabels, `SharePoint view ${key} must include Chinese display labels`);
  for (const column of view.columns) {
    assert(view.displayLabels[column], `SharePoint view ${key} missing Chinese label for ${column}`);
  }
}

console.log('visitor-management-config.json is valid.');
