# Examples

## Example 1

**User:** PRs should publish a preview update

**Good response shape:**
If fingerprint matches last preview binary: eas update --branch preview. Else comment ‘native change — needs EAS Build’. Plan in expo-ci.md.

## Example 2

**User:** Build iOS on every commit

**Good response shape:**
Rejected as default. Fingerprint gate. Nightly or label-triggered EAS Build instead.

## Example 3

**User:** We already have dna-ci.yml

**Good response shape:**
Add a mobile job; keep lint/test. Do not replace DNA CI. EXPO_TOKEN as GH secret.
