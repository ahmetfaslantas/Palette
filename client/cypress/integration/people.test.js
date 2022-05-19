describe("People operations", () => {
  before(function() {
    cy.fixture("auth.json").then((auth) => {
      this.auth = auth;
    });

    cy.fixture("course.json").then((course) => {
      this.course = course;
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

  it("Should add a student to a course as an instructor.", function() {
    cy.loginAsInstructor();
    
    cy.url().should("include", "/dashboard");

    cy.createCourse();

    cy.findByText("Test Course").click();

    cy.url().should("include", "/course");

    cy.findByText("People").click();

    cy.url().should("include", "/people");

    cy.findByText("Test Instructor").should("exist");

    cy.findByText("Add Student").click();

    cy.url().should("include", "/newstudent");

    cy.get("[placeholder=\"Student Email\"]").type(this.auth.student.email);

    cy.get("button").contains("Add Student").click();

    cy.url().should("include", "/people");

    cy.findByText(this.auth.student.name).should("exist");
  });

});