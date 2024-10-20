export const PASSWORD_GENERATOR_PAGE = `${Cypress.config().baseUrl}`;
export const PAGE_LOAD = `https://api.userway.org/api/a11y-data/v0/page/https%3A%2F%2Fwww.security.org%2Fpassword-generator%2F/DESKTOP/WIDGET_ON/status
`;

export const getPasswordLengthInput = () => cy.get('input[id="passwordLength"]');
export const getPasswordLengthRange = () => cy.get('input[id="passwordLengthRange"]');
export const getPassword = () => cy.get('input[id="password"]');
export const getPasswordStrength = () => cy.get('[class="PasswordGenerator_pg_password_strength_bar_step__Q4Hcl"]');
export const getGeneratePasswordIcon = () => cy.get('button[title="Generate password"]');
export const getCopyPasswordIcon = () => cy.get('button[title="Copy password"]');
export const getCopyPasswordButton = () => cy.get('button[type="button"][title="Copy Password"]');
export const getOptionLowercase = () => cy.get('input[id="option-lowercase"]');
export const getOptionUppercase = () => cy.get('input[id="option-uppercase"]');
export const getOptionNumbers = () => cy.get('input[id="option-numbers"]');
export const getOptionSymbols = () => cy.get('input[id="option-symbols"]');

class PasswordGeneratorOptions {
  public optionMap: Record<string, string> = {
    'Lowercase': 'input[id="option-lowercase"]',
    'Uppercase': 'input[id="option-uppercase"]',
    'Numbers': 'input[id="option-numbers"]',
    'Symbols': 'input[id="option-symbols"]'
  };
}    

class PasswordStrength {
  public strengthColors: Record<string, string> = {
    'low': 'rgb(218, 18, 18)',           // Red for low strength
    'medium': 'rgb(230, 160, 0)',        // Orange for medium strength
    'medium-high': 'rgb(125, 135, 1)',   // Bottle green for medium-high strength
    'strong': 'rgb(1, 135, 1)',          // Brignt Green for strong strength
    'extra strong': 'rgb(34, 46, 237)'   // Blue for extra strong strength
  };
}

export { PasswordGeneratorOptions, PasswordStrength };
