describe("Course operations", () => {
  before(function() {
    cy.task("db:drop");

    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.signUpAsInstructor();
    cy.signUpAsStudent();
  });

  beforeEach(function() {
    cy.fixture("course.json").then((course) => {
      this.course = course;
    });

    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });
  });

  it("Should create a course as an instructor.", function() {
    cy.loginAsInstructor();

    cy.url().should("include", "/dashboard");

    cy.contains("Add Course").click();

    cy.url().should("include", "/newcourse");

    cy.get("[placeholder=\"Course Name\"]").type(this.course.name);
    cy.get("[placeholder=\"Course Description\"]").type(this.course.description);

    cy.contains("Create Course").click();

    cy.url().should("include", "/dashboard");

    cy.findByText("Test Course").should("exist");
  });

  it("Should not create a course as a student.", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.findByText("Add Course").should("not.exist");
  });
});