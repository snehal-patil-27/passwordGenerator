import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { getCopyPasswordButton, getCopyPasswordIcon, getGeneratePasswordIcon, getOptionLowercase, getOptionNumbers, getOptionSymbols, getOptionUppercase, getPassword, getPasswordLengthInput, getPasswordLengthRange, getPasswordStrength, PASSWORD_GENERATOR_PAGE } from "../pageObjects/passwordGenerator.po";
import { PasswordGeneratorOptions, PasswordStrength} from '../pageObjects/passwordGenerator.po'; 

const passwordGeneratorOptions = new PasswordGeneratorOptions();
const passwordStrength = new PasswordStrength();
let generatedPasswords = [];

Then('I should see all components and the correct URL', () => {
  // Check the URL
  cy.url().should('eq', PASSWORD_GENERATOR_PAGE); 

  // Validate UI components
  getPassword()
  .should('be.visible')
  .and('have.attr', 'name', 'password');

  getPasswordLengthInput()
  .should('be.visible')
  .and('have.attr', 'name', 'passwordLength');

  getPasswordLengthRange()
  .should('be.visible')
  .and('have.attr', 'name', 'passwordLengthRange');

  getOptionLowercase() 
    .and('have.attr', 'value', 'lowercase');

  getOptionUppercase()
    .and('have.attr', 'value', 'uppercase');

  getOptionNumbers()
  .and('have.attr', 'value', 'numbers');

  getOptionSymbols()
  .and('have.attr', 'value', 'symbols');

  getGeneratePasswordIcon()
    .should('be.visible')
    .and('have.attr', 'title', 'Generate password');

  getCopyPasswordIcon()
    .should('be.visible')
    .and('have.attr', 'title', 'Copy password');

  getCopyPasswordButton()
    .should('be.visible')
    .and('have.text', 'Copy Password');
});

Then('the {string} option should be selected', (option: string) => {
  const checkboxSelector = passwordGeneratorOptions.optionMap[option];
  cy.get(checkboxSelector).should('be.checked'); // Check if the option is checked
});

Then('the {string} option should not be selected', (option: string) => {
  const checkboxSelector = passwordGeneratorOptions.optionMap[option];
  cy.get(checkboxSelector).should('not.be.checked'); // Check if the option is not checked
});

When("I set the password length to {string}", (length: string) => {
  getPasswordLengthInput().clear().type(length);
  cy.get('body').click(0, 0); // Click outside of the input field
});

When(/^I select the "([^"]+)" option$/, (options: string) => {
  // Split the options by commas and trim any extra whitespace
  const selectedOptions = options.split(',').map(opt => opt.trim());

  // Get all checkbox selectors
  const allSelectors = passwordGeneratorOptions.optionMap;

  // First, check all the desired options
  selectedOptions.forEach(option => {
    const checkboxSelector = allSelectors[option];

  // Check if the option is not already selected, then select it
    cy.get(checkboxSelector).then($checkbox => {
      if (!$checkbox.is(':checked')) {
        cy.wrap($checkbox).click({ force: true }); // Select the option if not checked
      }
    });
  });

  // Then, uncheck all checkboxes that are not in the selected options list
  Object.keys(allSelectors).forEach(option => {
    if (!selectedOptions.includes(option)) {
      const checkboxSelector = allSelectors[option];
      cy.get(checkboxSelector).then($checkbox => {
        if ($checkbox.is(':checked')) {
          cy.wrap($checkbox).click({ force: true }); // Uncheck the option if it's not one of the selected ones
        }
      });
    }
  });
});

Then('the password should be auto-generated', () => {
  getPassword().should('exist');
});

Then('the password should only contain Lowercase letters', () => {
  // RegEx to validate that the entire string consists of lowercase letters.
  getPassword().invoke('val').should('match', /^[a-z]+$/); 
});

Then('the password should only contain Uppercase letters', () => {
  // RegEx to validate that the entire string consists of Uppercase letters.
  getPassword().invoke('val').should('match', /^[A-Z]+$/);
});

Then('the password should only contain Numbers', () => {
  // RegEx to validate that the entire string consists of numbers.
  getPassword().invoke('val').should('match', /^\d+$/);
});

Then('the password should only contain Symbols', () => {
  // RegEx to validate that the entire string consists of symbols.
  getPassword().invoke('val').should('match', /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/);
});

Then('the password should only contain {string}', (options: string) => {
  // Split the options string by commas and trim any whitespace
  const selectedOptions = options.split(',').map(opt => opt.trim());

  // Define regex patterns for each option
  const patterns: Record<string, RegExp> = {
    'Lowercase': /[a-z]/,
    'Uppercase': /[A-Z]/,
    'Numbers': /[0-9]/,
    'Symbols': /[!@#$%^&*(),.?":{}|<>]/
  };

  // Get the generated password
  getPassword().invoke('val').then((password: string) => {
    // Loop through each selected option and validate that the password matches the corresponding pattern
    selectedOptions.forEach(option => {
      const pattern = patterns[option];
      expect(password).to.match(pattern, `Password should contain ${option}`);
  });

  // Now check that the password does not contain any patterns for unselected options
    Object.keys(patterns).forEach(option => {
      if (!selectedOptions.includes(option)) {
        const pattern = patterns[option];
        expect(password).to.not.match(pattern, `Password should not contain ${option}`);
      }
    });
  });
});

Then('the password should have exactly {string} characters', (length: string) => {
  // getPassword().invoke('val').should('have.length', parseInt(length));
  getPassword().invoke('val').should('have.length', length);
  // Validate that the value in the password length input matches the specified length
  getPasswordLengthRange().invoke('val').should('equal', length);
});

When("I set the password length to null", () => {
  getPasswordLengthInput().clear();
  cy.get('body').click(0, 0); // Click outside of the input field
});

When('I set the password length range to {string}', (length: string) => {
  // Set the value of the range input
  getPasswordLengthRange()
    .invoke('val', length) // Set the new value
    .trigger('input', { force: true })
    .trigger('change', { force: true })
    .then(() => {
      getPasswordLengthInput().clear().type(length);
      cy.get('body').click(0, 0);
  });

});

When('I deselect each option one by one', () => {
  const allSelectors = Object.values(passwordGeneratorOptions.optionMap);
  
  // Deselect each option one by one
  allSelectors.forEach((selector, index) => {
      cy.get(selector).click({ force: true }); // Deselect current option
  });
});

Then('the last option should still be selected', () => {
  const allSelectors = Object.values(passwordGeneratorOptions.optionMap);
  const lastSelector = allSelectors[allSelectors.length - 1]; // Get the last option

  // Verify that the last option is still checked
  cy.get(lastSelector).should('be.checked');
});

Then('the password should have low strength', () => {
  getPasswordStrength()
      .should('have.css', 'background-color', 'rgb(218, 18, 18)');
});

Then('the password should have medium strength', () => {
  getPasswordStrength()
      .should('have.css', 'background-color', 'rgb(230, 160, 0)');
});

Then('the password should have {string} strength', (strength: string) => {
  const expectedColor = passwordStrength.strengthColors[strength];

  // Check that the expected color is defined
  if (!expectedColor) {
    throw new Error(`Strength level "${strength}" is not recognized.`);
  }

  getPasswordStrength()
      .should('have.css', 'background-color', expectedColor);
});

When('I click the Generate Password button five times', () => {
  for (let i = 0; i < 5; i++) {
    getGeneratePasswordIcon().click(); 
    cy.wait(500);
    getPassword().invoke('val').then((password) => { 
      generatedPasswords.push(password); // Store the generated password
    });
  }
});

Then('five different passwords should be generated', () => {
  // Ensure all passwords are unique
  const uniquePasswords = [...new Set(generatedPasswords)];
  expect(uniquePasswords.length).to.equal(5);
});

Then('all passwords should meet the criteria of length and character type', () => {
  generatedPasswords.forEach((password) => {
    // Verify the password length 
    expect(password.length).to.equal(12);

    // Verify it contains uppercase letters
    expect(password).to.match(/[A-Z]/);

    // Verify it contains symbols
    expect(password).to.match(/[!@#$%^&*(),.?":{}|<>]/); 
  });
});