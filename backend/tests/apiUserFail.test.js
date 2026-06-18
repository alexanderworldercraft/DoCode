import { describe, it, expect, vi, beforeEach } from "vitest";
import { userController } from "../controllers/userController.js";
import { userRepository } from "../models/user.js";

function multipartRequest(fields, userId = 1) {
  return {
    user: { userId },
    parts: async function* parts() {
      for (const [fieldname, value] of Object.entries(fields)) {
        yield { fieldname, value };
      }
    },
  };
}

function replyMock() {
  return {
    send: vi.fn(),
    header: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("userController - error cases", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects admin creation when requester is not super admin", async () => {
    const request = multipartRequest({
      surnom: "admin1",
      email: "admin1@example.com",
      motDePasse: "Admin123!",
    });
    const reply = replyMock();

    vi.spyOn(userRepository, "getUserById").mockResolvedValue({ UtilisateurID: 1, GradeID: 2 });

    await userController.createAdmin(request, reply);

    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Seul un super administrateur peut créer un administrateur.",
    });
  });

  it("rejects admin creation when required fields are missing", async () => {
    const request = multipartRequest({ surnom: "", email: "", motDePasse: "" });
    const reply = replyMock();

    vi.spyOn(userRepository, "getUserById").mockResolvedValue({ UtilisateurID: 1, GradeID: 1 });

    await userController.createAdmin(request, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({ error: "Surnom, Email, and Mot de Passe are required" });
  });

  it("rejects invalid login credentials", async () => {
    const request = { body: { surnom: "admin1", motDePasse: "wrongpassword" } };
    const reply = replyMock();

    vi.spyOn(userRepository, "getUserBySurnomOrEmailIdentifier").mockResolvedValue(null);

    await userController.login(request, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("rejects manual backup when requester is not super admin", async () => {
    const request = {
      user: { userId: 1 },
      body: { motDePasse: "Admin123!" },
    };
    const reply = replyMock();

    vi.spyOn(userRepository, "getUserById").mockResolvedValue({ UtilisateurID: 1, GradeID: 2 });

    await userController.createManualBackup(request, reply);

    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Seul un super administrateur peut créer une sauvegarde manuelle.",
    });
  });
});
