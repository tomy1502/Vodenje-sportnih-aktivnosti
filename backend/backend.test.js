const db = require("./database");
const eventsController = require("./controllers/eventController");
const attachmentController = require("./controllers/attachmentController");


jest.mock("./database");
//GET
//test1
test("getAllEvents - should return all events successfully", () => {
    // Mock req and res
    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Mock database response
    const mockEvents = [
        { id: 1, name: "Nogomet", description: "Nogomet", location: "Maribor" },
    ];

    db.all.mockImplementation((query, params, callback) => {
        callback(null, mockEvents); // Simulate a successful query
    });

    // Call the method
    eventsController.getAllEvents(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith(mockEvents); // Expect all events to be returned
});
//Test2
test("getAllEvents - should handle database error", () => {
    // Mock req and res
    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Mock database error
    const mockError = new Error("Database error");

    db.all.mockImplementation((query, params, callback) => {
        callback(mockError); // Simulate a database error
    });

    // Call the method
    eventsController.getAllEvents(req, res);
    expect(res.status).toHaveBeenCalledWith(500); // Expect HTTP 500 for error
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); // Expect the error message
});
//ADD
//test3
test("addEvent - should add a new event successfully", () => {
    const req = {
        body: {
            id:2,
            name: "Rokomet", // The name we want to test
            description: "Rokometna tekma",
            date: "2024-12-10T15:00:00.000Z",
            location: "Ljubljana",
            organizer: "www"
        }
    };


    // Mock the database behavior for inserting an event
    db.run.mockImplementationOnce(function(query, params, callback) {
        console.log("Mock run called with query:", query); // Check the query being called
        console.log("Mock run called with parameters:", params);
        callback.call({ lastID: 2 }, null); // Call the callback with `this.lastID`
    });

    const res = {
        status: jest.fn().mockReturnThis(), // Mock `status` to return `res` for chaining
        json: jest.fn(), // Mock `json` to check if it's called
    };

    // Call the addEvent method
    eventsController.addEvent(req, res);
    console.log(res.status)
    // Assertions
    expect(res.status).toHaveBeenCalledWith(201); // Expect HTTP 201 for created

    // Check that the response contains the correct `id` and `name`
    expect(res.json).toHaveBeenCalledWith(({id: 2 }));
});
//test4
test("addEvent - should handle database error", () => {
    const req = {
        body: {
            id:2,
            name: "Rokomet", // The name we want to test
            description: "Rokometna tekma",
            date: "2024-12-10T15:00:00.000Z",
            location: "Ljubljana",
            organizer: "www"
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Mock the database error
    const mockError = new Error("Database error");
    db.run.mockImplementation((query, params, callback) => {
        callback(mockError); // Simulate an error
    });

    // Call the method
    eventsController.addEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect HTTP 500 for error
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); // Expect the error message
});
//DELETE
//test5
test("deleteEvent - should delete an event successfully", () => {
    const req = {
        params: {
            id: 2
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Mock the database response (simulate success)
    db.run.mockImplementation((query, params, callback) => {
        callback(null); // Simulate success with no error
    });

    // Call the method
    eventsController.deleteEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect HTTP 200 for success
    expect(res.json).toHaveBeenCalledWith({ message: "Dogodek uspešno izbrisan" }); // Expect the success message
});
//test6
test("deleteEvent - should handle database error", () => {
    const req = {
        params: {
            id: 2
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Mock the database error
    const mockError = new Error("Database error");
    db.run.mockImplementation((query, params, callback) => {
        callback(mockError); // Simulate an error
    });

    // Call the method
    eventsController.deleteEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect HTTP 500 for error
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); // Expect the error message
});
//UPDATE
//test7
test("updateEvent - should handle non-existing event", () => {
    const req = {
        params: { id: 999 }, // Non-existing ID
        body: {
            name: "Non-existent Event",
            description: "This event does not exist",
            date: "2024-12-15T15:00:00.000Z",
            location: "Nowhere",
            organizer: "organizer1"
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    db.run.mockImplementation((query, params, callback) => {
        callback.call({ changes: 0 }, null); // Simulate no rows updated
    });

    eventsController.updateEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404); // Expect HTTP 404 for not found
    expect(res.json).toHaveBeenCalledWith({ error: "Dogodek ni najden" }); // Expect error message
});

//test8
test("addEvent - should handle missing fields in request body", () => {
    const req = {
        body: {
            name: "Incomplete Event" // Missing description, date, and location
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Mock the database behavior to simulate SQLite error
    const mockError = new Error("SQLITE_ERROR: no such column: description");
    db.run.mockImplementation((query, params, callback) => {
        callback(mockError); // Simulate an error due to missing fields
    });

    eventsController.addEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Expect HTTP 500 for error
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message }); // Expect the SQLite error message
});


//test9
test("registerForEvent - should register a user successfully", () => {
    const req = {
        body: {
            eventId: 1,
            userId: 2,
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    db.run.mockImplementationOnce(function (query, params, callback) {
        callback.call({ lastID: 10 }, null); // Simulate successful registration
    });

    eventsController.registerForEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Prijava uspešna", id: 10 });
});

//test 10
test("deregisterFromEvent - should deregister a user successfully", () => {
    const req = {
        params: { eventId: 1 },
        body: { userId: 2 },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    db.run.mockImplementationOnce((query, params, callback) => {
        callback(null); // Simulate successful deregistration
    });

    eventsController.deregisterFromEvent(req, res);

    //expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Odjava uspešna" });
});


test("getUserNotifications - should return user notifications", () => {
    const req = {
        params: { userId: 2 },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const mockNotifications = [
        { message: "Event updated: Football Match" },
        { message: "Event canceled: Basketball Game" },
    ];

    db.all.mockImplementationOnce((query, params, callback) => {
        callback(null, mockNotifications);
    });

    eventsController.getUserNotifications(req, res);

    expect(res.json).toHaveBeenCalledWith(
        mockNotifications.map((notif) => notif.message)
    );
});


test("deregisterFromEvent - should handle missing parameters", () => {
    const req = {
        params: {}, // Missing eventId
        body: {},   // Missing userId
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    eventsController.deregisterFromEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400); // Expect HTTP 400 for bad request
    expect(res.json).toHaveBeenCalledWith({ error: "Missing eventId or userId" }); // Adjust the error message to your implementation
});


//Testi za nalogo 3->
//test 1
test("addAttachment - should add an attachment successfully", () => {
    const req = {
        body: {
            eventId: 1,
            description: "Meeting notes",
        },
        file: {
            originalname: "testFile.txt", // Simulated file name
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Mock the database behavior
    db.run.mockImplementation((query, params, callback) => {
        callback.call({ lastID: 5 }, null); // Simulate successful insertion
    });

    const attachmentController = require("./controllers/attachmentController");
    attachmentController.addAttachment(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201); // Expect HTTP 201 for created
    expect(res.json).toHaveBeenCalledWith({
        message: "Priloga uspešno dodana!",
        attachmentId: 5,
    });
});


//test 2
test("addAttachment - should handle missing fields in request", () => {
    const req = {
        body: {
            description: "No eventId or file", // Missing `eventId` and `file`
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const attachmentController = require("./controllers/attachmentController");
    attachmentController.addAttachment(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Expect HTTP 400 for bad request
    expect(res.json).toHaveBeenCalledWith({
        message: "Manjka datoteka ali ID dogodka",
    });
});


// test 3
test("getAttachmentsByEvent - should return attachments for an event", () => {
    const req = { params: { eventId: 1 } };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const mockAttachments = [
        { id: 1, event_id: 1, description: "Attachment 1", file_name: "file1.txt" },
        { id: 2, event_id: 1, description: "Attachment 2", file_name: "file2.txt" },
    ];

    db.all.mockImplementation((sql, params, callback) => {
        callback(null, mockAttachments); // Simulate successful query
    });

    attachmentController.getAttachmentsByEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAttachments);
});

//test 4
test("getAttachmentsByEvent - should fail with 400 if event ID is missing", () => {
    const req = { params: {} }; // Missing eventId
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    attachmentController.getAttachmentsByEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "Event ID is required",
    });
});

//test 5
test("addAttachment - should fail with 400 if file or eventId is missing", () => {
    const req = { body: { eventId: null }, file: null }; // Missing file and eventId
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    attachmentController.addAttachment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "Manjka datoteka ali ID dogodka",
    });
});


