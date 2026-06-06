import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
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
    status: vi.fn().mockReturnThis(),
  };
}

describe("userController", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates an admin when requester is super admin", async () => {
    const request = multipartRequest({
      surnom: "admin1",
      email: "admin1@example.com",
      motDePasse: "Admin123!",
    });
    const reply = replyMock();
    const mockUser = { UtilisateurID: 2, Surnom: "admin1", Email: "admin1@example.com", GradeID: 2, EtatID: 1 };

    vi.spyOn(userRepository, "getUserById").mockResolvedValue({ UtilisateurID: 1, GradeID: 1 });
    vi.spyOn(userRepository, "getUserBySurnomOrEmail").mockResolvedValue(null);
    vi.spyOn(userRepository, "createUser").mockResolvedValue(mockUser);

    await userController.createAdmin(request, reply);

    expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
      Surnom: "admin1",
      Email: "admin1@example.com",
      GradeID: 2,
      EtatID: 1,
    }));
    expect(reply.send).toHaveBeenCalledWith(mockUser);
  });

  it("logs in an active admin", async () => {
    const motDePasse = "Admin123!";
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const request = { body: { surnom: "admin1", motDePasse } };
    const reply = replyMock();

    vi.spyOn(userRepository, "getUserBySurnomOrEmailIdentifier").mockResolvedValue({
      UtilisateurID: 1,
      Surnom: "admin1",
      MotDePasse: hashedPassword,
      EtatID: 1,
      GradeID: 2,
    });

    await userController.login(request, reply);

    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
    }));
  });
});
