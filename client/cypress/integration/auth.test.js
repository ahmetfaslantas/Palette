describe("Auth operations", () => {
  before(function() {
    cy.task("db:drop");
  });

  beforeEach(function() {
    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });
  });

  it("Should sign up as an instructor.", function() {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.contains("Sign up!").click();

    cy.url().should("include", "/signup");

    cy.get("[placeholder=\"Name\"]").type(this.auth.instructor.name);
    cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
    cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);
    cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.instructor.password);

    cy.contains("Instructor").click();

    cy.get("[type=\"submit\"]").click();

    cy.url().should("include", "/login");
  });

  it("Should sign up as a student.", function() {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.contains("Sign up!").click();

    cy.url().should("include", "/signup");

    cy.get("[placeholder=\"Name\"]").type(this.auth.student.name);
    cy.get("[placeholder=\"Email\"]").type(this.auth.student.email);
    cy.get("[placeholder=\"Password\"]").type(this.auth.student.password);
    cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.student.password);

    cy.contains("Student").click();

    cy.get("[type=\"submit\"]").click();

    cy.url().should("include", "/login");
  });

  it("Should login as an instructor.", function() {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
    cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);

    cy.contains("Instructor").click();

    cy.get("[type=\"submit\"]").click();

    cy.url().should("include", "/dashboard");

    cy.findByText("Add Course").should("exist");
  });

  it("Should login as a student.", function() {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.get("[placeholder=\"Email\"]").type(this.auth.student.email);
    cy.get("[placeholder=\"Password\"]").type(this.auth.student.password);

    cy.contains("Student").click();

    cy.get("[type=\"submit\"]").click();

    cy.url().should("include", "/dashboard");

    cy.findByText("Add Course").should("not.exist");
  });

  it("Should not login with invalid credentials.", function() {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.get("[placeholder=\"Email\"]").type("qwerty");
    cy.get("[placeholder=\"Password\"]").type("qwerty");

    cy.contains("Instructor").click();

    cy.get("[type=\"submit\"]").click();

    cy.url().should("include", "/login");

    cy.findByText("Invalid email or password!").should("exist");
  });

  it("Should not sign up with an existing email.", function() {
    cy.visit("/");

    cy.url().should("include", "/login");

    cy.contains("Sign up!").click();

    cy.url().should("include", "/signup");

    cy.get("[placeholder=\"Name\"]").type(this.auth.instructor.name);
    cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
    cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);
    cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.instructor.password);

    cy.contains("Instructor").click();

    cy.get("[type=\"submit\"]").click();

    cy.url().should("include", "/signup");

    cy.findByText("User with this email already exists!").should("exist");
  });
});