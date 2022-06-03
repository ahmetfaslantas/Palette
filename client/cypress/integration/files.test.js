describe("File operations", () => {
  before(function() {
    cy.task("db:drop");
    cy.task("deleteDownloadedFiles");

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

  it("Should upload a file as an instructor.", function() {
    cy.loginAsInstructor();

    cy.url().should("include", "/dashboard");

    cy.createCourse();
    cy.addStudentToCourse();

    cy.get("[src=\"/./public/folder.svg\"]").click();

    cy.url().should("include", "/files");

    cy.get("input[type=\"file\"]").attachFile({
      filePath: "testfile.txt",
      mimeType: "text/plain",
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);

    cy.url().should("include", "/files");

    cy.get("summary").click({ force: true });

    cy.findByText("testfile").should("exist");
  });

  it("Should download a file as a student.", function() {
    cy.loginAsStudent();

    cy.url().should("include", "/dashboard");

    cy.get("[src=\"/./public/folder.svg\"]").click();

    cy.url().should("include", "/files");

    cy.get("summary").click();

    cy.findByText("testfile").should("exist");

    cy.findByText("testfile").click();

    const downloadsFolder = Cypress.config("downloadsFolder");

    cy.readFile(`${downloadsFolder}/testfile.txt`).should("equal", "This is a test file.");
  });
});