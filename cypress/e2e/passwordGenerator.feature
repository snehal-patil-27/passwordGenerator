Feature: Password Generator

    Background:
        Given I visit the password generator page

    Scenario: Verify the components and URL on the Password Generator page
        Then I should see all components and the correct URL

    Scenario: Default state of the password generator
        Then the password should have exactly "6" characters
        And the "Lowercase" option should be selected
        And the "Uppercase" option should be selected
        And the "Numbers" option should not be selected
        And the "Symbols" option should not be selected
        And the password should only contain "Lowercase, Uppercase"

    Scenario Outline: Generate a password with password number component and different character options
        When I set the password length to "<length>"
        And I select the "<option>" option
        Then the password should be auto-generated
        And the password should only contain "<option>"
        And the password should have exactly "<length>" characters

        Examples:
            | length | option                                 |
            | 10     | Lowercase                              |
            | 20     | Uppercase                              |
            | 30     | Numbers                                |
            | 32     | Symbols                                |
            | 12     | Uppercase, Symbols                     |
            | 17     | Lowercase, Numbers                     |
            | 22     | Lowercase, Uppercase, Numbers          |
            | 27     | Uppercase, Numbers, Symbols            |
            | 15     | Lowercase, Uppercase, Numbers, Symbols |

    Scenario Outline: Generate a password with password range component and different character options
        When I set the password length range to "<length>"
        And I select the "<option>" option
        Then the password should be auto-generated
        And the password should only contain "<option>"
        And the password should have exactly "<length>" characters

        Examples:
            | length | option                                 |
            | 8      | Lowercase                              |
            | 12     | Uppercase                              |
            | 16     | Numbers                                |
            | 19     | Symbols                                |
            | 21     | Uppercase, Symbols                     |
            | 23     | Lowercase, Numbers                     |
            | 26     | Lowercase, Uppercase, Numbers          |
            | 27     | Uppercase, Numbers, Symbols            |
            | 31     | Lowercase, Uppercase, Numbers, Symbols |
    
    Scenario Outline: Verify the minimum(6) and maximum(32) length requirement for the password
        When I set the password length to "<length>"
        Then the password should have exactly "<expectedLength>" characters

        Examples:
            | length | expectedLength |
            | 5      | 6              |
            | 33     | 32             |
            | -3     | 6              |

    Scenario: Verify default(6 char) password when null length is passed
        When I set the password length to null
        Then the password should have exactly "6" characters


    Scenario: Ensure at least one option is always selected
        When I select the "Lowercase, Uppercase, Numbers, Symbols" option
        And I deselect each option one by one
        Then the last option should still be selected

    Scenario Outline: Generate a password with specified strength
        When I set the password length to "<length>"
        And I select the "<option>" option
        Then the password should be auto-generated
        And the password should only contain "<option>"
        And the password should have "<strength>" strength

        Examples:
            | length | option                                 | strength     |
            | 6      | Uppercase                              | low          |
            | 10     | Lowercase                              | medium       |
            | 15     | Numbers                                | medium-high  |
            | 20     | Symbols                                | strong       |
            | 12     | Uppercase, Lowercase, Numbers, Symbols | extra strong |

    Scenario: Generate a password multiple times
        When I set the password length to "12"
        And I select the "Uppercase, Symbols" option
        Then the password should be auto-generated
        When I click the Generate Password button five times
        Then five different passwords should be generated
        And all passwords should meet the criteria of length and character type
