import "@testing-library/cypress/add-commands";

Cypress.Commands.add("signUpAsInstructor", function() {
  cy.visit("/signup");

  cy.get("[placeholder=\"Name\"]").type(this.auth.instructor.name);
  cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);
  cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.instructor.password);

  cy.contains("Instructor").click();

  cy.get("[type=\"submit\"]").click();

  cy.url().should("include", "/login");
});

Cypress.Commands.add("signUpAsStudent", function() {
  cy.visit("/signup");

  cy.get("[placeholder=\"Name\"]").type(this.auth.student.name);
  cy.get("[placeholder=\"Email\"]").type(this.auth.student.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.student.password);
  cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.student.password);

  cy.contains("Student").click();

  cy.get("[type=\"submit\"]").click();

  cy.url().should("include", "/login");
});

Cypress.Commands.add("loginAsInstructor", function() {
  cy.visit("/login");

  cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);

  cy.contains("Instructor").click();

  cy.get("[type=\"submit\"]").click();
});

Cypress.Commands.add("loginAsStudent", function() {
  cy.visit("/login");
  
  cy.get("[placeholder=\"Email\"]").type(this.auth.student.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.student.password);
  
  cy.contains("Student").click();
  
  cy.get("[type=\"submit\"]").click();
});

Cypress.Commands.add("createCourse", function() {
  cy.contains("Add Course").click();

  cy.get("[placeholder=\"Course Name\"]").type(this.course.name);
  cy.get("[placeholder=\"Course Description\"]").type(this.course.description);

  cy.contains("Create Course").click();

  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("addStudentToCourse", function() {
  cy.visit("/dashboard");

  cy.findByText("Test Course").click();

  cy.findByText("People").click();

  cy.findByText("Add Student").click();

  cy.get("[placeholder=\"Student Email\"]").type(this.auth.student.email);

  cy.get("button").contains("Add Student").click();

  cy.url().should("include", "/people");
  cy.visit("/");
});