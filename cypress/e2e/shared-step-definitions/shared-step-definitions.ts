import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { PAGE_LOAD, PASSWORD_GENERATOR_PAGE } from "../../pageObjects/passwordGenerator.po";

Given("I visit the password generator page", () => {
  cy.intercept('GET', PAGE_LOAD).as('pageLoad');
  cy.visit(PASSWORD_GENERATOR_PAGE);
  cy.wait('@pageLoad');
});